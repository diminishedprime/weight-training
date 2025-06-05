import { Database } from '@/database.types';

type LiftType = Database["public"]["Enums"]["lift_type_enum"]
export const liftTypeUIString = (type: LiftType): string => {
    switch (type) {
        case 'deadlift':
            return 'Deadlift';
        case 'squat':
            return 'Squat';
        case 'bench_press':
            return 'Bench Press';
        case 'overhead_press':
            return 'Overhead Press';
        case 'row':
            return 'Row';
        default: {
            // This will cause a type error if a new enum value is added and not handled
            const _exhaustiveCheck: never = type;
            return _exhaustiveCheck;
        }
    }
}