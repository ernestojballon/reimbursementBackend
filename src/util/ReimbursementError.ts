class ReimbusementError extends Error {
  date: Date;
  statusCode: number;
  constructor(statusCode: number, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ReimbusementError);
    }

    this.name = "CustomError";
    // Custom debugging information
    this.statusCode = statusCode;
    this.date = new Date();
  }
}
export default ReimbusementError;
