import { Request, Response } from "express";
import { createUser, findUserFromUid } from "../services/Users";
import { Users } from "../models/Users";
import { ErrorResponse } from "../utils/Errors";

export default class UsersController {
  public static async handleCreateUser(req: Request, res: Response) {
    try {
      const { body } = req;
      const newUser: Partial<Users> = await createUser(body);
      return res.status(201).send({
        status: 201,
        message: "User Created",
        data: newUser,
      });
    } catch (error) {
      if (error instanceof ErrorResponse) return res.status(error?.status).send(error);
      if (error instanceof Error) return res.status(500).send(new ErrorResponse({ status: 500, message: error.message, data: error }));
    }
  }

  public static async handleGetMyInfo(req: Request, res: Response) {
    try {
      const uid = req.user?.uid as string;
      const newUser: Partial<Users> = await findUserFromUid(uid);
      return res.status(200).send({
        status: 200,
        message: "User Found",
        data: newUser,
      });
    } catch (error) {
      if (error instanceof ErrorResponse) return res.status(error?.status).send(error);
      if (error instanceof Error) return res.status(500).send(new ErrorResponse({ status: 500, message: error.message, data: error }));
    }
  }
}
