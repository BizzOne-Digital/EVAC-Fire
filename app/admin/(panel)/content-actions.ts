'use server'

import { invalid, parseForm, refreshSite, saved } from '@/lib/admin'
import { requireAdmin } from '@/lib/auth'
import { documents, type DocKey } from '@/lib/cms-schema'
import { collections } from '@/lib/db'
import type { FormState } from '@/components/admin/form'

/** Saves one CMS document (home, about, settings, seo…) after validating the whole form. */
export async function saveDoc(key: DocKey, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin()
  if (!Object.hasOwn(documents, key)) return { ok: false, message: 'Unknown content section.' }
  const { data, errors } = parseForm(documents[key], fd)
  if (errors) return invalid(errors)
  await (await collections()).content.updateOne({ _id: key }, { $set: { data, updatedAt: new Date() } }, { upsert: true })
  refreshSite()
  return saved()
}
