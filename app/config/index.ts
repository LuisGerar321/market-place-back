import dotenv from "dotenv";
import { SequelizeOptions } from "sequelize-typescript";
dotenv.config();

export const config = {
  apiVersion: process.env.API_VERSION || "v1",
  server: {
    port: Number(process.env.SERVER_PORT) || 3001,
    host: process.env.SERVER_HOST || "localhost",
  },
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: process.env.DB_DIALECT || "postgres",
    database: process.env.DB_NAME || "postgres",
    username: process.env.DB_USER_NAME || "root",
    password: process.env.DB_PASS || "postgres",
  } as Partial<SequelizeOptions>,
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY || "",
  },
};
