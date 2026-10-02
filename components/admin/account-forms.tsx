'use client'

import { changePassword, updateProfile } from '@/app/admin/(panel)/account/actions'
import { AdminForm, Card, Field, Text } from './form'

const Password = ({ name, label, hint, autoComplete }: { name: string; label: string; hint?: string; autoComplete: string }) => (
  <Field name={name} label={label} hint={hint} required>
    <input id={`f-${name}`} name={name} type="password" required maxLength={200} autoComplete={autoComplete} />
  </Field>
)

export function AccountForms({ name, email }: { name: string; email: string }) {
  return (
    <div className="a-stack">
      <AdminForm action={updateProfile} submitLabel="Save profile">
        <Card title="Profile">
          <Text name="name" label="Name" value={name} max={120} />
          <Text name="email" label="Sign-in email" type="email" value={email} required max={200} />
        </Card>
      </AdminForm>
      <AdminForm action={changePassword} submitLabel="Change password" resetOnSuccess>
        <Card title="Password">
          <Password name="current" label="Current password" autoComplete="current-password" />
          <Password name="next" label="New password" hint="At least 12 characters. A short sentence works well." autoComplete="new-password" />
          <Password name="confirm" label="Confirm new password" autoComplete="new-password" />
        </Card>
      </AdminForm>
    </div>
  )
}
