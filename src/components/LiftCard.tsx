import * as React from "react";
import { Link } from "react-router-dom";
import * as c from "../constants";
import * as t from "../types";
import * as hooks from "../hooks";

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
        {c.liftMetadata[liftType].displayText}
      </div>
      <figure className="card-svg">
        <img src={c.liftMetadata[liftType].image} width="50" alt="" />
      </figure>
      {userDoc && userDoc[liftType] && userDoc[liftType]![t.ONE_REP_MAX] && (
        <div>
          <span className="bold has-text-primary">
            {userDoc[liftType]![t.ONE_REP_MAX]!.display(unit)}
          </span>
        </div>
      )}
    </Link>
  );
};

export default LiftCard;
