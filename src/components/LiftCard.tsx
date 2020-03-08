import moment from "moment";
import * as React from "react";
import { Link } from "react-router-dom";
import * as hooks from "../hooks";
import * as t from "../types";

interface LiftCardProps {
  liftType: t.LiftType;
  userDoc?: t.UserDoc;
}

const LiftCard: React.FC<LiftCardProps> = ({ liftType, userDoc }) => {
  const {
    settings: { unit }
  } = hooks.useSettings();
  return (
    <Link
      to={`/lift/${liftType}`}
      className="card lift-card flex-column flex-center"
    >
      <div className="lift-card-title">
        {t.Metadata.forLiftType(liftType).displayText}
      </div>
      <figure className="card-svg">
        <img src={t.Metadata.forLiftType(liftType).image} width="50" alt="" />
      </figure>
      {userDoc && userDoc.getORM(liftType).weight.greaterThan(t.Weight.zero()) && (
        <div>
          <span className="bold has-text-primary">
            {userDoc.getORM(liftType).weight.display(unit)}{" "}
          </span>
          {moment(userDoc.getORM(liftType).time.toDate()).calendar(undefined, {
            lastDay: "[Yesterday]",
            sameDay: "[Today]",
            nextDay: "[Tomorrow]",
            lastWeek: "[last] dddd",
            nextWeek: "dddd",
            sameElse: "L"
          })}{" "}
        </div>
      )}
    </Link>
  );
};

export default LiftCard;
