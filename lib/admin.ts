// Server helpers shared by admin pages and actions.
import { revalidatePath } from 'next/cache'
import type { z } from 'zod'
import type { Collection, ObjectId } from 'mongodb'
import { fieldErrors, formToObject } from './cms-schema'

/** Refreshes every cached public page after a content change. */
export const refreshSite = () => revalidatePath('/', 'layout')

/** MongoDB documents → plain JSON for client components (ObjectId and Date become strings). */
export const plain = <T,>(v: T): Plain<T> => JSON.parse(JSON.stringify(v))
type Plain<T> = T extends Date ? string : T extends { toHexString(): string } ? string : T extends (infer U)[] ? Plain<U>[] : T extends object ? { [K in keyof T]: Plain<T[K]> } : T

/** Validates admin form data against a schema; returns the data or form errors. */
export function parseForm<S extends z.ZodType>(schema: S, fd: FormData): { data: z.output<S>; errors?: undefined } | { data?: undefined; errors: Record<string, string> } {
  const r = schema.safeParse(formToObject(fd))
  return r.success ? { data: r.data } : { errors: fieldErrors(r.error) }
}

export const invalid = (errors: Record<string, string>) => ({ ok: false, message: 'Please fix the highlighted fields.', errors })
export const saved = (message = 'Changes saved.') => ({ ok: true, message })

/** Duplicate-key error (e.g. slug already taken). */
export const isDuplicate = (e: unknown) => (e as { code?: number })?.code === 11000

export const PAGE_SIZE = 20
export const pageParams = (sp: Record<string, string | string[] | undefined>) => {
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : (sp[k] as string | undefined)) ?? ''
  const page = Math.max(1, Number.parseInt(one('page')) || 1)
  return { one, page, skip: (page - 1) * PAGE_SIZE }
}
/** Case-insensitive "contains" match for user-typed search terms. */
export const contains = (q: string) => ({ $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' })

/** Moves one item up or down in a manually ordered collection, renumbering 0..n so gaps never accumulate. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- shared by services, audiences and approach
export async function reorder(col: Collection<any>, id: ObjectId, dir: -1 | 1) {
  const ids: ObjectId[] = (await col.find({}, { projection: { _id: 1 } }).sort({ sortOrder: 1, _id: 1 }).toArray()).map(d => d._id)
  const i = ids.findIndex(x => x.equals(id))
  const j = i + dir
  if (i < 0 || j < 0 || j >= ids.length) return false
  ;[ids[i], ids[j]] = [ids[j], ids[i]]
  await col.bulkWrite(ids.map((_id, sortOrder) => ({ updateOne: { filter: { _id }, update: { $set: { sortOrder } } } })))
  return true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const nextSortOrder = async (col: Collection<any>): Promise<number> =>
  ((await col.find({}, { projection: { sortOrder: 1 } }).sort({ sortOrder: -1 }).limit(1).next())?.sortOrder ?? -1) + 1
