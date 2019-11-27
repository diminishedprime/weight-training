import * as React from "react";
import firebase from "firebase/app";
import * as t from "./types";
import * as db from "./db";

type EditingState = {
  isEditing: boolean;
  uid?: string;
  dateString?: string;
};

export default ({
  user,
  liftType
}: {
  user: firebase.User;
  liftType: t.LiftType;
}) => {
  const [lifts, setLifts] = React.useState<{ [date: string]: t.DisplayLift[] }>(
    {}
  );

  React.useEffect(() => {
    const firestore = firebase.firestore();
    const lifts = db
      .getLifts(firestore, user.uid)
      .where("type", "==", liftType)
      .orderBy("date", "desc")
      .limit(50);
    db.onSnapshotGroupedBy(
      lifts,
      doc =>
        doc
          .data()
          .date.toDate()
          .toISOString()
          .slice(0, 10),
      doc => {
        const data = doc.data();
        const asDate = data.date.toDate();
        data["date"] = asDate;
        data["uid"] = doc.id;
        return data as t.DisplayLift;
      },
      grouping => {
        setLifts(grouping);
      }
    );
  }, [user.uid, liftType]);

  const [{ isEditing, uid, dateString }, setEditingState] = React.useState<
    EditingState
  >({
    isEditing: false,
    uid: undefined,
    dateString: undefined
  });

  const deleteLift = React.useCallback(
    (liftUid: string) => () => {
      db.deleteLift(firebase.firestore(), user.uid, liftUid).then(() => {
        setEditingState({
          isEditing: false,
          uid: undefined,
          dateString: undefined
        });
      });
    },
    [user.uid]
  );

  const cancelEdit = React.useCallback(() => {
    setEditingState({
      isEditing: false,
      uid: undefined,
      dateString: undefined
    });
    setUpdateReps({});
  }, []);

  const [updateReps, setUpdateReps] = React.useState<{
    [dateString: string]: {
      [liftUid: string]: string;
    };
  }>({});
  const repsOnChange = React.useCallback(
    (liftUid: string, dateString: string) => (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = e.target.value;
      setUpdateReps(old => ({ ...old, [dateString]: { [liftUid]: value } }));
    },
    []
  );

  const onClickUpdate = React.useCallback(
    (uid: string, dateString: string) => async () => {
      if (uid && updateReps[dateString] && updateReps[dateString][uid]) {
        const currentLift = lifts[dateString].find(lift => lift.uid === uid);
        if (currentLift) {
          if (currentLift.reps.toString() !== updateReps[dateString][uid]) {
            await db.updateLift(firebase.firestore(), user.uid, uid, {
              reps: parseInt(updateReps[dateString][uid])
            });
            setEditingState({
              isEditing: false,
              uid: undefined,
              dateString: undefined
            });
          }
        }
      }
    },
    [updateReps, lifts, user.uid]
  );

  const [updateDisabled, setUpdateDisable] = React.useState(true);
  React.useEffect(() => {
    if (
      uid &&
      dateString &&
      updateReps[dateString] &&
      updateReps[dateString][uid]
    ) {
      const currentLift = lifts[dateString].find(lift => lift.uid === uid);
      if (currentLift) {
        if (currentLift.reps.toString() !== updateReps[dateString][uid]) {
          setUpdateDisable(false);
        }
      }
    }
  }, [lifts, uid, updateReps, dateString]);

  if (Object.keys(lifts).length === 0) {
    return <div>No lifts recorded.</div>;
  }

  const dateGroups: [string, t.DisplayLift[]][] = Object.keys(
    lifts
  ).map(key => [key, lifts[key]]);

  return (
    <>
      {dateGroups.map(([dateString, lifts]: [string, t.DisplayLift[]]) => {
        return (
          <div key={dateString}>
            <div className="title is-5">{dateString}</div>
            <table className="table is-striped is-fullwidth">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight</th>
                  <th>Reps</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {lifts.map(lift => (
                  <tr key={lift.uid}>
                    <td>{lift.date.toLocaleTimeString()}</td>
                    <td>{lift.weight}</td>
                    <td>
                      {isEditing && uid === lift.uid ? (
                        <input
                          value={
                            updateReps[dateString] &&
                            updateReps[dateString][lift.uid] !== undefined
                              ? updateReps[dateString][lift.uid]
                              : lift.reps
                          }
                          onChange={repsOnChange(lift.uid, dateString)}
                        />
                      ) : (
                        <>{lift.reps}</>
                      )}
                    </td>
                    <td>
                      {uid === undefined && (
                        <button
                          className="button link is-danger is-small"
                          disabled={isEditing && uid !== lift.uid}
                          onClick={() => {
                            setEditingState({
                              isEditing: true,
                              uid: lift.uid,
                              dateString
                            });
                          }}
                        >
                          Edit
                        </button>
                      )}
                      {lift.uid === uid && isEditing && (
                        <div className="field has-addons">
                          <p className="control">
                            <button
                              className="button link is-danger is-small"
                              onClick={deleteLift(lift.uid)}
                            >
                              Delete
                            </button>
                          </p>
                          <p className="control">
                            <button
                              className="button link is-success is-small"
                              disabled={updateDisabled}
                              onClick={onClickUpdate(lift.uid, dateString)}
                            >
                              Update
                            </button>
                          </p>
                          <p className="control">
                            <button
                              className="button is-warning is-small"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
};
