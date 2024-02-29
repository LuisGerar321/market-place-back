import { NextFunction, Request, Response } from "express";
import Joi, { number } from "joi";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { jwtDecode, validateToken } from "../services/Auth";
import { ErrorResponse } from "../utils/Errors";
import { findUserFromUid } from "../services/Users";
import { ERolesTypes } from "../enums/Roles";
import { IUserRole } from "../interfaces/Users";
import { Users } from "../models/Users";
import Roles from "../models/Roles";

const { secretKey } = config.jwt;
export const validateSchema = (schema: Joi.ObjectSchema<any>) => {
  return function (req: Request, res: Response, next: NextFunction) {
    if (schema === null) return next();
    const { body } = req;
    const isValid = schema.validate(body);
    if (isValid?.error) {
      return res.status(400).send({
        status: 400,
        statusMessage: "Bad request",
        message: isValid.error.message,
      });
    }
    next();
  };
};

export const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) return res.status(400).send({ status: 400, message: "Bad Request: Authorization is missing in Header Request." });
    const token = authorization.split("Bearer ")[1];
    if (!token || token === "") {
      return res.status(400).send({ status: 400, message: "Bad Request: Bearer Token is missing in Auth Header." });
    }

    const isAValidToken = await validateToken(token);
    if (!isAValidToken) {
      return res.status(401).send(
        new ErrorResponse({
          status: 401,
          message: "UnAuthorized: Token is not valid or expired.",
        }),
      );
    }

    const tokenDecoded = jwtDecode(token);
    const user = await findUserFromUid(tokenDecoded?.uid);

    if (!user || typeof user.uid !== "string" || typeof user.role?.id !== "number")
      return res.status(404).send(
        new ErrorResponse({
          status: 404,
          message: "User not found for this token.",
        }),
      );

    req.user = {
      uid: user.uid,
      role: user.role?.id,
    };

    next();
  } catch (error) {
    console.error(error);
  }
};

export const authorization = (rolesAllowd: ERolesTypes[]) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      if (!req?.user)
        return res.status(400).send(
          new ErrorResponse({
            status: 404,
            message: "User not found for this token.",
          }),
        );

      const { uid } = req?.user;
      const user: Users | null = await Users.findOne({
        where: {
          uid,
        },
        include: [{ model: Roles, as: "role" }],
      });
      if (!user) {
        return res.status(401).send(
          new ErrorResponse({
            status: 400,
            message: "Bad Request: User is missing in the auth token.",
          }),
        );
      }

      const isAuth = rolesAllowd.includes(user.role.type);

      return isAuth
        ? next()
        : res.status(401).send(
            new ErrorResponse({
              status: 401,
              message: "Not Auth. User Role is not allowed to do this action.",
            }),
          );
    } catch (error) {
      if (error instanceof Error) return res.status(500).send(new ErrorResponse({ status: 500, message: error.message, data: error }));
    }
  };
};
