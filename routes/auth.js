const express = require("express");
const { AuthController } = require("../controller/auth-controller");
const { responseType } = require("./utils");
const router = express.Router();
const authController = new AuthController();

router.get("/", (req, res) => {
  responseType.sendUnauthorized(res);
});

//login user with id and password
router.post("/login", async (req, res) => {
  const { id, password } = req.body;
  if (!id || !password) {
    return responseType.sendBadRequest(
      res,
      "You didn't provide an id or password"
    );
  }
  const result = await authController.verifyLogin(id, password);

  if (result)
    return responseType.sendSuccess(res, "Success! You are now logged in!");

  responseType.sendUnauthorized(res);
});

exports.authRoutes = router;
