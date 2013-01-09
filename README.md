Andres Gallo's Tru Storage-New script version supporting Modifiers
==================================================================

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

Using version WITH MODIFIERS (supports modifiers for arrays such as push, shift, unshift...)
--------------------------------------------------------------------------------------------

I have kept the version with modifiers as a separate script.  Only one of the two scripts is needed. The modifiers version is only about 3 lines or so larger.  I have kept the original available just in case. To use the modifiers the rules above still apply. The only difference is the third parameter is the modifier.  If a modifier is specifier then the second parameter, becomes the array to pass to the modifier instead. 

### Lets setup an array to show how the native js modifiers can be used ######
	truStorage.setItem('a',{});
	truStorage.setItem('a.b',[1,2,3]);//Now we have set {a : {b: [1,2,3]}}

	//Lets use native javascript modifiers to add data to that nested array. We will use Array.push method
	truStorage.setItem('a.b',[4,5,6],'push');//Now we have set {a : {b: [1,2,3,4,5,6]}} if we look at the entire object

**Think of this as myArrayVariable.push([4,5,6])  **
**All methods/modifiers in native javacript can be used (shift,pop, unshift,push,substr....)  **



