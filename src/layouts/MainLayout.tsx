import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useOutlet } from 'react-router'

const navigation = [
  { title: 'Inicio', area: 'panel', links: [{ to: '/inicio/panel', label: 'Panel', icon: '▦' }] },
  { title: 'Compras', area: 'compras', links: [
    { to: '/compras/ordenes', label: 'Órdenes de compra', icon: '◫' },
    { to: '/ventas/ingreso-kardex', label: 'Recepción de compras', icon: '↧' },
  ] },
  { title: 'Inventario', area: 'inventario', links: [
    { to: '/ventas/movimiento-kardex', label: 'Movimientos de productos', icon: '⇄' },
    { to: '/ventas/stock-productos', label: 'Stock de productos', icon: '▥' },
  ] },
  {
    title: 'Ventas',
    area: 'ventas',
    links: [
      { to: '/ventas/ordenes', label: 'Órdenes de venta', icon: '◫' },
      { to: '/ventas/facturacion', label: 'Facturación', icon: '▤' },
    ],
  },
  { title: 'Cobros', area: 'cobros', links: [{ to: '/ventas/estado-cuenta', label: 'Cuentas por cobrar', icon: '◉' }] },
]

const themeStorageKey = 'erp-enterprisecloud-theme'
type Theme = 'light' | 'dark'

function MainLayout() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return window.localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })
  const { pathname } = useLocation()
  const outlet = useOutlet()
  const latestOutlet = useRef(outlet)
  const [displayed, setDisplayed] = useState({ pathname, outlet })
  const [leaving, setLeaving] = useState(false)

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem(themeStorageKey, theme)
    } catch {
      // El tema sigue funcionando durante la sesión si el almacenamiento está bloqueado.
    }
  }, [theme])

  useEffect(() => {
    latestOutlet.current = outlet
  }, [outlet])

  useEffect(() => {
    if (displayed.pathname === pathname) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayed({ pathname, outlet: latestOutlet.current })
      setLeaving(false)
      return
    }

    setLeaving(true)
    const timer = window.setTimeout(() => {
      setDisplayed({ pathname, outlet: latestOutlet.current })
      setLeaving(false)
    }, 140)
    return () => window.clearTimeout(timer)
  }, [pathname, displayed.pathname])

  const exiting = leaving && displayed.pathname !== pathname
  const group = navigation.find((item) => item.links.some((link) => link.to === pathname))
  const current = group?.links.find((link) => link.to === pathname)

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Link to="/inicio/panel" className="brand" aria-label="Logo de ERP EnterpriseCloud, ir al Panel">
          <span className="brand-mark" aria-hidden="true">EC</span>
          <span className="brand-copy"><strong>EnterpriseCloud</strong><small>Gestión empresarial</small></span>
        </Link>
        <nav aria-label="Navegación principal" className="sidebar-nav">
          {navigation.map(({ title, area, links }) => (
            <div className={`nav-group nav-${area}`} key={title}>
              <p className="nav-group-title">{title}</p>
              <div className="nav-group-links">
                {links.map(({ to, label, icon }) => (
                  <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className="nav-icon" aria-hidden="true">{icon}</span><span>{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">Datos de ejemplo. Los cambios se reinician al recargar.</div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb"><span>EnterpriseCloud</span><span aria-hidden="true">/</span><span>{group?.title ?? 'Inicio'}</span><span aria-hidden="true">/</span><strong>{current?.label ?? 'Panel'}</strong></div>
          <div className="topbar-actions">
            <div className="theme-control" role="group" aria-label="Tema de la interfaz">
              <button type="button" className={`theme-option ${theme === 'light' ? 'active' : ''}`} aria-pressed={theme === 'light'} onClick={() => setTheme('light')}><span aria-hidden="true">☼</span> Light</button>
              <button type="button" className={`theme-option ${theme === 'dark' ? 'active' : ''}`} aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}><span aria-hidden="true">◐</span> Dark</button>
            </div>
          </div>
        </header>
        <main className="content" id="contenido-principal">
          <div className={`route-frame ${exiting ? 'route-exit' : 'route-enter'}`}>
            {displayed.outlet}
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
