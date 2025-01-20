const userController = require("../controllers/user");

const userRouter = require("express").Router();

userRouter.post("/refresh-token", userController.refreshToken);
userRouter.post("/logout", userController.logout);

module.exports = userRouter;
