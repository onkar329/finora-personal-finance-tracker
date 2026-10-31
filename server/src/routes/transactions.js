import { Router } from 'express';
import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import auth from '../middleware/auth.js';
const router = Router();
router.use(auth);

function validate(body) {
  const title = String(body.title || '').trim();
  const category = String(body.category || '').trim();
  const amount = Number(body.amount);
  const type = body.type;
  const date = new Date(body.date || Date.now());
  if (!title || title.length > 120 || !category || category.length > 60 ||
      !Number.isFinite(amount) || amount <= 0 || !['income', 'expense'].includes(type) ||
      Number.isNaN(date.getTime())) return null;
  return { title, category, amount, type, date, notes: String(body.notes || '').slice(0, 500) };
}
router.get('/', async (req, res, next) => {
  try {
    const filter = { user: req.userId };
    if (req.query.type && ['income', 'expense'].includes(req.query.type)) filter.type = req.query.type;
    if (req.query.category) filter.category = String(req.query.category);
    if (req.query.from || req.query.to) {
      filter.date = {};
      if (req.query.from) filter.date.$gte = new Date(req.query.from);
      if (req.query.to) filter.date.$lte = new Date(req.query.to);
    }
    res.json(await Transaction.find(filter).sort({ date: -1, createdAt: -1 }).limit(1000));
  } catch (e) { next(e); }
});
router.post('/', async (req, res, next) => {
  try {
    const data = validate(req.body);
    if (!data) return res.status(400).json({ message: 'Please provide a title, category, positive amount, valid type and date.' });
    res.status(201).json(await Transaction.create({ ...data, user: req.userId }));
  } catch (e) { next(e); }
});
router.put('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid transaction ID.' });
    const data = validate(req.body);
    if (!data) return res.status(400).json({ message: 'Please check the transaction details.' });
    const item = await Transaction.findOneAndUpdate({ _id: req.params.id, user: req.userId }, data, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Transaction not found.' });
    res.json(item);
  } catch (e) { next(e); }
});
router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid transaction ID.' });
    const item = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!item) return res.status(404).json({ message: 'Transaction not found.' });
    res.json({ message: 'Transaction deleted.' });
  } catch (e) { next(e); }
});
export default router;
