// Holds all auth-related stuff

var clientId = '579680979169';
var apiKey = 'AIzaSyBv8IbfM6RNw0OTDawbL9w5PhjEMQt5RiU';
var scopes = 'https://www.googleapis.com/auth/calendar.readonly';


function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth,1);
    checkAuth();
}

function checkAuth() {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true},
        handleAuthResult);
}

function handleAuthResult(authResult) {

    if (authResult) {

        userWasAuthorized();

    } else {
      /*
        authorizeButton.style.visibility = '';
        authorizeButton.onclick = handleAuthClick;
        */
    }
}

function handleAuthClick() {
  if (DEBUG_MODE){
    handleAuthResult(true);
  }

    gapi.auth.authorize(
        {client_id: clientId, scope: scopes, immediate: false},
        handleAuthResult);
    return false;
}
