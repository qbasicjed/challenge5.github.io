
require([
      "esri/portal/Portal",
      "esri/identity/OAuthInfo",
      "esri/identity/IdentityManager",
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/MapImageLayer",
      "dojo/dom-style",
      "dojo/dom-attr",
      "dojo/on",
      "dojo/dom"
    ], function(
        Portal, OAuthInfo, identityManager, Map, MapView, MapImageLayer,
        domStyle, domAttr, on, dom) {

            //specify portal
            var portalUrl = "https://www.arcgis.com/sharing";

            //specify authorization information for a redirect
            var info = new OAuthInfo({
                appId: "tODxtel2axughbeR", //a.k.a. clientID
                popup: false
              });
        
            //lookup later//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            identityManager.registerOAuthInfos([info]);

            // send users to arcgis.com to login
            on(dom.byId("sign-in"), "click", function() {
                identityManager.getCredential(portalUrl);
            });

            // log out and reload
            on(dom.byId("sign-out"), "click", function() {
                identityManager.destroyCredentials();
                window.location.reload();
            });

            identityManager.checkSignInStatus(portalUrl).then(function() {
                dom.byId('anonymousPanel').style.display = 'none';
                dom.byId('personalizedPanel').style.display = 'block'
            });
        }
            
)
