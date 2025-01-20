const crypto = require("crypto");

// Generate RSA key pair
// return { publicKey, privateKey }
const generateRSAKeyPair = () => {
  return crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048, // Key size
    publicKeyEncoding: {
      type: "spki", // Recommended public key encoding
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8", // Recommended private key encoding
      format: "pem",
    },
  });
};

const authTokenPublicKey = process.env.AUTH_TOKEN_PUBLIC_KEY;
exports.getAuthTokenPublicKey = () => {
  return authTokenPublicKey;
};

const authTokenPrivateKey = process.env.AUTH_TOKEN_PRIVATE_KEY;
exports.getAuthTokenPrivateKey = () => {
  return authTokenPrivateKey;
};

const refreshTokenPublicKey = process.env.REFRESH_TOKEN_PUBLIC_KEY;
exports.getRefreshTokenPublicKey = () => {
  return refreshTokenPublicKey;
};

const refreshTokenPrivateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;
exports.getRefreshTokenPrivateKey = () => {
  return refreshTokenPrivateKey;
};
