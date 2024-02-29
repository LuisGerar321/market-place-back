import express from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      uid: string;
      role: number;
    };
  }
}
