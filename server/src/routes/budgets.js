import { Router } from 'express';
import mongoose from 'mongoose';
import Budget from '../models/Budget.js';
import auth from '../middleware/auth.js';
const router = Router();
router.use(auth);
router.get('/', async (req, res, next) => {
  try {
    const filter = { user: req.userId };
    if (req.query.month) filter.month = String(req.query.month);
    res.json(await Budget.find(filter).sort({ category: 1 }));
  } catch (e) { next(e); }
});
router.post('/', async (req, res, next) => {
  try {
    const category = String(req.body.category || '').trim();
    const limit = Number(req.body.limit);
    const month = String(req.body.month || '');
    if (!category || category.length > 60 || !Number.isFinite(limit) || limit <= 0 || !/^\d{4}-\d{2}$/.test(month))
      return res.status(400).json({ message: 'Enter a category, positive budget amount and month.' });
    const budget = await Budget.findOneAndUpdate(
      { user: req.userId, category, month }, { $set: { limit } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(budget);
  } catch (e) { next(e); }
});
router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid budget ID.' });
    const item = await Budget.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!item) return res.status(404).json({ message: 'Budget not found.' });
    res.json({ message: 'Budget deleted.' });
  } catch (e) { next(e); }
});
export default router;
