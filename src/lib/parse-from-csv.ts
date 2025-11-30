export type ColumnParser<T> = (columns: string[]) => T;

export type ParserOptions = {
  skipHeader?: boolean;
};

export function parseFromCsv<T extends object>(
  input: string,
  columnParser: ColumnParser<T>,
  options?: ParserOptions
): T[] {
  const lines = input.trim().replaceAll("\r", "").split("\n");

  if (options?.skipHeader) {
    lines.shift();
  }

  return lines.map((line) =>
    columnParser(
      line
        .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
        .map((column) => column.replaceAll('"', ""))
    )
  );
}

export default parseFromCsv;
