import * as fromFirestore from "../fromFirestore";
import { Weight as DBWeight } from "./db";
import { AsFirestore, AsJson, Equals, Versioned, WeightUnit } from "./index";

const lbsToKiloRatio = 0.453592;

export class Weight
  implements DBWeight, AsFirestore, Versioned, Equals<Weight>, AsJson {
  public static VERSION = "1";
  public static fromFirestoreData = fromFirestore.weightFromFirestore;
  public static kiloToLbs = (value: number) => {
    return value / lbsToKiloRatio;
  };

  public static lbsToKilo = (value: number) => {
    return value * lbsToKiloRatio;
  };

  public static lbs = (value: number): Weight => {
    return new Weight(value, WeightUnit.POUND);
  };

  public static zero = (): Weight => {
    return new Weight(0, WeightUnit.POUND);
  };

  public static kilo = (value: number): Weight => {
    return new Weight(value, WeightUnit.KILOGRAM);
  };

  public static bar = (): Weight => {
    return new Weight(45, WeightUnit.POUND);
  };

  public value: number;
  public unit: WeightUnit;
  public version = Weight.VERSION;

  constructor(value: number, unit: WeightUnit) {
    this.value = value;
    this.unit = unit;
  }

  public getVersion(): string {
    return this.version;
  }

  public asFirestore(): object {
    return JSON.parse(JSON.stringify(this));
  }

  public clone(): Weight {
    return new Weight(this.value, this.unit);
  }

  public withValue(value: number): Weight {
    return new Weight(value, this.unit);
  }

  public toString(): string {
    return `${this.value.toFixed(1).replace(/[.,]0$/, "")}${this.unit}`;
  }

  public display(unit: WeightUnit): string {
    return this.toUnit(unit).toString();
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
    return this.equals(b) || this.lessThan(b);
  }

  public equals(b: Weight): boolean {
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
    return this.equals(b) || this.greaterThan(b);
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

  public toPound(): Weight {
    let newValue = this.value;
    if (this.unit === WeightUnit.KILOGRAM) {
      newValue = Weight.kiloToLbs(this.value);
    }
    return new Weight(newValue, WeightUnit.POUND);
  }
  public toKilo(): Weight {
    let newValue = this.value;
    if (this.unit === WeightUnit.POUND) {
      newValue = Weight.lbsToKilo(this.value);
    }
    return new Weight(newValue, WeightUnit.KILOGRAM);
  }

  public toUnit(unit: WeightUnit): Weight {
    if (unit === WeightUnit.KILOGRAM) {
      return this.toKilo();
    }
    return this.toPound();
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

  public asJSON(): string {
    return JSON.stringify(this);
  }
}
