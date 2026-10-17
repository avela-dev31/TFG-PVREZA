import '../styles/banner.css';

const MENSAJE = "PVREZA CLUB • CREATED TO CREATE  ";
const REPETICIONES = 10;

const Banner = () => (
    <div className="pvreza-banner-container">
        <div className="pvreza-banner-track">
            {Array.from({ length: REPETICIONES }, (_, i) => (
                <span key={i}>{MENSAJE}</span>
            ))}
        </div>
    </div>
);

export default Banner;