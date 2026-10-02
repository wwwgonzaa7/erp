import { Navigate, Route, Routes } from 'react-router'
import MainLayout from './layouts/MainLayout'
import { OrdenComprasPage } from './modules/compras/pages'
import { EstadoCuentaPage } from './modules/finanzas/pages'
import {
  IngresoKardexPage,
  MovimientoKardexPage,
  StockProductosPage,
} from './modules/inventario/pages'
import { FacturacionPage, OrdenVentasPage } from './modules/ventas/pages'
import PanelPage from './pages/PanelPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/inicio/panel" replace />} />
        <Route path="inicio/panel" element={<PanelPage />} />
        <Route path="compras/ordenes" element={<OrdenComprasPage />} />
        <Route path="ventas/ordenes" element={<OrdenVentasPage />} />
        <Route path="ventas/facturacion" element={<FacturacionPage />} />
        <Route path="ventas/estado-cuenta" element={<EstadoCuentaPage />} />
        <Route path="ventas/ingreso-kardex" element={<IngresoKardexPage />} />
        <Route path="ventas/movimiento-kardex" element={<MovimientoKardexPage />} />
        <Route path="ventas/stock-productos" element={<StockProductosPage />} />
        <Route path="*" element={<Navigate to="/inicio/panel" replace />} />
      </Route>
    </Routes>
  )
}

export default App
