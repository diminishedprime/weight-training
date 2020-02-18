import { mockAnalytics } from "../../../test-utils";
import * as t from "../../../types";
import { LiftType as LiftTypeV1 } from "../LiftType/v1";
import { LiftType as LiftTypeV2 } from "../LiftType/v2";
import * as sut from "./index";
import { UserDoc as V1Db } from "./v1";
import { UserDoc as V2Db } from "./v2";
import { timestamp } from "../../../util";

describe("for migrating UserDoc from firestore", () => {
  test("Can parse V1 into UserDoc object", () => {
    const analyticsMock = jest.fn();
    mockAnalytics({ logEvent: analyticsMock });
    const jsonObject: V1Db = {
      "version": "1",
      "deadlift": {},
      "squat": {},
      "front-squat": {},
      "bench-press": {},
      "overhead-press": {}
    };
    const actual = sut.toUserDoc(jsonObject);
    expect(actual.asJSON()).toEqual(t.UserDoc.empty().asJSON());
    expect(analyticsMock).toBeCalled();
    expect(analyticsMock).toBeCalledWith("old_db_version", {
      type: "UserDoc",
      version: "1"
    });
  });

  test("Can parse V2 into UserDoc object", () => {
    const pr1 = {
      [t.ONE_REP_MAX]: {
        weight: { value: 10, unit: t.WeightUnit.POUND, version: "1" as "1" },
        time: { seconds: 0, nanoseconds: 10 }
      }
    };
    const jsonObject: V2Db = {
      "deadlift": pr1,
      "squat": pr1,
      "front-squat": pr1,
      "bench-press": pr1,
      "overhead-press": pr1,
      "version": "2"
    };
    const actual = sut.toUserDoc(jsonObject);
    const expected = t.UserDoc.empty();
    const ten = t.Weight.lbs(10);
    const tenNano = timestamp(0, 10);
    expected.setORM(LiftTypeV2.Deadlift, ten, tenNano);
    expected.setORM(LiftTypeV2.Squat, ten, tenNano);
    expected.setORM(LiftTypeV2.FrontSquat, ten, tenNano);
    expected.setORM(LiftTypeV2.BenchPress, ten, tenNano);
    expected.setORM(LiftTypeV2.OverheadPress, ten, tenNano);
    expect(actual.asFirestore()).toEqual(expected.asFirestore());
  });
});
