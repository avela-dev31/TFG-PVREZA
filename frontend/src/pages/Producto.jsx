/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductoById, getProductos } from "../api/productosApi";
import { getFavoritos, addFavorito, removeFavorito } from "../api/authApi";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { imgUrl } from "../constants";
import Banner from "../components/Banner";
import guiaTallasImg from "../../assets/img/guia_tallas.png";
import "../styles/producto.css";

const Producto = () => {
  const { id } = useParams();
  const { addToCart, isCartOpen, isMenuOpen } = useContext(CartContext);
  const { user } = useAuth();

  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [stock, setStock] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);
  const [fotoActiva, setFotoActiva] = useState(0);
  const [otrosProductos, setOtrosProductos] = useState([]);
  const [esFavorito, setEsFavorito] = useState(false);
  const [showRecomendador, setShowRecomendador] = useState(false);
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [complexion, setComplexion] = useState('');

  const tallaRecomendada = () => {
    const a = Number(altura);
    const p = Number(peso);
    if (!a || !p || !complexion || a < 140 || p < 35) return null;

    const mod = complexion === 'delgada' ? -4 : complexion === 'ancha' ? 4 : 0;
    const pecho = a * 0.4 + p * 0.3 + 10 + mod;
    const tallaPecho = pecho <= 92 ? 0 : pecho <= 98 ? 1 : pecho <= 104 ? 2 : pecho <= 112 ? 3 : 4;
    const tallaAltura = a <= 165 ? 0 : a <= 172 ? 1 : a <= 178 ? 2 : a <= 185 ? 3 : 4;

    const tallas = ['XS', 'S', 'M', 'L', 'XL'];
    return tallas[Math.max(tallaPecho, tallaAltura)];
  };

  useEffect(() => {
    setLoading(true);

    getProductoById(id)
      .then((res) => {
        if (res.data.ok) {
          setProducto(res.data.producto);
          setStock(res.data.stock);
          setImagenes(res.data.imagenes.map((img) => img.url));
          setFotoActiva(0);
          setTallaSeleccionada(null);
        }
      })
      .catch((err) => console.error("Error obteniendo el producto:", err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    getProductos()
      .then((res) => {
        const otros = res.data.filter((p) => String(p.id_producto) !== String(id));
        setOtrosProductos(otros);
      })
      .catch((err) => console.error("Error obteniendo otros productos:", err));
  }, [id]);

  useEffect(() => {
    if (!user) return;
    getFavoritos()
      .then((res) => {
        setEsFavorito(res.data.some((p) => String(p.id_producto) === String(id)));
      })
      .catch(() => {});
  }, [id, user]);

  const toggleFavorito = async () => {
    if (!user) return;
    if (esFavorito) {
      await removeFavorito(id);
      setEsFavorito(false);
    } else {
      await addFavorito(id);
      setEsFavorito(true);
    }
  };

  const siguiente = () => setFotoActiva((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  const anterior = () => setFotoActiva((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));

  const tallaClass = (item) =>
    ["talla-btn", tallaSeleccionada?.id_stock === item.id_stock ? "selected" : "", item.cantidad <= 0 ? "disabled" : ""]
      .join(" ")
      .trim();

  if (loading) return <div className="product-loading">Cargando PVREZA CLUB...</div>;
  if (!producto) return <div className="product-loading">Producto no encontrado</div>;

  return (
    <main>
    {!isCartOpen && !isMenuOpen && <Banner />}
      <section className="product">
        {/* CARRUSEL */}
        <div className="carousel">
          <div className="carousel-viewport">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${fotoActiva * 100}%)` }}
            >
              {imagenes.length > 0 ? (
                imagenes.map((url, index) => (
                  <img
                    key={index}
                    src={imgUrl(url)}
                    alt={`${producto.nombre} - vista ${index + 1}`}
                  />
                ))
              ) : (
                <img src={imgUrl(producto.imagen_url)} alt={producto.nombre} />
              )}
            </div>
          </div>
          {imagenes.length > 1 && (
            <>
              <button onClick={anterior} className="slider-arrow left">&#10094;</button>
              <button onClick={siguiente} className="slider-arrow right">&#10095;</button>
            </>
          )}
        </div>

        {/* DETALLES */}
        <div className="product-details">
          <div className="product-name-row">
            <h1 className="product-name">{producto.nombre}</h1>
            {user && (
              <button onClick={toggleFavorito} className="fav-btn" title={esFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill={esFavorito ? '#000' : 'none'} stroke="#000" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            )}
          </div>
          <p className="price">{producto.precio} €</p>

          <div className="tallas">
            {stock.map((item) => (
              <button
                key={item.id_stock}
                disabled={item.cantidad <= 0}
                onClick={() => setTallaSeleccionada(item)}
                className={tallaClass(item)}
              >
                {item.talla}
              </button>
            ))}
          </div>

          <button
            className="tryon-trigger-btn"
            onClick={() => setShowRecomendador(!showRecomendador)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <path d="M12 7v6" />
              <path d="M9 10h6" />
            </svg>
            {showRecomendador ? 'Cerrar recomendador' : '¿Cuál es mi talla?'}
          </button>

          {showRecomendador && (
            <div className="recomendador">
              <p className="recomendador-desc">Nuestras camisetas son de corte boxy fit. Introduce tus medidas y te recomendamos la talla ideal.</p>
              <div className="recomendador-inputs">
                <input
                  type="number"
                  placeholder="Altura (cm)"
                  min="140"
                  max="220"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  className="recomendador-input"
                />
                <input
                  type="number"
                  placeholder="Peso (kg)"
                  min="35"
                  max="150"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  className="recomendador-input"
                />
              </div>
              <div className="recomendador-complexion">
                <p className="recomendador-label">Complexión</p>
                <div className="complexion-opciones">
                  {[
                    { key: 'delgada', label: 'Delgada', desc: 'Hombros estrechos, constitución ligera' },
                    { key: 'media', label: 'Media', desc: 'Proporción estándar' },
                    { key: 'ancha', label: 'Ancha', desc: 'Hombros anchos, constitución fuerte' },
                  ].map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      className={`complexion-btn ${complexion === c.key ? 'selected' : ''}`}
                      onClick={() => setComplexion(c.key)}
                      title={c.desc}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              {tallaRecomendada() && (
                <div className="recomendador-resultado">
                  <p>Tu talla recomendada es</p>
                  <span className="talla-recomendada">{tallaRecomendada()}</span>
                  <button
                    className="seleccionar-recomendada-btn"
                    onClick={() => {
                      const match = stock.find(
                        (s) => s.talla === tallaRecomendada() && s.cantidad > 0
                      );
                      if (match) setTallaSeleccionada(match);
                    }}
                    disabled={!stock.find((s) => s.talla === tallaRecomendada() && s.cantidad > 0)}
                  >
                    {stock.find((s) => s.talla === tallaRecomendada() && s.cantidad > 0)
                      ? 'Seleccionar esta talla'
                      : 'Agotada'}
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="cart-btn"
            disabled={!tallaSeleccionada}
            onClick={() => addToCart(producto, tallaSeleccionada)}
          >
            {tallaSeleccionada ? "Añadir al carrito" : "Selecciona una talla"}
          </button>

          <details className="product-details-section">
            <summary><strong>DETALLES DEL PRODUCTO</strong></summary>
            <p>{producto.descripcion}</p>
          </details>

          <details className="product-details-section">
            <summary><strong>GUÍA DE TALLAS</strong></summary>
            <img
              src={guiaTallasImg}
              alt="Guía de tallas"
              className="guia-tallas-img"
            />
          </details>
        </div>
      </section>
      
      {otrosProductos.length > 0 && (
        <section className="otros-productos">
          <h2 className="otros-productos-titulo">TAMBIÉN TE PUEDE GUSTAR</h2>
          <div className="otros-productos-grid">
            {otrosProductos.map((p) => (
              <button
                key={p.id_producto}
                className={`otro-producto-card`}
                onClick={() => navigate(`/producto/${p.id_producto}`)}
              >
                <img
                  src={imgUrl(p.imagen_url)}
                  alt={p.nombre}
                />
                <p className="otro-producto-nombre">{p.nombre}</p>
                <p className="otro-producto-precio">{p.precio} €</p>
              </button>
            ))}
          </div>
        </section>
      )}

    </main>
  );
};

export default Producto;