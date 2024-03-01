import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { config } from "./config";

const dbConfig: SequelizeOptions = config.db;

const sequelize = new Sequelize({
  ...dbConfig,
  port: 5432,
  logging: false,
  storage: ":memory:",
  models: [__dirname + "/models"],
});

export async function setupDB(force = false): Promise<void> {
  return new Promise((resolve, reject) => {
    sequelize
      .authenticate()
      .then(() => {
        sequelize
          .sync({
            force,
          })
          .then(() => {
            console.log("Connection DB ok!");
            resolve();
          })
          .catch((err) => {
            console.log("Connection DB not working!");
            reject(err);
          });
      })
      .catch((err) => {
        console.log("Connection DB not working, bad credetial!");
        reject(err);
      });
  });
}

export default sequelize;
