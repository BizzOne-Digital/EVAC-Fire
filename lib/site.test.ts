import { test } from 'node:test'
import assert from 'node:assert/strict'
import { telHref } from './site.ts'

test('telHref maps vanity letters to keypad digits', () => {
  assert.equal(telHref('613-262-FIRE'), 'tel:+16132623473')
  assert.equal(telHref('613-262-3473'), 'tel:+16132623473')
  assert.equal(telHref('800-FLOWERS'), 'tel:+18003569377')
})
