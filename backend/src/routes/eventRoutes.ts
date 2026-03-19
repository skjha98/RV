import { Router } from 'express';
import * as eventsCtrl from '../controllers/eventController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(eventsCtrl.getEvent));
router.post('/', asyncHandler(eventsCtrl.createEvent));
router.post('/bulk', asyncHandler(eventsCtrl.bulkCreateEvents));
router.put('/:id', asyncHandler(eventsCtrl.updateEvent));
router.delete('/:id', asyncHandler(eventsCtrl.deleteEvent));

export default router;