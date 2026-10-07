export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

export const API_ROUTES = {
  BASE: '/api/v1',
  AUTH: '/api/v1/auth',
  PROJECTS: '/api/v1/projects',
  BLOGS: '/api/v1/blogs',
  LEARNING: '/api/v1/learning',
  JOURNEY: '/api/v1/journey',
  ACADEMICS: '/api/v1/academics',
  FREELANCING: '/api/v1/freelancing',
  MEDIA: '/api/v1/media',
  CONTACT: '/api/v1/contact',
  SETTINGS: '/api/v1/settings',
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;
