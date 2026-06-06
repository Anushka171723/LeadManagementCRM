import mongoose from 'mongoose';
import Lead, { LEAD_STATUSES } from '../models/Lead.js';

const ALLOWED_SORT_FIELDS = ['createdAt', 'name', 'email', 'company', 'status'];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildLeadQuery = ({ search, status }) => {
  const query = {};

  if (status && LEAD_STATUSES.includes(status)) {
    query.status = status;
  }

  if (search?.trim()) {
    const pattern = new RegExp(escapeRegex(search.trim()), 'i');
    query.$or = [{ name: pattern }, { email: pattern }, { company: pattern }];
  }

  return query;
};

const parsePagination = ({ page = '1', limit = '10' }) => {
  const parsedPage = Math.max(Number.parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 10, 1), 50);

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit
  };
};

const cleanLeadPayload = (body) => ({
  name: body.name,
  email: body.email,
  phone: body.phone,
  company: body.company,
  status: body.status || 'New',
  notes: body.notes || ''
});

export const createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create(cleanLeadPayload(req.body));
    res.status(201).json({ data: lead });
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (req, res, next) => {
  try {
    const { search, status, sort = 'createdAt', order = 'desc' } = req.query;
    const query = buildLeadQuery({ search, status });
    const { page, limit, skip } = parsePagination(req.query);
    const sortField = ALLOWED_SORT_FIELDS.includes(sort) ? sort : 'createdAt';
    const sortDirection = order === 'asc' ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(query).sort({ [sortField]: sortDirection }).skip(skip).limit(limit),
      Lead.countDocuments(query)
    ]);

    res.json({
      data: leads,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadStats = async (_req, res, next) => {
  try {
    const grouped = await Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const byStatus = LEAD_STATUSES.reduce((acc, status) => ({ ...acc, [status]: 0 }), {});

    grouped.forEach((item) => {
      byStatus[item._id] = item.count;
    });

    const total = Object.values(byStatus).reduce((sum, value) => sum + value, 0);
    res.json({ data: { total, byStatus } });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid lead id' });
    }

    const lead = await Lead.findByIdAndUpdate(id, cleanLeadPayload(req.body), {
      new: true,
      runValidators: true
    });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json({ data: lead });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid lead id' });
    }

    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};
