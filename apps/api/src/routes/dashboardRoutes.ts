import { Router } from 'express';
import { authenticateToken } from '../middlewares/authenticateToken.ts';
import { getDashboardSummary } from '../controllers/dashboardController.ts';
const router = Router();

router.get('/summary',authenticateToken,getDashboardSummary);


export default router;
