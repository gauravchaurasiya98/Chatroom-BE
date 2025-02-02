const ErrorCodes = {
  NO_TOKEN: { code: "NO_TOKEN", message: "No token provided", status: 401 },
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    message: "User is not authorized",
    status: 401,
  },
  EXPIRED_TOKEN: {
    code: "TOKEN_EXPIRED",
    message: "Invalid or expired token",
    status: 403,
  },
  NOT_FOUND: { code: "NOT_FOUND", message: "Resource not found", status: 404 },
  SERVER_ERROR: {
    code: "SERVER_ERROR",
    message: "Internal server error",
    status: 500,
  },
};

module.exports = ErrorCodes;
