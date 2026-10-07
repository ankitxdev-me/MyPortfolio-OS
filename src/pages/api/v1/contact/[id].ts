import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { successResponse } from '@/server/api/response';
import { ContactMessageModel } from '@/server/db/models/ContactMessage.model';
import { NotFoundError, BadRequestError } from '@/server/errors/HttpError';

export const prerender = false;

/**
 * PATCH /api/v1/contact/[id]
 * Update status of a message ('read', 'unread', 'archived', 'replied')
 */
export const PATCH: APIRoute = createApiHandler(async ({ params, request }) => {
  const { id } = params;
  if (!id) throw new BadRequestError('Message ID is required');

  const body = await request.json();
  const { status } = body;

  if (!status) {
    throw new BadRequestError('Status is required');
  }

  const updated = await ContactMessageModel.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true }
  );

  if (!updated) {
    throw new NotFoundError('Contact message not found');
  }

  return successResponse(
    {
      id: updated._id.toString(),
      name: updated.name,
      email: updated.email,
      status: updated.status,
    },
    'Message status updated successfully'
  );
});

/**
 * DELETE /api/v1/contact/[id]
 * Soft delete a contact message
 */
export const DELETE: APIRoute = createApiHandler(async ({ params }) => {
  const { id } = params;
  if (!id) throw new BadRequestError('Message ID is required');

  const updated = await ContactMessageModel.findByIdAndUpdate(
    id,
    { $set: { isDeleted: true } },
    { new: true }
  );

  if (!updated) {
    throw new NotFoundError('Contact message not found');
  }

  return successResponse(null, 'Contact message deleted successfully');
});
