import fs from "fs";
import { describe, expect, it } from "vitest";
import parseFromCsv from "../../src/lib/parse-from-csv";

interface TestObject1 {
  column1: string;
  column2: number;
  column3: Date;
}

const columnParser = (columns: string[]): TestObject1 => {
  return {
    column1: columns[0],
    column2: parseInt(columns[1]),
    column3: new Date(columns[2]),
  };
};

const input1 = fs.readFileSync(`${__dirname}/csv-parser/csv01.csv`, "utf8");
const input2 = fs.readFileSync(`${__dirname}/csv-parser/csv02.csv`, "utf8");

const expected1 = [
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

const expected2 = [
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

describe("parseFromCsv", () => {
  it("csv01", () => {
    const actual = parseFromCsv(input1, columnParser, { skipHeader: true });
    expect(actual).toEqual(expected1);
  });

  it("csv02", () => {
    const actual = parseFromCsv(input2, columnParser, { skipHeader: true });
    expect(actual).toEqual(expected2);
  });
});
