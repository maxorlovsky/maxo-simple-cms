// Sanitization helpers
export function sanitizeString(value: any): string {
  return value ? value.toString().trim() : '';
};