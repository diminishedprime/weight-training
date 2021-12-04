const alphabet = (): string[] => {
  const a = [];
  const start = 'a'.charCodeAt(0);
  const end = 'z'.charCodeAt(0);
  for (var i = start; i <= end; ++i) {
    a.push(String.fromCharCode(i));
  }
  return a;
};

const Alphabet = alphabet();

interface LiteralType {
  type: 'literal-type';
  value: string;
}

type FieldType =
  | CustomType
  | 'string'
  | 'number'
  | 'boolean'
  | 'Timestamp'
  | LiteralType
  | ArrayType;

interface ArrayType {
  type: 'array-type';
  inner: FieldType;
}

type TypeField = [fieldName: string, fieldType: FieldType, required: boolean];

interface Metadata {
  exerciseType?: 'dumbbell' | 'barbbell';
  narrowFunctionName?: string;
  enumValue?: string;
  uiString?: string;
  uiStringFunctionName?: string;
  targetAreas?: string[];
  equipment?: string[];
}

type CustomType = {
  type: 'custom-type';
  typeName: string;
  version: number;
  fields: TypeField[];
  metadata?: Metadata;
};

interface EnumValue {
  enumKey: string;
  enumValue: string;
  metadata?: Metadata;
}

interface EnumType {
  type: 'enum-type';
  enumName: string;
  enumValues: EnumValue[];
  metadata?: Metadata;
}

interface EnumUnionType {
  type: 'enum-union-type';
  typeName: string;
  baseEnum: EnumType;
  variants: EnumValue[];
  metadata?: Metadata;
}

interface CustomTypeUnion {
  type: 'custom-type-union';
  typeName: string;
  variants: CustomType[];
  metadata?: Metadata;
}

interface NarrowFunctionData {
  functionName: string;
  baseEnum: EnumType;
  enumUnionType: EnumUnionType;
}

// helpers for creating the meta types

const customTypeUnion = (
  name: string,
  variants: CustomType[],
  metadata?: Metadata,
): CustomTypeUnion => ({
  type: 'custom-type-union',
  typeName: name,
  variants,
  metadata,
});

const enumUnionType = (
  name: string,
  baseEnum: EnumType,
  filter: (e: EnumValue) => boolean,
  metadata?: Metadata,
): EnumUnionType => ({
  type: 'enum-union-type',
  typeName: name,
  baseEnum,
  variants: baseEnum.enumValues.filter(filter),
  metadata,
});

const enumType = (
  enumName: string,
  enumValues: EnumType['enumValues'],
  metadata?: Metadata,
): EnumType => ({
  type: 'enum-type',
  enumName,
  enumValues,
  metadata,
});

const typeField = (valueName: string): TypeField => [
  'type',
  stringLiteral(valueName),
  true,
];

const stringLiteral = (...s: string[]): LiteralType => ({
  type: 'literal-type',
  value: s.map((s) => `'${s}'`).join(' | '),
});

const arrayOf = (inner: FieldType): ArrayType => ({
  type: 'array-type',
  inner,
});

const customType = (
  typeName: string,
  version: number,
  fields: TypeField[],
  metadata?: Metadata,
): CustomType => ({
  type: 'custom-type',
  typeName: typeName,
  version,
  fields,
  metadata,
});

// helpers for generating the code strings

const generateEnum = (e: EnumType): string => {
  const enumEntries = e.enumValues
    .map(({ enumKey, enumValue }) => `  ${enumKey} = '${enumValue}',`)
    .join('\n');
  return `
export enum ${e.enumName} {
  ${enumEntries.trim()}
}
`.trim();
};

const generateEnums = (s: EnumType[]): string =>
  s.map(generateEnum).join('\n\n').trimEnd();

const generateTypeName = (fieldType: FieldType): string => {
  if (typeof fieldType === 'string') {
    return `${fieldType}`;
  } else if (fieldType.type === 'literal-type') {
    return `${fieldType.value}`;
  } else if (fieldType.type === 'custom-type') {
    return `${fieldType.typeName}_V${fieldType.version}`;
  } else if (fieldType.type === 'array-type') {
    return `Array<${generateTypeName(fieldType.inner)}>`;
  } else return '';
};

const generateField = ([fieldName, fieldType, required]: TypeField): string => {
  const ifRequired = required ? '' : '?';
  let typePart = '';
  if (typeof fieldType === 'string') {
    typePart = generateTypeName(fieldType);
  } else if (fieldType.type === 'literal-type') {
    typePart = generateTypeName(fieldType);
  } else if (fieldType.type === 'custom-type') {
    typePart = generateTypeName(fieldType);
  } else if (fieldType.type === 'array-type') {
    typePart = generateTypeName(fieldType);
  }
  // What is the absolute fuck is going on here???
  return `${fieldName}${ifRequired}: ${typePart};`;
};

const generateEnumUnion = ({
  typeName,
  baseEnum,
  variants,
}: EnumUnionType): string => {
  const entries = variants
    .map((e) => `  | ${baseEnum.enumName}.${e.enumKey}`)
    .join('\n');
  return `
export type ${typeName} =
  ${entries.trim()};
`.trim();
};

const generateEnumUnions = (eut: EnumUnionType[]): string =>
  eut.map(generateEnumUnion).join('\n\n').trimEnd();

const generateNarrowFunction = (eut: EnumUnionType): string => {
  if (
    eut.metadata === undefined ||
    eut.metadata.narrowFunctionName === undefined
  ) {
    return '';
  } else {
    const arg = 'toNarrow';
    const conditions = eut.variants
      .map((v) => `  ${arg} === ${eut.baseEnum.enumName}.${v.enumKey} ||`)
      .join('\n');
    return `
export const ${eut.metadata.narrowFunctionName} = (
  ${arg}: ${eut.baseEnum.enumName},
): ${arg} is ${eut.typeName} =>
${conditions.substring(0, conditions.lastIndexOf(' ||'))};
`.trim();
  }
};

const generateNarrowFunctions = (eut: EnumUnionType[]): string =>
  eut.map(generateNarrowFunction).join('\n\n').trimEnd();

const generateType = ({
  typeName: typename,
  version,
  fields,
}: CustomType): string => {
  const fieldsString = fields
    .map((f) => `  ${generateField(f)}`)
    .concat([`  version: ${version};`])
    .join('\n');
  return `
export interface ${typename}_V${version} {
  ${fieldsString.trim()}
}`.trim();
};

const generateTypes = (s: CustomType[]): string =>
  s.map(generateType).join('\n\n').trimEnd();

const generateUIStringFunction = (s: EnumType): string => {
  if (s?.metadata?.uiStringFunctionName === undefined) {
    return '';
  }
  const kases = s.enumValues
    .map(
      (e) =>
        `    case ${s.enumName}.${e.enumKey}:
      return '${e?.metadata?.uiString || ''}';`,
    )
    .join('\n');
  return `
export const ${s.metadata.uiStringFunctionName} = (e: ${s.enumName}) => {
  switch (e) {
${kases}
    default: {
      const exhaustiveCheck: never = e;
      console.log({ exhaustiveCheck });
      throw new Error('Unhandled case');
    }
  }
};
  `;
};

const generateUIStringFunctions = (s: EnumType[]): string =>
  s.map(generateUIStringFunction).join('\n\n').trimEnd();

const generateTypesUnion = (s: CustomTypeUnion): string => {
  const entries = s.variants
    .map((e) => `  | ${e.typeName}_V${e.version}`)
    .join('\n');
  return `
export type ${s.typeName} =
${entries};
`.trim();
};

const generateTypesUnions = (s: CustomTypeUnion[]): string =>
  s.map(generateTypesUnion).join('\n\n').trimEnd();

const generateExerciseMetadata = (
  exerciseEnum: EnumType,
  metadataType: CustomType,
): string => {
  const cases = exerciseEnum.enumValues
    .map((e) =>
      `    case ${exerciseEnum.enumName}.${e.enumKey}: {
      return {
        version: ${metadataType.version},
        targetAreas: [${(e?.metadata?.targetAreas || [])
          .map((a) => `'${a}'`)
          .join(', ')}],
        equipment: [${(e?.metadata?.equipment || [])
          .map((a) => `'${a}'`)
          .join(', ')}],
      }
    }
`.trimEnd(),
    )
    .join('\n');

  return `
export const metadataForExercise = (e: ${exerciseEnum.enumName}): ${metadataType.typeName}_V${metadataType.version} => {
  switch (e) {
${cases}
    default: {
      const exhaustiveCheck: never = e;
      console.log({ exhaustiveCheck });
      throw new Error('Unhandled case');
    }
  }
}
`.trim();
};

// Type data below

const Weight_V1 = customType('Weight', 1, [
  ['unit', stringLiteral('lb', 'kg'), true],
  ['value', 'number', true],
]);

const ExerciseMetadata_V1 = customType('ExerciseMetadata', 1, [
  [
    'targetAreas',
    arrayOf(
      stringLiteral(
        'chest',
        'back',
        'shoulders',
        'pectoralis',
        'glutes',
        'arms',
        'thighs',
        'calves',
        'quadriceps',
        'tensor fascia latae',
        'hip abductors',
        'trapezies',
        'abs',
        'abdominuls',
        'rectus abdominus',
        'internal obliques',
        'external obliques',
        'legs',
        'hamstrings',
        'biceps',
        'triceps',
        'deltoids',
        // Meme but might be worth keeping
        'yes',
      ),
    ),
    true,
  ],
  [
    'equipment',
    arrayOf(
      stringLiteral(
        'barbbell',
        'dumbbell',
        'bodyweight',
        'kettlebell',
        'resistance band',
      ),
    ),
    true,
  ],
]);

const commonBar = (typeValue: string): TypeField[] => [
  ['date', 'Timestamp', true],
  ['weight', Weight_V1, true],
  typeField(typeValue),
  ['reps', 'number', true],
  ['warmup', 'boolean', true],
];

const commonDumbbell = (typeValue: string): TypeField[] => [
  ['date', 'Timestamp', true],
  ['weight', Weight_V1, true],
  typeField(typeValue),
  ['reps', 'number', true],
];

const barExerciseTypes: CustomType[] = [
  customType('Deadlift', 3, commonBar('deadlift'), {
    enumValue: 'a',
    uiString: 'Deadlift',
    equipment: ['barbbell'],
    targetAreas: ['back', 'hamstrings', 'trapezies'],
  }),
  customType('Squat', 3, commonBar('squat'), {
    enumValue: 'b',
    uiString: 'Squat',
    equipment: ['barbbell'],
    targetAreas: ['abdominuls', 'quadriceps', 'glutes', 'hamstrings', 'back'],
  }),
  customType('FrontSquat', 3, commonBar('front-squat'), {
    enumValue: 'c',
    uiString: 'Front Squat',
    equipment: ['barbbell'],
    targetAreas: ['quadriceps', 'back'],
  }),
  customType('BenchPress', 3, commonBar('bench-press'), {
    enumValue: 'd',
    uiString: 'Bench Press',
    equipment: ['barbbell'],
    targetAreas: ['pectoralis', 'deltoids'],
  }),
  customType('OverheadPress', 3, commonBar('overhead-press'), {
    enumValue: 'e',
    uiString: 'Overhead Press',
    equipment: ['barbbell'],
    targetAreas: ['shoulders', 'triceps', 'deltoids'],
  }),
  customType('Snatch', 1, commonBar('snatch'), {
    enumValue: 'f',
    uiString: 'Snatch',
    equipment: ['barbbell'],
    targetAreas: ['yes'],
  }),
].map((ct) => ({
  ...ct,
  metadata: { ...ct.metadata, exerciseType: 'barbbell' },
}));

// TODO - Since the order here matters, we can never add another
// barExerciseType or the enum will break. Figure out a way around this.
const dumbbellExerciseTypes: CustomType[] = [
  customType('DumbbellRow', 1, commonDumbbell('dumbbell-row'), {
    enumValue: 'g',
    uiString: 'Bent-Over Row',
    equipment: ['dumbbell'],
    targetAreas: ['back', 'deltoids'],
  }),
  customType('DumbbellFly', 1, commonDumbbell('dumbbell-fly'), {
    enumValue: 'h',
    uiString: 'Fly',
    equipment: ['dumbbell'],
    targetAreas: ['pectoralis', 'deltoids'],
  }),
  customType('DumbbellBicepCurl', 1, commonDumbbell('dumbbell-bicep-curl'), {
    enumValue: 'i',
    uiString: 'Bicep Curl',
    equipment: ['dumbbell'],
    targetAreas: ['biceps'],
  }),
  customType('DumbbellHammerCurl', 1, commonDumbbell('dumbbell-hammer-curl'), {
    enumValue: 'j',
    uiString: 'Hammer Curl',
    equipment: ['dumbbell'],
    targetAreas: ['biceps'],
  }),
].map((ct) => ({
  ...ct,
  metadata: { ...ct.metadata, exerciseType: 'dumbbell' },
}));

const exerciseTypes: CustomType[] = [
  ...barExerciseTypes,
  ...dumbbellExerciseTypes,
];

const ExerciseEnum = enumType(
  'Exercise',
  exerciseTypes.map(({ typeName, metadata }) => {
    if (metadata === undefined || metadata.enumValue === undefined) {
      throw new Error(
        `'enumValue' must be defined in the Exercise metadata. ${typeName}`,
      );
    }
    return {
      enumKey: typeName,
      enumValue: metadata.enumValue,
      metadata,
    };
  }),
  {
    uiStringFunctionName: 'exerciseUIString',
  },
);

const enumsToGenerate: EnumType[] = [ExerciseEnum];
const enumUnionTypesToGenerate: EnumUnionType[] = [
  enumUnionType(
    'DumbbellExercise',
    ExerciseEnum,
    (a) => !!(a.metadata && a.metadata.exerciseType === 'dumbbell'),
    { narrowFunctionName: 'narrowDumbbellExercise' },
  ),
  enumUnionType(
    'BarExercise',
    ExerciseEnum,
    (a) => !!(a.metadata && a.metadata.exerciseType === 'barbbell'),
    { narrowFunctionName: 'narrowBarExercise' },
  ),
];
const typesToGenerate: CustomType[] = [
  Weight_V1,
  ExerciseMetadata_V1,
  ...exerciseTypes,
];
const typeUnions: CustomTypeUnion[] = [
  customTypeUnion('ExerciseData', [...exerciseTypes]),
  customTypeUnion('BarExerciseData', [...barExerciseTypes]),
  customTypeUnion('DumbbellExerciseData', [...dumbbellExerciseTypes]),
];

console.log(`// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY`);
console.log(`import { Timestamp } from 'firebase/firestore';\n`);
console.log(generateEnums(enumsToGenerate));
console.log(`// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY`);
console.log(generateEnumUnions(enumUnionTypesToGenerate));
console.log(`// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY`);
console.log(generateTypes(typesToGenerate));
console.log(`// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY`);
console.log(generateTypesUnions(typeUnions));
console.log(`// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY`);
console.log(generateNarrowFunctions(enumUnionTypesToGenerate));
console.log(`// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY`);
console.log(generateUIStringFunctions(enumsToGenerate));
console.log(`// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY`);
console.log(generateExerciseMetadata(ExerciseEnum, ExerciseMetadata_V1));
