import * as React from "react";
import * as t from "../types";
import * as c from "../constants";
import { Link } from "react-router-dom";

interface LiftCardProps {
  liftType: t.LiftType;
  userDoc?: t.UserDoc;
}

const LiftCard: React.FC<LiftCardProps> = ({ liftType, userDoc }) => {
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
            {userDoc[liftType]![t.ONE_REP_MAX]}
          </span>
        </div>
      )}
    </Link>
  );
};

export default LiftCard;
