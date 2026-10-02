import { ordenesCompra, recepciones } from '../data/compras'
import { almacenes } from '../data/inventario'
import { proveedores } from '../data/terceros'
import type { OrdenCompra, Recepcion } from '../types'
import { validarLineas, validarLineasConPrecio } from './mockValidation'

export function listarOrdenesCompra(): Promise<readonly OrdenCompra[]> {
  return Promise.resolve(ordenesCompra.map((orden) => ({
    ...orden,
    lineas: orden.lineas.map((linea) => ({ ...linea })),
  })))
}

export function listarRecepciones(): Promise<readonly Recepcion[]> {
  return Promise.resolve(recepciones.map((recepcion) => ({
    ...recepcion,
    lineas: recepcion.lineas.map((linea) => ({ ...linea })),
  })))
}

function validarOrdenCompra(datos: Omit<OrdenCompra, 'id'>): void {
  if (!proveedores.some((proveedor) => proveedor.id === datos.proveedorId)) {
    throw new Error('Selecciona un proveedor válido.')
  }
  validarLineasConPrecio(datos.lineas)
}

export async function crearOrdenCompra(datos: Omit<OrdenCompra, 'id'>): Promise<OrdenCompra> {
  validarOrdenCompra(datos)
  const orden: OrdenCompra = {
    ...datos,
    id: crypto.randomUUID(),
    lineas: datos.lineas.map((linea) => ({ ...linea })),
  }
  ordenesCompra.push(orden)
  return orden
}

export async function actualizarOrdenCompra(id: string, datos: Omit<OrdenCompra, 'id'>): Promise<OrdenCompra> {
  const indice = ordenesCompra.findIndex((orden) => orden.id === id)
  if (indice < 0) throw new Error('La orden de compras no existe.')
  if (recepciones.some((recepcion) => recepcion.ordenCompraId === id)) {
    throw new Error('No se puede editar una orden con recepciones registradas.')
  }
  validarOrdenCompra(datos)
  const orden: OrdenCompra = {
    ...datos,
    id,
    lineas: datos.lineas.map((linea) => ({ ...linea })),
  }
  ordenesCompra[indice] = orden
  return orden
}

export async function eliminarOrdenCompra(id: string): Promise<void> {
  const indice = ordenesCompra.findIndex((orden) => orden.id === id)
  if (indice < 0) throw new Error('La orden de compras no existe.')
  if (recepciones.some((recepcion) => recepcion.ordenCompraId === id)) {
    throw new Error('No se puede eliminar una orden con recepciones registradas.')
  }
  ordenesCompra.splice(indice, 1)
}

function validarRecepcion(datos: Omit<Recepcion, 'id'>, recepcionId?: string): void {
  const orden = ordenesCompra.find((item) => item.id === datos.ordenCompraId)
  if (!orden) throw new Error('Selecciona una orden de compras válida.')
  if (!almacenes.some((almacen) => almacen.id === datos.almacenId)) {
    throw new Error('Selecciona un almacén válido.')
  }
  validarLineas(datos.lineas)
  if (datos.lineas.some((linea) => !orden.lineas.some((item) => item.productoId === linea.productoId))) {
    throw new Error('La recepción solo puede incluir productos de la orden.')
  }
  for (const linea of datos.lineas) {
    const cantidadOrdenada = orden.lineas
      .filter((item) => item.productoId === linea.productoId)
      .reduce((total, item) => total + item.cantidad, 0)
    const cantidadRecibida = recepciones
      .filter((item) => item.ordenCompraId === orden.id && item.id !== recepcionId)
      .flatMap((item) => item.lineas)
      .filter((item) => item.productoId === linea.productoId)
      .reduce((total, item) => total + item.cantidad, 0)
    const cantidadNueva = datos.lineas
      .filter((item) => item.productoId === linea.productoId)
      .reduce((total, item) => total + item.cantidad, 0)
    if (cantidadRecibida + cantidadNueva > cantidadOrdenada) {
      throw new Error('La cantidad recibida no puede superar la cantidad ordenada.')
    }
  }
}

export async function crearRecepcion(datos: Omit<Recepcion, 'id'>): Promise<Recepcion> {
  validarRecepcion(datos)
  const recepcion: Recepcion = {
    ...datos,
    id: crypto.randomUUID(),
    lineas: datos.lineas.map((linea) => ({ ...linea })),
  }
  recepciones.push(recepcion)
  return recepcion
}

export async function actualizarRecepcion(id: string, datos: Omit<Recepcion, 'id'>): Promise<Recepcion> {
  const indice = recepciones.findIndex((recepcion) => recepcion.id === id)
  if (indice < 0) throw new Error('La recepción no existe.')
  validarRecepcion(datos, id)
  const recepcion: Recepcion = {
    ...datos,
    id,
    lineas: datos.lineas.map((linea) => ({ ...linea })),
  }
  recepciones[indice] = recepcion
  return recepcion
}

export async function eliminarRecepcion(id: string): Promise<void> {
  const indice = recepciones.findIndex((recepcion) => recepcion.id === id)
  if (indice < 0) throw new Error('La recepción no existe.')
  recepciones.splice(indice, 1)
}
