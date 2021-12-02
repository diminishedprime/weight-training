import { useContext, useMemo } from 'react';
import { AuthCtxType } from '@/types';
import { AuthCtx } from '../components/Layout/AuthProvider';

const useUser = () => {
  const api = useContext(AuthCtx as AuthCtxType);
  return useMemo(() => api.user, [api.user]);
};

export default useUser;
