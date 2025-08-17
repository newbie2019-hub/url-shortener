// This interface describes a response that *already* has the data and meta properties
// Add any other properties that might exist on such a response
export interface PreTransformedResponse<T = any, M = Record<string, any>> {
  data: T;
  meta: M;
  [key: string]: any; // Allow other properties if they can exist
}
