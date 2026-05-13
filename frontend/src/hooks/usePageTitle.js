import { useEffect } from 'react';

const usePageTitle = (title, faviconUrl = '/favicon.png') => {
    useEffect(() => {
        document.title = title ? `${title} | PVREZA` : 'PVREZA | Official Store';

        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = faviconUrl;
    }, [title, faviconUrl]);
};

export default usePageTitle;
