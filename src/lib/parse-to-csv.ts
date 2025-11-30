export type PropertyParser<T> = (obj: T) => string[];

export type ParserOptions = {
  addHeader?: boolean;
  enclosure?: string;
  eol?: "crlf" | "lf";
};

export function parseToCsv<T extends object>(
  input: T[],
  propertyParser: PropertyParser<T>,
  options?: ParserOptions
): string {
  let result = "";
  const enclosure = options?.enclosure || "";
  const eol = options?.eol === "crlf" ? "\r\n" : "\n";

  if (options?.addHeader) {
    const instance = input[0];
    let header = "";

    Object.keys(instance).map((key) => {
      if (header) {
        header += ",";
      }

      header += `${enclosure}${key}${enclosure}`;
    });

    result += `${header}${eol}`;
  }

  return result.concat(
    ...input.map(
      (obj) =>
        `${enclosure}${propertyParser(obj).join(`${enclosure},${enclosure}`)}${enclosure}${eol}`
    )
  );
}

export default parseToCsv;
