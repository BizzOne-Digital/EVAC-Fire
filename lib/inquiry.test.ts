import { test } from 'node:test'
import assert from 'node:assert/strict'
import { serviceFromParam, validateInquiry } from './inquiry.ts'

const valid = {
  name: 'Alex Morgan',
  organization: 'Northside Property Group',
  email: 'alex@example.com',
  phone: '',
  propertyType: 'Condominium corporation',
  service: 'fire-drill',
  message: 'We need a supervised drill for a 12-storey building.',
}

test('service param maps only known slugs', () => {
  assert.equal(serviceFromParam('fire-safety-plan'), 'fire-safety-plan')
  assert.equal(serviceFromParam(['fire-drill', 'x']), 'fire-drill')
  assert.equal(serviceFromParam('plan'), '')
  assert.equal(serviceFromParam(undefined), '')
})

test('valid inquiry passes and is trimmed', () => {
  const { data, errors } = validateInquiry({ ...valid, name: '  Alex Morgan ' })
  assert.equal(errors, undefined)
  assert.equal(data?.name, 'Alex Morgan')
})

test('invalid fields are reported individually', () => {
  const { errors } = validateInquiry({ ...valid, email: 'nope', service: 'plan', propertyType: 'Castle', phone: 'abc', message: 'hi' })
  assert.deepEqual(Object.keys(errors ?? {}).sort(), ['email', 'message', 'phone', 'propertyType', 'service'])
})
