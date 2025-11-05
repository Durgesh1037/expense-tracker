import { Router } from 'express';
import { getProfile, updateBasicDetails, updateProfile } from '../controllers/profileController.ts';
import { upload } from '../middlewares/uploads.ts';
import { authenticateToken } from '../middlewares/authenticateToken.ts';
import { schemaValidate } from '../middlewares/schemaValidate.ts';
import { schemas } from '../helper/input-schema.ts';
const router = Router();

router.get('/',authenticateToken,getProfile);

router.put('/',authenticateToken,[schemaValidate(schemas.profilePut)],upload,updateProfile);


router.put('/information',authenticateToken,[schemaValidate(schemas.profilePut)],updateBasicDetails);



export default router;
