import type { Documento } from '../types'

export const documentos: Documento[] = [
  {
    id: 'doc-001',
    nombre: 'Factura de venta 001',
    tipo: 'Factura',
    entidad: 'factura',
    entidadId: 'fac-001',
  },
  {
    id: 'doc-002',
    nombre: 'Orden de compra 001',
    tipo: 'Orden de compra',
    entidad: 'ordenCompra',
    entidadId: 'oc-001',
  },
]
