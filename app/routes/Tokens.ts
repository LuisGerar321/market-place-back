import { Router } from "express";
import TokensController from "../controllers/Tokens";
import { validateJWT } from "../middlewares";

const TokensRoutes = Router();

TokensRoutes.get("/validate", validateJWT, TokensController.handleValidateToken);

export default TokensRoutes;
