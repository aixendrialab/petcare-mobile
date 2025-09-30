export const ALL_ROLES = [
  'parent',
  'vet',
  'pharmacist',
  'hostel',
  'vendor',
  'nutritionist',
  'walker',
] as const

export type Role = (typeof ALL_ROLES)[number]