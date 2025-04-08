(function () {
    var matomoInstance = "hansevision.matomo.cloud";
    var matomoBaseUrl = "https://" + matomoInstance + "/";
    var matomoPhpUrl = matomoBaseUrl + "matomo.php";
    var matomoJsUrl = "https://cdn.matomo.cloud/" + matomoInstance + "/matomo.js";
    var matomoScriptId = "matomo-script";

    // Initialize Matomo tracking
    function initializeMatomo() {
        var matomoQueue = window._paq = window._paq || [];
        matomoQueue.push(['trackPageView']);
        matomoQueue.push(['enableLinkTracking']);
        matomoQueue.push(['setTrackerUrl', matomoPhpUrl]);
        matomoQueue.push(['setSiteId', '1']);
    }

    // Method to track page events
    function trackPageEvent(pageUrl) {
        var matomoQueue = window._paq = window._paq || [];
        matomoQueue.push(['setCustomUrl', pageUrl]);
        matomoQueue.push(['trackPageView']);
    }

    // Add the Matomo script to the page
    function addMatomoScript() {
        // Check if the script is already added
        if (document.getElementById(matomoScriptId)) {
            return;
        }

        var documentObject = document;
        var scriptElement = documentObject.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.src = matomoJsUrl;
        scriptElement.async = true;
        scriptElement.id = matomoScriptId;

        // Append the script just before the first script tag
        var firstScript = documentObject.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(scriptElement, firstScript);
    }

    // Listener for popstate event to track page changes
    function setupPopstateListener() {
        window.addEventListener('popstate', function (event) {
            var currentUrl = window.location.href;
            trackPageEvent(currentUrl);
        });
    }

    // Initialize Matomo, add the script, and set up the listener
    initializeMatomo();
    addMatomoScript();
    setupPopstateListener();
})();