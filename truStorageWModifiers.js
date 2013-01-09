truStorage = {   
	makeFormat : function(str){
		var formatted = str;
		try { formatted = JSON.parse(str);} 
		catch (e){ console.log('truStorage not passed a json object');}
		return formatted;
	},
	readLocalObj : function(str,setVal,modifier){
		if(typeof setVal === "object")setVal = JSON.stringify(setVal);
        if(typeof modifier === "undefined")modifier = false;

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
				typeof currentLevel !== "object"){
				console.warn('cannot append key to non object');
				return false;
			}
            
            
			if(isSetMode && i === strArrLn -1){
                 if(modifier){
                    var r = this.makeFormat(currentLevel[key]);
                    r[modifier].apply(r,JSON.parse(setVal));
					setVal = r;
                 }currentLevel[key] = setVal;	
            }

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
	setItem : function(str, value, modifier){
		var fetchPath = this.readLocalObj(str,value,modifier);
		return fetchPath;
	},
	getItem : function(str){
		var fetchPath = this.readLocalObj(str);
		return fetchPath; 
	}
}