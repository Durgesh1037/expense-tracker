import type { Request, Response, NextFunction } from "express";
export const schemaValidate = (schema:any) => {
  return (req:Request, res:Response, next:NextFunction) => {
    console.log("req.body:", req.body);
    const { error } = schema.validate(req.body);
    const valid = error == null;
    if (valid) {
      return next();
    }
    const { details } = error;
    const msg = details.map((error:any) => error.message).join(",");
    res.status(422).send({ message: msg, status: false });
  };
};
