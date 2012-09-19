/* =============================================================================
   Andres Gallo's, truStorage
   *(Allows storage of more than just strings allowing storage of strings, integers and json.)
   ========================================================================== */

truStorage = {   
	makeFormat : function(str){
		var formatted = str;
		try { formatted = JSON.parse(str);} 
		catch (e){ console.log('truStorage not passed a json object');}
		return formatted;
	},
	readLocalObj : function(str,setVal){
		if(typeof setVal === "object")setVal = JSON.stringify(setVal);
		
		var strArr = str.split('.'),
		    strArrLn = strArr.length,
			currentLevel = localStorage,//Depth level starts at localStorageRoot
			rootKey = strArr[0];
		var objCopy = {},
			isSetMode = false;
			
		if(typeof setVal !== "undefined")isSetMode = true;
			
		for(var i=0;i<strArrLn;i++){
			var key = strArr[i];

			if(typeof currentLevel === "undefined" ||
				typeof currentLevel !== "object")console.warn('cannot append key to non object');
				
			if(isSetMode && i === strArrLn -1)currentLevel[key] = setVal;	
			
			//Generate objects if needed
			if( !(typeof currentLevel === "object" && key in currentLevel) ){
				if(i !== strArrLn -1)currentLevel[key] = {};
				else currentLevel[key] = null;
			}
			
			currentLevel = this.makeFormat(currentLevel[key]);
			if(i===0)objCopy = currentLevel;
		}
		if(isSetMode)localStorage[rootKey] = JSON.stringify(objCopy);

		return currentLevel;
	},
	setItem : function(str, value){
		var fetchPath = this.readLocalObj(str,value);
		return fetchPath;
	},
	getItem : function(str){
		var fetchPath = this.readLocalObj(str);
		return fetchPath; 
	}
}