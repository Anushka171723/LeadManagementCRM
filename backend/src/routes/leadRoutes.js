import express from 'express';
import {
  createLead,
  deleteLead,
  getLeadStats,
  getLeads,
  updateLead
} from '../controllers/leadController.js';

const router = express.Router();

router.get('/stats', getLeadStats);
router.route('/').get(getLeads).post(createLead);
router.route('/:id').put(updateLead).delete(deleteLead);

export default router;
