
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

            // in the event that #sign-in is clicked
            on(dom.byId("sign-in"), "click", function() {
                //get the credentials from the portal
                //This sends the user to the ArcGIS website to sign in.
                identityManager.getCredential(portalUrl);
                var userIdjs = document.getElementById('userId');
                userIdjs.text = getUserInfo(identityManager.getCredential());
            });

            // in the event that #sign-out is clicked
            on(dom.byId("sign-out"), "click", function() {
                //forget the credentials
                identityManager.destroyCredentials();
                //reload the window
                window.location.reload();
            });

            identityManager.checkSignInStatus(portalUrl).then(function() {
                dom.byId('anonymousPanel').style.display = 'none';
                dom.byId('personalizedPanel').style.display = 'block'
            });
        }
            
)
