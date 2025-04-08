(async function () {
    var matomoInstance = "hansevision.matomo.cloud";
    var matomoBaseUrl = "https://" + matomoInstance + "/";
    var matomoPhpUrl = matomoBaseUrl + "matomo.php";
    var matomoJsUrl = "https://cdn.matomo.cloud/" + matomoInstance + "/matomo.js";
    var matomoScriptId = "matomo-script";

    var lastTrackedUrl = location.href;

    // Initialize Matomo tracking and track the initial page view
    function initializeMatomo() {
        var matomoQueue = window._paq = window._paq || [];
        matomoQueue.push(['enableLinkTracking']);
        matomoQueue.push(['setTrackerUrl', matomoPhpUrl]);
        matomoQueue.push(['setSiteId', '1']);
        matomoQueue.push(['trackPageView']);
        console.log('[Matomo] Initial page view tracked:', location.href);
    }

    // Method to track page views
    function trackPageEvent(url) {
        if (url === lastTrackedUrl) return;
        lastTrackedUrl = url;

        var matomoQueue = window._paq = window._paq || [];
        matomoQueue.push(['setCustomUrl', url]);
        matomoQueue.push(['trackPageView']);
        console.log('[Matomo] Page view tracked:', url);
    }

    // Add the Matomo script to the page and return a promise
    function addMatomoScript() {
        return new Promise(function (resolve, reject) {
            if (document.getElementById(matomoScriptId)) {
                resolve();
                return;
            }

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = matomoJsUrl;
            script.async = true;
            script.id = matomoScriptId;

            script.onload = function () {
                console.log('[Matomo] Script loaded');
                resolve();
            };

            script.onerror = function () {
                reject(new Error('[Matomo] Script failed to load'));
            };

            var firstScript = document.getElementsByTagName('script')[0];
            firstScript.parentNode.insertBefore(script, firstScript);
        });
    }

    // Listen to history and browser navigation changes
    function setupNavigationTracking() {
        var originalPushState = history.pushState;
        var originalReplaceState = history.replaceState;

        history.pushState = function () {
            var result = originalPushState.apply(this, arguments);
            trackPageEvent(location.href);
            return result;
        };

        history.replaceState = function () {
            var result = originalReplaceState.apply(this, arguments);
            trackPageEvent(location.href);
            return result;
        };

        window.addEventListener('popstate', function () {
            trackPageEvent(location.href);
        });
    }

    // Run initialization after script is loaded
    try {
        initializeMatomo();
        await addMatomoScript();
        setupNavigationTracking();
    } catch (error) {
        console.error(error);
    }
})();
