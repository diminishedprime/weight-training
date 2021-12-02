import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

export const LoginStatus = {
  Unknown: 0,
  LoggedIn: 1,
  LoggedOut: 2,
};

const provider = new GoogleAuthProvider();

const firstLoad = true;
const useAuth = () => {
  const auth = useMemo(() => getAuth(), []);
  const [currentUser, setCurrentUser] = useState(() => {
    const c = auth.currentUser;
    if (c !== null) {
      return c;
    }
    if (firstLoad) {
      return 'unknown';
    }
    return c;
  });

  const loginStatus = useMemo(
    () =>
      typeof window === 'undefined' || currentUser === 'unknown'
        ? LoginStatus.Unknown
        : currentUser === null
        ? LoginStatus.LoggedOut
        : LoginStatus.LoggedIn,
    [currentUser],
  );

  useEffect(() => onAuthStateChanged(auth, setCurrentUser), [auth]);

  const login = useCallback(() => {
    signInWithPopup(auth, provider).then((result) => {
      setCurrentUser(result.user);
    });
  }, [auth]);

  const logout = useCallback(() => {
    signOut(auth).then(() => {
      setCurrentUser(null);
    });
  }, [auth]);

  return { login, logout, loginStatus, user: currentUser };
};

export default useAuth;
