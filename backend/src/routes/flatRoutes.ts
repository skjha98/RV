import { Router } from 'express';
import * as flatsCtrl from '../controllers/flatController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(flatsCtrl.getFlats));
router.post('/', asyncHandler(flatsCtrl.createFlat));
router.post('/bulk', asyncHandler(flatsCtrl.bulkCreateFlats));
router.put('/:id', asyncHandler(flatsCtrl.updateFlat));
router.delete('/:id', asyncHandler(flatsCtrl.deleteFlat));

export default router;