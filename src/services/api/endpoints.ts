export const apiEndpoints = {
  auth: '/api/v1/auth',
  users: '/api/v1/users',
  customers: '/api/v1/customers',
  suppliers: '/api/v1/suppliers',
  products: '/api/v1/products',
  inventory: '/api/v1/inventory',
  sales: '/api/v1/sales',
  purchases: '/api/v1/purchases',
  payments: '/api/v1/payments',
  documents: '/api/v1/documents',
  reports: '/api/v1/reports',
} as const

export type ApiEndpoint = (typeof apiEndpoints)[keyof typeof apiEndpoints]
