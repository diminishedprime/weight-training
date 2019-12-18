import * as firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import * as React from "react";
import * as serviceWorker from "./serviceWorker";

export const useForceSignIn = () => {
  const history = useHistory();
  const [user, setUser] = React.useState<firebase.User | null>(null);
  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setUser(user);
      if (!user) {
        history.push("/login");
      }
    });
  }, [history]);
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

export enum LocalStorageKey {
  X_BY_X = "@weight-training/x-by-x"
}
export const useLocalStorage = <T>(
  key: LocalStorageKey,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>, () => void] => {
  const [value, setValue] = React.useState<T>(initialValue);
  React.useEffect(() => {
    const stringValue = window.localStorage.getItem(key);
    if (stringValue === null) {
      return;
    }
    const parsed = JSON.parse(stringValue);
    setValue(parsed);
  }, [key]);

  React.useEffect(() => {
    new Promise(resolve => {
      window.localStorage.setItem(key, JSON.stringify(value));
      resolve();
    });
  }, [value, key]);

  const removeItem = React.useCallback(() => {
    new Promise(resolve => {
      window.localStorage.removeItem(key);
      resolve();
    });
  }, [key]);

  return [value, setValue, removeItem];
};
