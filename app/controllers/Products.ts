import { Request, Response } from "express";
import { createProduct, getAllProducts, getMyProducts } from "../services/Products";
import { ErrorResponse } from "../utils/Errors";

export default class ProductsController {
  public static async handleCreateProduct(req: Request, res: Response) {
    try {
      const { name, quantity, priceUsd } = req.body;
      const newProduct = await createProduct(
        {
          name,
          quantity,
          priceUsd,
        },
        req.user?.uid as string,
      );
      res.status(201).send({
        status: 201,
        message: "Product created sucessfully",
        data: newProduct,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) return res.status(500).send(new ErrorResponse({ status: 500, message: error.message, data: error }));
    }
  }
  public static async handleGetMyProduct(req: Request, res: Response) {
    try {
      const newProduct = await getMyProducts(req.user?.uid as string);
      res.status(200).send({
        status: 200,
        message: "Product created sucessfully",
        data: newProduct,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) return res.status(500).send(new ErrorResponse({ status: 500, message: error.message, data: error }));
    }
  }

  public static async handleGetAllProduct(req: Request, res: Response) {
    try {
      const { page, pageSize, where: whereQuery } = req.query;
      let where;
      if (whereQuery) {
        try {
          where = JSON.parse(String(whereQuery));
        } catch (error) {
          where = null;
        }
      }

      console.log(where);

      const newProduct = await getAllProducts(Number(page), Number(pageSize), where);

      res.status(200).send({
        status: 200,
        message: "Product created sucessfully",
        data: newProduct,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) return res.status(500).send(new ErrorResponse({ status: 500, message: error.message, data: error }));
    }
  }
}
