import { WeightUnit } from "./index";

const lbsToKiloRatio = 0.453592;

export class Weight {
  public static kiloToLbs = (value: number) => {
    return value / lbsToKiloRatio;
  };

  public static lbsToKilo = (value: number) => {
    return value * lbsToKiloRatio;
  };

  public static lbs = (value: number): Weight => {
    return new Weight(value, WeightUnit.POUND);
  };

  public static kilo = (value: number): Weight => {
    return new Weight(value, WeightUnit.KILOGRAM);
  };

  public static bar = (): Weight => {
    return new Weight(45, WeightUnit.POUND);
  };

  public static fromJSON(json: { value: number; unit: string }): Weight {
    return new Weight(json.value, json.unit as WeightUnit);
  }

  public value: number;
  public unit: WeightUnit;

  constructor(value: number, unit: WeightUnit) {
    this.value = value;
    this.unit = unit;
  }

  public asObject(): object {
    return JSON.parse(JSON.stringify(this));
  }

  public clone(): Weight {
    return new Weight(this.value, this.unit);
  }

  public withValue(value: number): Weight {
    return new Weight(value, this.unit);
  }

  public toString(): string {
    return `${this.value}${this.unit}`;
  }

  public add(...rest: Weight[]): Weight {
    return rest.reduce((acc, next) => {
      if (acc.unit === next.unit) {
        acc.value += next.value;
      } else if (acc.unit === WeightUnit.KILOGRAM) {
        acc.value += Weight.lbsToKilo(next.value);
      } else if (acc.unit === WeightUnit.POUND) {
        acc.value += Weight.kiloToLbs(next.value);
      }
      return acc;
    }, new Weight(this.value, this.unit));
  }

  public subtract(...rest: Weight[]): Weight {
    return rest.reduce((acc, next) => {
      if (acc.unit === next.unit) {
        acc.value -= next.value;
      } else if (acc.unit === WeightUnit.KILOGRAM) {
        acc.value -= Weight.lbsToKilo(next.value);
      } else if (acc.unit === WeightUnit.POUND) {
        acc.value -= Weight.kiloToLbs(next.value);
      }
      return acc;
    }, new Weight(this.value, this.unit));
  }

  public lessThanEq(b: Weight): boolean {
    return this.equal(b) || this.lessThan(b);
  }

  public equal(b: Weight): boolean {
    if (this.unit === b.unit) {
      return this.value === b.value;
    } else if (this.unit === WeightUnit.KILOGRAM) {
      return this.value === Weight.lbsToKilo(b.value);
    } else {
      return b.value === Weight.kiloToLbs(b.value);
    }
  }

  public lessThan(b: Weight): boolean {
    if (this.unit === b.unit) {
      return this.value < b.value;
    } else if (this.unit === WeightUnit.KILOGRAM) {
      return this.value < Weight.lbsToKilo(b.value);
    } else {
      return b.value < Weight.kiloToLbs(b.value);
    }
  }
  public greaterThanEq(b: Weight): boolean {
    return this.equal(b) || this.greaterThan(b);
  }
  public greaterThan(b: Weight): boolean {
    if (this.unit === b.unit) {
      return this.value > b.value;
    } else if (this.unit === WeightUnit.KILOGRAM) {
      return this.value > Weight.lbsToKilo(b.value);
    } else {
      return b.value > Weight.kiloToLbs(b.value);
    }
  }

  public toKilo(): Weight {
    let newValue = this.value;
    if (this.unit === WeightUnit.POUND) {
      newValue = Weight.lbsToKilo(this.value);
    }
    return new Weight(newValue, WeightUnit.KILOGRAM);
  }

  public divide = (b: number): Weight => {
    return new Weight(this.value / b, this.unit);
  };
  public multiply = (b: number): Weight => {
    return new Weight(this.value * b, this.unit);
  };

  public nearestFive(): Weight {
    return new Weight(5 * Math.round(this.value / 5), this.unit);
  }
}
