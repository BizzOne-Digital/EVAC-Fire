import { test } from 'node:test'
import assert from 'node:assert/strict'
import { documents, formToObject, homeSchema, postSchema } from './cms-schema.ts'
import { hashPassword, verifyPassword } from './password.ts'
import { parseMarkup } from './site.ts'
import { documentsSeed } from '../scripts/seed-data.ts'

const fd = (entries: [string, string][]) => {
  const f = new FormData()
  for (const [k, v] of entries) f.append(k, v)
  return f
}

test('formToObject builds nested objects and arrays from dotted names', () => {
  const o = formToObject(fd([['hero.primary.label', 'Go'], ['stages.0.step', 'PLAN'], ['stages.2.step', 'PRACTICE'], ['$ACTION_ID_x', 'ignored']]))
  assert.deepEqual(o, { hero: { primary: { label: 'Go' } }, stages: [{ step: 'PLAN' }, { step: 'PRACTICE' }] })
})

test('every seed document passes its schema', () => {
  for (const [key, schema] of Object.entries(documents)) assert.ok(schema.safeParse(documentsSeed[key as keyof typeof documents]).success, key)
})

test('links reject javascript: and protocol-relative URLs', () => {
  const home = structuredClone(documentsSeed.home)
  for (const bad of ['javascript:alert(1)', '//evil.example', 'data:text/html,x']) {
    home.hero.primary.href = bad
    assert.equal(homeSchema.safeParse(home).success, false, bad)
  }
  home.hero.primary.href = '/contact#inquiry'
  assert.ok(homeSchema.safeParse(home).success)
})

test('unchecked toggles become false; textareas split into lists', () => {
  const r = postSchema.safeParse({ title: 'T', slug: 'a-b', excerpt: 'E', body: [{ type: 'p', text: 'x' }], imageSrc: '/a.jpg', tags: 'one, two ,', status: 'draft' })
  assert.ok(r.success)
  assert.deepEqual(r.data.tags, ['one', 'two'])
  assert.equal(postSchema.safeParse({ ...r.data, slug: 'Bad Slug' }).success, false)
})

test('heading markup splits lines and *highlights*', () => {
  assert.deepEqual(parseMarkup('PLAN.\n*PREPARE.*'), [[{ text: 'PLAN.', em: false }], [{ text: 'PREPARE.', em: true }]])
  assert.deepEqual(parseMarkup('Serving the *GTA*.')[0].map(p => p.em), [false, true, false])
})

test('passwords hash with a salt and verify', async () => {
  const a = await hashPassword('correct horse battery')
  assert.notEqual(a, await hashPassword('correct horse battery'))
  assert.ok(await verifyPassword('correct horse battery', a))
  assert.equal(await verifyPassword('wrong', a), false)
})
