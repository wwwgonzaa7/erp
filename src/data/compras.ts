import type { OrdenCompra, Recepcion, SolicitudCompra } from '../types'

export const solicitudesCompra: SolicitudCompra[] = [
  {
    id: 'sol-001',
    fecha: '2026-08-20',
    lineas: [
      { productoId: 'prod-001', cantidad: 2 },
      { productoId: 'prod-003', cantidad: 5 },
    ],
  },
  {
    id: 'sol-002',
    fecha: '2026-08-22',
    lineas: [{ productoId: 'prod-002', cantidad: 2 }],
  },
]

export const ordenesCompra: OrdenCompra[] = [
  {
    id: 'oc-001',
    proveedorId: 'prov-001',
    fecha: '2026-08-23',
    lineas: [
      { productoId: 'prod-001', cantidad: 2, precioUnitario: 1100 },
      { productoId: 'prod-003', cantidad: 5, precioUnitario: 60 },
    ],
  },
  {
    id: 'oc-002',
    proveedorId: 'prov-002',
    fecha: '2026-08-24',
    lineas: [{ productoId: 'prod-002', cantidad: 2, precioUnitario: 500 }],
  },
]

export const recepciones: Recepcion[] = [
  {
    id: 'rec-001',
    ordenCompraId: 'oc-001',
    almacenId: 'alm-001',
    fecha: '2026-08-26',
    lineas: [
      { productoId: 'prod-001', cantidad: 2 },
      { productoId: 'prod-003', cantidad: 5 },
    ],
  },
  {
    id: 'rec-002',
    ordenCompraId: 'oc-002',
    almacenId: 'alm-002',
    fecha: '2026-08-27',
    lineas: [{ productoId: 'prod-002', cantidad: 2 }],
  },
]
