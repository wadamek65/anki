const omitTypename = (key: string, value: any): any => (key === '__typename' ? undefined : value);
export const withoutTypename = (input: any): any => JSON.parse(JSON.stringify(input), omitTypename);
