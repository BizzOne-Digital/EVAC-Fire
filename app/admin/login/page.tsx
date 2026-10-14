import { redirect } from 'next/navigation'
import { getAdmin } from '@/lib/auth'
import { LoginForm } from './login-form'

export const metadata = { title: 'Sign in' }

export default async function Login() {
  if (await getAdmin()) redirect('/admin')
  return (
    <main className="a-login tone-dark">
      <div className="a-login-card">
        <p className="label">EVAC Fire &amp; Safety</p>
        <h1>Admin sign in</h1>
        <p className="a-login-sub">Manage website content, blog posts and inquiries.</p>
        <LoginForm />
      </div>
    </main>
  )
}
