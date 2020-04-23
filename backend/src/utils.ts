export const toCursor = (id: string): string => Buffer.from(id, 'utf8').toString('base64');
export const fromCursor = (cursor: string): string => Buffer.from(cursor, 'base64').toString('utf8');
