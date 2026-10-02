import { Link, Outlet } from 'react-router'

function AuthLayout() {
  return (
    <main className="auth-layout">
      <p className="brand">ERP EnterpriseCloud</p>
      <Outlet />
      <Link to="/inicio/panel">Volver al ERP</Link>
    </main>
  )
}

export default AuthLayout
