const jwt = require("jsonwebtoken");
const auth = require("../utils/authentication");

exports.validateAuthToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No authToken provided" });
  }
  const authToken = authHeader.split(" ")[1];
  jwt.verify(authToken, auth.getAuthTokenPublicKey(), (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Token is invalid or expired" }); // Token invalid or expired
    }
    req.user = { id: payload.id, fullName: payload.fullName }; // Attach user data to the request
    next();
  });
};

exports.validateRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refreshToken provided" });
  }
  jwt.verify(refreshToken, auth.getRefreshTokenPublicKey(), (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Token is invalid or expired" }); // Token invalid or expired
    }
    req.user = { id: payload.id, fullName: payload.fullName }; // Attach user data to the request
    next();
  });
};

exports.authenticateWebSocketConnections = (socket, next) => {
  const authToken = socket.handshake.auth?.token; // Client sends the token in handshake
  if (!authToken)
    return next(new Error("Authentication error: No token provided"));

  // Verify the authToken
  jwt.verify(authToken, auth.getAuthTokenPublicKey(), (err, user) => {
    if (err)
      return next(new Error("Authentication error: Invalid or expired token"));
    socket.user = user; // Attach user data to the socket
    next(); // Proceed to the next middleware/connection handler
  });
};
