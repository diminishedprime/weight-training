# Database Schema Diagram

> This was AI generated so it may be complete garbage.

Below is a Mermaid ER diagram representing the main tables and relationships in the database, based on the migration files:

```mermaid
erDiagram
    USERS {
        uuid id PK
        text name
        text email
        timestamp emailVerified
        text image
    }
    WEIGHTS {
        uuid id PK
        numeric weight_value
        enum(weight_unit_enum) weight_unit
    }
    EXERCISES {
        uuid id PK
        uuid user_id FK
        enum(exercise_type_enum) exercise_type
        enum(equipment_type_enum) equipment_type
        timestamp performed_at
        uuid weight_id FK
        int reps
        bool warmup
        enum(completion_status_enum) completion_status
        text notes
        enum(relative_effort_enum) relative_effort
    }
    EXERCISE_GROUP {
        uuid id PK
        uuid user_id FK
        uuid wendler_id FK
    }
    EXERCISE_BLOCK {
        uuid id PK
        uuid user_id FK
        uuid exercise_group_id FK
        uuid exercise_id FK
        int block_order
        uuid workout_session_id FK
    }
    WORKOUT_SESSION {
        uuid id PK
        uuid user_id FK
        text name
        text notes
    }
    WENDLER_METADATA {
        uuid id PK
        uuid user_id FK
        uuid training_max_id FK
        uuid increase_amount_id FK
        enum(cycle_type_enum) cycle_type
        enum(exercise_type_enum) exercise_type
    }

    USERS ||--o{ EXERCISES : "user_id"
    USERS ||--o{ EXERCISE_GROUP : "user_id"
    USERS ||--o{ EXERCISE_BLOCK : "user_id"
    USERS ||--o{ WORKOUT_SESSION : "user_id"
    USERS ||--o{ WENDLER_METADATA : "user_id"
    WEIGHTS ||--o{ EXERCISES : "weight_id"
    WEIGHTS ||--o{ WENDLER_METADATA : "training_max_id"
    WEIGHTS ||--o{ WENDLER_METADATA : "increase_amount_id"
    EXERCISE_GROUP ||--o{ EXERCISE_BLOCK : "exercise_group_id"
    EXERCISES ||--o{ EXERCISE_BLOCK : "exercise_id"
    EXERCISE_GROUP ||--o| WENDLER_METADATA : "wendler_id"
    WORKOUT_SESSION ||--o{ EXERCISE_BLOCK : "workout_session_id"
```

- PK = Primary Key, FK = Foreign Key
- Enum types are shown for clarity.
- This diagram covers the main tables and their relationships as defined in the migrations.
