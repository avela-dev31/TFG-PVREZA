import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; 
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import CartDrawer from './components/CartDrawer';

import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Producto from './pages/Producto';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Perfil from './pages/Perfil';
import Dashboard from './pages/admin/Dashboard';
import FAQ from './pages/FAQ';
import Envios from './pages/Envios';
import Contacto from './pages/Contacto';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <CartDrawer />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/catalogo/:coleccion" element={<Catalogo />}/>
            <Route path="/producto/:id" element={<Producto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/envios" element={<Envios />} />
            <Route path="/contacto" element={<Contacto />} />

            {/* Rutas protegidas (usuario logueado) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>

            {/* Rutas admin */}
            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="/admin" element={<Dashboard />} />
            </Route>
          </Routes>
          
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;