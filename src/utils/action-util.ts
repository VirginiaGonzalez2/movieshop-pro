import error from "next/error";
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
        default:
            throw new error({ statusCode: actionError.statusCode });
    }
}

export { HTTPStatusCode, type ActionSuccess, type ActionError, defaultActionErrorHandler };
