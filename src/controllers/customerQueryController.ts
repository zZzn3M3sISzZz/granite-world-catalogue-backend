import { Request, Response } from 'express';
import CustomerQuery from '../models/CustomerQuery';

// Get all customer queries
export const getCustomerQueries = async (req: Request, res: Response) => {
  try {
    const queries = await CustomerQuery.find()
      .populate('productId')
      .sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer queries', error });
  }
};

// Get a single customer query
export const getCustomerQuery = async (req: Request, res: Response) => {
  try {
    const query = await CustomerQuery.findById(req.params.id).populate('productId');
    if (!query) {
      return res.status(404).json({ message: 'Customer query not found' });
    }
    res.json(query);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer query', error });
  }
};

// Create a new customer query
export const createCustomerQuery = async (req: Request, res: Response) => {
  try {
    const query = new CustomerQuery(req.body);
    const savedQuery = await query.save();
    res.status(201).json(savedQuery);
  } catch (error) {
    res.status(400).json({ message: 'Error creating customer query', error });
  }
};

// Update a customer query
export const updateCustomerQuery = async (req: Request, res: Response) => {
  try {
    const query = await CustomerQuery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('productId');
    
    if (!query) {
      return res.status(404).json({ message: 'Customer query not found' });
    }
    res.json(query);
  } catch (error) {
    res.status(400).json({ message: 'Error updating customer query', error });
  }
};

// Delete a customer query
export const deleteCustomerQuery = async (req: Request, res: Response) => {
  try {
    const query = await CustomerQuery.findByIdAndDelete(req.params.id);
    if (!query) {
      return res.status(404).json({ message: 'Customer query not found' });
    }
    res.json({ message: 'Customer query deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer query', error });
  }
}; 