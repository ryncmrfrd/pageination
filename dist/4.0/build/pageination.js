/**
 
    Pageination | Simple, free, single-page websites.
    @version 4.0
    @author Ryan Comerford <https://ryncmrfrd.com>

*/

"use strict";

/**
 * A helper function for logging, warnings, and errors
 * TODO move & refactor for readability
 */
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

/**
 * The main Pageination object
 * @constructor
 * @param {string} elementID - The ID of the main Pageination wrapper element.
 * TODO add all other params
 */
function pageination(
	elementID,
	{
		type = "vertical",
		speed = 500,
		scrollSensitivity = 25,
		dots = {},
		devMode = false,

		onInit = (pageination) => {},
		onPageChange = (pageName, pageIndex) => {}
	}
){

	//-------------------------------------------------------------------------------------------------------------------------------------------------

	let element = document.querySelector(elementID);

	if( !Boolean(elementID) || elementID == '' ) 			  	  log(["Pageination page element required. See documentation"], "error");
	if( !/(?:vertical|horizontal)/.test(type) )					  log(["Invalid pageination type. Must be a string of value vertical or horizontal"], "error");
	if( typeof speed != "number" || speed <= 0 )				  log(["Invalid speed value. Must of type number and greater than 0"], "error");
	// validate scroll sensitivity
	if( typeof devMode != "boolean" )							  log(["Invalid devMode value. Must be of type boolean"], "error");
	if( typeof onInit != "function" )							  log(["Invalid onInit value. Must be of type function"], "error");
	if( typeof onPageChange != "function" )						  log(["Invalid onPageChange value. Must be of type function"], "error");

	if(!dots.type) type == "vertical" ? dots.type = "right" : dots.type = "bottom";
	if(!dots.theme) dots.theme = "light";
	if( typeof dots != "object" || Object.keys(dots).length < 2 ) log(["Invalid dots value. Must be of type object and contain 2 properties denoting dot type and theme"], "error");
	if( dots && !/(?:top|left|bottom|right)/.test(dots.type) )	  log(["Invalid dots.type value. Must be top, left, bottom, or right"], "error");
	if( dots && !/(?:light|dark)/.test(dots.theme) )			  log(["Invalid dots.theme value. Must  string of value light or dark"], "error");

	//-------------------------------------------------------------------------------------------------------------------------------------------------

	Object.defineProperty(this, 	 "element",		 	  {value: element, writable: false}, 	 	   "Query selector of element wrapping all pages");
    Object.defineProperty(this, 	 "type", 		 	  {value: type, writable: false}, 		 	   "Whether pages scroll horizontally or vertically");
	Object.defineProperty(this, 	 "speed", 		 	  {value: speed, writable: false}, 		 	   "Time taken to scroll between pages (milliseconds)");
	Object.defineProperty(this, 	 "scrollSensitivity", {value: scrollSensitivity, writable: false}, "Enables developer-specific console logs");
	Object.defineProperty(this, 	 "dots", 		 	  {value: {}, writable: false},				   "Contains dots.type and dots.theme");
	Object.defineProperty(this.dots, "type", 			  {value: dots.type, writable: false},		   "Rendered position of navigation dots");
	Object.defineProperty(this.dots, "theme", 		 	  {value: dots.theme, writable: false},		   "Colour theme of navigation dots");
	Object.defineProperty(this, 	 "devMode", 		  {value: devMode, writable: false}, 	   	   "Enables developer-specific console logs");
    Object.defineProperty(this, 	 "onInit", 		 	  {value: onInit, writable: false}, 		   "Function called after initialisation");
    Object.defineProperty(this, 	 "onPageChange", 	  {value: onPageChange, writable: false}, 	   "Function called after a page change");

	//-------------------------------------------------------------------------------------------------------------------------------------------------

	const pages = 	  document.querySelectorAll(`${elementID} section`),
		  pageNames = Array.prototype.map.call( pages, el => el.id);

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

	var reizeTimer 	= 		  null,
		reizeTimerThreshold = 50;

	var windowHeight = window.innerHeight,
		windowWidth =  window.innerWidth;

	//-------------------------------------------------------------------------------------------------------------------------------------------------

	const _initaliseCSS = () => {

		bodyElement.classList.add(`${bodyClass}`);
		bodyElement.classList.add(`${bodyClass}${this.type}`);

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
			if( i === 0 ) dot. classList.add(`${dotClass}active`);

			dot.id = e;

			dot.addEventListener("click", e => {

				e.preventDefault();

				_changePage( pageNames.indexOf(e.target.id) );
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

		const deltaX = 	   e.deltaX,
			  deltaY =     e.deltaY,
			  absDeltaX =  Math.abs(deltaX),
			  absDeltaY =  Math.abs(deltaY),
			  isTouchpad = !(absDeltaY === 225 || absDeltaY === 450);

		if( absDeltaX < this.scrollSensitivity && absDeltaY < this.scrollSensitivity ) return false;
			  
		let scrollAxis, scrollDirection;

		if( absDeltaX > absDeltaY && absDeltaX > this.scrollSensitivity){
			scrollAxis = "x";
			scrollDirection = deltaX > 0 ? "left" : "right";
		} else if( absDeltaY > this.scrollSensitivity ){
			scrollAxis = "y";
			scrollDirection = deltaY > 0 ? "up" : "down";
		} else return false;

		window.scrollTo(0,0);

		if( this.type == "vertical" || !isTouchpad ){
			scrollAxis == "y" && scrollDirection == "up" ?  this.nextPage() : this.prevPage();
		} else{
			if( this.type == "horizontal"){
				if( activePage == 0 ){
					setTimeout(() => document.querySelector('html, body').style['overscroll-behavior-x'] = 'initial', this.speed);
				} else{
					document.querySelector('html, body').style['overscroll-behavior-x'] = 'none';
				}
				scrollAxis == "x" && scrollDirection == "left" ?  this.nextPage() : this.prevPage();
			}
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

		const deltaX =    initialPositionX - e.touches[0].clientX,
			  deltaY =    initialPositionY - e.touches[0].clientY,
			  absDeltaX = Math.abs(deltaX),
			  absDeltaY = Math.abs(deltaY);

		if( absDeltaX < this.scrollSensitivity && absDeltaY < this.scrollSensitivity ) return false;

		let touchAxis, touchDirection;

		if( absDeltaX > absDeltaY && absDeltaX > this.scrollSensitivity){
			touchAxis = "x";
			touchDirection = deltaX > 0 ? "left" : "right";
		} else if( absDeltaY > this.scrollSensitivity ){
			touchAxis = "y";
			touchDirection = deltaY > 0 ? "up" : "down";
		} else return false;

		window.scrollTo(0,0);

		if( this.type == "vertical" ){
			touchAxis == "y" && touchDirection == "up" ?  this.nextPage() : this.prevPage();
		} else{
			if( activePage == 0 ){
				setTimeout(() => document.querySelector('html, body').style['overscroll-behavior-x'] = 'initial', this.speed);
			} else{
				document.querySelector('html, body').style['overscroll-behavior-x'] = 'none';
			}
			touchAxis == "x" && touchDirection == "left" ?  this.nextPage() : this.prevPage();
		}

		return true;
	};

	//-------------------------------------------------------------------------------------------------------------------------------------------------

	const nestedHandleResize = () => {
		windowHeight = window.innerHeight;
		windowWidth =  window.innerWidth;

		if( this.type == "horizontal" ){
			this.element.style.transform = `translateX(-${ activePage * windowWidth}px)`;
		} else{
			this.element.style.transform = `translateY(-${ activePage * windowHeight}px)`;
		}
	}

	const _handleResize = e => {
		clearTimeout(reizeTimer);
		reizeTimer = setTimeout(nestedHandleResize, reizeTimerThreshold);

		return true;
    }

	//-------------------------------------------------------------------------------------------------------------------------------------------------

	const _addEventListeners = e => {

		window.addEventListener("wheel", 	  _handleScrollWheel);
		window.addEventListener("touchstart", _handleTouchStart);
		window.addEventListener("touchmove",  _handleTouchMove);
		window.addEventListener("resize", 	  _handleResize);

		if( this.devMode ) log(["Initialised event listeners"], "log");

		return true;
	}
	
	//-------------------------------------------------------------------------------------------------------------------------------------------------

	let successfullyInitialisedCSS = _initaliseCSS();
	if( !successfullyInitialisedCSS ) log(["Error initialising custom CSS."], "error");

	let successfullyCreatedNavigationDots = _createNavigationDots();
	if( !successfullyCreatedNavigationDots ) log(["Error creating navigation dots."], "error");

	let successfullyAddedEventListeners = _addEventListeners();
	if( !successfullyAddedEventListeners ) log(["Error initialising event listenerrs."], "error");

	if( this.devMode ) log(["Finished initialising\n", this], "log", true);

	return this.onInit(this);

};