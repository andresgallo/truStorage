/*jslint browser: true*/
/*global console, define */
/*exported truStorage, truSessionStorage*/

/**
 * [TRUSTORAGE is a wrapper for localStorage which allows easy storage and retrieval of objects]
 * @param {LocalStorage || Object} storageType in which to store data
 * @param {[Object]} root      [Root of key within storage in which to set and get data]
 * @param {[String]} root.key  [key for storage]
 * @param {[Object || Array]} root.type [object or array in which to store data]
 */
var TRUSTORAGE = function(storageType, root){
  "use strict";

  this.storageType = storageType || localStorage;
  if(root){
    if(typeof root === "string"){ root = {key: root, type: {}}; }
    this.storageType[root.key] = this.storageType[root.key] || JSON.stringify(root.type);
  }
  this.prefix = root ? (root.key+".") : "";

  function _makeFormat(str){
    var formatted = str;
    try {
      if( !(str instanceof Array) ){formatted = JSON.parse(str);}
    }
    catch (e){ /*console.log('truStorage not passed a json object');*/}
    return formatted;
  }

  function _readLocalObj(str,setVal,modifier){
    /*jshint validthis:true */
    str = str || "";
    if(this.prefix.length){
      str = this.prefix+str;
    }
     
    if(typeof setVal === "object"){setVal = JSON.stringify(setVal);}
    if(typeof modifier === "undefined"){modifier = false;}

    var strArr = str.split('.'),
      strArrLn = strArr.length,
      currentLevel = this.storageType,//Depth level starts at storageTypeRoot
      rootKey = strArr[0];

    var objCopy = {},
      isSetMode = false;

    if(typeof setVal !== "undefined"){isSetMode = true;}

    for(var i=0;i<strArrLn;i++){
      var key = strArr[i];

      if(typeof currentLevel === "undefined" ||
        typeof currentLevel !== "object"){
        console.warn('cannot append key to non object');
        return null;
      }

      if(isSetMode && i === strArrLn -1){
        if(modifier){
          var r = _makeFormat(currentLevel[key]);
          r[modifier].apply(r,JSON.parse(setVal));
          setVal = r;
        }
        currentLevel[key] = setVal;
      }

      //Generate objects if needed
      if( isSetMode && !(typeof currentLevel === "object" && key in currentLevel) ){
        if(i !== strArrLn -1){currentLevel[key] = i ? {} : '{}';}
        else {return null;}
      }
      currentLevel = _makeFormat(currentLevel[key]);
      if(i===0){objCopy = currentLevel;}
    }
    if(isSetMode){storageType[rootKey] = JSON.stringify(objCopy);}
    return currentLevel;
  }

  this.setDefault= function(str, value) {
    if (this.getItem(str) == undefined) {
      this.setItem(str, value)
    }
  };

  this.setItem= function(str, value, modifier){
    var fetchPath = _readLocalObj.call(this,str,value,modifier);
    return fetchPath;
  };
  this.getItem= function (str){
    if(!str && !this.prefix.length){
      return storageType;
    }else if(this.prefix && !str){
      return _makeFormat(storageType[this.prefix.replace('.','')]);
    }else {
      return _readLocalObj.call(this,str);
    }
  };
  this.clear= function(){
    if(storageType instanceof Storage){
      storageType.clear();
    }else {
      storageType = {};
    }  
  };
  this.removeItem= function(str){
    if(storageType instanceof Storage){
      storageType.removeItem(str.split('.')[0]);
    }else {
      delete storageType[str.split('.')[0]];
    }
  };
};

var truStorage = new TRUSTORAGE((function(){
  "use strict";
  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
    return localStorage;
  } catch(e) {
    return {};
  }
})());
var truSessionStorage = new TRUSTORAGE((function(){
  "use strict";
  try {
    sessionStorage.setItem("test", "test");
    sessionStorage.removeItem("test");
    return sessionStorage;
  } catch(e) {
    return {};
  }
})());

if ( typeof define === "function" && define.amd ) {
  define( "truStorage", [], function() {
    "use strict";
    return TRUSTORAGE;
  });
}



