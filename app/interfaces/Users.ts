import Roles from "../models/Roles";
import { Users } from "../models/Users";

export interface IUser {
  name: string;
  password: string;
  email: string;
  roleId: number;
}

export interface IUserRole extends Users {
  role: Roles;
}
