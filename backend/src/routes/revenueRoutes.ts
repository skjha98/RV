import { Router } from 'express';
import * as revCtrl from '../controllers/revenueController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(revCtrl.getRevenue));
router.get('/stage', asyncHandler(revCtrl.getStagedRevenue));
router.post('/stage', asyncHandler(revCtrl.stageRevenue));
router.post('/promote', asyncHandler(revCtrl.confirmPromotion));

export default router;