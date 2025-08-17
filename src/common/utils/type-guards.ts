import { PreTransformedResponse } from '../interfaces/pre-transformed-response.interface';

/**
 * Type guard to check if a response object already contains 'data' and 'meta' properties.
 * This function asserts the type of the response if it returns true.
 */
export function isPreTransformedResponse<T = any, M = Record<string, any>>(
  response: any, // Can use any since we're checking its structure
): response is PreTransformedResponse<T, M> {
  if (typeof response !== 'object' || response === null) {
    return false;
  }

  return (
    Object.prototype.hasOwnProperty.call(response, 'data') &&
    Object.prototype.hasOwnProperty.call(response, 'meta')
  );
}
