var Observable = require("FuseJS/Observable");
var FirebaseUser = require("Firebase/Authentication/User");
var GAuth = require("Firebase/Authentication/Google");
var FirebaseDb = require("../../Database/FirebaseDb");
//---

var defaultStatusMessage = "Status OK";
var signedInStatusText = Observable(defaultStatusMessage);
var lobbyStatusText = Observable(defaultStatusMessage);

var userName = Observable("-");
var userEmail = Observable("-");
var userPhotoUrl = Observable("-");

//---

var mainPage = {title: "Lobby", handle: "lobbyPage"};

var currentPage = Observable(mainPage);

var currentPageHandle = currentPage.map(function(x) {
    return x.handle;
});

var currentPageTitle = currentPage.map(function(x) {
    return x.title;
});

function signedIn() {
    signedInStatusText.value = defaultStatusMessage;
    currentPage.value = {title: "Logged In Page", handle: "loggedInPage"};
    updateUserDetailsDb();
}

function signedOut() {
    currentPage.value = mainPage;
    updateUserDetailsDb();
}

//---

var updateUserDetailsDb = function() {
    if (FirebaseUser.isSignedIn) {
        var userMap = {
            "userName": FirebaseUser.name,
            "userEmail": FirebaseUser.email,
            "userPhotoUrl": FirebaseUser.photoUrl,
            "displayName": FirebaseUser.displayName
        };
        FirebaseDb.saveUserDetails(FirebaseUser.uid, userMap);
    } else {
        userName.value = "-";
        userEmail.value = "-";
        userPhotoUrl.value = "-";
    }
};

FirebaseUser.onError = function(errorMsg, errorCode) {
    console.log("ERROR(" + errorCode + "): " + errorMsg);
    lobbyStatusText.value = "Error: " + errorMsg;
};

FirebaseUser.signedInStateChanged = function() {
    if (FirebaseUser.isSignedIn)
        signedIn();
    else
        signedOut();
};

GAuth.onAuth = function() {
    console.log("onAuth called");
    updateUserDetailsDb();
    router.goto("mainPage");
};

//---

var reauthenticate = function() {
    FirebaseUser.reauthenticate().then(function(message) {
        console.log("reauthenticated");
    }).catch(function(e) {
        console.log("reauthentication failed:" + e);
    });
};

var signOutNow = function() {
    FirebaseUser.signOut();
};


module.exports = {
    currentPage: currentPage,
    currentPageHandle: currentPageHandle,
    currentPageTitle: currentPageTitle,
    lobbyStatusText: lobbyStatusText,

    // userEmailInput: userEmailInput,
    // userPasswordInput: userPasswordInput,
    // createUser: createUser,
    // signInWithEmail: signInWithEmail,

    signedInStatusText: signedInStatusText,
    userName: userName,
    userEmail: userEmail,
    userPhotoUrl: userPhotoUrl,
    reauthenticate: reauthenticate,
    signOutNow: signOutNow
};
