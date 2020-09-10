require([
    "esri/portal/Portal",
    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager",
    "esri/portal/PortalQueryParams"
  ], function (Portal, OAuthInfo, esriId, PortalQueryParams) {
    var personalPanelElement = document.getElementById("personalizedPanel");
    var anonPanelElement = document.getElementById("anonymousPanel");
    var userIdElement = document.getElementById("userId");

    //specify authentication information
    var info = new OAuthInfo({
      // appId is the same as client ID.  This is unique to the application.
      // The Id is registered with esri prior to development and can only be allowed to operate from a specific URL.
      appId: "tODxtel2axughbeR",
      popup: false
    });
    //send in the authentication info to verify the id with Esri
    esriId.registerOAuthInfos([info]);

    esriId
        //make sure the user is signed in.  
      .checkSignInStatus(info.portalUrl + "/sharing")
      //if so, show the items
      .then(function () {
        displayItems();
      })
      .catch(function () {
        // Otherwise hide the items section and show the sign-in button
        anonPanelElement.style.display = "block";
        personalPanelElement.style.display = "none";
      });

    document
      .getElementById("sign-in")
      //wait for the user to click the sign-in button
      .addEventListener("click", function () {
        // send the user to the OAuth Sign In page
        esriId.getCredential(info.portalUrl + "/sharing");
      });

    document
      .getElementById("sign-out")
      //wait for the user to click the sign-out button
      .addEventListener("click", function () {
        //forget the credentials and reload as if for the first time.
        esriId.destroyCredentials();
        window.location.reload();
      });

    function displayItems() {
      var portal = new Portal();
      // Setting authMode to immediate signs the user in once loaded
      portal.authMode = "immediate";
      // Once loaded, user is signed in
      portal.load().then(function () {
        // Create query parameters for the portal search
        var queryParams = new PortalQueryParams({
          query: "owner:" + portal.user.username,
          sortField: "numViews",
          sortOrder: "desc",
          //100 is the max value for num.
          num: 100
        });
        //change the text to be the username associated with the account accessed with the credentials specified in the portal object.
        userIdElement.innerHTML = portal.user.username;
        //hide the login button and welcome message
        anonPanelElement.style.display = "none";
        //show the logout button and items section
        personalPanelElement.style.display = "block";

        // Query the items based on the queryParams created from portal above
        portal.queryItems(queryParams).then(createGallery);
      });
    }

    function createGallery(items) {
        // function addTag(item){
        //     document.getElementById("test").innerHTML = 
        //     item.title
        //     //show it below the image
        //     ? '<div class="esri-title">' + (item.title || "") + "</div>"
        //     //otherwise show alternate text
        //     : '<div class="esri-title esri-null-title">Title not available</div>';
        //   }


      //populate the items section of the page
      
      
      //create a string to be appended to based on query results
      var htmlFragment = "";

      //loop through each index in the items array and call each one item
      items.results.forEach(function (item) {

        function addTag(item){
            document.getElementById("test").innerHTML = '<h1>You clicked a thing</h1>';
        }
        //make a separate string for the tags for clarity
        var tagSection = "";

        //append to the htmlFragment with html code to produce for each item.
        htmlFragment +=
          //start tag for the produced container for an item
          '<div class="esri-item-container">' +
          //if the item.thumbnailUrl is present and valid
          (item.thumbnailUrl
            //add a div with the image at the url as the background image
            ? '<div class="esri-image" style="background-image:url(' +
              item.thumbnailUrl +
              ');"></div>'
            //otherwise show alternate text
            : '<div class="esri-image esri-null-image">Thumbnail not available</div>') +
          //if the items title is present and valid
          (item.title
            //show it below the image
            ? '<div class="esri-title">' + (item.title || "") + "</div>"
            //otherwise show alternate text
            : '<div class="esri-title esri-null-title">Title not available</div>');//end of appending to htmlFragment for now

          //start the tag section with an opening div tag
          tagSection =
              '<div class="tagContainer"><div class="action"  onclick="addTag(item)">Tags: </div>';
          //for each index(which we name "tag") in the tags array(part of the item object),     
          item.tags.forEach(function(tag){
            //append a new tag to the string  
            tagSection +=
              (tag
                ? '<div class="tags">' + (tag || "") + ", </div>"
                //in case there are no tags
                : '<div class="tags">No Tags</div>'
              );
          });
          //close out the tag section div
          tagSection += '</div>';

          //add the tags to the html and close the item div
          htmlFragment += tagSection +
          "</div>";

          
      });
      //generate the code string specified in htmlFragment
      document.getElementById("itemGallery").innerHTML = htmlFragment;


    }
  });