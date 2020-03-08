import { WeightField } from "./db";
import { toWeight } from "./db/WeightField";
import { Equals } from "./index";
import { WeightUnit } from "./WeightUnit";
import { withBrand, HasFirestoreField } from "./db/marker";

const lbsToKiloRatio = 0.453592;

export class Weight implements HasFirestoreField<WeightField>, Equals<Weight> {
  public static VERSION: "1" = "1";
  public static fromFirestoreData = toWeight;
  public static fromJSON = (s: string): Weight => {
    const parsed = JSON.parse(s);
    return Weight.fromFirestoreData(parsed);
  };

  public static forUnit = (unit: WeightUnit) => (value: number) => {
    return new Weight(value, unit);
  };
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

  public static bar = (unit: WeightUnit = WeightUnit.POUND): Weight => {
    switch (unit) {
      case WeightUnit.POUND:
        return new Weight(45, unit);
      case WeightUnit.KILOGRAM:
        return new Weight(20, unit);
    }
  };

  public firestoreField: WeightField;
  public version = Weight.VERSION;

  constructor(value: number, unit: WeightUnit) {
    this.firestoreField = withBrand({
      value,
      unit,
      version: "1"
    });
  }

  public setValue(value: number): Weight {
    const nu = this.clone();
    nu.firestoreField.value = value;
    return nu;
  }

  public getVersion(): string {
    return this.version;
  }

  public asFirestore(): WeightField {
    return this.firestoreField;
  }

  public clone(): Weight {
    return new Weight(this.firestoreField.value, this.firestoreField.unit);
  }

  public withValue(value: number): Weight {
    return new Weight(value, this.firestoreField.unit);
  }

  public toString(): string {
    return `${this.firestoreField.value.toFixed(1).replace(/[.,]0$/, "")}${
      this.firestoreField.unit
    }`;
  }

  public display(unit: WeightUnit = this.firestoreField.unit): string {
    return this.toUnit(unit).toString();
  }

  public getUnit(): WeightUnit {
    return this.firestoreField.unit;
  }

  public getValue(): number {
    return this.firestoreField.value;
  }

  public add(...rest: Weight[]): Weight {
    return rest.reduce((acc, next) => {
      if (acc.getUnit() === next.getUnit()) {
        return acc.withValue(acc.getValue() + next.getValue());
      } else if (acc.getUnit() === WeightUnit.KILOGRAM) {
        return acc.withValue(
          acc.getValue() + Weight.lbsToKilo(next.getValue())
        );
      } else if (acc.getUnit() === WeightUnit.POUND) {
        return acc.withValue(
          acc.getValue() + Weight.kiloToLbs(next.getValue())
        );
      }
      return acc;
    }, this.clone());
  }

  public subtract(...rest: Weight[]): Weight {
    return rest.reduce((acc, next) => {
      if (acc.getUnit() === next.getUnit()) {
        return acc.withValue(acc.getValue() - next.getValue());
      } else if (acc.getUnit() === WeightUnit.KILOGRAM) {
        return acc.withValue(
          acc.getValue() - Weight.lbsToKilo(next.getValue())
        );
      } else if (acc.getUnit() === WeightUnit.POUND) {
        return acc.withValue(
          acc.getValue() - Weight.kiloToLbs(next.getValue())
        );
      }
      return acc;
    }, this.clone());
  }

  public lessThanEq(b: Weight): boolean {
    return this.equals(b) || this.lessThan(b);
  }

  public equals(b: Weight): boolean {
    if (this.getUnit() === b.getUnit()) {
      return this.getValue() === b.getValue();
    } else if (this.getUnit() === WeightUnit.KILOGRAM) {
      return this.getValue() === Weight.lbsToKilo(b.getValue());
    } else {
      return b.getValue() === Weight.kiloToLbs(b.getValue());
    }
  }

  public lessThan(b: Weight): boolean {
    if (this.getUnit() === b.getUnit()) {
      return this.getValue() < b.getValue();
    } else if (this.getUnit() === WeightUnit.KILOGRAM) {
      return this.getValue() < Weight.lbsToKilo(b.getValue());
    } else {
      return b.getValue() < Weight.kiloToLbs(b.getValue());
    }
  }
  public greaterThanEq(b: Weight): boolean {
    return this.equals(b) || this.greaterThan(b);
  }
  public greaterThan(b: Weight): boolean {
    if (this.getUnit() === b.getUnit()) {
      return this.getValue() > b.getValue();
    } else if (this.getUnit() === WeightUnit.KILOGRAM) {
      return this.getValue() > Weight.lbsToKilo(b.getValue());
    } else {
      return b.getValue() > Weight.kiloToLbs(b.getValue());
    }
  }

  public compare(b: Weight): number {
    return this.lessThan(b) ? -1 : this.greaterThan(b) ? 1 : 0;
  }

  public toPound(): Weight {
    let newValue = this.getValue();
    if (this.getUnit() === WeightUnit.KILOGRAM) {
      newValue = Weight.kiloToLbs(this.getValue());
    }
    return new Weight(newValue, WeightUnit.POUND);
  }
  public toKilo(): Weight {
    let newValue = this.getValue();
    if (this.getUnit() === WeightUnit.POUND) {
      newValue = Weight.lbsToKilo(this.getValue());
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
    return new Weight(this.getValue() / b, this.getUnit());
  };

  public fraction = (b: Weight): number => {
    const withUnits = b.toUnit(this.getUnit());
    return this.getValue() / withUnits.getValue();
  };
  public multiply = (b: number): Weight => {
    return new Weight(this.getValue() * b, this.getUnit());
  };

  public nearestFive(): Weight {
    return new Weight(5 * Math.round(this.getValue() / 5), this.getUnit());
  }

  public asJSON(): string {
    return JSON.stringify(this.asFirestore());
  }
}
