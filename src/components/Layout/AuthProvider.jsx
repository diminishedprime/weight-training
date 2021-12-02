import * as React from 'react';
import useAuth, { LoginStatus } from './useAuth';

export const AuthCtx = React.createContext({
  login: () => {},
  logout: () => {},
  loginStatus: LoginStatus.Unknown,
  user: 'unknown',
});

const AuthProvider = ({ children }) => {
  const api = useAuth();
  return <AuthCtx.Provider value={api}>{children}</AuthCtx.Provider>;
};

export default AuthProvider;
