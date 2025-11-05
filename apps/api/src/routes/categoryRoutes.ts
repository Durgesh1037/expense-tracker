import { Router } from 'express';
import { categorycontroller } from '../controllers/categoryController.ts';
const router = Router();

router.get('/',categorycontroller);

export default router;
