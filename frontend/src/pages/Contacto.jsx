import { useState } from 'react';
import usePageTitle from '../hooks/usePageTitle';
import '../styles/info-pages.css';

const Contacto = () => {
    usePageTitle('Contacto');
    const [enviado, setEnviado] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setEnviado(true);
    };

    return (
        <main className="info-page">
            <h1>CONTACTO</h1>
            <p className="intro">
                ¿Tienes alguna pregunta, sugerencia o incidencia? Escríbenos y te responderemos lo antes posible.
            </p>

            <div className="contact-grid">
                <div>
                    {enviado ? (
                        <div className="info-section">
                            <h2>Mensaje enviado</h2>
                            <p>
                                Gracias por contactar con nosotros. Te responderemos en un plazo máximo de 48 horas.
                            </p>
                            <button
                                className="submit-btn"
                                style={{ marginTop: '20px' }}
                                onClick={() => setEnviado(false)}
                            >
                                ENVIAR OTRO MENSAJE
                            </button>
                        </div>
                    ) : (
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>NOMBRE</label>
                                <input type="text" required placeholder="Tu nombre" />
                            </div>
                            <div className="form-group">
                                <label>EMAIL</label>
                                <input type="email" required placeholder="tu@email.com" />
                            </div>
                            <div className="form-group">
                                <label>ASUNTO</label>
                                <input type="text" required placeholder="¿Sobre qué quieres hablar?" />
                            </div>
                            <div className="form-group">
                                <label>MENSAJE</label>
                                <textarea required placeholder="Escribe tu mensaje aquí..." />
                            </div>
                            <button type="submit" className="submit-btn">ENVIAR MENSAJE</button>
                        </form>
                    )}
                </div>

                <div className="contact-info-side">
                    <div className="contact-info-block">
                        <h3>EMAIL</h3>
                        <p><a href="mailto:contacto@pvreza.com">contacto@pvreza.com</a></p>
                    </div>
                    <div className="contact-info-block">
                        <h3>INSTAGRAM</h3>
                        <p><a href="https://www.instagram.com/pvreza.club/" target="_blank" rel="noreferrer">@pvreza.club</a></p>
                    </div>
                    <div className="contact-info-block">
                        <h3>HORARIO DE ATENCIÓN</h3>
                        <p>Lunes a Viernes</p>
                        <p>10:00 – 18:00 (CET)</p>
                    </div>
                    <div className="contact-info-block">
                        <h3>UBICACIÓN</h3>
                        <p>Lebrija, Sevilla</p>
                        <p>España</p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Contacto;