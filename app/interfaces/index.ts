import { Request } from "express";

export interface IResponse {
  status: number;
  message: string;
  data?: any;
}

export interface IRequestSession {
  uid: string;
  role?: number;
}

export interface IRequest extends Request {
  session: IRequestSession;
}
