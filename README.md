Andres Gallo's Tru Storage-
============================

Local storage is one of the most useful features introduced with html5, allowing for persistent storage through the user experiences we create. With that said, its limitation to strings is something which I found to be a huge problem. The limitation to just strings was polluting local storage, so a bit more structure is good. This is the product of a saturday well spent :) Please enjoy.

Using it in javascript
----------------------

To use it simply have this script available before the code where you will be these truStorage calls. The syntax is pretty much the same as that of local Storage. In the background I am actually using localStorage after all. 
	
### Getting content ######
###### Getting it one level deep (Same as local storage will allow)
	truStorage.getItem('myKey'); 
	//This wil return the same as **localStorage.getItem('myKey')** except it can also return an **object** if that is what you stored. 

###### Getting content from a nested object
	truStorage.getItem('myKey.mySubkey.myKeyInsideSubKey'); 
	//This will go through the objects. The nested objects are separated by '.' symbol just as when one reads the value of an object in javascript.
	//The script will return null if the object has a value of null, or does not exist.
	
### Setting content ######
**Though we can store strings just like localStorage lets try storing an object**
    var ObjectToStore = {//This is a sample object 
	    mySubkey : {
		     myKeyInsideSubKey : 'some value'
	    }
    }

###### Setting it one level deep (Same as local storage will allow)
    truStorage.setItem('myKey',ObjectToStore); 
	
###### Setting it inside a nested object (Lets change the value of the inner most key to be a string)
    truStorage.setItem('myKey.mySubkey.myKeyInsideSubKey',{innerKey : 'now I am an object'}); 
	
	
**Will add support for sessionStorage sometime as well**
	
