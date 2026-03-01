import { Router } from 'express';
import * as occasionsCtrl from '../controllers/occasionController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(occasionsCtrl.getOccasion));
router.post('/', asyncHandler(occasionsCtrl.createOccasion));
router.post('/bulk', asyncHandler(occasionsCtrl.bulkCreateOccasions));
router.put('/:id', asyncHandler(occasionsCtrl.updateOccasion));
router.delete('/:id', asyncHandler(occasionsCtrl.deleteOccasion));

export default router;