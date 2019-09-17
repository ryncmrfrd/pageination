/**
 
    Pageination | Simple, free, single-page websites.
    @version 2.0.0
    @author Ryan Comerford <https://ryncmrfrd.com>

*/

"use strict";

const pageination = function (pageinationWrapperID, {

    //misc config arguments
    scrollSpeed = 1000,
    isDevMode = false,
    dots = { dotPosition: "left", dotTheme: "light" },

    //inbuilt event listener functions
    onInit = function () { },
    onPageChange = function () { }

} = {
    "scrollSpeed": 1000,
    "isDevMode": false,
    "dots": { "dotPosition": "left", "dotTheme": "light" },
    "onInit": function () { },
    "onPageChange": function () { }
}){

    /*
        Error handling for arguments
    */

    if (!pageinationWrapperID) throw new Error("Pageination | REQUIRED VARIABLE | ID of pageination wrapper element must be provided.")
    if (typeof pageinationWrapperID != "string") throw new Error("Pageination | VARIABLE TYPE | pageinationWrapperID must be of type 'string'.")

    if (typeof scrollSpeed != "number") throw new Error("Pageination | VARIABLE TYPE | scrollSpeed must be of type 'number'.")
    if (scrollSpeed > 10000) console.warning("Pageination | Painfully slow scroll speed detected.")
    if (scrollSpeed < 0) throw new Error("Pageination | VARIABLE ERROR | scrollSpeed must be greater than 0.")

    if (isDevMode != false && typeof isDevMode != "boolean") throw new Error("Pageination | VARIABLE TYPE | isDevMode must be of type boolean.")

    if (typeof dots != "object") throw new Error("Pageination | VARIABLE TYPE | dots must be of type 'object'.")
    if (typeof dots.dotPosition != "string") throw new Error("Pageination | VARIABLE TYPE | dots.dotPosition must be of type 'string'.")
    if (typeof dots.dotTheme != "string") throw new Error("Pageination | VARIABLE TYPE | dots.dotTheme must be of type 'string'.")
    if (!/(?:top|left|bottom|right)/.test(dots.dotPosition)) throw new Error("Pageination | VARIABLE TYPE | dots.dotPosition must be either 'top', 'left', 'bottom', or 'right'.")
    if (!/(?:dark|light)/.test(dots.dotTheme)) throw new Error("Pageination | VARIABLE TYPE | dots.dotTheme must be either 'dark' or 'light'.")

    if (typeof onInit != "function") throw new Error("Pageination | VARIABLE TYPE | onInit must be of type 'function'.")
    if (typeof onPageChange != "function") throw new Error("Pageination | VARIABLE TYPE | onPageChange must be of type 'function'.")

    /*
        Get other variables for init fn
    */

    var pageWrapper = document.querySelector(`#${pageinationWrapperID}`),
        pageObjects = pageWrapper.querySelectorAll("section"),
        pageNames = [];
    pageObjects.forEach(e => pageNames.push(e.classList[0]))

    /*
        Log found variables if "isDevMode" is true (default = false)
    */

    if (isDevMode) {
        console.log(
            '%c Pageination | Dev Mode Enabled', 'color:red; font-size:35px; font-weight: bold; -webkit-text-stroke: 1px black;',
            '\n\nPage Wrapper DOMObject: ', pageWrapper,
            '\nPage Names', {
            'Strings': pageNames,
            'DOMObjects': pageObjects
        },
            '\nSettings', {
            'scrollSpeed': scrollSpeed,
            'isDevMode': isDevMode
        }
        )
    }

    /*
        Run the internal init function. Keeps this fn short and sweet.
    */

    return _pageination.api.init({
        scrollSpeed: scrollSpeed,
        isDevMode: isDevMode,
        pageWrapper: pageWrapper,
        pageObjects: pageObjects,
        pageNames: pageNames,
        dots: dots,
        onPageChange: onPageChange,
        onInit: onInit
    });

}

const _pageination = {

    /* 
        Stores all global variables
        Generally defined by _pageination.api.init()
    */

    vars: {

        //misc developer variables
        activePage: "",
        scrollLocked: false,
        pageWrapper: document.body,
        random: "",

        //set by init function
        pageNames: [],
        scrollSpeed: 1000,
        isDevMode: false,
        dots: {
            dotPosition: "left",
            dotTheme: "light"
        },

        //event listener functions
        onInit: function () { },
        onPageChange: function () { }

    },

    /* 
        Reusable code ran by internal functions
    */

    api: {

        /* 
            Sets the main variables and html styles
        */

        init: function ({
            scrollSpeed,
            isDevMode,
            pageWrapper,
            pageObjects,
            pageNames,
            dots,
            onPageChange,
            onInit
        }) {

            /*
                set global variables
            */

            _pageination.vars.pageWrapper = pageWrapper;
            _pageination.vars.pageNames = pageNames;
            _pageination.vars.scrollSpeed = scrollSpeed;
            _pageination.vars.isDevMode = isDevMode;
            _pageination.vars.dots = dots;
            _pageination.vars.onPageChange = onPageChange;
            _pageination.vars.onInit = onInit;

            /*
                set css and classes for pageination-related elements
            */

            //ensures that styles are only used to pageination to avoid messing with other page styles
            const generateHex = function () { return Math.floor(Math.random() * 16777215).toString(16); };
            var randomHex = generateHex();
            _pageination.vars.random = randomHex;

            //append pageination styles to document
            var pageinationStyle = document.createElement("style");
            pageinationStyle.innerText = `._${randomHex}_pageination-documentBody{overflow:hidden;margin:0;padding:0}._${randomHex}_pageination-pageWrapper{white-space:nowrap;transition:transform ${_pageination.vars.scrollSpeed}ms ease;margin:0;padding:0}._${randomHex}_pageination-page{overflow:hidden;margin:0;padding:0;}._${randomHex}_pageination-dotWrapper-top_dark ._${randomHex}_pageination-dot,._${randomHex}_pageination-dotWrapper-left_dark ._${randomHex}_pageination-dot,._${randomHex}_pageination-dotWrapper-bottom_dark ._${randomHex}_pageination-dot,._${randomHex}_pageination-dotWrapper-right_dark ._${randomHex}_pageination-dot{background-color:#000}._${randomHex}_pageination-dotWrapper-top_light ._${randomHex}_pageination-dot,._${randomHex}_pageination-dotWrapper-left_light ._${randomHex}_pageination-dot,._${randomHex}_pageination-dotWrapper-bottom_light ._${randomHex}_pageination-dot,._${randomHex}_pageination-dotWrapper-right_light ._${randomHex}_pageination-dot{background-color:#fff}._${randomHex}_pageination-dotWrapper-top_dark,._${randomHex}_pageination-dotWrapper-top_light{height:15px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;z-index:999;position:absolute;left:50%;top:1%;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}._${randomHex}_pageination-dotWrapper-left_dark,._${randomHex}_pageination-dotWrapper-left_light{width:15px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;z-index:999;position:absolute;left:1%;top:50%;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}._${randomHex}_pageination-dotWrapper-bottom_dark,._${randomHex}_pageination-dotWrapper-bottom_light{height:15px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;z-index:999;position:absolute;left:50%;bottom:1%;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}._${randomHex}_pageination-dotWrapper-right_dark,._${randomHex}_pageination-dotWrapper-right_light{width:15px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;z-index:999;position:absolute;right:1%;top:50%;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}._${randomHex}_pageination-dot{cursor:pointer;opacity:.5;transition:opacity ${Number(_pageination.vars.scrollSpeed / 2)}ms,height ${Number(_pageination.vars.scrollSpeed / 2)}ms,width ${Number(_pageination.vars.scrollSpeed / 2)}ms,margin ${Number(_pageination.vars.scrollSpeed / 2)}ms;height:10px;width:10px;border-radius:50%}._${randomHex}_pageination-dotWrapper-top_dark ._${randomHex}_pageination-dot,._${randomHex}_pageination-dotWrapper-top_light ._${randomHex}_pageination-dot{margin:0 7.5px}._${randomHex}_pageination-dotWrapper-left_dark ._${randomHex}_pageination-dot,._${randomHex}_pageination-dotWrapper-left_light ._${randomHex}_pageination-dot{margin:7.5px 0}._${randomHex}_pageination-dotWrapper-bottom_dark ._${randomHex}_pageination-dot,._${randomHex}_pageination-dotWrapper-bottom_light ._${randomHex}_pageination-dot{margin:0 7.5px}._${randomHex}_pageination-dotWrapper-right_dark ._${randomHex}_pageination-dot,._${randomHex}_pageination-dotWrapper-right_light ._${randomHex}_pageination-dot{margin:7.5px 0}._${randomHex}_pageination-dot:hover{opacity:.75}._${randomHex}_pageination-dot._${randomHex}_pageination-dot-ACTIVE{margin:5px 0;height:15px;width:15px;cursor:initial;opacity:1}`;
            document.body.append(pageinationStyle);

            //add classes and size to pageination elements
           
            document.body.classList.add(`_${randomHex}_pageination-documentBody`)
            //width
            document.body.style["min-width"] = window.innerWidth;
            document.body.style.width = window.innerWidth;
            document.body.style["max-width"] = window.innerWidth;
            //height
            document.body.style["min-height"] = window.innerHeight;
            document.body.style.height = window.innerHeight;
            document.body.style["max-height"] = window.innerHeight;

            pageWrapper.classList.add(`_${randomHex}_pageination-pageWrapper`);
            //width
            pageWrapper.style["min-width"] = window.innerWidth;
            pageWrapper.style.width = window.innerWidth;
            pageWrapper.style["max-width"] = window.innerWidth;
            //height
            pageWrapper.style["min-height"] = window.innerHeight;
            pageWrapper.style.height = window.innerHeight;
            pageWrapper.style["max-height"] = window.innerHeight;

            pageObjects.forEach(element => {
                element.classList.add(`_${randomHex}_pageination-page`)
                //width
                element.style["min-width"] = window.innerWidth;
                element.style.width = window.innerWidth;
                element.style["max-width"] = window.innerWidth;
                //height
                element.style["min-height"] = window.innerHeight;
                element.style.height = window.innerHeight;
                element.style["max-height"] = window.innerHeight;
            });

            /*
                Creates dots of screen to show the active page
            */

            if (dots) {

                //create new DOM element and add it to the beginning of the body
                var newDots = document.createElement("div");
                newDots.classList.add(`_${randomHex}_pageination-dotWrapper-${dots.dotPosition}_${dots.dotTheme || "light"}`);
                document.body.prepend(newDots);

                /**get that newly created element @see above */
                var dotWrapper = document.querySelector(`._${randomHex}_pageination-dotWrapper-top_${dots.dotTheme || "light"}`) ||
                    document.querySelector(`._${randomHex}_pageination-dotWrapper-right_${dots.dotTheme || "light"}`) ||
                    document.querySelector(`._${randomHex}_pageination-dotWrapper-bottom_${dots.dotTheme || "light"}`) ||
                    document.querySelector(`._${randomHex}_pageination-dotWrapper-left_${dots.dotTheme || "light"}`);

                pageObjects.forEach(element => {
                    //create a new dot for each page element
                    var newDot = document.createElement("span");
                    newDot.classList.add(`_${randomHex}_pageination-dot`);
                    newDot.id = element.classList[0];
                    //change page on clicking on dot
                    newDot.addEventListener("click", e => {
                        if (!_pageination.vars.scrollLocked) this.changePage(e.target.id, "clickdots");
                    })

                    //add the new dot to the DOM
                    dotWrapper.append(newDot);
                })

            }

            /*
                Run init event listener function
            */

            if (_pageination.vars.onInit) _pageination.vars.onInit(
                pageWrapper,
                pageNames,
                scrollSpeed,
                isDevMode,
                dots,
                onPageChange
            )

            /*
                Go to the first page
            */

            this.changePage(_pageination.vars.pageNames[0], "first page", true)

            /*
                Add touch scrolling event listeners
            */

            var initialPosition = null;

            /** on the beginning of the touch, set the initial position @see above */
            window.addEventListener("touchstart", e => initialPosition = e.touches[0].clientY);

            //while moving
            window.addEventListener("touchmove", e => {

                //if no movement is detected
                if (initialPosition === null || _pageination.vars.scrollLocked) return;

                //calculate the position difference from old to new to find direction
                var newPosition = e.touches[0].clientY,
                    positionDifference = initialPosition - newPosition;

                //change to the page either 1 position up or down from the current pos
                if (positionDifference > 0) {
                    var nextpage = _pageination.vars.pageNames[_pageination.vars.pageNames.indexOf(_pageination.vars.activePage) + 1];
                    if (nextpage != undefined) this.changePage(nextpage, "touch")
                    else return;
                } else {
                    var nextpage = _pageination.vars.pageNames[_pageination.vars.pageNames.indexOf(_pageination.vars.activePage) - 1];
                    if (nextpage != undefined) this.changePage(nextpage, "touch")
                    else return;
                }

                //reset for next time the handler runs
                initialPosition = null;

            });

            /*
                Add listener for mousewheel scrolling
            */

            window.addEventListener("wheel", e => {

                /*if currently scrolling (_pageination.vars.scrollLocked)
                  or if the active page is not in the pageNames array (_pageination.vars.pageNames.indexOf(_pageination.vars.activePage))*/
                if (_pageination.vars.scrollLocked || _pageination.vars.pageNames.indexOf(_pageination.vars.activePage) < 0) {
                    return;
                }

                /** @see: "(10 < e.deltaY || e.deltaY < -10)" | where 10 is the minimum "scroll sensitivity" */
                else if (!_pageination.vars.scrollLocked && (10 < e.deltaY || e.deltaY < -10)) {
                    var scrolldirection = e.deltaY >= 0 ? "up" : "down";

                    //scroll to the above page
                    if (scrolldirection == "up") {
                        var nextpage = _pageination.vars.pageNames[_pageination.vars.pageNames.indexOf(_pageination.vars.activePage) + 1];
                        if (nextpage) this.changePage(nextpage, "scroll")
                    }

                    //scroll to the below page
                    else {
                        var nextpage = _pageination.vars.pageNames[_pageination.vars.pageNames.indexOf(_pageination.vars.activePage) - 1];
                        if (nextpage) this.changePage(nextpage, "scroll")
                    }
                }

            });

            /*
                Add listener for page resize
            */

            //allow for better performance while resizimg
            var allowResize = true;

            window.addEventListener("resize", e => {

                //a very processing power intensive - pretty much rerenders the whole page
                const resize = function(){

                    document.body.style["min-width"] = window.innerWidth;
                    document.body.style.width = window.innerWidth;
                    document.body.style["max-width"] = window.innerWidth;
                    document.body.style["min-height"] = window.innerHeight;
                    document.body.style.height = window.innerHeight;
                    document.body.style["max-height"] = window.innerHeight;
    
                    pageWrapper.style["min-width"] = window.innerWidth;
                    pageWrapper.style.width = window.innerWidth;
                    pageWrapper.style["max-width"] = window.innerWidth;
                    pageWrapper.style["min-height"] = window.innerHeight;
                    pageWrapper.style.height = window.innerHeight;
                    pageWrapper.style["max-height"] = window.innerHeight;
    
                    pageObjects.forEach(element => {
                        element.style["min-width"] = window.innerWidth;
                        element.style.width = window.innerWidth;
                        element.style["max-width"] = window.innerWidth;
                        element.style["min-height"] = window.innerHeight;
                        element.style.height = window.innerHeight;
                        element.style["max-height"] = window.innerHeight;
                    });

                    _pageination.vars.pageWrapper.style.transform = `translateY(-${Number(window.innerHeight * _pageination.vars.pageNames.indexOf(_pageination.vars.activePage))}px)`

                    allowResize = false;
                }

                if(allowResize) resize();
                else {
                    //only resize every 150ms to save on cpu power
                    setTimeout(e => {
                        resize();
                        allowResize = true;
                    }, 150)
                }

            });

        },

        /* 
            Changes the shown page
        */

        changePage: function (changeToPage, relHandler = "unknown", noDisableScroll = false) {

            var page = _pageination.vars.pageNames[_pageination.vars.pageNames.indexOf(changeToPage)]

            //changeToPage error handling
            if (!changeToPage) throw new Error('Pageination | To change to a page, an argument stating which page is required.');
            else if (typeof (changeToPage) != 'string') throw new Error('Pageination | The "changeToPage" variable must be of type "string"');
            else if (!page) {
                if (_pageination.vars.isDevMode) console.warn('Pageination | The chosen page was not found in the "pageNames" variables and the page was not changed.');
                return false
            }

            //run onchange function
            if (_pageination.vars.onPageChange) _pageination.vars.onPageChange(page, relHandler)

            //animate the page change
            _pageination.vars.pageWrapper.style.transform = `translateY(-${Number(window.innerHeight * _pageination.vars.pageNames.indexOf(page))}px)`

            //change the dev activePage variable to the new page
            _pageination.vars.activePage = page;

            //console.log if in dev mode
            if (_pageination.vars.isDevMode) console.log('Pageination | Changed page to', page, 'via "' + relHandler + '"')

            //disable all scroll handlers unless otherwise specified
            if (!noDisableScroll) this.disableScroll(_pageination.vars.scrollSpeed);

            //if showdots variable
            if (_pageination.vars.dots) {

                //get all of the dots
                var dotsWrapper = document.querySelector(`._${_pageination.vars.random}_pageination-dotWrapper-top_${_pageination.vars.dots.dotTheme || "light"}`) ||
                    document.querySelector(`._${_pageination.vars.random}_pageination-dotWrapper-left_${_pageination.vars.dots.dotTheme || "light"}`) ||
                    document.querySelector(`._${_pageination.vars.random}_pageination-dotWrapper-bottom_${_pageination.vars.dots.dotTheme || "light"}`) ||
                    document.querySelector(`._${_pageination.vars.random}_pageination-dotWrapper-right_${_pageination.vars.dots.dotTheme || "light"}`);

                var dots = dotsWrapper.childNodes;

                //remove active class from dot if it exists
                var activeDot;
                dots.forEach(elem => {
                    if (elem.classList.value.toString().includes(`_${_pageination.vars.random}_pageination-dot-ACTIVE`)) activeDot = elem;
                })
                if (activeDot) activeDot.classList.remove(`_${_pageination.vars.random}_pageination-dot-ACTIVE`);

                //add new active class to clicked dot
                var clickedDot;
                dots.forEach(elem => {
                    if (elem.id == changeToPage) clickedDot = elem;
                })
                if (clickedDot) clickedDot.classList.add(`_${_pageination.vars.random}_pageination-dot-ACTIVE`);
            }

            return true

        },

        /* 
            Disables all event handlers for x miliseconds
        */

        disableScroll: function (miliseconds) {

            //set scrollLocked variable
            _pageination.vars.scrollLocked = true;
            if (_pageination.vars.isDevMode) console.log('Pageination | Disabled scrolling for', miliseconds, 'miliseconds');

            //change back after "scrollSpeed" miliseconds
            setTimeout(e => {
                _pageination.vars.scrollLocked = false
            }, miliseconds);

        }

    }
}