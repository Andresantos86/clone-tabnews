const {
  MethodNotAllowedError,
  InternalServerError,
  ValidationError,
  NotFoundError,
} = require("./errors");

function onNoMatchHandler(request, response) {
  const publicError = new MethodNotAllowedError();
  response.status(publicError.statusCode).json(publicError);
}

function onErrorHandler(error, request, response) {
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    return response.status(error.statusCode).json(error);
  }

  const publicError = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });

  response.status(publicError.statusCode).json(publicError);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};
export default controller;
