/**
 * @ Author: Sabrina Bjurman
 * @ Create Time: 2026-03-02 10:47:24
 * @ Modified by: Sabrina Bjurman
 * @ Modified time: 2026-03-04 10:46:19
 * @ Description: Utility for actions.
 */

import { forbidden, notFound, unauthorized } from "next/navigation";

enum HTTPStatusCode {
    OK = 200,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    ImATeapot = 418,
    InternalServerError = 500,
}

type ActionSuccess<T> = { ok: true; statusCode: HTTPStatusCode.OK; content: T };
type ActionError<CauseType = never, ErrorType = never> =
    | { ok: false; statusCode: HTTPStatusCode }
    | {
          ok: false;
          statusCode: HTTPStatusCode.InternalServerError;
          cause: CauseType;
          error: ErrorType;
      };

function defaultActionErrorHandler(actionError: ActionError): void | never {
    switch (actionError.statusCode) {
        case HTTPStatusCode.Unauthorized:
            unauthorized();
        case HTTPStatusCode.Forbidden:
            forbidden();
        case HTTPStatusCode.NotFound:
            notFound();
    }
}

export { HTTPStatusCode, type ActionSuccess, type ActionError, defaultActionErrorHandler };
