# Database Schema Diagram

Below is a Mermaid ER diagram representing the main tables and relationships in the database, based on the latest migration files:

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
    WENDLER_METADATA {
        uuid id PK
        uuid user_id FK
        numeric training_max
        numeric increase_amount
        enum(wendler_cycle_type_enum) cycle_type
        enum(exercise_type_enum) exercise_type
        timestamp created_at
        timestamp updated_at
    }
    EXERCISE_BLOCK {
        uuid id PK
        uuid user_id FK
        uuid wendler_metadata_id FK
        int block_order
        text notes
        timestamp created_at
        timestamp updated_at
    }
    EXERCISE_BLOCK_EXERCISES {
        uuid block_id FK
        uuid exercise_id FK
        int exercise_order
    }
    EXERCISE_SUPERBLOCK {
        uuid id PK
        uuid user_id FK
        text name
        text notes
        timestamp created_at
        timestamp updated_at
    }
    EXERCISE_SUPERBLOCK_BLOCKS {
        uuid superblock_id FK
        uuid block_id FK
        int superblock_order
    }

    USERS ||--o{ EXERCISES : "user_id"
    USERS ||--o{ WENDLER_METADATA : "user_id"
    USERS ||--o{ EXERCISE_BLOCK : "user_id"
    USERS ||--o{ EXERCISE_SUPERBLOCK : "user_id"
    WEIGHTS ||--o{ EXERCISES : "weight_id"
    WENDLER_METADATA ||--o{ EXERCISE_BLOCK : "wendler_metadata_id"
    EXERCISE_BLOCK ||--o{ EXERCISE_BLOCK_EXERCISES : "id"
    EXERCISES ||--o{ EXERCISE_BLOCK_EXERCISES : "id"
    EXERCISE_SUPERBLOCK ||--o{ EXERCISE_SUPERBLOCK_BLOCKS : "id"
    EXERCISE_BLOCK ||--o{ EXERCISE_SUPERBLOCK_BLOCKS : "id"
```

- PK = Primary Key, FK = Foreign Key
- Enum types are shown for clarity.
- This diagram covers the main tables and their relationships as defined in the migrations.
