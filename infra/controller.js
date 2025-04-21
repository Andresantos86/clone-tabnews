const { MethodNotAllowedError, InternalServerError } = require("./errors");

function onNoMatchHandler(request, response) {
  const publicError = new MethodNotAllowedError();
  response.status(publicError.statusCode).json(publicError);
}

function onErrorHandler(error, request, response) {
  const publicError = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });
  console.log(publicError);
  response.status(publicError.statusCode).json(publicError);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};
export default controller;
