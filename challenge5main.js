
require([
      "esri/portal/Portal",
      "esri/portal/PortalQueryParams",
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
        Portal, PortalQueryParams, OAuthInfo, identityManager, Map, MapView, MapImageLayer,
        domStyle, domAttr, on, dom) {

            //specify portal
            var portalUrl = "https://www.arcgis.com/sharing";

            //specify authorization information for a redirect
            var info = new OAuthInfo({
                appId: "tODxtel2axughbeR", //a.k.a. clientID
                popup: false
              });
        
            //send the appID and popup state to be registered.
            identityManager.registerOAuthInfos([info]);
            //^-- another source used esriId instead of identityManager

            // in the event that #sign-in is clicked
            on(dom.byId("sign-in"), "click", function() {
                //get the credentials from the portal
                //This sends the user to the ArcGIS website to sign in.
                identityManager.getCredential(portalUrl);
                
            });

            // in the event that #sign-out is clicked
            on(dom.byId("sign-out"), "click", function() {
                //forget the credentials
                identityManager.destroyCredentials();
                //reload the window;
                window.location.reload();
            });

            //CheckSignInStatus returns Promise<Credential> or error callback, 
            //depending on if the user has signed in or not.
            //If it returns a credential, the function is run to cease displaying "sign=in" text
            //and start showing "sign-out" text along with the items.
            identityManager.checkSignInStatus(portalUrl).then(function() {
                //login/logout 
                dom.byId('anonymousPanel').style.display = 'none';
                dom.byId('personalizedPanel').style.display = 'block';
                dom.byId('userId').innerHTML = credential.userId;
                //change the heading from "no items found"  
                dom.byId('itemsList').element.textContent = 'Here are your items';
                //content
                dom.byId('itemsList').style.display = 'flex';

                var portal = new Portal();
// Setting authMode to immediate signs the user in once loaded
portal.authMode = "immediate";
// Once loaded, user is signed in
portal.load().then(function() {
  // Create query parameters for the portal search
  var queryParams = new PortalQueryParams({
    query: "owner:" + portal.user.username,
    sortField: "type",
    num: 100
  });

  // Query the items based on the queryParams created from portal above
  portal.queryItems(queryParams).then(createGallery);
});
            });
        }
            
)
