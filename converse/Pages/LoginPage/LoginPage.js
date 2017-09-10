var Observable = require("FuseJS/Observable");
var FirebaseUser = require("Firebase/Authentication/User");
var GAuth = require("Firebase/Authentication/Google");
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
    updateUserDetailsUI();
}

function signedOut() {
    currentPage.value = mainPage;
    updateUserDetailsUI();
}

//---

var updateUserDetailsUI = function() {
    if (FirebaseUser.isSignedIn) {
        userName.value = FirebaseUser.name;
        userEmail.value = FirebaseUser.email;
        userPhotoUrl.value = FirebaseUser.photoUrl;
    } else {
        userName.value = "-";
        userEmail.value = "-";
        userPhotoUrl.value = "-";
    }
    console.log("username " + userName.value);
    console.log("username " + userEmail.value);
    console.log("username " + userPhotoUrl.value);
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

//---

// var userEmailInput = Observable("");
// var userPasswordInput = Observable("");

// var createUser = function() {
//     var email = userEmailInput.value;
//     var password = userPasswordInput.value;
//     EAuth.createWithEmailAndPassword(email, password).then(function(user) {
//         signedIn();
//     }).catch(function(e) {
//         console.log("Signup failed: " + e);
//         FirebaseUser.onError(e, -1);
//     });
// };

// var signInWithEmail = function() {
//     var email = userEmailInput.value;
//     var password = userPasswordInput.value;
//     EAuth.signInWithEmailAndPassword(email, password).then(function(user) {
//         signedIn();
//     }).catch(function(e) {
//         console.log("SignIn failed: " + e);
//         FirebaseUser.onError(e, -1);
//     });
// };

GAuth.onAuth = function() {
    console.log("onAuth called");
    updateUserDetailsUI();
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
