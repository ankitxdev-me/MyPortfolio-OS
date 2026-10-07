/**
 * Unified API Contract & DTO Types for Portfolio OS
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta?: Record<string, any>;
  message?: string;
  timestamp: string;
}

export interface ApiPaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  message?: string;
  timestamp: string;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  rule?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
    path?: string;
    timestamp?: string;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortingParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  useCache?: boolean;
  cacheTtl?: number;
  skipAuth?: boolean;
}

export interface QueryOptions extends RequestOptions, PaginationParams, SortingParams {
  search?: string;
  filter?: Record<string, any>;
  [key: string]: any;
}

// ----------------------------------------------------
// DTO Interfaces
// ----------------------------------------------------

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  avatarUrl?: string;
}

export interface ProjectDTO {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  description: string;
  summary?: string;
  status?: 'Completed' | 'In Progress' | 'Planned' | string;
  progress?: number;
  featured: boolean;
  published?: boolean;
  startDate?: string;
  deadline?: string;
  githubUrl?: string;
  demoUrl?: string;
  liveUrl?: string;
  thumbnailUrl?: string;
  image?: string;
  gallery?: { src?: string; caption?: string; url?: string; alt?: string }[];
  metrics?: { label: string; value: string }[];
  techStack?: string[] | {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    infrastructure?: string[];
  };
  overview?: string;
  architectureOverview?: string;
  features?: string[];
  timeline?: { date: string; title: string; description: string; status?: string }[];
  challenges?: { id?: string; title: string; problem: string; solution: string; outcome: string }[];
  lessonsLearned?: { engineering?: string; architecture?: string; performance?: string };
  tags?: string[];
  stats?: {
    stars?: number;
    views?: number;
    likes?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogDTO {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImageUrl: string;
  readingTimeMinutes: number;
  published: boolean;
  featured?: boolean;
  publishedAt?: string;
  status?: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
  stats?: {
    views?: number;
    likes?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CourseDTO {
  id: string;
  slug: string;
  title?: string;
  name?: string;
  platform?: string;
  instructor?: string;
  category?: string;
  certificateUrl?: string;
  credentialId?: string;
  progressPercent?: number;
  proficiency?: number;
  status: 'completed' | 'in_progress' | 'planned' | 'Draft' | 'draft' | string;
  published?: boolean;
  featured?: boolean;
  isTopSkill?: boolean;
  startDate?: string;
  targetCompletion?: string;
  completedDate?: string;
  topics?: string[];
  timeline?: { date?: string; title?: string; description?: string }[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateDTO {
  id: string;
  slug: string;
  title: string;
  issuer: string;
  issueDate?: string;
  credentialId?: string;
  url?: string;
  category?: string;
  description?: string;
  published?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MilestoneDTO {
  id: string;
  title: string;
  organization: string;
  role: string;
  period: string;
  type: 'experience' | 'education' | 'achievement' | 'leadership';
  description: string;
  highlights: string[];
  skills: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicSemesterDTO {
  id: string;
  slug: string;
  semesterName?: string;
  title?: string;
  term: string;
  year: number;
  gpa: number;
  sgpa?: number;
  status?: string;
  published?: boolean;
  featured?: boolean;
  summary?: string;
  courses: Array<{
    code: string;
    name: string;
    credits: number;
    grade: string;
    description?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface FreelanceServiceDTO {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  pricingStartingAt: number;
  featured: boolean;
  iconName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FreelanceProjectDTO {
  id: string;
  clientName: string;
  projectTitle: string;
  deliverables: string[];
  testimonial?: {
    quote: string;
    authorName: string;
    authorTitle: string;
  };
  completionDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFileDTO {
  id: string;
  filename: string;
  url: string;
  publicId?: string;
  mimeType: string;
  sizeBytes: number;
  dimensions?: {
    width: number;
    height: number;
  };
  altText?: string;
  createdAt: string;
}

export interface AuditLogDTO {
  id: string;
  action: string;
  actor: string;
  ipAddress: string;
  userAgent?: string;
  resource: string;
  status: 'success' | 'failure';
  details?: Record<string, any>;
  timestamp: string;
}

export interface SiteSettingsDTO {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  socialLinks: Record<string, string>;
  maintenanceMode: boolean;
  analyticsEnabled: boolean;
  updatedAt: string;
}

export interface SearchResultItemDTO {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  snippet?: string;
  slug?: string;
  url: string;
  type: string;
  category?: string;
  tags?: string[];
  image?: string;
  score?: number;
  relevanceScore?: number;
}
