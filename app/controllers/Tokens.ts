import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../utils/Errors";

export default class TokensController {
  protected name: string;
  constructor() {
    this.name = "tokens";
  }
  public static async handleValidateToken(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).send({ status: 200, message: "token is valid", data: true });
    } catch (error) {
      console.log(error);
      res.status(500).send(
        new ErrorResponse({
          status: 500,
          message: `Internal Server Error ${(error as Error)?.message}`,
        }),
      );
    }
  }
}
