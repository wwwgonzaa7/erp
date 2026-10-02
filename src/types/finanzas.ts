import type { FechaISO, Id } from './common'

export interface CuentaPorCobrar {
  id: Id
  facturaId: Id
  importe: number
  saldoPendiente: number
  fechaVencimiento: FechaISO
}

export interface CuentaPorPagar {
  id: Id
  proveedorId: Id
  importe: number
  saldoPendiente: number
  fechaVencimiento: FechaISO
}

export interface Caja {
  id: Id
  nombre: string
}

export interface Banco {
  id: Id
  nombre: string
}
