import { User } from 'firebase/auth';
import { useContext, useMemo } from 'react';
import { AuthCtx } from '../components/Layout/AuthProvider';

const useUser = () => {
  const api = useContext(
    AuthCtx as React.Context<{
      login: () => void;
      logout: () => void;
      loginStatus: 0 | 1 | 2;
      user: 'unknown' | User | null;
    }>,
  );
  return useMemo(() => api.user, [api.user]);
};

export default useUser;
