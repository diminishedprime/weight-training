import classnames from "classnames";
import firebase from "firebase/app";
import React from "react";
import Bar from "../../components/Bar";
import * as db from "../../db";
import * as hooks from "../../hooks";
import { BarbellLift, FirebaseUser, Lift } from "../../types";

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
  const currentKey = localStorageKey + "-current";
  const skippedKey = localStorageKey + "-skipped";
  const finishedKey = localStorageKey + "-finished";
  const [current, setCurrent] = React.useState(() => {
    const currentString = window.localStorage.getItem(currentKey);
    if (currentString === null) {
      return 0;
    } else {
      return parseInt(currentString, 0);
    }
  });
  const [skipped, setSkipped] = React.useState<Set<number>>(() => {
    const skippedString = window.localStorage.getItem(skippedKey);
    if (skippedString === null) {
      return new Set();
    } else {
      return new Set(JSON.parse(skippedString));
    }
  });
  const [finished, setFinished] = React.useState<Set<number>>(() => {
    const finishedString = window.localStorage.getItem(finishedKey);
    if (finishedString === null) {
      return new Set();
    } else {
      return new Set(JSON.parse(finishedString));
    }
  });

  React.useEffect(() => {
    if (current < rows.length) {
      window.localStorage.setItem(finishedKey, JSON.stringify([...finished]));
      window.localStorage.setItem(skippedKey, JSON.stringify([...skipped]));
      window.localStorage.setItem(currentKey, current.toString());
    }
  }, [
    finished,
    skipped,
    current,
    currentKey,
    finishedKey,
    skippedKey,
    rows.length
  ]);

  React.useEffect(() => {
    if (current >= rows.length) {
      window.localStorage.removeItem(finishedKey);
      window.localStorage.removeItem(skippedKey);
      window.localStorage.removeItem(currentKey);
      finishSection();
    }
  }, [
    current,
    finishSection,
    currentKey,
    finishedKey,
    skippedKey,
    rows.length
  ]);

  const skipRemaining = React.useCallback(
    (idx: number) => () => {
      setSkipped((old) => {
        for (let i = idx; i <= rows.length; i++) {
          old.add(i);
        }
        return new Set(old);
      });
      setCurrent(rows.length);
    },
    [rows.length]
  );

  const skipLift = React.useCallback(
    (idx: number) => () => {
      setCurrent((old) => old + 1);
      setSkipped((old) => {
        old.add(idx);
        return new Set(old);
      });
    },
    []
  );
  const complete = current >= rows.length;

  const finishLift = React.useCallback(
    (idx: number, row: BarbellLift) => () => {
      setCurrent((old) => old + 1);
      setFinished((old) => {
        old.add(idx);
        return new Set(old);
      });
      db.addLift(
        firebase.firestore(),
        user,
        Lift.forBarbellLift(
          row.weight,
          row.liftType,
          row.reps,
          row.warmup,
          firebase.firestore.Timestamp.now()
        )
      );
    },
    [user]
  );

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
                          className={`button is-danger`}
                        >
                          Skip Remaining
                        </button>
                      </div>
                    )}
                    {!complete && (
                      <div className="flex flex-end flex-grow buttons">
                        <button
                          onClick={skipLift(idx)}
                          className="button is-outlined is-warning"
                        >
                          Skip
                        </button>
                        <button
                          onClick={finishLift(idx, row)}
                          className="button is-outlined is-success"
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
