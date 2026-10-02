import { Link } from 'react-router'
import {
  useCuentasPorCobrar,
  useFacturas,
  useOrdenesCompra,
  useProductos,
  useRecepciones,
  useVentas,
} from '../hooks'

function PanelPage() {
  const ordenes = useOrdenesCompra()
  const ventas = useVentas()
  const facturas = useFacturas()
  const cuentas = useCuentasPorCobrar()
  const recepciones = useRecepciones()
  const productos = useProductos()

  const areas = [
    {
      title: 'Compras y recepción',
      className: 'area-compras',
      description: 'Primero registra la orden. Cuando lleguen los productos, confirma la recepción.',
      links: [
        { label: 'Órdenes de compra', detail: `${ordenes.data.length} órdenes`, to: '/compras/ordenes' },
        { label: 'Recepción de compras', detail: `${recepciones.data.length} recepciones`, to: '/ventas/ingreso-kardex' },
      ],
    },
    {
      title: 'Inventario',
      className: 'area-inventario',
      description: 'Consulta las entradas, las salidas por ventas y lo que queda disponible.',
      links: [
        { label: 'Movimientos de productos', detail: 'Entradas y salidas', to: '/ventas/movimiento-kardex' },
        { label: 'Stock de productos', detail: `${productos.data.length} productos`, to: '/ventas/stock-productos' },
      ],
    },
    {
      title: 'Ventas y cobros',
      className: 'area-ventas',
      description: 'Registra la venta, emite su factura y consulta el saldo pendiente.',
      links: [
        { label: 'Órdenes de venta', detail: `${ventas.data.length} órdenes`, to: '/ventas/ordenes' },
        { label: 'Facturación', detail: `${facturas.data.length} facturas`, to: '/ventas/facturacion' },
        { label: 'Cuentas por cobrar', detail: `${cuentas.data.length} cuentas`, to: '/ventas/estado-cuenta' },
      ],
    },
  ]

  return (
    <section className="page area-panel">
      <div className="page-heading">
        <div><span className="eyebrow">INICIO</span><h1>Panel</h1><p>Encuentra cada registro desde la compra hasta el cobro de una venta.</p></div>
      </div>
      {[ordenes, ventas, facturas, cuentas, recepciones, productos].some((item) => item.error) && (
        <p className="notice notice-error" role="alert">No se pudieron cargar todos los datos.</p>
      )}
      {[ordenes, ventas, facturas, cuentas, recepciones, productos].some((item) => item.loading) && <p className="notice" role="status">Cargando datos…</p>}
      <div className="process-board">
        <div className="process-board-head"><span className="eyebrow">RECORRIDO DE LA OPERACIÓN</span><h2>De la compra al cobro</h2></div>
        <div className="process-areas">
          {areas.map((area) => (
            <div className={`process-area ${area.className}`} key={area.title}>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
              <div className="process-links">
                {area.links.map((item) => (
                  <Link className="process-link" key={item.to} to={item.to}>
                    <span><strong>{item.label}</strong><small>{item.detail}</small></span>
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PanelPage
