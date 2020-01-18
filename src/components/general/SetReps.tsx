import * as React from "react";

interface SetRepsProps {
  setReps: React.Dispatch<React.SetStateAction<number>>;
  reps: number;
}

export const SetReps: React.FC<SetRepsProps> = ({ setReps, reps }) => {
  return (
    <div className="control">
      <label className="label">Reps: {reps}</label>
      <div className="buttons has-addons">
        <button
          className="button is-outlined is-danger"
          onClick={() => setReps((a) => Math.max(1, a - 1))}
        >
          -
        </button>
        <button className="button" onClick={() => setReps(1)}>
          1
        </button>
        <button className="button" onClick={() => setReps(3)}>
          3
        </button>
        <button className="button" onClick={() => setReps(5)}>
          5
        </button>
        <button
          className="button is-outlined is-success"
          onClick={() => setReps((a) => a + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
};
