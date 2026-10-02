import { useState } from 'react'
import { Link } from 'react-router'
import { useProductos, useRecepciones, useVentas } from '../../hooks'
import { nombreProducto } from '../../utils/format'

export function MovimientoKardexPage() {
  const recepciones = useRecepciones()
  const ventas = useVentas()
  const productos = useProductos()
  const [productoFiltro, setProductoFiltro] = useState('')

  const movimientosOrdenados = [
    ...recepciones.data.flatMap((recepcion) => recepcion.lineas.map((linea, indice) => ({
      clave: `${recepcion.id}-${indice}`,
      fecha: recepcion.fecha,
      productoId: linea.productoId,
      ingreso: linea.cantidad,
      salida: 0,
      origen: recepcion.id,
    }))),
    ...ventas.data.flatMap((venta) => venta.lineas.map((linea, indice) => ({
      clave: `${venta.id}-${indice}`,
      fecha: venta.fecha,
      productoId: linea.productoId,
      ingreso: 0,
      salida: linea.cantidad,
      origen: venta.id,
    }))),
  ].sort((a, b) => a.fecha.localeCompare(b.fecha) || b.ingreso - a.ingreso || a.clave.localeCompare(b.clave))
  const saldos = new Map<string, number>()
  const movimientos = movimientosOrdenados.map((movimiento) => {
    const saldo = (saldos.get(movimiento.productoId) ?? 0) + movimiento.ingreso - movimiento.salida
    saldos.set(movimiento.productoId, saldo)
    return { ...movimiento, saldo }
  }).filter((movimiento) => !productoFiltro || movimiento.productoId === productoFiltro)

  return (
    <section className="page area-inventario">
      <div className="page-heading"><div><span className="eyebrow">INVENTARIO</span><h1>Movimientos de productos</h1><p>Revisa las entradas por compras recibidas y las salidas por ventas.</p></div></div>
      {(recepciones.error || ventas.error || productos.error) && <p className="notice notice-error" role="alert">No se pudieron cargar los datos.</p>}
      {(recepciones.loading || ventas.loading || productos.loading) && <p className="notice" role="status">Cargando datos…</p>}
      <div className="section-card"><div className="section-head"><h2>Historial de movimientos</h2><small>{movimientos.length} resultados</small></div><div className="filters"><label>
        Filtrar por producto
        <select value={productoFiltro} onChange={(event) => setProductoFiltro(event.target.value)}>
          <option value="">Todos</option>
          {productos.data.map((producto) => (
            <option key={producto.id} value={producto.id}>{producto.nombre}</option>
          ))}
        </select>
      </label><div className="related-links"><Link to="/ventas/ingreso-kardex">Ver recepciones ↗</Link><Link to="/ventas/ordenes">Ver ventas ↗</Link></div></div><div className="table-wrap">
        <table>
          <thead><tr><th>Fecha</th><th>Producto</th><th>Entrada</th><th>Salida</th><th>Existencia global</th><th>Registro</th></tr></thead>
          <tbody>
            {movimientos.map((movimiento) => (
              <tr key={movimiento.clave}>
                <td>{movimiento.fecha}</td>
                <td>{nombreProducto(movimiento.productoId, productos.data)}</td>
                <td>{movimiento.ingreso || '—'}</td>
                <td>{movimiento.salida || '—'}</td>
                <td>{movimiento.saldo}</td>
                <td>{movimiento.origen}</td>
              </tr>
            ))}
            {!recepciones.loading && !ventas.loading && !recepciones.error && !ventas.error && movimientos.length === 0 && <tr><td className="empty-cell" colSpan={6}>No hay movimientos para mostrar.</td></tr>}
          </tbody>
        </table>
      </div></div>
      <div className="next-step"><span>Después de revisar movimientos</span><Link to="/ventas/stock-productos">Ver stock disponible <span aria-hidden="true">→</span></Link></div>
    </section>
  )
}
