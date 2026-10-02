import type { FechaISO, Id, LineaCantidad, LineaConPrecio } from './common'

export interface SolicitudCompra {
  id: Id
  fecha: FechaISO
  lineas: LineaCantidad[]
}

export interface OrdenCompra {
  id: Id
  proveedorId: Id
  fecha: FechaISO
  lineas: LineaConPrecio[]
}

export interface Recepcion {
  id: Id
  ordenCompraId: Id
  almacenId: Id
  fecha: FechaISO
  lineas: LineaCantidad[]
}
