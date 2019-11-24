import * as React from "react";
import firebase from "firebase/app";
import * as t from "./types";

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
      });
  }, [user.uid, liftType]);

  const [{ isEditing, uid }, setEditingState] = React.useState<EditingState>({
    isEditing: false,
    uid: undefined
  });

  const deleteLift = React.useCallback(
    (uid: string) => () => {
      firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .collection("lifts")
        .doc(uid)
        .delete()
        .then(() => {
          setEditingState({ isEditing: false, uid: undefined });
        });
    },
    [user.uid]
  );

  const cancelEdit = React.useCallback(() => {
    setEditingState({ isEditing: false, uid: undefined });
  }, []);

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
            <td>{lift.reps}</td>
            <td>
              {uid === undefined && (
                <button
                  className="button link is-danger"
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
