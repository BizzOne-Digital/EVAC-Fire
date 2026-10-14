import { test } from 'node:test'
import assert from 'node:assert/strict'
import { serviceFromParam, serviceOptions, validateInquiry } from './inquiry.ts'

const options = serviceOptions([{ slug: 'fire-safety-plan', title: 'Fire Safety Plans' }, { slug: 'fire-drill', title: 'Fire Drills' }])

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
  assert.equal(serviceFromParam('fire-safety-plan', options), 'fire-safety-plan')
  assert.equal(serviceFromParam(['fire-drill', 'x'], options), 'fire-drill')
  assert.equal(serviceFromParam('plan', options), '')
  assert.equal(serviceFromParam(undefined, options), '')
})

test('valid inquiry passes and is trimmed', () => {
  const { data, errors } = validateInquiry({ ...valid, name: '  Alex Morgan ' }, options)
  assert.equal(errors, undefined)
  assert.equal(data?.name, 'Alex Morgan')
})

test('invalid fields are reported individually', () => {
  const { errors } = validateInquiry({ ...valid, email: 'nope', service: 'plan', propertyType: 'Castle', phone: 'abc', message: 'hi' }, options)
  assert.deepEqual(Object.keys(errors ?? {}).sort(), ['email', 'message', 'phone', 'propertyType', 'service'])
})

test('not-sure is always a valid choice; unpublished services are not', () => {
  assert.equal(validateInquiry({ ...valid, service: 'not-sure' }, options).errors, undefined)
  assert.ok(validateInquiry({ ...valid, service: 'routine-inspections' }, options).errors?.service)
})
