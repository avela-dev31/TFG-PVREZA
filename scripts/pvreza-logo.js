// pvreza-logo.js
(function() {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "url": "https://pvrezaclub.com",
    "logo": "https://pvrezaclub.com/path-to-your-logo.png"
  });
  document.head.appendChild(script);
})();
