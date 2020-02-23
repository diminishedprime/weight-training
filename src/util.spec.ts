import * as t from "./types";

import { plates } from "./constants";
import * as sut from "./util";

describe("for the util functions", () => {
  describe("for platesFor", () => {
    test("returns not-possible for weights below 45", () => {
      expect(sut.platesFor(t.Weight.lbs(30))).toBe("not-possible");
      expect(sut.platesFor(t.Weight.zero())).toBe("not-possible");
      expect(sut.platesFor(t.Weight.lbs(-20))).toBe("not-possible");
    });

    describe("can make lbs", () => {
      test("45 lbs", () => {
        expect(sut.platesFor(t.Weight.bar())).toEqual([]);
      });
      test("135 lbs", () => {
        const actual = sut.platesFor(t.Weight.lbs(135));
        const expected = [plates._45Lbs];
        expect(actual).toEqual(expected);
      });
      test("140 lbs", () => {
        const actual = sut.platesFor(t.Weight.lbs(140));
        const expected = [plates._45Lbs, plates._2_5Lbs];
        expect(actual).toEqual(expected);
      });
      test("145 lbs", () => {
        const actual = sut.platesFor(t.Weight.lbs(145));
        const expected = [plates._45Lbs, plates._5Lbs];
        expect(actual).toEqual(expected);
      });
      test("150 lbs", () => {
        const actual = sut.platesFor(t.Weight.lbs(150));
        const expected = [plates._45Lbs, plates._5Lbs, plates._2_5Lbs];
        expect(actual).toEqual(expected);
      });
      // There _could_ be more tests than this, but I really don't feel like it.
      test("155 lbs", () => {
        const actual = sut.platesFor(t.Weight.lbs(155));
        const expected = [plates._45Lbs, plates._10Lbs];
        expect(actual).toEqual(expected);
      });
    });
    // TODO - there should be really be tests for every simple plate combo.
    describe("can make kilo", () => {
      test("20 kilo", () => {
        const actual = sut.platesFor(t.Weight.bar(t.WeightUnit.KILOGRAM));
        const expected: t.Plate[] = [];
        expect(actual).toEqual(expected);
      });

      test("24 kilo", () => {
        const actual = sut.platesFor(t.Weight.kilo(24));
        const expected: t.Plate[] = [plates._2k];
        expect(actual).toEqual(expected);
      });

      test("30 kilo", () => {
        const actual = sut.platesFor(t.Weight.kilo(30));
        const expected: t.Plate[] = [plates._5k];
        expect(actual).toEqual(expected);
      });
    });
  });
});
