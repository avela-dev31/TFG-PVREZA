/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductoById, getProductos } from "../api/productosApi";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { BACKEND_URL } from "../constants";
import AvatarCreator from "../components/AvatarCreator";
import Banner from "../components/Banner";
import "../styles/producto.css";

const MODEL_MAP = {
  1: "Avatar_Pvreza.glb",
  2: "Avatar_Pvreza.glb",
  3: "Avatar_Pvreza.glb",
};

const Producto = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated, user } = useAuth();

  const [producto, setProducto] = useState(null);
  const [stock, setStock] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);
  const [fotoActiva, setFotoActiva] = useState(0);

  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [altura, setAltura] = useState(175);
  const [peso, setPeso] = useState(75);

  const modeloCamiseta = MODEL_MAP[id] || "camiseta_azul.glb";

  useEffect(() => {
    window.scrollTo(0, 0);
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

    getProductos().then((res) => {
      res.data.filter((p) => p.id_producto !== parseInt(id));
    });
  }, [id]);

  const handleAbrirProbador = () => {
    setAltura(isAuthenticated && user ? (user.altura || 175) : 175);
    setPeso(isAuthenticated && user ? (user.peso || 75) : 75);
    setIsTryOnOpen(true);
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
      <Banner />
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
                    src={`${BACKEND_URL}${url}`}
                    alt={`${producto.nombre} - vista ${index + 1}`}
                  />
                ))
              ) : (
                <img src={`${BACKEND_URL}${producto.imagen_url}`} alt={producto.nombre} />
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
          <h1 className="product-name">{producto.nombre}</h1>
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

          <button className="tryon-trigger-btn" onClick={handleAbrirProbador}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v19" />
              <path d="M5 10h14" />
              <path d="M5 15h14" />
            </svg>
            Probar en mi Avatar 3D
          </button>

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
        </div>
      </section>

      {/* MODAL PROBADOR 3D */}
      {isTryOnOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={() => setIsTryOnOpen(false)} className="modal-close">&times;</button>
            <div className="modal-layout">

              <div className="modal-canvas">
                <AvatarCreator altura={Number(altura)} peso={Number(peso)} modeloCamiseta={modeloCamiseta} />
              </div>

              <div className="modal-controls">
                <h2>{isAuthenticated ? "TUS MEDIDAS GUARDADAS" : "CONFIGURA TU AVATAR"}</h2>

                {isAuthenticated ? (
                  <p className="user-greeting">
                    Hola <strong>{user.nombre}</strong>, estamos proyectando tu avatar con los datos de tu perfil.
                  </p>
                ) : (
                  <p className="guest-notice">
                    ⚠️ No has iniciado sesión. Introduce tus datos manualmente para el probador virtual.
                  </p>
                )}

                <label className="controls-label">Altura</label>
                <div className="input-group">
                  <input type="range" min="150" max="210" value={altura} onChange={(e) => setAltura(e.target.value)} />
                  <span className="val-display">{altura} cm</span>
                </div>

                <label className="controls-label mt">Peso</label>
                <div className="input-group">
                  <input type="range" min="50" max="120" value={peso} onChange={(e) => setPeso(e.target.value)} />
                  <span className="val-display">{peso} kg</span>
                </div>

                <div className="info-box">
                  <p><strong>Talla recomendada:</strong> {altura > 180 || peso > 85 ? "XL" : "L"}</p>
                </div>

                {!isAuthenticated && (
                  <Link to="/login" className="login-prompt-link">
                    ¿Quieres guardar tus medidas? Inicia sesión
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Producto;