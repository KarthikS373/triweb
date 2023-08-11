import { Router } from 'express';

import {
  createOrganization,
  getAllOrganizations,
  getOrganization,
  getAllUserOrganizations,
} from '../controllers/organization.controller';

const router = Router();

router.get('/', getAllUserOrganizations);
router.get('/all', getAllOrganizations);
router.post('/create', createOrganization);
router.get('/:id', getOrganization);
    
export default router;

