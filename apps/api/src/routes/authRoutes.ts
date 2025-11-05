import { Router } from 'express';
import { loginUser, registerUser,refreshToken,logoutUser } from '../controllers/authController.ts';
import { schemaValidate } from '../middlewares/schemaValidate.ts';
import { schemas } from '../helper/input-schema.ts';
const router = Router();


// Create a new user
router.post('/register',[schemaValidate(schemas.userPOST)],registerUser);

router.post('/login',[schemaValidate(schemas.userLOGIN)],loginUser);

router.post('/refresh',refreshToken );

router.post('/logout', logoutUser);

export default router;
