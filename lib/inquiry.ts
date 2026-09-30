// Pure inquiry logic: form options, URL param mapping and validation.
// No framework imports so it can be unit-tested with `node --test`.

export const SERVICE_OPTIONS = [
  { value: 'fire-safety-plan', label: 'Fire Safety Plan' },
  { value: 'fire-drill', label: 'Fire Drill' },
  { value: 'fire-safety-training', label: 'Fire Safety Training' },
  { value: 'routine-inspections', label: 'Routine Inspections' },
  { value: 'expert-consultation', label: 'Expert Consultation' },
  { value: 'not-sure', label: 'Not sure yet — help me choose' },
] as const

export type ServiceValue = (typeof SERVICE_OPTIONS)[number]['value']

export const PROPERTY_TYPES = [
  { group: 'Property & building management', options: ['Property management company (multiple buildings)', 'Condominium corporation', 'Commercial building / landlord'] },
  { group: 'Business', options: ['Office', 'Retail', 'Restaurant', 'Clinic', 'Warehouse'] },
  { group: 'Education & community', options: ['School', 'Daycare', 'Place of worship', 'Community centre'] },
  { group: 'Care & residential', options: ['Retirement home', 'Care facility', 'Group home'] },
  { group: 'Other', options: ['Other'] },
] as const

export const INQUIRY_FIELDS = ['name', 'organization', 'email', 'phone', 'propertyType', 'service', 'message'] as const
export type InquiryField = (typeof INQUIRY_FIELDS)[number]
export type InquiryData = Record<InquiryField, string>

export type InquiryState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Partial<Record<InquiryField, string>>
  values?: Partial<InquiryData>
}

export function serviceFromParam(param: string | string[] | undefined): ServiceValue | '' {
  const value = Array.isArray(param) ? param[0] : param
  return SERVICE_OPTIONS.find(o => o.value === value)?.value ?? ''
}

export function serviceLabel(value: string) {
  return SERVICE_OPTIONS.find(o => o.value === value)?.label ?? value
}

const propertyValues: readonly string[] = PROPERTY_TYPES.flatMap(g => g.options)
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^[+\d().\-\s]{7,24}$/

export function validateInquiry(input: Partial<InquiryData>): { data?: InquiryData; errors?: Partial<Record<InquiryField, string>> } {
  const v = Object.fromEntries(INQUIRY_FIELDS.map(k => [k, (input[k] ?? '').trim()])) as InquiryData
  const errors: Partial<Record<InquiryField, string>> = {}

  if (v.name.length < 2 || v.name.length > 100) errors.name = 'Please enter your name.'
  if (!v.organization || v.organization.length > 150) errors.organization = 'Please enter your company or organization.'
  if (!EMAIL.test(v.email) || v.email.length > 200) errors.email = 'Please enter a valid email address.'
  if (v.phone && !PHONE.test(v.phone)) errors.phone = 'Please enter a valid phone number, or leave it blank.'
  if (!propertyValues.includes(v.propertyType)) errors.propertyType = 'Please choose a property or building type.'
  if (!SERVICE_OPTIONS.some(o => o.value === v.service)) errors.service = 'Please choose the service you are interested in.'
  if (v.message.length < 10) errors.message = 'Please tell us a little more (at least 10 characters).'
  else if (v.message.length > 3000) errors.message = 'Please keep your message under 3,000 characters.'

  return Object.keys(errors).length ? { errors } : { data: v }
}
