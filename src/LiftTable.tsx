import * as React from "react";
import firebase from "firebase/app";
import * as t from "./types";
import * as db from "./db";

type EditingState = {
  isEditing: boolean;
  uid?: string;
};

export default ({
  user,
  liftType
}: {
  user: firebase.User;
  liftType: t.LiftType;
}) => {
  const [lifts, setLifts] = React.useState<t.DisplayLift[]>([]);

  React.useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .collection("lifts")
      .where("type", "==", liftType)
      .orderBy("date", "desc")
      .limit(5)
      .onSnapshot(snapshot => {
        setLifts(
          snapshot.docs.map(doc => {
            const data = doc.data();
            const asDate = data.date.toDate();
            data["date"] = asDate;
            data["uid"] = doc.id;
            return data as t.DisplayLift;
          })
        );
        setUpdateReps({});
      });
  }, [user.uid, liftType]);

  const [{ isEditing, uid }, setEditingState] = React.useState<EditingState>({
    isEditing: false,
    uid: undefined
  });

  const deleteLift = React.useCallback(
    (liftUid: string) => () => {
      db.deleteLift(firebase.firestore(), user.uid, liftUid).then(() => {
        setEditingState({ isEditing: false, uid: undefined });
      });
    },
    [user.uid]
  );

  const cancelEdit = React.useCallback(() => {
    setEditingState({ isEditing: false, uid: undefined });
    setUpdateReps({});
  }, []);

  const [updateReps, setUpdateReps] = React.useState<{
    [liftUid: string]: string;
  }>({});
  const repsOnChange = React.useCallback(
    (liftUid: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setUpdateReps(old => {
        const update = { ...old, [liftUid]: value };
        console.log({ old, update });
        return update;
      });
    },
    []
  );

  const onClickUpdate = React.useCallback(
    (uid: string) => async () => {
      console.log({ uid }, updateReps[uid]);
      if (uid && updateReps[uid]) {
        const currentLift = lifts.find(lift => lift.uid === uid);
        if (currentLift) {
          if (currentLift.reps.toString() !== updateReps[uid]) {
            console.log("this happened");
            await db.updateLift(firebase.firestore(), user.uid, uid, {
              reps: parseInt(updateReps[uid])
            });
            setEditingState({ isEditing: false, uid: undefined });
          }
        }
      }
    },
    [updateReps, lifts, user.uid]
  );

  const [updateDisabled, setUpdateDisable] = React.useState(true);
  React.useEffect(() => {
    if (uid && updateReps[uid]) {
      const currentLift = lifts.find(lift => lift.uid === uid);
      if (currentLift) {
        if (currentLift.reps.toString() !== updateReps[uid]) {
          setUpdateDisable(false);
        }
      }
    }
  }, [lifts, uid, updateReps]);

  if (lifts.length === 0) {
    return <div>No lifts recorded.</div>;
  }

  return (
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
                    updateReps[lift.uid] !== undefined
                      ? updateReps[lift.uid]
                      : lift.reps
                  }
                  onChange={repsOnChange(lift.uid)}
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
                    setEditingState({ isEditing: true, uid: lift.uid });
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
                      onClick={onClickUpdate(lift.uid)}
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
  );
};
