import type { FechaISO, Id, LineaConPrecio } from './common'

export interface Cotizacion {
  id: Id
  clienteId: Id
  fecha: FechaISO
  lineas: LineaConPrecio[]
}

export interface Venta {
  id: Id
  clienteId: Id
  fecha: FechaISO
  lineas: LineaConPrecio[]
}

export interface Factura {
  id: Id
  ventaId: Id
  fechaEmision: FechaISO
  importe: number
}
