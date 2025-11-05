import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profileController.ts";
import { upload } from "../middlewares/uploads.ts";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  getSpecificExpense,
  updateExpense,
} from "../controllers/expensesController.ts";
import { authenticateToken } from "../middlewares/authenticateToken.ts";
import { schemaValidate } from "../middlewares/schemaValidate.ts";
import { schemas } from "../helper/input-schema.ts";
const router = Router();

router.get("/", authenticateToken, getExpenses);
router.get("/:id", authenticateToken, getSpecificExpense);
router.post(
  "/",
  authenticateToken,
  [schemaValidate(schemas.expensesPost)],
  createExpense
);

router.put(
  "/:id",
  authenticateToken,
  [schemaValidate(schemas.expensesPost)],
  updateExpense
);

router.delete(
  "/:id",
  authenticateToken,
  [schemaValidate(schemas.expensesPost)],
  deleteExpense
);

export default router;
