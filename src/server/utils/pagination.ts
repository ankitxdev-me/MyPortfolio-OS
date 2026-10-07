import type { PaginationParams, PaginationMeta } from '../types/pagination.types';
import { DEFAULT_PAGINATION } from '../config/constants';

export function normalizePaginationParams(
  query: Partial<PaginationParams>
): Required<PaginationParams> {
  const page = Math.max(1, Number(query.page) || DEFAULT_PAGINATION.PAGE);
  const rawLimit = Number(query.limit) || DEFAULT_PAGINATION.LIMIT;
  const limit = Math.min(DEFAULT_PAGINATION.MAX_LIMIT, Math.max(1, rawLimit));

  return {
    page,
    limit,
    sortBy: query.sortBy || 'createdAt',
    sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc',
    search: query.search?.trim() || '',
  };
}

export function calculatePaginationOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function buildPaginationMeta(
  totalItems: number,
  page: number,
  limit: number
): PaginationMeta {
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const currentPage = Math.min(page, totalPages);

  return {
    page: currentPage,
    limit,
    totalItems,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}
