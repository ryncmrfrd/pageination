/**
 
    Run before other scripts to detect broswer support for ECMAScript 2015 (ES6).
    @version 0.0.1
    @author Ryan Comerford <https://ryncmrfrd.com>

*/

"use strict";

function _supportsES6() {
	try{
		new Function("() => {};");
	} catch(ex){
		return false;
	}

    return true;
}

const ES6Support = _supportsES6();

if( !ES6Support ) {
	let errorText = "[WARNING] Insuffient support for ES6 (ECMAScript 2015). Please update your browser.";
	console.warn(errorText);
	alert("Insuffient javascript support.  Please update your browser.")
}
