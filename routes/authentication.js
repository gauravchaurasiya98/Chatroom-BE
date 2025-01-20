const userController = require("../controllers/user");

const authRouter = require("express").Router();

authRouter.post("/login", userController.login);
authRouter.post("/register", userController.register);

module.exports = authRouter;
