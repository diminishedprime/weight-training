import classnames from "classnames";
import React from "react";
import Bar from "../../components/Bar";
import * as db from "../../db";
import * as hooks from "../../hooks";
import { BarbellLift, FirebaseUser, Lift } from "../../types";
import * as util from "../../util";
import usePersistentRowProgress from "./usePersistentRowProgress";

interface BarbellRowProps {
  selected: boolean;
  row: BarbellLift;
  finished: boolean;
  skipped: boolean;
}

const BarbellRow: React.FC<BarbellRowProps> = ({
  selected,
  row,
  finished,
  skipped
}) => {
  const {
    settings: { unit }
  } = hooks.useSettings();
  const cn = classnames({
    "is-selected": selected,
    "has-background-success": finished,
    "has-background-warning": skipped
  });
  return (
    <>
      <>
        <tr className={cn}>
          <td>{row.weight.display(unit)}</td>
          <td>{row.liftType}</td>
          <td>{row.reps}</td>
          <td align="center">{row.warmup ? "✔️" : ""}</td>
        </tr>
        {selected && (
          <tr>
            <td colSpan={4}>
              <Bar weight={row.weight} />
            </td>
          </tr>
        )}
      </>
    </>
  );
};

interface BarbellTableProps {
  rows: BarbellLift[];
  localStorageKey: string;
  finishSection: () => void;
  isActive: boolean;
  user: FirebaseUser;
}
const BarbellTable: React.FC<BarbellTableProps> = ({
  rows,
  localStorageKey,
  finishSection,
  isActive,
  user
}) => {
  const {
    skipped,
    skipRemaining,
    skipLift,
    current,
    finished,
    finishLift
  } = usePersistentRowProgress<BarbellLift>(
    localStorageKey,
    rows,
    finishSection
  );
  const firestore = hooks.useFirestore();
  const complete = current >= rows.length;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Weight</th>
          <th>Lift</th>
          <th>Reps</th>
          <th>Warmup</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <React.Fragment key={`table-${idx}`}>
            <BarbellRow
              finished={finished.has(idx)}
              skipped={skipped.has(idx)}
              selected={isActive && idx === current}
              row={row}
            />
            {isActive && idx === current && (
              <tr>
                <td colSpan={4}>
                  <div className="control flex flex-center">
                    {idx + 1 < rows.length && (
                      <div>
                        <button
                          onClick={skipRemaining(idx)}
                          className={`button is-danger is-skip-remaining-button`}
                        >
                          Skip Remaining
                        </button>
                      </div>
                    )}
                    {!complete && (
                      <div className="flex flex-end flex-grow buttons">
                        <button
                          onClick={skipLift(idx)}
                          className="button is-outlined is-warning is-skip-button"
                        >
                          Skip
                        </button>
                        <button
                          onClick={finishLift(idx, () => {
                            db.addLift(
                              firestore,
                              user,
                              Lift.forBarbellLift(
                                row.weight,
                                row.liftType,
                                row.reps,
                                row.warmup,
                                util.now()
                              )
                            );
                          })}
                          className="button is-outlined is-success is-done-button"
                        >
                          Done
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};
export default BarbellTable;
