import sequelize from "./db";
import { ERolesTypes } from "./enums/Roles";
import Roles from "./models/Roles";

export const seedData = async () => {
  const t = await sequelize.transaction();
  try {
    //Roles

    await Roles.findOrCreate({
      where: { type: ERolesTypes.ADMIN },
      defaults: {
        name: "Admin",
      },
      transaction: t,
    });

    await Roles.findOrCreate({
      where: { type: ERolesTypes.SELLER },
      defaults: {
        name: "Seller",
      },
      transaction: t,
    });
    t.commit();
  } catch (error) {
    t.rollback();
    console.error(error);
  }
};
