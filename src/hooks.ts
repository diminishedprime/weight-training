import { useHistory } from "react-router-dom";

import * as React from "react";
import * as serviceWorker from "./serviceWorker";
import * as t from "./types";
import * as db from "./db";
import moment from "moment";
import firebase from "firebase/app";

const formatFor = (
  m: moment.Moment
): { className?: string; displayString?: string } => {
  const timeSinceLift = moment.duration(
    moment()
      .utc()
      .diff(m, "milliseconds"),
    "milliseconds"
  );
  const minutes = timeSinceLift.minutes();
  if (minutes >= 15 || timeSinceLift.asMinutes() >= 15) {
    return {};
  }
  let timeClass = "";
  if (minutes < 2) {
    timeClass = "has-text-danger";
  } else {
    timeClass = "has-text-success";
  }

  const seconds = timeSinceLift.seconds();
  return {
    displayString: `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
    className: timeClass
  };
};

export const useTimeSinceLift = (
  user: t.User | undefined,
  liftUid: string | undefined
): { moment?: moment.Moment; className?: string; displayString?: string } => {
  const [m, setMoment] = React.useState<moment.Moment>();
  const [className, setClassName] = React.useState<string>();
  const [displayString, setDisplayString] = React.useState();

  React.useEffect(() => {
    if (user === undefined || liftUid === undefined) {
      return;
    }
    db.getLift(firebase.firestore(), user.uid, liftUid).then(lift => {
      if (lift === undefined) {
        return;
      }
      const m = moment(lift.date.toDate());
      setMoment(m);
      const format = formatFor(m);
      setDisplayString(format.displayString);
      setClassName(format.className);
    });
  }, [user, liftUid]);

  React.useEffect(() => {
    if (m === undefined) {
      return;
    }
    const interval = setInterval(() => {
      const format = formatFor(m);
      setDisplayString(format.displayString);
      setClassName(format.className);
    }, 500);
    return () => clearInterval(interval);
  }, [user, m]);

  return { moment: m, className, displayString };
};

export const useLiftsWithCache = (user: t.User | null, date?: string) => {
  const key = t.LocalStorageKey.LIFTS + date;
  const [displayLifts, setDisplayLifts] = React.useState<
    t.DisplayLift[] | undefined
  >(() => {
    const stringValue = window.localStorage.getItem(key);
    if (stringValue === null) {
      return undefined;
    } else {
      const parsed = JSON.parse(stringValue) as any[];
      for (const parse of parsed) {
        if (typeof parse.date === "string") {
          // Send an event to firestore. Once we get very few or no entries
          // here, we can delete this if branch.
          firebase.analytics().logEvent("exception", {
            description: "Old Date format in localStorage",
            fatal: false
          });
          parse.date = firebase.firestore.Timestamp.fromDate(parse.date);
        } else {
          parse.date = new firebase.firestore.Timestamp(
            parse.date.seconds,
            parse.date.milliseconds
          );
        }
      }
      return parsed;
    }
  });

  React.useEffect(() => {
    if (user === null || date === undefined) {
      return;
    }
    new Promise(resolve => {
      const duration = moment.duration({ days: 1 });
      const dayBefore = moment(date, "YYYY-MM-DD").toDate();
      const dayAfter = moment(date, "YYYY-MM-DD")
        .add(duration)
        .toDate();

      db.getLiftsBetween(
        firebase.firestore(),
        user.uid,
        dayBefore,
        dayAfter
      ).then(newDisplayLifts => {
        setDisplayLifts(displayLifts => {
          const newStringified = JSON.stringify(newDisplayLifts);
          if (
            displayLifts === undefined ||
            JSON.stringify(displayLifts) !== newStringified
          ) {
            window.localStorage.setItem(key, newStringified);
            return newDisplayLifts;
          } else {
            return displayLifts;
          }
        });
        resolve();
      });
    });
  }, [user, key, date]);

  return displayLifts;
};

export const useForceSignIn = (): t.User | null => {
  const history = useHistory();
  const [user, setUser, cleanup] = useLocalStorage<t.User | null>(
    t.LocalStorageKey.USER,
    null
  );

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        cleanup();
        history.push("/login");
      } else {
        const u: t.User = { uid: user.uid };
        setUser(u);
      }
    });
  }, [history, cleanup, setUser]);
  return user;
};

export const useUpdateAvailable = (): boolean => {
  const [updateAvailable, setUpdateAvailable] = React.useState(false);
  React.useEffect(() => {
    serviceWorker.register({
      onUpdate: () => {
        setUpdateAvailable(true);
      }
    });
  });
  return updateAvailable;
};

export const useLocalStorage = <T>(
  key: t.LocalStorageKey,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>, () => void] => {
  const [value, setValue] = React.useState<T>(() => {
    const stringValue = window.localStorage.getItem(key);
    if (stringValue === null) {
      return initialValue;
    } else {
      const parsed = JSON.parse(stringValue);
      return parsed;
    }
  });

  React.useEffect(() => {
    if (value !== null && value !== undefined) {
      new Promise(resolve => {
        window.localStorage.setItem(key, JSON.stringify(value));
        resolve();
      });
    }
  }, [value, key]);

  const removeItem = React.useCallback(() => {
    new Promise(resolve => {
      window.localStorage.removeItem(key);
      resolve();
    });
  }, [key]);

  return [value, setValue, removeItem];
};
