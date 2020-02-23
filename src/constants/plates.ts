/* tslint:disable:variable-name */
import { Plate } from "../types/common";
import { Weight } from "../types/Weight";

const _25k: Plate = {
  weight: Weight.kilo(25),
  cssClass: "plate_25_kilo"
};

const _20k: Plate = {
  weight: Weight.kilo(20),
  cssClass: "plate_20_kilo"
};

const _15k: Plate = {
  weight: Weight.kilo(15),
  cssClass: "plate_15_kilo"
};

const _10k: Plate = {
  weight: Weight.kilo(10),
  cssClass: "plate_10_kilo"
};

const _5k: Plate = {
  weight: Weight.kilo(5),
  cssClass: "plate_5_kilo"
};

const _2k: Plate = {
  weight: Weight.kilo(2),
  cssClass: "plate_2_kilo"
};

const _45Lbs: Plate = {
  weight: Weight.lbs(45),
  cssClass: "plate_45_lbs"
};

// const _35Lbs: Plate = {
//   weight: Weight.lbs(35),
//   cssClass: "plate_35_lbs"
// };

const _25Lbs: Plate = {
  weight: Weight.lbs(25),
  cssClass: "plate_25_lbs"
};

const _10Lbs: Plate = {
  weight: Weight.lbs(10),
  cssClass: "plate_10_lbs"
};

const _5Lbs: Plate = {
  weight: Weight.lbs(5),
  cssClass: "plate_5_lbs"
};

const _2_5Lbs: Plate = {
  weight: Weight.lbs(2.5),
  cssClass: "plate_2_5_lbs"
};

export const plates = {
  _25k,
  _20k,
  _15k,
  _10k,
  _5k,
  _2k,
  _45Lbs,
  // TODO - I can eventually add this plate as an option, but I don't want to
  // make the UI support this right now. Ideally, there's somewhere where you
  // can enter what plates you have available, and then it picks from those.
  // _35Lbs,
  _25Lbs,
  _10Lbs,
  _5Lbs,
  _2_5Lbs
};
