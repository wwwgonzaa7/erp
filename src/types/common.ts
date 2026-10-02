export type Id = string
export type FechaISO = string

export interface LineaCantidad {
  productoId: Id
  cantidad: number
}

export interface LineaConPrecio extends LineaCantidad {
  precioUnitario: number
}
