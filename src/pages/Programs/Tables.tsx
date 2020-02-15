import moment from "moment";
import * as React from "react";
import { Link } from "react-router-dom";
import { FirebaseUser, ProgramSection } from "../../types";

interface ProgramSectionTableProps {
  section: ProgramSection;
  finishSection: () => void;
  user: FirebaseUser;
  isActive: boolean;
  localStorageKey: string;
}

const ProgramSectionTable: React.FC<ProgramSectionTableProps> = ({
  user,
  section,
  finishSection,
  isActive,
  localStorageKey
}) => {
  const { titleText, data } = section;
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
  const complete = current >= data.length;

  React.useEffect(() => {
    if (current < data.length) {
      window.localStorage.setItem(finishedKey, JSON.stringify([...finished]));
      window.localStorage.setItem(skippedKey, JSON.stringify([...skipped]));
      window.localStorage.setItem(currentKey, current.toString());
    }
  }, [finished, skipped, current, currentKey, finishedKey, skippedKey]);

  React.useEffect(() => {
    if (current >= data.length) {
      window.localStorage.removeItem(finishedKey);
      window.localStorage.removeItem(skippedKey);
      window.localStorage.removeItem(currentKey);
      finishSection();
    }
  }, [current, finishSection, currentKey, finishedKey, skippedKey]);
  return (
    <>
      <div className="is-5">{titleText}</div>
      <table className="table">
        {data[0].header()}
        <tbody>
          {data.map((row, idx) => (
            <React.Fragment key={`table-${idx}`}>
              {row.row({
                skipped: skipped.has(idx),
                finished: finished.has(idx),
                selected: isActive && idx === current,
                user
              })}
              {isActive && idx === current && (
                <tr>
                  <td colSpan={row.length()}>
                    <div className="control flex flex-center">
                      {idx + 1 < data.length && (
                        <div>
                          <button
                            onClick={() => {
                              setSkipped((old) => {
                                for (let i = idx; i <= data.length; i++) {
                                  old.add(i);
                                }
                                return new Set(old);
                              });
                              setCurrent(data.length);
                            }}
                            className={`button is-danger`}
                          >
                            Skip Remaining
                          </button>
                        </div>
                      )}
                      {!complete && (
                        <div className="flex flex-end flex-grow buttons">
                          <button
                            onClick={() => {
                              setCurrent((old) => old + 1);
                              setSkipped((old) => {
                                old.add(idx);
                                return new Set(old);
                              });
                            }}
                            className="button is-outlined is-warning"
                          >
                            Skip
                          </button>
                          <button
                            onClick={() => {
                              setCurrent((old) => old + 1);
                              setFinished((old) => {
                                old.add(idx);
                                return new Set(old);
                              });
                              row.completeExercise(user);
                            }}
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
    </>
  );
};

interface TableProps {
  user: FirebaseUser;
  exercises: ProgramSection[];
}

const Tables: React.FC<TableProps> = ({ user, exercises }) => {
  const [activeExercise, setActiveExercise] = React.useState(0);
  const [doneWithSections, setDoneWithSections] = React.useState(false);

  const finishSection = React.useCallback(() => {
    setActiveExercise((old) => old + 1);
    setDoneWithSections(true);
  }, []);

  return (
    <div>
      {exercises.map((section, idx) => (
        <ProgramSectionTable
          user={user}
          finishSection={finishSection}
          key={`program-${idx}`}
          section={section}
          isActive={idx === activeExercise}
          localStorageKey={`@weight-training/programSection/${idx}`}
        />
      ))}
      {doneWithSections && (
        <div>
          <Link to="/">
            <button className="button">Home</button>
          </Link>
          <Link to={`/lifts/${moment().format("YYYY-MM-DD")}`}>
            <button className="button">Today's Exercises</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Tables;
