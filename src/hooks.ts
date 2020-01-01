import * as firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import * as React from "react";
import * as serviceWorker from "./serviceWorker";
import * as t from "./types";

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
