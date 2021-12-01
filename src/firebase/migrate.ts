import { DBUserDoc, UserDoc_V4 } from '@/types';

export const migrateUserDoc = (
  userDoc: DBUserDoc,
  updated = false,
): { userDoc: UserDoc_V4; updated: boolean } => {
  switch (userDoc.version) {
    case '3': {
      const asV4: UserDoc_V4 = {
        ...userDoc,
        version: 4,
        pinnedExercises: { type: 'unset' },
      };
      return migrateUserDoc(asV4, true);
    }
    case 4: {
      return { updated, userDoc };
    }
    default: {
      console.error('version not accounted for', { userDoc });
      throw new Error(`version not accounted for: ${userDoc}`);
    }
  }
};
