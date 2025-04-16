import express from 'express';
import {
  getCustomerQueries,
  getCustomerQuery,
  createCustomerQuery,
  updateCustomerQuery,
  deleteCustomerQuery,
} from '../controllers/customerQueryController';

const router = express.Router();

// Get all customer queries
router.get('/', getCustomerQueries);

// Get a single customer query
router.get('/:id', getCustomerQuery);

// Create a new customer query
router.post('/', createCustomerQuery);

// Update a customer query
router.put('/:id', updateCustomerQuery);

// Delete a customer query
router.delete('/:id', deleteCustomerQuery);

export default router; 