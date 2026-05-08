import usePageTitle from '../hooks/usePageTitle';
import '../styles/info-pages.css';

const Envios = () => {
    usePageTitle('Envíos y Devoluciones');

    return (
        <main className="info-page">
            <h1>ENVÍOS Y DEVOLUCIONES</h1>
            <p className="intro">
                Todo lo que necesitas saber sobre cómo recibir tu pedido y qué hacer si necesitas devolverlo.
            </p>

            <section className="info-section">
                <h2>Tarifas de envío</h2>
                <table className="shipping-table">
                    <thead>
                        <tr>
                            <th>DESTINO</th>
                            <th>PLAZO</th>
                            <th>COSTE</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Península</td>
                            <td>2 – 4 días laborables</td>
                            <td>3,95 €</td>
                        </tr>
                        <tr>
                            <td>Baleares</td>
                            <td>4 – 7 días laborables</td>
                            <td>5,95 €</td>
                        </tr>
                        <tr>
                            <td>Canarias</td>
                            <td>5 – 7 días laborables</td>
                            <td>7,95 €</td>
                        </tr>
                        <tr>
                            <td>Europa (UE)</td>
                            <td>5 – 10 días laborables</td>
                            <td>9,95 €</td>
                        </tr>
                    </tbody>
                </table>
                <p style={{ marginTop: '15px', fontSize: '0.85rem', color: '#888' }}>
                    Envío gratuito en pedidos superiores a 50 € (solo Península).
                </p>
            </section>

            <section className="info-section">
                <h2>Seguimiento del pedido</h2>
                <p>
                    Una vez que tu pedido sea enviado, recibirás un email de confirmación con el número de seguimiento.
                    Podrás rastrear tu paquete en tiempo real a través del enlace proporcionado.
                </p>
            </section>

            <section className="info-section">
                <h2>Política de devoluciones</h2>
                <p>
                    Tienes 14 días naturales desde la recepción de tu pedido para solicitar una devolución.
                    Para que la devolución sea aceptada, el producto debe cumplir las siguientes condiciones:
                </p>
                <ul>
                    <li>No haber sido usado ni lavado</li>
                    <li>Conservar las etiquetas originales</li>
                    <li>Estar en su embalaje original o equivalente</li>
                </ul>
            </section>

            <section className="info-section">
                <h2>¿Cómo solicitar una devolución?</h2>
                <p>
                    Envía un email a <strong>contacto@pvreza.com</strong> indicando tu número de pedido y el motivo
                    de la devolución. Te responderemos en un máximo de 48 horas con las instrucciones para el envío
                    de vuelta.
                </p>
            </section>

            <section className="info-section">
                <h2>Cambios de talla</h2>
                <p>
                    Si necesitas cambiar la talla de tu prenda, el proceso es el mismo que una devolución.
                    Te enviaremos la nueva talla una vez recibamos el producto original, sujeto a disponibilidad de stock.
                </p>
            </section>

            <section className="info-section">
                <h2>Reembolsos</h2>
                <p>
                    Una vez recibido y verificado el producto devuelto, procesaremos el reembolso en un plazo
                    de 5-10 días laborables al mismo método de pago utilizado en la compra.
                    Los gastos de envío de la devolución corren a cargo del cliente, salvo que el producto
                    presente defectos de fabricación.
                </p>
            </section>
        </main>
    );
};

export default Envios;