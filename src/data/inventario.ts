import type { Almacen, Producto } from '../types'

export const productos: Producto[] = [
  { id: 'prod-001', nombre: 'Laptop' },
  { id: 'prod-002', nombre: 'Monitor' },
  { id: 'prod-003', nombre: 'Teclado' },
]

export const almacenes: Almacen[] = [
  { id: 'alm-001', nombre: 'Almacén principal' },
  { id: 'alm-002', nombre: 'Almacén secundario' },
]
