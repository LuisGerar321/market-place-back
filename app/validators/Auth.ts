import Joi from "joi";

export const signinCredentialSchema = Joi.object({
  email: Joi.string().required().not().allow(null, ""),
  password: Joi.string().required().not().allow(null, ""),
});
