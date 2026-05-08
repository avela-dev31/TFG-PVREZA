import { useState } from 'react';
import usePageTitle from '../hooks/usePageTitle';
import '../styles/info-pages.css';

const preguntas = [
    {
        pregunta: '¿Qué materiales utilizáis en vuestras camisetas?',
        respuesta: 'Todas nuestras prendas están fabricadas con algodón orgánico 100% de 230g, con certificación GOTS. Buscamos la máxima calidad y durabilidad en cada pieza.'
    },
    {
        pregunta: '¿Cómo puedo saber mi talla?',
        respuesta: 'En PVREZA ofrecemos un sistema de probador virtual 3D. Al crear tu perfil, puedes introducir tus medidas (altura, peso) y nuestro avatar te mostrará cómo te quedará cada prenda antes de comprarla.'
    },
    {
        pregunta: '¿Cuánto tarda en llegar mi pedido?',
        respuesta: 'Los envíos dentro de la Península se entregan en 2-4 días laborables. Para Baleares y Canarias, el plazo es de 4-7 días laborables. Recibirás un email con el número de seguimiento cuando tu pedido sea enviado.'
    },
    {
        pregunta: '¿Puedo devolver o cambiar un producto?',
        respuesta: 'Sí, tienes 14 días naturales desde la recepción del pedido para solicitar una devolución o cambio. El producto debe estar sin usar, con etiquetas y en su embalaje original. Consulta nuestra página de Envíos y Devoluciones para más detalles.'
    },
    {
        pregunta: '¿Qué métodos de pago aceptáis?',
        respuesta: 'Aceptamos tarjeta de crédito/débito (Visa, Mastercard), PayPal y Bizum. Todos los pagos se procesan de forma segura con cifrado SSL.'
    },
    {
        pregunta: '¿Los drops se reponen?',
        respuesta: 'PVREZA funciona con sistema de drops limitados. Una vez que una colección se agota, no se repone. Suscríbete a nuestra newsletter para estar al tanto de los próximos lanzamientos y no quedarte sin la tuya.'
    },
    {
        pregunta: '¿Dónde se diseñan las prendas?',
        respuesta: 'Todas nuestras prendas son diseñadas en Lebrija, Sevilla. Desde el concepto hasta el diseño final, cada pieza nace en nuestro estudio local.'
    },
    {
        pregunta: '¿Cómo puedo contactar con vosotros?',
        respuesta: 'Puedes escribirnos a través del formulario de contacto en nuestra web, enviarnos un email a contacto@pvreza.com o escribirnos por DM en Instagram (@pvreza.club). Respondemos en un máximo de 24-48 horas.'
    }
];

const FAQ = () => {
    usePageTitle('Preguntas Frecuentes');
    const [abierta, setAbierta] = useState(null);

    const toggle = (index) => {
        setAbierta(abierta === index ? null : index);
    };

    return (
        <main className="info-page">
            <h1>PREGUNTAS FRECUENTES</h1>
            <p className="intro">
                Resolvemos las dudas más comunes sobre PVREZA, nuestros productos y el proceso de compra.
            </p>

            <div className="faq-list">
                {preguntas.map((item, index) => (
                    <div key={index} className={`faq-item ${abierta === index ? 'open' : ''}`}>
                        <button className="faq-question" onClick={() => toggle(index)}>
                            {item.pregunta}
                            <span className="faq-icon">+</span>
                        </button>
                        <div className="faq-answer">
                            <p>{item.respuesta}</p>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default FAQ;
