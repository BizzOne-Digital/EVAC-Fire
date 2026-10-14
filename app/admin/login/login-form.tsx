'use client'

import { useActionState } from 'react'
import { signIn } from './actions'

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, { error: '', email: '' })
  return (
    <form action={action} className="a-login-form">
      {state.error && <div className="form-alert" role="alert">{state.error}</div>}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required maxLength={200} defaultValue={state.email} />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={200} />
      </div>
      <button className="btn" type="submit" disabled={pending}><span>{pending ? 'Signing in…' : 'Sign in'}</span></button>
    </form>
  )
}
