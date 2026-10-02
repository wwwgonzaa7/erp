import type { LineaCantidad, Producto } from '../types'

type Props = {
  lineas: LineaCantidad[]
  productos: readonly Producto[]
  onChange: (lineas: LineaCantidad[]) => void
}

function LineasCantidadEditor({ lineas, productos, onChange }: Props) {
  function actualizar(indice: number, cambios: Partial<LineaCantidad>) {
    onChange(lineas.map((linea, posicion) => posicion === indice ? { ...linea, ...cambios } : linea))
  }

  return (
    <fieldset>
      <legend>Productos recibidos</legend>
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
          <button className="button button-danger" type="button" onClick={() => onChange(lineas.filter((_, posicion) => posicion !== indice))}>
            Quitar
          </button>
        </div>
      ))}
      <button className="button" type="button" onClick={() => onChange([...lineas, { productoId: '', cantidad: 1 }])}>
        Agregar producto
      </button>
    </fieldset>
  )
}

export default LineasCantidadEditor
