import { Request, Response } from "express";
import { signin } from "../services/Auth";
import { ErrorResponse } from "../utils/Errors";

export default class AuthController {
  public static async handleSignin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const token: string = await signin({ email, password });
      res.status(200).send({
        status: 200,
        message: "Sucessfully Credentials",
        data: { token },
      });
    } catch (error) {
      if (error instanceof ErrorResponse) return res.status(error?.status).send(error);
      if (error instanceof Error) return res.status(500).send(new ErrorResponse({ status: 500, message: error.message, data: error }));
    }
  }
}
