import mongoose, { type Model } from 'mongoose';
import type { IBaseRepository, QueryOptions, PaginatedResult } from '../../types/repository.types';
import type { PaginationParams } from '../../types/pagination.types';
import { buildPaginationMeta } from '../../utils/pagination';

export abstract class MongooseBaseRepository<T extends { id: string }, D extends mongoose.Document> implements IBaseRepository<T> {
  constructor(protected readonly model: Model<D>) {}

  protected toDomain(doc: D | null): T | null {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject({ getters: true, virtuals: true }) : doc;
    const { _id, __v, ...rest } = obj as Record<string, unknown>;
    return {
      id: _id ? String(_id) : (rest.id as string),
      ...rest,
    } as unknown as T;
  }

  public async find(filter: Record<string, unknown> = {}, _options?: QueryOptions): Promise<T[]> {
    const query = { isDeleted: { $ne: true }, ...filter };
    const docs = await this.model.find(query).sort({ createdAt: -1 }).lean().exec();
    return docs.map((doc) => this.toDomain(doc as unknown as D) as T);
  }

  public async findById(id: string, _options?: QueryOptions): Promise<T | null> {
    const isObjId = mongoose.Types.ObjectId.isValid(id);
    let doc = null;
    if (isObjId) {
      doc = await this.model.findById(id).lean().exec();
    }
    if (!doc) {
      doc = await this.model.findOne({ isDeleted: { $ne: true }, slug: id }).lean().exec();
    }
    return this.toDomain(doc as unknown as D);
  }

  public async findOne(filter: Record<string, unknown>, _options?: QueryOptions): Promise<T | null> {
    const query = { isDeleted: { $ne: true }, ...filter };
    const doc = await this.model.findOne(query).lean().exec();
    return this.toDomain(doc as unknown as D);
  }

  public async create(item: Partial<T>): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const created = await this.model.create(item as any);
    return this.toDomain(created as unknown as D) as T;
  }

  public async update(id: string, item: Partial<T>): Promise<T | null> {
    const isObjId = mongoose.Types.ObjectId.isValid(id);
    let updated = null;
    if (isObjId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updated = await this.model.findByIdAndUpdate(id, { $set: item as any }, { returnDocument: 'after' }).lean().exec();
    }
    if (!updated) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updated = await this.model.findOneAndUpdate({ slug: id }, { $set: item as any }, { returnDocument: 'after' }).lean().exec();
    }
    return this.toDomain(updated as unknown as D);
  }

  public async delete(id: string): Promise<boolean> {
    const isObjId = mongoose.Types.ObjectId.isValid(id);
    let res = null;
    if (isObjId) {
      res = await this.model.findByIdAndDelete(id).exec();
    }
    if (!res) {
      res = await this.model.findOneAndDelete({ slug: id }).exec();
    }
    return !!res;
  }

  public async count(filter: Record<string, unknown> = {}): Promise<number> {
    const query = { isDeleted: { $ne: true }, ...filter };
    return this.model.countDocuments(query).exec();
  }

  public async paginate(
    params: PaginationParams,
    filter: Record<string, unknown> = {},
    _options?: QueryOptions
  ): Promise<PaginatedResult<T>> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 10));
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { isDeleted: { $ne: true }, ...filter };
    if (params.search) {
      query.$text = { $search: params.search };
    }

    const [docs, total] = await Promise.all([
      this.model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
      this.model.countDocuments(query).exec(),
    ]);

    const data = docs.map((doc) => this.toDomain(doc as unknown as D) as T);

    return {
      data,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  public async findPaginated(
    options: { page: number; limit: number; search?: string },
    filter: Record<string, unknown> = {}
  ): Promise<{ data: T[]; total: number; page: number; limit: number; totalPages: number }> {
    const res = await this.paginate(options, filter);
    return {
      data: res.data,
      total: res.meta.totalItems,
      page: res.meta.page,
      limit: res.meta.limit,
      totalPages: res.meta.totalPages,
    };
  }

  public async hardDelete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
    const res = await this.model.findByIdAndDelete(id).exec();
    return !!res;
  }
}
