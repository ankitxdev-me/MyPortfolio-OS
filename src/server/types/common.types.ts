export type EnvironmentMode = 'development' | 'production' | 'test';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface Dictionary<T = unknown> {
  [key: string]: T;
}
