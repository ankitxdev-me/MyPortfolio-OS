import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { successResponse } from '@/server/api/response';
import { ContactMessageModel } from '@/server/db/models/ContactMessage.model';
import { BadRequestError } from '@/server/errors/HttpError';

export const prerender = false;

/**
 * GET /api/v1/contact
 * Fetch contact messages with optional filtering & unread count
 */
export const GET: APIRoute = createApiHandler(async ({ request }) => {
  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '50', 10);
  const skip = (page - 1) * limit;

  const query: any = { isDeleted: { $ne: true } };
  if (status && status !== 'all') {
    query.status = status;
  }

  const [items, totalItems, unreadCount] = await Promise.all([
    ContactMessageModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ContactMessageModel.countDocuments(query),
    ContactMessageModel.countDocuments({ isDeleted: { $ne: true }, status: 'unread' }),
  ]);

  const formatted = items.map((doc: any) => ({
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    subject: doc.subject,
    message: doc.message,
    status: doc.status || 'unread',
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }));

  return successResponse(formatted, 'Contact messages fetched successfully', {
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit) || 1,
    unreadCount,
  });
});

/**
 * POST /api/v1/contact
 * Public endpoint to submit visitor messages to MongoDB
 */
export const POST: APIRoute = createApiHandler(async ({ request }) => {
  const body = await request.json();
  const { name, email, subject, message } = body;

  if (!name || !email || !message) {
    throw new BadRequestError('Name, email, and message are required fields');
  }

  const created = await ContactMessageModel.create({
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    subject: subject ? String(subject).trim() : 'General Portfolio Inquiry',
    message: String(message).trim(),
    status: 'unread',
    isDeleted: false,
  });

  return successResponse(
    { id: created._id, name: created.name, status: created.status },
    'Thank you for your message! Ankit will get back to you shortly.',
    undefined,
    201
  );
});

/**
 * PATCH /api/v1/contact
 * Bulk update operations (e.g. mark all as read)
 */
export const PATCH: APIRoute = createApiHandler(async ({ request }) => {
  const body = await request.json();
  const { action } = body;

  if (action === 'markAllRead') {
    await ContactMessageModel.updateMany(
      { isDeleted: { $ne: true }, status: 'unread' },
      { $set: { status: 'read' } }
    );
    return successResponse(null, 'All messages marked as read');
  }

  throw new BadRequestError('Invalid bulk action');
});
