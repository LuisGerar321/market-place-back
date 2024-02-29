import { Router } from "express";
import { validateSchema } from "../middlewares";
import { signinCredentialSchema } from "../validators/Auth";
import AuthController from "../controllers/Auth";

const Auth = Router();

Auth.post("/", validateSchema(signinCredentialSchema), AuthController.handleSignin);

export default Auth;
