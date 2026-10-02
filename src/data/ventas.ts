import type { Cotizacion, Factura, Venta } from '../types'

export const cotizaciones: Cotizacion[] = [
  {
    id: 'cot-001',
    clienteId: 'cli-001',
    fecha: '2026-09-01',
    lineas: [
      { productoId: 'prod-001', cantidad: 1, precioUnitario: 1500 },
      { productoId: 'prod-003', cantidad: 2, precioUnitario: 100 },
    ],
  },
  {
    id: 'cot-002',
    clienteId: 'cli-002',
    fecha: '2026-09-03',
    lineas: [{ productoId: 'prod-002', cantidad: 2, precioUnitario: 800 }],
  },
]

export const ventas: Venta[] = [
  {
    id: 'ven-001',
    clienteId: 'cli-001',
    fecha: '2026-09-05',
    lineas: [
      { productoId: 'prod-001', cantidad: 1, precioUnitario: 1500 },
      { productoId: 'prod-003', cantidad: 2, precioUnitario: 100 },
    ],
  },
  {
    id: 'ven-002',
    clienteId: 'cli-002',
    fecha: '2026-09-06',
    lineas: [{ productoId: 'prod-002', cantidad: 1, precioUnitario: 800 }],
  },
]

export const facturas: Factura[] = [
  { id: 'fac-001', ventaId: 'ven-001', fechaEmision: '2026-09-05', importe: 1700 },
  { id: 'fac-002', ventaId: 'ven-002', fechaEmision: '2026-09-06', importe: 800 },
]
