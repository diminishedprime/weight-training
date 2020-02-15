import moment from "moment";
import * as React from "react";
import { Link } from "react-router-dom";
import { FirebaseUser, ProgramSection } from "../../types";
import BarbellTable from "./BarbellTable";

interface ProgramSectionTableProps {
  section: ProgramSection;
  finishSection: () => void;
  user: FirebaseUser;
  isActive: boolean;
  localStorageKey: string;
}

// TODO add in section to home page to resume a program if there's anything in localstorage.
const ProgramSectionTable: React.FC<ProgramSectionTableProps> = ({
  user,
  section,
  finishSection,
  isActive,
  localStorageKey
}) => {
  const { titleText, data } = section;
  let table = null;
  switch (data.type) {
    case "BarbellLifts":
      table = (
        <BarbellTable
          user={user}
          rows={data.rows}
          localStorageKey={localStorageKey}
          finishSection={finishSection}
          isActive={isActive}
        />
      );
      break;
  }
  return (
    <>
      <div className="is-5">{titleText}</div>
      {table}
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
