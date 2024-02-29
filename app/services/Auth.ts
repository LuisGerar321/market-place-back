import { config } from "../config";
import { Users } from "../models/Users";
import { ErrorResponse } from "../utils/Errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Roles from "../models/Roles";
import { isAfter } from "date-fns";
import { ISigninCredential } from "../interfaces/Auth";
import { IUserRole } from "../interfaces/Users";

const { secretKey } = config.jwt;

export const jwtDecode = (token: string) => {
  if (!token) return null;
  const tokenDecoded: any = jwt.decode(token);

  if (!tokenDecoded) {
    return null;
  }

  return tokenDecoded?.dataValues;
};

export const isTokenExpired = (tokenExp: any): boolean => {
  const currentTime = new Date();
  if (isAfter(currentTime, new Date(tokenExp * 1000))) {
    // El token ha expirado (exp está en segundos, por eso se multiplica por 1000)
    return true;
  }
  return false;
};

export const verifyTokenSignature = (token: string) => {
  try {
    // Verificar la firma del token utilizando la clave secreta
    jwt.verify(token, secretKey);
    // Si la verificación es exitosa, significa que la firma es válida
    return true;
  } catch (error) {
    // Si hay un error en la verificación, la firma no es válida
    return false;
  }
};

export const validateToken = async (token: string): Promise<boolean> => {
  try {
    if (!verifyTokenSignature(token)) {
      return false;
    }

    const tokenDecoded = jwtDecode(token);

    if (!tokenDecoded) {
      return false;
    }

    const { uid, exp } = tokenDecoded;
    // Validate Time Expiration //

    if (isTokenExpired(exp)) {
      return false;
    }

    // Validate token info min a user //
    const user = await Users.findOne({
      where: {
        uid,
      },
    });

    if (!user) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signin = async ({ email, password }: ISigninCredential): Promise<string> => {
  try {
    const userFound = await Users.findOne({
      where: {
        email,
      },
      // include: [{ model: Roles, as: "role" }],
    });

    if (!userFound) throw new ErrorResponse({ status: 404, message: `Users with ${email} not found` });

    const isACorrectPass = await bcrypt.compare(password, userFound.password);
    if (!isACorrectPass)
      throw new ErrorResponse({
        status: 400,
        message: "UnAuthorized",
      });

    const { password: pass, ...userWithoutPass } = userFound;
    const token = jwt.sign(userWithoutPass, secretKey);
    return token;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserInfoFromCredentials = async ({ email, password }: ISigninCredential): Promise<IUserRole | null> => {
  try {
    const userFound: IUserRole = (await Users.findOne({
      where: {
        email,
      },
      include: [
        {
          model: Roles,
          as: "role",
          required: true,
        },
      ],
    })) as IUserRole;

    if (!userFound) throw new ErrorResponse({ status: 404, message: `Users with ${email} not found` });

    const isACorrectPass = await bcrypt.compare(password, userFound.password);
    if (!isACorrectPass) return null;

    return userFound;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
