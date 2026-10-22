import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLoginRequest, appleLoginRequest } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const APPLE_CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID;
const APPLE_REDIRECT_URI = import.meta.env.VITE_APPLE_REDIRECT_URI;

const loadScript = (src, id) =>
  new Promise((resolve, reject) => {
    if (document.getElementById(id)) return resolve();
    const s = document.createElement('script');
    s.id = id;
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });

const SocialAuthButtons = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const googleRef = useRef(null);
  const callbackRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSuccess = (res) => {
    login(res.data.user, res.data.token, res.data.refreshToken);
    navigate('/');
  };

  // Google
  callbackRef.current = async (credential) => {
    setError('');
    setLoading(true);
    try {
      const res = await googleLoginRequest(credential);
      handleSuccess(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Error con Google');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    loadScript('https://accounts.google.com/gsi/client', 'google-gsi').then(() => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => callbackRef.current(response.credential),
      });
      if (googleRef.current) {
        window.google.accounts.id.renderButton(googleRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'rectangular',
          text: 'continue_with',
          width: googleRef.current.offsetWidth || 400,
          locale: 'es',
        });
      }
    });
  }, []);

  // Apple
  const handleApple = async () => {
    setError('');
    setLoading(true);
    try {
      await loadScript(
        'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js',
        'apple-auth'
      );
      window.AppleID.auth.init({
        clientId: APPLE_CLIENT_ID,
        scope: 'name email',
        redirectURI: APPLE_REDIRECT_URI,
        usePopup: true,
      });
      const response = await window.AppleID.auth.signIn();
      const res = await appleLoginRequest(
        response.authorization.id_token,
        response.user
      );
      handleSuccess(res);
    } catch (err) {
      if (err?.error !== 'popup_closed_by_user') {
        setError(err?.response?.data?.message || 'Error con Apple');
      }
    } finally {
      setLoading(false);
    }
  };

  const showGoogle = !!GOOGLE_CLIENT_ID;
  const showApple = !!APPLE_CLIENT_ID;

  if (!showGoogle && !showApple) return null;

  return (
    <div className="social-auth">
      <div className="social-divider">
        <span>O CONTINÚA CON</span>
      </div>

      {showGoogle && <div ref={googleRef} className="google-btn-wrapper" />}

      {showApple && (
        <button
          type="button"
          className="social-btn apple-btn"
          onClick={handleApple}
          disabled={loading}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          Continuar con Apple
        </button>
      )}

      {error && <p className="auth-error">{error}</p>}
    </div>
  );
};

export default SocialAuthButtons;
