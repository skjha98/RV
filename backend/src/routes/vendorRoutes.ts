import { Router } from 'express';
import * as vendorCtrl from '../controllers/vendorController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(vendorCtrl.getVendor));
router.post('/', asyncHandler(vendorCtrl.createVendor));
router.post('/bulk', asyncHandler(vendorCtrl.bulkCreateVendors));
router.put('/:id', asyncHandler(vendorCtrl.updateVendor));
router.delete('/:id', asyncHandler(vendorCtrl.deleteVendor));

export default router;