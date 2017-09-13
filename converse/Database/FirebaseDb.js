var Observable = require('FuseJS/Observable');
var FirebaseDatabase =require("Firebase/Database");

var usersPath = "Users/";

//Add the value json from javascript to the path supplied in , in a List
var saveMapDetailsToPathInList = function(path, valueObjectMap){
	console.log(" Adding to db " + path + JSON.stringify(valueObjectMap));
	FirebaseDatabase.push(path, valueObjectMap);
};

var saveUserDetails = function(uid, valueObjectMap){
	console.log("adding user to platform users");
	FirebaseDatabase.save(usersPath + uid, valueObjectMap);
};

module.exports = {
	saveUserDetails: saveUserDetails
	// saveMapDetailsToPathInList: saveMapDetailsToPathInList
};
