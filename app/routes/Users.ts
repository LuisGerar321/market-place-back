import { Router } from "express";
import { validateJWT, validateSchema } from "../middlewares";
import { UsersCreateSchema } from "../validators/Users";
import UsersController from "../controllers/Users";

const Users = Router();

Users.post("/", validateSchema(UsersCreateSchema), UsersController.handleCreateUser);
Users.get("/self", validateJWT, UsersController.handleGetMyInfo);

export default Users;
