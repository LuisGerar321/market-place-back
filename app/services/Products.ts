import { Op } from "sequelize";
import { Product } from "../interfaces/Product";
import Products from "../models/Product";
import { pagination } from "../utils/pagination";
import { Users } from "../models/Users";

export const createProduct = async (productPayload: Product, sellerUid: string): Promise<Products> => {
  try {
    const product = await Products.create({
      name: productPayload?.name,
      sellerUid,
      quantity: productPayload?.quantity,
      priceUsd: productPayload?.priceUsd,
    });
    return product;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getMyProducts = async (uid: string) => {
  try {
    const products: Products[] = await Products.findAll({
      where: {
        sellerUid: uid,
      },
    });
    return products;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllProducts = async (page: number, pageSize: number, whereQuery: any) => {
  try {
    page = isNaN(page) ? 1 : page;
    pageSize = isNaN(pageSize) ? 20 : pageSize;
    let limit = pageSize !== 0 ? pageSize : undefined;
    let offset = (page - 1) * pageSize !== 0 ? (page - 1) * pageSize : undefined;

    whereQuery = typeof whereQuery === "object" && whereQuery !== null ? whereQuery : {};
    const { maxPrice, minPrice, sellerName, ...whereSanitized } = whereQuery;

    let whereConditions = typeof whereSanitized === "object" ? { ...whereSanitized } : {};

    if (minPrice !== undefined || maxPrice !== undefined) {
      whereConditions.priceUsd = {};
      if (minPrice !== undefined) {
        whereConditions.priceUsd[Op.gte] = Number(minPrice);
      }
      if (maxPrice !== undefined) {
        whereConditions.priceUsd[Op.lte] = Number(maxPrice);
      }
    }

    if (typeof whereConditions.name === "string") {
      whereConditions.name = { [Op.like]: `%${whereConditions.name}%` };
    }

    const { rows: products, count } = await Products.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Users,
          as: "seller",
          attributes: ["uid", "name", "email"],
          required: true,
          where: sellerName
            ? {
                name: {
                  [Op.like]: `%${sellerName}%`,
                },
              }
            : undefined,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const dataPagination = pagination(count, page, pageSize, products);
    return dataPagination;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
