import { IUser, IUserRole } from "../interfaces/Users";
import Roles from "../models/Roles";
import { Users } from "../models/Users";
import { ErrorResponse } from "../utils/Errors";

export const createUser = async (user: IUser): Promise<Partial<Users>> => {
  try {
    const { roleId } = user;
    const isRoleIdOnDB = await Roles.findOne({
      where: {
        id: roleId ?? 2,
      },
    });

    if (!isRoleIdOnDB)
      throw new ErrorResponse({
        status: 400,
        message: `Bad Request: roleId: ${roleId} is not a valid Id for Role Table`,
      });

    const isUserOnDB: Users | null = await Users.findOne({
      where: {
        email: user.email,
      },
    });

    if (isUserOnDB)
      throw new ErrorResponse({
        status: 400,
        message: "This email address is already registered. Please try a different one.",
      });
    const newUser: Users = await Users.create({ ...user });
    if (!newUser) return new Error("Error at user creation");
    return user;
  } catch (error) {
    // console.error(error as Error);
    console.log(error as Error);
    throw error;
  }
};

export const findUserFromUid = async (uid: string): Promise<Partial<IUserRole>> => {
  try {
    const user = await Users.findOne({
      where: {
        uid,
      },
      include: [
        {
          model: Roles,
          as: "role",
          required: true,
        },
      ],
    });

    if (!user)
      throw new ErrorResponse({
        status: 404,
        message: `User with uid ${uid} not found.`,
      });

    return user;
  } catch (error) {
    console.log(error as Error);
    throw error;
  }
};
