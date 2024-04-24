import { HttpErrorResponse } from '@angular/common/http'

export const cloneErrorResponse = (
  errorResponse: HttpErrorResponse,
  statusText = '',
): HttpErrorResponse => {
  const { error, headers, status, url } = errorResponse
  return new HttpErrorResponse({
    error,
    headers,
    status,
    url: url ?? '',
    statusText,
  })
}
