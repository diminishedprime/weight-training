import { useCallback, useContext } from 'react';
import { UserCtx } from '@/components/Layout';
import { updateUserDoc } from '@/firebase';
import { Update, UserDoc_V4 } from '@/types';

const useUpdateUserDoc = () => {
  const user = useContext(UserCtx);
  return useCallback(
    async (update: Update<UserDoc_V4>): Promise<void> => {
      if (user === null || user === 'unknown') {
        throw new Error('Invalid invariant, user must be defined.');
      }
      return updateUserDoc(user, update);
    },
    [user],
  );
};

export default useUpdateUserDoc;
