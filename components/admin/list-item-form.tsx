'use client'

import { saveListItem } from '@/app/admin/(panel)/lists/actions'
import type { ListKind } from '@/app/admin/(panel)/lists/config'
import { AdminForm, Card, LinesField, Text, Toggle } from './form'

export function ListItemForm({ kind, id, v, itemsLabel }: { kind: ListKind; id: string | null; v: { title: string; items: string[]; published: boolean }; itemsLabel: string }) {
  return (
    <AdminForm action={saveListItem.bind(null, kind, id)} submitLabel={id ? 'Save' : 'Create'}>
      <Card title="Content">
        <Text name="title" label="Title" value={v.title} required max={120} />
        <LinesField name="items" label={itemsLabel} value={v.items} rows={6} />
        <Toggle name="published" label="Published" value={v.published} />
      </Card>
    </AdminForm>
  )
}
