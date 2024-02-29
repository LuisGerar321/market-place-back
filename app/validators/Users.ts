import Joi from "joi";

export const UsersCreateSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().required(),
  roleId: Joi.number().default(2),
});
