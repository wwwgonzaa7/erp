import { cuentasPorCobrar } from '../data/finanzas'
import { facturas } from '../data/ventas'
import type { CuentaPorCobrar } from '../types'

export function listarCuentasPorCobrar(): Promise<readonly CuentaPorCobrar[]> {
  return Promise.resolve([...cuentasPorCobrar])
}

function validarCuenta(datos: Omit<CuentaPorCobrar, 'id'>): void {
  const factura = facturas.find((item) => item.id === datos.facturaId)
  if (!factura) throw new Error('Selecciona una factura válida.')
  if (!Number.isFinite(datos.importe) || datos.importe < 0) {
    throw new Error('El importe debe ser cero o mayor.')
  }
  if (Math.abs(datos.importe - factura.importe) > 0.005) {
    throw new Error('El importe de la cuenta debe coincidir con la factura.')
  }
  if (!Number.isFinite(datos.saldoPendiente) || datos.saldoPendiente < 0 || datos.saldoPendiente > datos.importe) {
    throw new Error('El saldo pendiente debe estar entre cero y el importe.')
  }
}

export async function crearCuentaPorCobrar(datos: Omit<CuentaPorCobrar, 'id'>): Promise<CuentaPorCobrar> {
  validarCuenta(datos)
  const cuenta: CuentaPorCobrar = { ...datos, id: crypto.randomUUID() }
  cuentasPorCobrar.push(cuenta)
  return cuenta
}

export async function actualizarCuentaPorCobrar(id: string, datos: Omit<CuentaPorCobrar, 'id'>): Promise<CuentaPorCobrar> {
  const indice = cuentasPorCobrar.findIndex((cuenta) => cuenta.id === id)
  if (indice < 0) throw new Error('La cuenta por cobrar no existe.')
  validarCuenta(datos)
  const cuenta: CuentaPorCobrar = { ...datos, id }
  cuentasPorCobrar[indice] = cuenta
  return cuenta
}

export async function eliminarCuentaPorCobrar(id: string): Promise<void> {
  const indice = cuentasPorCobrar.findIndex((cuenta) => cuenta.id === id)
  if (indice < 0) throw new Error('La cuenta por cobrar no existe.')
  cuentasPorCobrar.splice(indice, 1)
}
