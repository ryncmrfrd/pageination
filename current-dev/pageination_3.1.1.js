/**
 
    Pageination | Simple, free, single-page websites.
    @version 3.1.0
    @author Ryan Comerford <https://ryncmrfrd.com>

*/

"use strict";

function log(

    txt = [],
    type = "log",
    spaced = false

){
    if(txt.length <= 0) return false;

    type = !/(?:log|warning|error)/.test(type) ? "log" : type;
    spaced ? (txt.unshift(` \n[${type.toUpperCase()}] Pageination.js\n`), txt.push("\n ")) : txt.unshift(`[${type.toUpperCase()}] Pageination.js |`);

    if (type === "log") return console.log(...txt);
    else if (type === "warning") return console.warn(...txt);
    else throw new Error(txt.join(' '));
};

function pageination(elementName, {

    type = "vertical",
    speed = 500,
    dots = { 
        type: "right", 
        theme: "light" 
    },
    devMode = false,
    onInit = (pageination) => {},
    onPageChange = (pageName, pageIndex) => {}

} = {}){

	function _supportsES6() {
		try{
			Function("() => {};"); return true;
		} catch(exception){
			return false;
		}
	}

	if( !_supportsES6() ) {
		alert("Insuffient support for ES6 (ECMAScript 2015). Please update your browser."); 
		return false;
	}

	let element = document.getElementById(elementName);
	
	if( !Boolean(elementName) || elementName == '' ) 			  log(["Pageination page element required. See documentation"], "error");
	if( !/(?:vertical|horizontal)/.test(type) )					  log(["Invalid pageination type. Must be a string of value vertical or horizontal"], "error");
	if( typeof speed != "number" || speed <= 0 )				  log(["Invalid speed value. Must of type number and greater than 0"], "error");
	if( typeof devMode != "boolean" )							  log(["Invalid devMode value. Must be of type boolean"], "error");
	if( typeof onInit != "function" )							  log(["Invalid onInit value. Must be of type function"], "error");
	if( typeof onPageChange != "function" )						  log(["Invalid onPageChange value. Must be of type function"], "error");
	if( typeof dots != "object" || Object.keys(dots).length < 2 ) log(["Invalid dots value. Must be of type object and contain 2 properties denoting dot type and theme"], "error");
	if( dots && !/(?:top|left|bottom|right)/.test(dots.type) )	  log(["Invalid dots.type value. Must be top, left, bottom, or right"], "error");
	if( dots && !/(?:light|dark)/.test(dots.theme) )			  log(["Invalid dots.theme value. Must  string of value light or dark"], "error");	

	Object.defineProperty(this, 	 "element",		 {value: element, writable: false}, 	 "Query selector of element wrapping all pages");
    Object.defineProperty(this, 	 "type", 		 {value: type, writable: false}, 		 "Whether pages scroll horizontally or vertically");
	Object.defineProperty(this, 	 "speed", 		 {value: speed, writable: false}, 		 "Time taken to scroll between pages (milliseconds)");
	Object.defineProperty(this, 	 "devMode", 	 {value: devMode, writable: false}, 		 "Enables developer-specific console logs");
    Object.defineProperty(this, 	 "onInit", 		 {value: onInit, writable: false}, 		 "Function called after initialisation");
    Object.defineProperty(this, 	 "onPageChange", {value: onPageChange, writable: false}, "Function called after a page change");
	Object.defineProperty(this, 	 "dots", 		 {value: {}, writable: false},			 "Contains dots.type and dots.theme");
	Object.defineProperty(this.dots, "type", 		 {value: dots.type, writable: false},	 "Rendered position of navigation dots");
	Object.defineProperty(this.dots, "theme", 		 {value: dots.theme, writable: false},	 "Colour theme of navigation dots");

	const pages = document.querySelectorAll(`${elementName} section`),
		  pageNames = Array.prototype.map.call( pages, el => { return el.id });

	const bodyElement =     document.body;

	const bodyClass =       "pageinationbody",
          wrapperClass =    "pageinationwrapper",
          pageClass =       "pageinationpage",
          dotWrapperClass = "pageinationdots",
		  dotClass =        "pageinationdot";
	
	var scrollDisabled = false;

	var activePage = 0;

	var initialPositionX =  null, 
		initialPositionY =  null;

	var windowHeight = window.innerHeight,
		windowWidth = windowWidth;

	//-------------------------------------------------------------------------------------------------------------------------------------------------

	const _initaliseCSS = () => {

		let cssElem = document.createElement("style");
		cssElem.innerText = `.pageinationbody{position:fixed;top:0;left:0;height:100vh;width:100vw;margin:0}
							.pageinationbodyvertical{margin:0;overflow-y:hidden}
							.pageinationbodyhorizontal{margin:0;overflow-x:hidden}
							.pageinationwrapper{position:fixed;top:0;left:0;height:100%;-webkit-transition:-webkit-transform ${pageNames.length}ms ease-in-out;transition:-webkit-transform ${Number(this.speed)}ms ease-in-out;-o-transition:transform ${Number(this.speed)}ms ease-in-out;transition:transform ${Number(this.speed)}ms ease-in-out;transition:transform ${Number(this.speed)}ms ease-in-out,-webkit-transform ${Number(this.speed)}ms ease-in-out}
							.pageinationwrappervertical{-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);width:100%}
							.pageinationwrapperhorizontal{-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0);display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-flow:row nowrap;flex-flow:row nowrap;width:${pageNames.length}00%}
							.pageinationpage{height:100%!important;width:100%;overflow:hidden;-webkit-box-flex:2;-ms-flex-positive:2;flex-grow:2}.pageinationdots{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;margin:15px;z-index:999}
							.pageinationdotsleft, .pageinationdotsright{width:15px;position:fixed;top:50%;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}
							.pageinationdotsright{right:0}.pageinationdotsleft{left:0}.pageinationdotsleft .pageinationdot, .pageinationdotsright .pageinationdot{margin:7.5px 0}.pageinationdotsleft .pageinationdotactive, .pageinationdotsright .pageinationdotactive{margin:5px 0!important}.pageinationdotsbottom, .pageinationdotstop{height:15px;position:fixed;left:50%;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}
							.pageinationdotstop{top:50%}
							.pageinationdotsbottom{bottom:0}
							.pageinationdotsbottom .pageinationdot, .pageinationdotstop .pageinationdot{margin:0 7.5px}
							.pageinationdotsbottom .pageinationdotactive, .pageinationdotstop .pageinationdotactive{margin:0 5px!important}
							.pageinationdotactive{opacity:1!important;cursor:default!important;height:15px!important;width:15px!important}
							.pageinationdot{${!this.autoScroll ? "cursor:pointer" : ""};height:10px;width:10px;opacity:.5;border-radius:7.5px;-webkit-transition:opacity ${Number(this.speed)}ms,height ${Number(this.speed)}ms,width ${Number(this.speed)}ms,margin ${Number(this.speed)}ms;-o-transition:opacity ${Number(this.speed)}ms,height ${Number(this.speed)}ms,width ${Number(this.speed)}ms,margin ${Number(this.speed)}ms;transition:opacity ${Number(this.speed)}ms,height ${Number(this.speed)}ms,width ${Number(this.speed)}ms,margin ${Number(this.speed)}ms}
							${!this.autoScroll ? ".pageinationdot:hover{opacity:.75}" : ""}.pageinationdotslight .pageinationdot{background:#fff}.pageinationdotsdark .pageinationdot{background:#000}`;
		bodyElement.append(cssElem);
		
		bodyElement.classList.add(`${bodyClass}${this.type}`);
		if(this.isBody) bodyElement.classList.add(`${bodyClass}`);

		this.element.classList.add(`${wrapperClass}`)
		this.element.classList.add(`${wrapperClass}${this.type}`)
		
		pages.forEach(e => e.classList.add(`${pageClass}`) );

		if( this.devMode ) log(["Initialised CSS"], "log");

		return true;
	};

	//-------------------------------------------------------------------------------------------------------------------------------------------------

	const _createNavigationDots = () => {

		let newDots = document.createElement("div");
		newDots.classList.add(`${dotWrapperClass}`);
		newDots.classList.add(`${dotWrapperClass}${this.dots.type}`, `${dotWrapperClass}${this.dots.theme}`);
		bodyElement.prepend(newDots);

		let dotsWrapper = document.querySelector(`.${dotWrapperClass}`);
	
		pageNames.forEach((e, i) => {

			let dot = document.createElement("span");
			dot.classList.add(`${dotClass}`);
			i === 0 ? dot.classList.add(`${dotClass}active`) : '';
			if( i === 0 )dot. classList.add(`${dotClass}active`);
			dot.id = e;
			dot.addEventListener("click", e => {
				e.preventDefault();
				// CHANGE TO 3.1.1 Fixed error when clicking dots to change page
				_changePage(
					pageNames.indexOf(e.target.id)
				);
			});
	
			dotsWrapper.append(dot);
		})

		if( this.devMode ) log(["Initialised navigation dots"], "log");

		return true;
	};

	//-------------------------------------------------------------------------------------------------------------------------------------------------

	const _changePage = pageIndex => {

		if(pageIndex < 0) pageIndex = 0;
        if(pageIndex > pageNames.length - 1) pageIndex = pageNames.length - 1;

        if(scrollDisabled || activePage == pageIndex) return false;

        let cacheLastActivePage = activePage;

		scrollDisabled = true;
		setTimeout(() => {
			scrollDisabled = false;
		}, 0.9 * this.speed);

		if(this.type == "horizontal"){
			this.element.style.transform = `translateX(-${ pageIndex * windowWidth}px)`;
		} else{
			this.element.style.transform = `translateY(-${ pageIndex * windowHeight}px)`;
		}

        if(this.dots){
            let dots = document.querySelector(`.${dotWrapperClass}`);
            dots.querySelector(`.${dotClass}active`).classList.remove(`${dotClass}active`);
            dots.childNodes[pageIndex].classList.add(`${dotClass}active`);
        }

        activePage = pageIndex;

		if( this.devMode ) log(["Scrolled from page", cacheLastActivePage, "to", pageIndex], "log");
        
        return this.onPageChange(pageNames[pageIndex], pageIndex);
	}

	this.nextPage = () => _changePage(activePage + 1);
    this.prevPage = () => _changePage(activePage - 1);

	//-------------------------------------------------------------------------------------------------------------------------------------------------

	const _handleScrollWheel = e => {

		let scrollDirection;

		window.scrollTo(0,0);

		if( Math.abs(e.deltaY) >= Math.abs(e.deltaX) ){
			e.deltaY >= 0 ? scrollDirection = "down" : scrollDirection = "up";
		} else{
			e.deltaX >= 0 ? scrollDirection = "right" : scrollDirection = "left";
		}

		if( this.type == "vertical" ){
			scrollDirection == "up" ? this.prevPage() :this.nextPage();
		} else{
			if( activePage == 0 ){
				setTimeout(() => document.querySelector('html, body').style['overscroll-behavior-x'] = 'initial', this.speed);
			} else{
				document.querySelector('html, body').style['overscroll-behavior-x'] = 'none';
			}
			scrollDirection == "left" ? this.prevPage() : this.nextPage();
		}

		return true;
	};

	//-------------------------------------------------------------------------------------------------------------------------------------------------

	const _handleTouchStart = e => {

		initialPositionX = e.touches[0].clientX; 
		initialPositionY = e.touches[0].clientY;

		return true;
	};

	const _handleTouchMove = e => {

		let deltaX = initialPositionX - e.touches[0].clientX, 
			deltaY = initialPositionY - e.touches[0].clientY;

		let touchDirection;

		window.scrollTo(0,0);
	
		if( Math.abs(deltaY) >= Math.abs(deltaX) ){
			deltaY >= 0 ? touchDirection = "down" : touchDirection = "up";
		} else{
			deltaX >= 0 ? touchDirection = "right" : touchDirection = "left";
		}

		if( this.type == "vertical" ){
			touchDirection == "up" ? this.prevPage() :this.nextPage();
		} else{
			if( activePage == 0 ){
				setTimeout(() => document.querySelector('html, body').style['overscroll-behavior-x'] = 'initial', this.speed);
			} else{
				document.querySelector('html, body').style['overscroll-behavior-x'] = 'none';
			}
			touchDirection == "left" ? this.prevPage() : this.nextPage();
		}

		return true;
	};

	//-------------------------------------------------------------------------------------------------------------------------------------------------

	const _handleResize = e => {

		windowHeight = window.innerHeight;
		windowWidth = windowWidth;

		if( this.type == "horizontal" ){
			this.element.style.transform = `translateX(-${ activePage * windowWidth}px)`;
		} else{
			this.element.style.transform = `translateY(-${ activePage * windowHeight}px)`;
		}

		return true;
    }

	//-------------------------------------------------------------------------------------------------------------------------------------------------

	const _addEventListeners = e => {

		window.addEventListener("wheel", 	  _handleScrollWheel);
		window.addEventListener("touchstart", _handleTouchStart);
		window.addEventListener("touchmove",  _handleTouchMove);
		window.addEventListener("resize", 	  _handleResize);

		if( this.devMode ) log(["Initialised event listeners"], "log");
	}
	
	//-------------------------------------------------------------------------------------------------------------------------------------------------

	_initaliseCSS();

	_createNavigationDots();
	
	_addEventListeners();

	if( this.devMode ) log(["Finished initialising\n", this], "log", true);

	return this.onInit(this);

};