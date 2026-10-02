import type { LineaConPrecio, Producto } from '../types'

type Props = {
  lineas: LineaConPrecio[]
  productos: readonly Producto[]
  onChange: (lineas: LineaConPrecio[]) => void
}

function LineasConPrecioEditor({ lineas, productos, onChange }: Props) {
  function actualizar(indice: number, cambios: Partial<LineaConPrecio>) {
    onChange(lineas.map((linea, posicion) => posicion === indice ? { ...linea, ...cambios } : linea))
  }

  return (
    <fieldset>
      <legend>Productos</legend>
      {lineas.map((linea, indice) => (
        <div className="line-fields" key={indice}>
          <label>
            Producto
            <select
              required
              value={linea.productoId}
              onChange={(event) => actualizar(indice, { productoId: event.target.value })}
            >
              <option value="">Selecciona un producto</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>{producto.nombre}</option>
              ))}
            </select>
          </label>
          <label>
            Cantidad
            <input
              required
              type="number"
              min="1"
              step="1"
              value={linea.cantidad}
              onChange={(event) => actualizar(indice, { cantidad: Number(event.target.value) })}
            />
          </label>
          <label>
            Precio unitario
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={linea.precioUnitario}
              onChange={(event) => actualizar(indice, { precioUnitario: Number(event.target.value) })}
            />
          </label>
          <button className="button button-danger" type="button" onClick={() => onChange(lineas.filter((_, posicion) => posicion !== indice))}>
            Quitar
          </button>
        </div>
      ))}
      <button
        className="button"
        type="button"
        onClick={() => onChange([...lineas, { productoId: '', cantidad: 1, precioUnitario: 0 }])}
      >
        Agregar producto
      </button>
    </fieldset>
  )
}

export default LineasConPrecioEditor
