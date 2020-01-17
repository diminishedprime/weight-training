import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import * as c from "../constants";
import * as hooks from "../hooks";
import * as t from "../types";

const Records = () => {
  hooks.useMeasurePage("Records");
  const userDoc = t.useSelector((a) => a.localStorage.userDoc);
  const {
    settings: { unit }
  } = hooks.useSettings();

  if (userDoc === undefined) {
    return null;
  }

  // TODO - it'd be better if records were actually lift entries instead of this custom thing.
  // TODO - After above, we can highlight the lift for links on the Date column.
  // TODO - We should account for custom Records.
  const records = userDoc.getRecords();
  const noRecords = userDoc.getEmptyRecords();

  return (
    <>
      <h2>Your Records</h2>
      {records.length === 0 ? (
        <div>You don't have any records yet. Get to lifting!</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Lift</th>
              <th>Weight</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.liftType}>
                <td>
                  <span className="bold">
                    {c.liftMetadata[record.liftType].displayText}
                  </span>
                </td>
                <td>{record.orm.weight.display(unit)}</td>
                <td>
                  <Link
                    to={`/lifts/${moment(record.orm.time.toDate()).format(
                      "YYYY-MM-DD"
                    )}`}
                  >
                    {record.orm.time.toDate().toLocaleDateString()}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {noRecords.length !== 0 && (
        <>
          <div>The following have no recorded records</div>
          <ul>
            {noRecords.map((pr) => (
              <li key={pr.liftType}>
                <Link to={`/lift/${pr.liftType}`}>
                  {c.liftMetadata[pr.liftType].displayText}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default Records;
