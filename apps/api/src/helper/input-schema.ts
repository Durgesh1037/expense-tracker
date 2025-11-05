import  Joi from "joi";

export const schemas = {
  userPOST: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().allow(""),
    tos: Joi.boolean().valid(true).required().messages({
      "any.only": "Terms of Service must be accepted",
    }),
    marketing: Joi.boolean(),
    twoFA: Joi.boolean(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(15).required(),
    confirmPassword: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
  }),
  userLOGIN: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(15).required(),
    remember: Joi.boolean(),
  }),
  expensesPost: Joi.object().keys({
    // userId: Joi.string().required(),
    amount: Joi.number().required().options({ convert: true }),
    currency: Joi.string().required(),
    date: Joi.date().required(),
    category: Joi.string().required(),
    tags: Joi.array().items(Joi.string()),
    notes: Joi.string().allow(""),
    merchant: Joi.string().allow(""),
    attachmentUrl: Joi.string().uri().allow(""),
    receipt: Joi.string().allow(""),
    description: Joi.string().allow(""),
    information: Joi.string().allow(""),
    billable:Joi.boolean(),
    recurring:Joi.boolean()
  }),
  profilePut: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().allow(""),
    avatar: Joi.string().uri().allow(""),
    avatarUrl: Joi.string().uri().allow(""),
  }),
};
