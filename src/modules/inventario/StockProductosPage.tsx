import { useState } from 'react'
import { Link } from 'react-router'
import { useProductos, useRecepciones, useVentas } from '../../hooks'
import { formatoNumero } from '../../utils/format'

export function StockProductosPage() {
  const productos = useProductos()
  const recepciones = useRecepciones()
  const ventas = useVentas()
  const [busqueda, setBusqueda] = useState('')

  const visibles = productos.data.filter((producto) => producto.nombre.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase()))

  return (
    <section className="page area-inventario">
      <div className="page-heading"><div><span className="eyebrow">INVENTARIO</span><h1>Stock de productos</h1><p>Consulta cuántas unidades quedan después de las recepciones y las ventas.</p></div></div>
      <p className="info-note">El stock es global porque las ventas no identifican un almacén.</p>
      {(productos.error || recepciones.error || ventas.error) && <p className="notice notice-error" role="alert">No se pudieron cargar los datos.</p>}
      {(productos.loading || recepciones.loading || ventas.loading) && <p className="notice" role="status">Cargando datos…</p>}
      <div className="section-card"><div className="section-head"><h2>Disponibilidad de productos</h2><small>{visibles.length} resultados</small></div><div className="filters"><label>
        Buscar producto
        <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} />
      </label><div className="related-links"><Link to="/ventas/ingreso-kardex">Ver recepciones ↗</Link><Link to="/ventas/ordenes">Ver ventas ↗</Link></div></div><div className="table-wrap">
        <table>
          <thead><tr><th>Producto</th><th>Ingresos</th><th>Salidas</th><th>Disponible</th></tr></thead>
          <tbody>
            {visibles.map((producto) => {
              const ingresos = recepciones.data.reduce(
                (total, recepcion) => total + recepcion.lineas
                  .filter((linea) => linea.productoId === producto.id)
                  .reduce((suma, linea) => suma + linea.cantidad, 0),
                0,
              )
              const salidas = ventas.data.reduce(
                (total, venta) => total + venta.lineas
                  .filter((linea) => linea.productoId === producto.id)
                  .reduce((suma, linea) => suma + linea.cantidad, 0),
                0,
              )
              return (
                <tr key={producto.id}>
                  <td>{producto.nombre}</td>
                  <td>{formatoNumero(ingresos)}</td>
                  <td>{formatoNumero(salidas)}</td>
                  <td>{formatoNumero(ingresos - salidas)}</td>
                </tr>
              )
            })}
            {!productos.loading && !productos.error && visibles.length === 0 && <tr><td className="empty-cell" colSpan={4}>No hay productos para mostrar.</td></tr>}
          </tbody>
        </table>
      </div></div>
      <div className="next-step"><span>Continúa con ventas</span><Link to="/ventas/ordenes">Registrar una venta <span aria-hidden="true">→</span></Link></div>
    </section>
  )
}
