import { Router } from "express";
import { authorization, validateJWT, validateSchema } from "../middlewares";
import ProductsController from "../controllers/Products";
import { ERolesTypes } from "../enums/Roles";

const Products = Router();

Products.post("/", validateJWT, ProductsController.handleCreateProduct);
Products.get("/self", validateJWT, ProductsController.handleGetMyProduct);
Products.get("/", ProductsController.handleGetAllProduct);

export default Products;
