import { almacenes, productos } from '../data/inventario'
import type { Almacen, Producto } from '../types'

export function listarProductos(): Promise<readonly Producto[]> {
  return Promise.resolve([...productos])
}

export function listarAlmacenes(): Promise<readonly Almacen[]> {
  return Promise.resolve([...almacenes])
}
