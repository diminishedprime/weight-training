import { useHistory, useLocation } from "react-router-dom";

import moment from "moment";
import * as React from "react";
import * as db from "./db";
import * as serviceWorker from "./serviceWorker";
import * as t from "./types";
import { useSelector } from "./types";

export const useFirestore = () => {
  return useSelector((a) => a.firestore);
};

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
  user: t.FirebaseUser | undefined,
  liftUid: string | undefined
): { moment?: moment.Moment; className?: string; displayString?: string } => {
  const firestore = useSelector((a) => a.firestore);
  const [m, setMoment] = React.useState<moment.Moment>();
  const [className, setClassName] = React.useState<string>();
  const [displayString, setDisplayString] = React.useState();

  React.useEffect(() => {
    if (user === undefined || liftUid === undefined) {
      return;
    }
    db.getLift(firestore, user, liftUid).then((lift) => {
      if (lift === undefined) {
        return;
      }
      const m = moment(lift.getDate().toDate());
      setMoment(m);
      const format = formatFor(m);
      setDisplayString(format.displayString);
      setClassName(format.className);
    });
  }, [user, liftUid, firestore]);

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

export const useForceSignIn = (): t.FirebaseUser | null => {
  const history = useHistory();
  const auth = useSelector((a) => a.auth);
  const [user, setUser, cleanup] = useLocalStorage<t.FirebaseUser | null>(
    t.LocalStorageKey.FIREBASE_USER,
    null
  );

  React.useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        cleanup();
        history.push("/login");
      } else {
        const u: t.FirebaseUser = { uid: user.uid };
        setUser(u);
      }
    });
  }, [history, cleanup, setUser, auth]);
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
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }, [value, key]);

  const removeItem = React.useCallback(() => {
    window.localStorage.removeItem(key);
  }, [key]);

  return [value, setValue, removeItem];
};

interface UseSettings {
  settings: t.Settings;
  setSettings: React.Dispatch<React.SetStateAction<t.Settings>>;
}

export const useSettings = (): UseSettings => {
  const [settings, setSettings] = useLocalStorage<t.Settings>(
    t.LocalStorageKey.SETTINGS,
    { version: "1", showOlympic: true, unit: t.WeightUnit.POUND }
  );

  return { settings, setSettings };
};

export const useMeasurePage = (
  pageTitle: string,
  cleanup?: (path: string) => string
) => {
  const location = useLocation();
  const analytics = useSelector((a) => a.analytics);
  React.useEffect(() => {
    if (analytics === undefined) {
      return;
    }
    const pagePath =
      cleanup === undefined ? location.pathname : cleanup(location.pathname);
    analytics.logEvent("page_view", {
      page_title: pageTitle,
      page_path: pagePath
    });
  }, [location.pathname, pageTitle, analytics, cleanup]);
};

interface ActivePrograms {
  programs: { [programUrl: string]: { displayText: string; url: string } };
  version: "1";
}

type UseActivePrograms = () => {
  activePrograms: ActivePrograms;
  addActiveProgram: (programUrl: string, displayText: string) => void;
  removeActiveProgram: (programUrl: string) => void;
};

export const useActivePrograms: UseActivePrograms = () => {
  const [activePrograms, setActivePrograms] = useLocalStorage<ActivePrograms>(
    t.LocalStorageKey.ActivePrograms,
    { programs: {}, version: "1" }
  );

  const addActiveProgram = React.useCallback(
    (programUrl: string, displayText: string) => {
      if (displayText !== "ignore") {
        setActivePrograms((old) => ({
          ...old,
          programs: {
            ...old.programs,
            [programUrl]: { displayText, url: programUrl }
          }
        }));
      }
    },
    [setActivePrograms]
  );

  const removeActiveProgram = React.useCallback(
    (programUrl: string) => {
      setActivePrograms((old) => {
        delete old.programs[programUrl];
        return { ...old };
      });
    },
    [setActivePrograms]
  );

  return { activePrograms, addActiveProgram, removeActiveProgram };
};

interface UseDefaultBar {
  weight: t.Weight;
  setWeight: React.Dispatch<React.SetStateAction<t.Weight>>;
}

export const useDefaultBar = (initialWeight?: t.Weight): UseDefaultBar => {
  const {
    settings: { unit: defaultUnit }
  } = useSettings();
  const [weight, setWeight] = React.useState(
    initialWeight || t.Weight.bar(defaultUnit)
  );
  return { weight, setWeight };
};
