/**
 
    Pageination | Simple, free, single-page websites.
    @version 3.0.0
    @author Ryan Comerford <https://ryncmrfrd.com>

*/

"use strict";

//pageination constructor - initializes the page and returns all paramaters
function pageination(element = () => { throw new Error(`Pageination | ${txt}`) }, {

    type = "vertical", //direction of scrolling
    speed = 1000, //time (ms) it takes to scroll between pages
    dots, //navigation dots object --> { type, theme }
    autoScroll = false, //toggle automatically cycling through pages (disables all other listeners)
    isBody = true, //toggles changes in overflow behaviour on body
    devMode = false, //toggles console logs on event calls
    onInit = () => {}, //event called on finishing initalizing page. returns pageination object (this)
    onPageChange = () => {} //event called after every page change. returns the new page name and index

} = {}){

    /*
        CONSOLE LOG
    */

    const devLog = (txt, spaced = false) => {
        if(spaced){
            txt.unshift(" \nPageination.js\n");
            txt.push("\n ")
        } else txt.unshift("Pageination.js |");

        console.log(...txt)
    }

    /*
        CACHE ELEMENTS + UNIVERSAL VARS
    */

    var bodyElementCache =      document.body;
    const bodyClassName =       "pageinationbody",
          wrapperClassName =    "pageinationwrapper",
          pageClassName =       "pageinationpage",
          dotWrapperClassName = "pageinationdots",
          dotClassName =        "pageinationdot";

    /*
        CONSTRUCTOR VALUES
        -- for variable definitions see above --
        -- Object.defineProperty used here to make variables read-only --
    */ 

    let activePage = 0; //the index of the currently "active" page in this.pageNames

        ( !/(?:vertical|horizontal)/.test(type) ) ? type = "vertical" : ""; //defaults type value to vertical
    Object.defineProperty(this, 'type', {value: type, writable: false});
    Object.defineProperty(this, 'speed', {value: +speed||1000, writable: false});

        ( dots && !/(?:top|left|bottom|right)/.test(dots.type) ) ? dots.type = "right" : ""; //defaults dots type to right
        ( dots && !/(?:light|dark)/.test(dots.theme) ) ? dots.theme = "light" : ""; //defaults dots theme to light
    Object.defineProperty(this, 'dots', {value: dots||undefined, writable: false});

    Object.defineProperty(this, 'autoScroll', {value: autoScroll, writable: false});
    Object.defineProperty(this, 'isBody', {value: isBody||true, writable: false});
    Object.defineProperty(this, 'devMode', {value: devMode||false, writable: false});
    Object.defineProperty(this, 'element', {value: document.querySelector(element), writable: false});
    Object.defineProperty(this, 'pages', {value: document.querySelectorAll(`${element} section`), writable: false});
        
    var pageNames = []; this.pages.forEach((e, i) => pageNames.push(e.id || i)); //gets all page names from their ids
    Object.defineProperty(this, 'pageNames', {value: pageNames, writable: false});
    
    Object.defineProperty(this, 'onInit', {value: onInit, writable: false});
    Object.defineProperty(this, 'onPageChange', {value: onPageChange, writable: false});


    /* 
        CSS
    */

    //add pageination style element to dom
    var cssElement = document.createElement("style");
    cssElement.innerText = `.pageinationbody{height:100vh;width:100vw;margin:0}.pageinationbodyvertical{margin:0;overflow-y:hidden}.pageinationbodyhorizontal{margin:0;overflow-x:hidden}.pageinationwrapper{height:100%;-webkit-transition:-webkit-transform ${this.pageNames.length}ms ease-in-out;transition:-webkit-transform ${Number(this.speed / 2)}ms ease-in-out;-o-transition:transform ${Number(this.speed / 2)}ms ease-in-out;transition:transform ${Number(this.speed / 2)}ms ease-in-out;transition:transform ${Number(this.speed / 2)}ms ease-in-out,-webkit-transform ${Number(this.speed / 2)}ms ease-in-out}.pageinationwrappervertical{-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);width:100%}.pageinationwrapperhorizontal{-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0);display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-flow:row nowrap;flex-flow:row nowrap;width:${this.pageNames.length}00%}.pageinationpage{height:100%!important;width:100%;overflow:hidden;-webkit-box-flex:2;-ms-flex-positive:2;flex-grow:2}.pageinationdots{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;margin:15px;z-index:999}.pageinationdotsleft, .pageinationdotsright{width:15px;position:fixed;top:50%;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.pageinationdotsright{right:0}.pageinationdotsleft{left:0}.pageinationdotsleft .pageinationdot, .pageinationdotsright .pageinationdot{margin:7.5px 0}.pageinationdotsleft .pageinationdotactive, .pageinationdotsright .pageinationdotactive{margin:5px 0!important}.pageinationdotsbottom, .pageinationdotstop{height:15px;position:fixed;left:50%;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.pageinationdotstop{top:50%}.pageinationdotsbottom{bottom:0}.pageinationdotsbottom .pageinationdot, .pageinationdotstop .pageinationdot{margin:0 7.5px}.pageinationdotsbottom .pageinationdotactive, .pageinationdotstop .pageinationdotactive{margin:0 5px!important}.pageinationdotactive{opacity:1!important;cursor:default!important;height:15px!important;width:15px!important}.pageinationdot{${!this.autoScroll ? "cursor:pointer" : ""};height:10px;width:10px;opacity:.5;border-radius:7.5px;-webkit-transition:opacity ${Number(this.speed / 2)}ms,height ${Number(this.speed / 2)}ms,width ${Number(this.speed / 2)}ms,margin ${Number(this.speed / 2)}ms;-o-transition:opacity ${Number(this.speed / 2)}ms,height ${Number(this.speed / 2)}ms,width ${Number(this.speed / 2)}ms,margin ${Number(this.speed / 2)}ms;transition:opacity ${Number(this.speed / 2)}ms,height ${Number(this.speed / 2)}ms,width ${Number(this.speed / 2)}ms,margin ${Number(this.speed / 2)}ms}${!this.autoScroll ? ".pageinationdot:hover{opacity:.75}" : ""}.pageinationdotslight .pageinationdot{background:#fff}.pageinationdotsdark .pageinationdot{background:#000}`;
    bodyElementCache.append(cssElement);

    //add class/es to body
    bodyElementCache.classList.add(`${bodyClassName}${this.type}`);
    if(this.isBody) bodyElementCache.classList.add(`${bodyClassName}`);

    //add classes to wrapper element
    this.element.classList.add(`${wrapperClassName}`)
    this.element.classList.add(`${wrapperClassName}${this.type}`)

    // add classes to each page
    this.pages.forEach(e => e.classList.add(`${pageClassName}`) );

    /* 
        CREATE DOTS
    */

    if(this.dots){

        //create new dots wrapper element
        var newDots = document.createElement("div");
            newDots.classList.add(`${dotWrapperClassName}`);

        // if not provided, make use of default dots positions
        !this.dots.position ? 
            ( this.type == "horizontal" ? newDots.classList.add(`${dotWrapperClassName}bottom`) : newDots.classList.add(`${dotWrapperClassName}right`) ) :
            newDots.classList.add(`${dotWrapperClassName}${this.dots.position}`);

        //add theme class to new element
        newDots.classList.add(`${dotWrapperClassName}${this.dots.theme}`);
        
        //add element to dom
        bodyElementCache.prepend(newDots);

        var dotsWrapper = document.querySelector(`.${dotWrapperClassName}`);

        //create a new dot element for each page
        this.pageNames.forEach(e => {
            var dot = document.createElement("span");
                dot.classList.add(`${dotClassName}`);
                dot.id = e;

            //allow clicking on it to go to its respective page (unless autoscrolling)
            if(!this.autoScroll){
                dot.addEventListener("click", e => {
                    this.changePage(e.target.id);
                });
            }

            dotsWrapper.append(dot);
        })

        //add active class to initial dot
        document.querySelector(`.${dotWrapperClassName}`).childNodes[0].classList.add(`${dotClassName}active`);
    }

    if(!this.autoScroll){ // <-- autoScrolling disables all event handlers (touch AND scroll)

        /* 
            DETECTING SCROLLING
        */
 
        //listen for scrolling on wrapper elememt
        const handlWheel = e => {
            e.preventDefault();
            var scrollDirection;

            //calculate scroll directon from x,y deltas
            Math.abs(e.deltaY) >= Math.abs(e.deltaX) ?
                e.deltaY >= 0 ? scrollDirection = "down" : scrollDirection = "up" :
                e.deltaX >= 0 ? scrollDirection = "right" : scrollDirection = "left";
            
            //call changepage based on scroll direction
            this.type == "horizontal" ?
                scrollDirection == "left" ? this.prevPage() : this.nextPage() :
                scrollDirection == "up" ? this.prevPage() : this.nextPage();

            //change overscroll behavior based on activepage number
            if(this.type == "horizontal" && activePage == 0) {
                setTimeout(() => {
                    document.querySelector('html').style['overscroll-behavior-x'] = 'initial';
                    document.querySelector('body').style['overscroll-behavior-x'] = 'initial';
                }, this.speed); 
            } else if(this.type == "horizontal") { 
                document.querySelector('html').style['overscroll-behavior-x'] = 'none';
                document.querySelector('body').style['overscroll-behavior-x'] = 'none';
            }

            if(window.scrollY != 0 || window.scrollX != 0){
                window.scrollTo(0,0);
            }
        };
        this.element.addEventListener("wheel", handlWheel)

        /*
            DETECTING TOUCH
        */

        var initialPositionX = null,
            initialPositionY = null;

        // get and store initial touch positions
        this.element.addEventListener("touchstart", e => { e.preventDefault(); initialPositionX = e.touches[0].clientX; initialPositionY = e.touches[0].clientY });

        this.element.addEventListener("touchmove", e => {
            e.preventDefault();

            if(initialPositionX == null || initialPositionY == null) return;

            var deltaX = initialPositionX - e.touches[0].clientX, 
                deltaY = initialPositionY - e.touches[0].clientY;

            var touchDirection;
            Math.abs(deltaY) >= Math.abs(deltaX) ?
                deltaY >= 0 ? touchDirection = "down" : touchDirection = "up" :
                deltaX >= 0 ? touchDirection = "right" : touchDirection = "left";

            this.type == "horizontal" ?
                touchDirection == "left" ? this.prevPage() : this.nextPage() :
                touchDirection == "up" ? this.prevPage() : this.nextPage();

            if(this.type == "horizontal" && activePage == 0) {
                setTimeout(() => {
                    document.querySelector('html').style['overscroll-behavior-x'] = 'initial';
                    document.querySelector('body').style['overscroll-behavior-x'] = 'initial';
                }, this.speed); 
            } else if(this.type == "horizontal") { 
                document.querySelector('html').style['overscroll-behavior-x'] = 'none';
                document.querySelector('body').style['overscroll-behavior-x'] = 'none';
            }
        
            initialPositionX = null;
            initialPositionY = null;

            if(window.scrollY != 0 || window.scrollX != 0){
                window.scrollTo(0,0);
            }
        });
    } else{

        function _autoScroll(_this) {
            setInterval(function () {
                if(activePage == _this.pageNames.length - 1) _this.changePage(0);
                else _this.nextPage();
            }, _this.speed * 2.5);
        }
        _autoScroll(this);
    }
       
    /* 
        DETECTING RESIZE
    */

    // force page rerender on resize

    const handleResize = e => {
        this.type == "horizontal" ? 
            this.element.style.transform = `translateX(-${ activePage * window.innerWidth}px)` :
            this.element.style.transform = `translateY(-${ activePage * window.innerHeight}px)`;
    }

    window.addEventListener("resize", handleResize);

    /* 
        CHANGING PAGE
    */

    // define a function to change active pages
    const changePage = (page, checkPage = true) => {
        const cacheLastActivePage = activePage;

        if(!this.autoScroll && this.scrollDisabled) return false;

        var pageIndex = typeof page == "number" ? page : this.pageNames.indexOf(page);
        if(pageIndex < 0) pageIndex = 0;
        if(pageIndex > this.pageNames.length - 1) pageIndex = this.pageNames.length - 1;

        if(checkPage && activePage == pageIndex) return false;

        this.type == "horizontal" ? 
            this.element.style.transform = `translateX(-${ pageIndex * window.innerWidth}px)` :
            this.element.style.transform = `translateY(-${ pageIndex * window.innerHeight}px)`;

        if(this.dots){
            var dots = document.querySelector(`.${dotWrapperClassName}`);
            dots.querySelector(`.${dotClassName}active`).classList.remove(`${dotClassName}active`);
            dots.childNodes[pageIndex].classList.add(`${dotClassName}active`);
        }

        this.scrollDisabled = true;
        setTimeout(() => this.scrollDisabled = false, (this.speed - (this.speed * .1)))

        activePage = pageIndex;

        this.devMode && checkPage ? devLog([`Scrolled from page`, cacheLastActivePage, `to`, pageIndex]) : "";

        window.scrollTo(0,0)
        
        return this.onPageChange(this.pageNames[pageIndex], pageIndex);
    }
    Object.defineProperty(this, 'changePage', {value: changePage, writable: false});

    // give quicker options for next/previous page calls
    this.nextPage = () => (this.changePage(activePage + 1));
    this.prevPage = () => (this.changePage(activePage - 1));

    this.devMode ? devLog(["Initialised as object:",this],true) : "";
    return this.onInit(this);
}