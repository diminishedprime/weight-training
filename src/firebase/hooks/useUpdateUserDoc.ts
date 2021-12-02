import { useCallback } from 'react';
import { updateUserDoc } from '@/firebase';
import { Update, UserDoc_V4 } from '@/types';
import useUser from '@/hooks/useUser';

const useUpdateUserDoc = () => {
  const user = useUser();
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
