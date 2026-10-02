import { cuentasPorCobrar } from '../data/finanzas'
import { clientes } from '../data/terceros'
import { facturas, ventas } from '../data/ventas'
import type { Factura, Venta } from '../types'
import { validarLineasConPrecio } from './mockValidation'

export function listarVentas(): Promise<readonly Venta[]> {
  return Promise.resolve(ventas.map((venta) => ({
    ...venta,
    lineas: venta.lineas.map((linea) => ({ ...linea })),
  })))
}

export function listarFacturas(): Promise<readonly Factura[]> {
  return Promise.resolve([...facturas])
}

function validarVenta(datos: Omit<Venta, 'id'>): void {
  if (!clientes.some((cliente) => cliente.id === datos.clienteId)) {
    throw new Error('Selecciona un cliente válido.')
  }
  validarLineasConPrecio(datos.lineas)
}

export async function crearVenta(datos: Omit<Venta, 'id'>): Promise<Venta> {
  validarVenta(datos)
  const venta: Venta = {
    ...datos,
    id: crypto.randomUUID(),
    lineas: datos.lineas.map((linea) => ({ ...linea })),
  }
  ventas.push(venta)
  return venta
}

export async function actualizarVenta(id: string, datos: Omit<Venta, 'id'>): Promise<Venta> {
  const indice = ventas.findIndex((venta) => venta.id === id)
  if (indice < 0) throw new Error('La orden de ventas no existe.')
  if (facturas.some((factura) => factura.ventaId === id)) {
    throw new Error('No se puede editar una venta con facturas registradas.')
  }
  validarVenta(datos)
  const venta: Venta = {
    ...datos,
    id,
    lineas: datos.lineas.map((linea) => ({ ...linea })),
  }
  ventas[indice] = venta
  return venta
}

export async function eliminarVenta(id: string): Promise<void> {
  const indice = ventas.findIndex((venta) => venta.id === id)
  if (indice < 0) throw new Error('La orden de ventas no existe.')
  if (facturas.some((factura) => factura.ventaId === id)) {
    throw new Error('No se puede eliminar una venta con facturas registradas.')
  }
  ventas.splice(indice, 1)
}

function validarFactura(datos: Omit<Factura, 'id'>): void {
  const venta = ventas.find((item) => item.id === datos.ventaId)
  if (!venta) throw new Error('Selecciona una orden de ventas válida.')
  if (!Number.isFinite(datos.importe) || datos.importe < 0) {
    throw new Error('El importe debe ser cero o mayor.')
  }
  const importeVenta = venta.lineas.reduce((total, linea) => total + linea.cantidad * linea.precioUnitario, 0)
  if (Math.abs(datos.importe - importeVenta) > 0.005) {
    throw new Error('El importe de la factura debe coincidir con la venta.')
  }
}

export async function crearFactura(datos: Omit<Factura, 'id'>): Promise<Factura> {
  validarFactura(datos)
  const factura: Factura = { ...datos, id: crypto.randomUUID() }
  facturas.push(factura)
  return factura
}

export async function actualizarFactura(id: string, datos: Omit<Factura, 'id'>): Promise<Factura> {
  const indice = facturas.findIndex((factura) => factura.id === id)
  if (indice < 0) throw new Error('La factura no existe.')
  if (cuentasPorCobrar.some((cuenta) => cuenta.facturaId === id)) {
    throw new Error('No se puede editar una factura con cuentas por cobrar registradas.')
  }
  validarFactura(datos)
  const factura: Factura = { ...datos, id }
  facturas[indice] = factura
  return factura
}

export async function eliminarFactura(id: string): Promise<void> {
  const indice = facturas.findIndex((factura) => factura.id === id)
  if (indice < 0) throw new Error('La factura no existe.')
  if (cuentasPorCobrar.some((cuenta) => cuenta.facturaId === id)) {
    throw new Error('No se puede eliminar una factura con cuentas por cobrar registradas.')
  }
  facturas.splice(indice, 1)
}
