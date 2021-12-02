import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { subscribeToUserDoc } from '@/firebase';
import { UserDoc_V4 } from '@/types';
import useUser from '@/hooks/useUser';

interface Resolved {
  type: 'resolved';
  userDoc: UserDoc_V4;
}

interface InProgress {
  type: 'in-progress';
}

interface NotStarted {
  type: 'not-started';
}

interface Failed {
  type: 'failed';
}

type UserDocRequest = Resolved | InProgress | NotStarted | Failed;

export const useUserDocNoCtx = (user: User | null | 'unknown') => {
  const [type, setType] = useState<UserDocRequest['type']>('not-started');
  const [userDoc, setUserDoc] = useState<UserDoc_V4>();

  useEffect(() => {
    if (user === null || user === 'unknown') {
      return;
    }
    setType('in-progress');
    return subscribeToUserDoc(user, (ud) => {
      setUserDoc(ud);
      setType('resolved');
    });
  }, [user]);

  switch (type) {
    case 'not-started':
    case 'in-progress':
    case 'failed':
      return { type };
    case 'resolved':
      if (userDoc === undefined) {
        throw new Error(`Invalid invaraint. 'userDoc' must be defined here.`);
      }
      return { type, userDoc };
    default: {
      const check: never = type;
      throw new Error(`Exhaustive check failed, ${check}`);
    }
  }
};

const useUserDoc = (): UserDocRequest => {
  const user = useUser();
  return useUserDocNoCtx(user);
};

export default useUserDoc;
