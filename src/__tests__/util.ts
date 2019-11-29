import * as sut from "../util";
import * as t from "../types";

describe("for the util functions", () => {
  describe("for platesFor", () => {
    test("returns not-possible for weights below 45", () => {
      expect(sut.platesFor(30)).toBe("not-possible");
      expect(sut.platesFor(0)).toBe("not-possible");
      expect(sut.platesFor(-20)).toBe("not-possible");
    });

    describe("can make", () => {
      test("45", () => {
        expect(sut.platesFor(45)).toEqual(sut.emptyBar());
      });

      test("135", () => {
        const actual = sut.platesFor(135);

        const expected = sut.emptyBar();
        expected[t.PlateTypes.FORTY_FIVE] = 2;

        expect(actual).toEqual(expected);
      });

      test("140", () => {
        const actual = sut.platesFor(140);

        const expected = sut.emptyBar();
        expected[t.PlateTypes.FORTY_FIVE] = 2;
        expected[t.PlateTypes.TWO_AND_A_HALF] = 2;

        expect(actual).toEqual(expected);
      });

      test("145", () => {
        const actual = sut.platesFor(145);

        const expected = sut.emptyBar();
        expected[t.PlateTypes.FORTY_FIVE] = 2;
        expected[t.PlateTypes.FIVE] = 2;

        expect(actual).toEqual(expected);
      });

      test("150", () => {
        const actual = sut.platesFor(150);

        const expected = sut.emptyBar();
        expected[t.PlateTypes.FORTY_FIVE] = 2;
        expected[t.PlateTypes.FIVE] = 2;
        expected[t.PlateTypes.TWO_AND_A_HALF] = 2;

        expect(actual).toEqual(expected);
      });

      // There _could_ be more tests than this, but I really don't feel like it.
      test("155", () => {
        const actual = sut.platesFor(155);

        const expected = sut.emptyBar();
        expected[t.PlateTypes.FORTY_FIVE] = 2;
        expected[t.PlateTypes.TEN] = 2;

        expect(actual).toEqual(expected);
      });
    });
  });
});
