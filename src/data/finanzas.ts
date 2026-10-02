import type { Banco, Caja, CuentaPorCobrar, CuentaPorPagar } from '../types'

export const cuentasPorCobrar: CuentaPorCobrar[] = [
  {
    id: 'cxc-001',
    facturaId: 'fac-001',
    importe: 1700,
    saldoPendiente: 700,
    fechaVencimiento: '2026-10-05',
  },
  {
    id: 'cxc-002',
    facturaId: 'fac-002',
    importe: 800,
    saldoPendiente: 800,
    fechaVencimiento: '2026-10-06',
  },
]

export const cuentasPorPagar: CuentaPorPagar[] = [
  {
    id: 'cxp-001',
    proveedorId: 'prov-001',
    importe: 2500,
    saldoPendiente: 1500,
    fechaVencimiento: '2026-10-10',
  },
  {
    id: 'cxp-002',
    proveedorId: 'prov-002',
    importe: 1000,
    saldoPendiente: 1000,
    fechaVencimiento: '2026-10-12',
  },
]

export const cajas: Caja[] = [
  { id: 'caja-001', nombre: 'Caja principal' },
  { id: 'caja-002', nombre: 'Caja secundaria' },
]

export const bancos: Banco[] = [
  { id: 'banco-001', nombre: 'Banco principal' },
  { id: 'banco-002', nombre: 'Banco secundario' },
]
