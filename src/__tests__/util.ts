import * as t from "../types";
import * as sut from "../util";

describe("for the util functions", () => {
  test("can split a plateConfig in half", () => {
    const config = sut.platesFor(t.Weight.lbs(220));
    const splitConfig = sut.splitConfig(config);
    const expected = sut.emptyBar();
    if (expected === "not-possible") {
      return;
    }
    expected[t.PlateTypes.FORTY_FIVE] = 1;
    expected[t.PlateTypes.TWENTY_FIVE] = 1;
    expected[t.PlateTypes.TEN] = 1;
    expected[t.PlateTypes.FIVE] = 1;
    expected[t.PlateTypes.TWO_AND_A_HALF] = 1;

    expect(splitConfig).not.toEqual(config);
    expect(splitConfig).not.toBe(config);
    expect(splitConfig).toEqual(expected);
  });

  describe("for platesFor", () => {
    test("returns not-possible for weights below 45", () => {
      expect(sut.platesFor(t.Weight.lbs(30))).toBe("not-possible");
      expect(sut.platesFor(t.Weight.zero())).toBe("not-possible");
      expect(sut.platesFor(t.Weight.lbs(-20))).toBe("not-possible");
    });

    describe("can make", () => {
      test("45", () => {
        expect(sut.platesFor(t.Weight.bar())).toEqual(sut.emptyBar());
      });

      test("135", () => {
        const actual = sut.platesFor(t.Weight.lbs(135));

        const expected = sut.emptyBar();
        if (expected === "not-possible") {
          return;
        }
        expected[t.PlateTypes.FORTY_FIVE] = 2;

        expect(actual).toEqual(expected);
      });

      test("140", () => {
        const actual = sut.platesFor(t.Weight.lbs(140));

        const expected = sut.emptyBar();
        if (expected === "not-possible") {
          return;
        }
        expected[t.PlateTypes.FORTY_FIVE] = 2;
        expected[t.PlateTypes.TWO_AND_A_HALF] = 2;

        expect(actual).toEqual(expected);
      });

      test("145", () => {
        const actual = sut.platesFor(t.Weight.lbs(145));

        const expected = sut.emptyBar();
        if (expected === "not-possible") {
          return;
        }
        expected[t.PlateTypes.FORTY_FIVE] = 2;
        expected[t.PlateTypes.FIVE] = 2;

        expect(actual).toEqual(expected);
      });

      test("150", () => {
        const actual = sut.platesFor(t.Weight.lbs(150));

        const expected = sut.emptyBar();
        if (expected === "not-possible") {
          return;
        }
        expected[t.PlateTypes.FORTY_FIVE] = 2;
        expected[t.PlateTypes.FIVE] = 2;
        expected[t.PlateTypes.TWO_AND_A_HALF] = 2;

        expect(actual).toEqual(expected);
      });

      // There _could_ be more tests than this, but I really don't feel like it.
      test("155", () => {
        const actual = sut.platesFor(t.Weight.lbs(155));

        const expected = sut.emptyBar();
        if (expected === "not-possible") {
          return;
        }
        expected[t.PlateTypes.FORTY_FIVE] = 2;
        expected[t.PlateTypes.TEN] = 2;

        expect(actual).toEqual(expected);
      });
    });
  });
});
