import fs from "fs";
import { format } from "date-fns";
import { describe, expect, it } from "vitest";
import parseToCsv from "../../src/lib/parse-to-csv";

interface TestObject1 {
  column1: string;
  column2: number;
  column3: Date;
}

const input1 = [
  {
    column1: "a",
    column2: 1,
    column3: new Date("2025-01-01"),
  },
  {
    column1: "b",
    column2: 2,
    column3: new Date("2025-12-31"),
  },
  {
    column1: "c",
    column2: 3,
    column3: new Date("2025-07-01"),
  },
];

const input2 = [
  {
    column1: "a",
    column2: 1,
    column3: new Date("2025-01-01"),
  },
  {
    column1: "b",
    column2: 2,
    column3: new Date("2025-12-31"),
  },
  {
    column1: "c,c,c",
    column2: 3,
    column3: new Date("2025-07-01"),
  },
];

const expected1 = fs.readFileSync(`${__dirname}/csv-parser/csv01.csv`, "utf8");
const expected2 = fs.readFileSync(`${__dirname}/csv-parser/csv02.csv`, "utf8");

const objectParser = (obj: TestObject1): string[] => [
  obj.column1,
  obj.column2.toString(),
  format(obj.column3, "yyyy-MM-dd"),
];

describe("parseToCsv", () => {
  it("csv01", () => {
    const actual = parseToCsv(input1, objectParser, {
      addHeader: true,
      eol: "lf",
    });

    expect(actual).toEqual(expected1);
  });

  it("csv02", () => {
    const actual = parseToCsv(input2, objectParser, {
      addHeader: true,
      enclosure: '"',
      eol: "lf",
    });

    expect(actual).toEqual(expected2);
  });
});
