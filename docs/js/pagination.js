/**
 
    Pagination | Simple, free, single-page websites.
    @version 1.0.0
    @author Ryan Comerford <https://ryncmrfrd.com>

*/

"use strict";

const pagination = function(paginationWrapperID, {
    useHashes = true,
    scrollSpeed = 1000,
    isDevMode = false,
    dots = {
        dotPosition: "left"
    }
} = { 
    "useHashes": true, 
    "scrollSpeed": 1000, 
    "isDevMode": false,
    "dots": { "dotPosition": "left" }
}){

    /* 
        Arguments error handling
    */

    //paginationWrapperID
    if( !paginationWrapperID ) throw new Error('Pagination | REQUIRED VARIABLE - The ID of your Pagination wrapper must be provided.');
    else if( typeof (paginationWrapperID) != 'string' ) throw new Error('Pagination | VARIABLE ERROR - The provided wrapper ID must be of type "string".');
    else if( !document.getElementById(paginationWrapperID) ) throw new Error('Pagination | VARIABLE ERROR - An element with the provided ID was not found.');

    //useHashes
    if( typeof (useHashes) != 'boolean' ) throw new Error('Pagination | VARIABLE ERROR - useHashes must be of type "boolean".');

    //scrollSpeed
    if( typeof (scrollSpeed) != 'number') throw new Error('Pagination | VARIABLE ERROR - scrollSpeed must be of type "number".')
    else if( scrollSpeed < 0 ) throw new Error('Pagination | VARIABLE ERROR - scrollSpeed must have a value above 0.')
    else if( scrollSpeed > 10000 ) console.warn('Pagination | Painfully slow scroll speed detected.')

    //isDevMode
    if( typeof (isDevMode) != 'boolean' ) throw new Error('Pagination | VARIABLE ERROR - isDevMode must be of type "boolean".')

    //dots
    if( typeof (dots) != 'object' ) throw new Error('Pagination | VARIABLE ERROR - Dots variable must be of type object.');
    else if( !dots.dotPosition ) throw new Error('Pagination | REQUIRED VARIABLE - dotPosition variable is required.');
    else if( typeof (dots.dotPosition) != 'string' ) throw new Error('Pagination | VARIABLE ERROR - dotPosition variable must be of type string.');

    /*
        Get other variables for init fn
    */
    var pageWrapper = document.querySelector(`#${paginationWrapperID}`),
        pageObjects = pageWrapper.querySelectorAll("section"),
        pageNames = [];
        pageObjects.forEach(e => pageNames.push(e.classList[0]))

    /*
        Log found variables if "isDevMode" is true (default = false)
    */

    if( isDevMode ){
        console.log(
            '%c Pagination | Dev Mode Enabled', 'color:red; font-size:35px; font-weight: bold; -webkit-text-stroke: 1px black;',
            '\n\nPage Wrapper DOMObject: ', pageWrapper, //the DOM object of the element with the paginationWrapperID
            '\nPage Names', {
                'Strings': pageNames, //the raw text names of the pages
                'DOMObjects': pageObjects //the DOM objects of the pages
            },
            '\nSettings', {
                'scrollSpeed': scrollSpeed, //the speed at which which to change pages
                'isDevMode': isDevMode //whether to console log page changes
            }
        )
    }

    /*
        Run the internal init function. Keeps this fn short and sweet.
    */

    return _pagination.api.init({
        useHashes: useHashes,
        scrollSpeed: scrollSpeed,
        isDevMode: isDevMode,
        pageWrapper: pageWrapper,
        pageObjects: pageObjects,
        pageNames: pageNames,
        dots: dots
    });

}

const _pagination = {

    /* 
        Stores all global variables
        Generally defined by _pagination.api.init()
    */

    vars: {

        //misc developer variables
        activePage: "",
        scrollLocked: false,
        pageWrapper: document.body,
        random: "",

        //set by init function
        pageNames: [],
        useHashes: true,
        scrollSpeed: 1000,
        isDevMode: false,
        dots: {
            showDots: false,
            dotPosition: "left"
        }

    },

    /* 
        Reusable code ran by internal functions
    */

    api: {

        /* 
            Sets the main variables and html styles
        */

        init: function(
            /** for argument descriptions @see 58 in pagination() fn */
            { 
                useHashes, 
                scrollSpeed, 
                isDevMode, 
                pageWrapper, 
                pageObjects, 
                pageNames, 
                dots 
            }
        ){

            /*
                set global variables
            */
            
            _pagination.vars.pageWrapper = pageWrapper;
            _pagination.vars.pageNames = pageNames;
            _pagination.vars.useHashes = useHashes;
            _pagination.vars.scrollSpeed = scrollSpeed;
            _pagination.vars.isDevMode = isDevMode;
            _pagination.vars.dots = dots;

            /*
                set css and classes for pagination-related elements
            */
           
            //ensures that styles are only used to pagination to avoid messing with other page styles
            const generateHex = function(){ return Math.floor(Math.random()*16777215).toString(16); };
            var randomHex = generateHex();
            _pagination.vars.random = randomHex;

            //append pagination styles to document
            var paginationStyle = document.createElement("style");
            paginationStyle.innerText = `
               ._${randomHex}_pagination-documentBody{overflow:hidden;margin:0;padding:0}
               ._${randomHex}_pagination-pageWrapper{width:100vw;height:100vh;transition:transform ${_pagination.vars.scrollSpeed}ms ease}
               ._${randomHex}_pagination-page{width:100vw;height:100vh}
               ._${randomHex}_pagination-dotWrapper-top{height:15px;display:flex;flex-direction:row;align-items:center;justify-content:center;z-index:999;position:absolute;left:50%;top:20px;transform:translate(-50%,-50%)}
               ._${randomHex}_pagination-dotWrapper-left{width:15px;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999;position:absolute;left:20px;top:50%;transform:translate(-50%,-50%)}
               ._${randomHex}_pagination-dotWrapper-bottom{height:15px;display:flex;flex-direction:row;align-items:center;justify-content:center;z-index:999;position:absolute;left:50%;bottom:20px;transform:translate(-50%,-50%)}
               ._${randomHex}_pagination-dotWrapper-right{width:15px;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999;position:absolute;right:20px;top:50%;transform:translate(-50%,-50%)}
               ._${randomHex}_pagination-dot{cursor:pointer;opacity:.5;transition:opacity ${Number(_pagination.vars.scrollSpeed / 2)}ms,height ${Number(_pagination.vars.scrollSpeed / 2)}ms,width ${Number(_pagination.vars.scrollSpeed / 2)}ms,margin ${Number(_pagination.vars.scrollSpeed / 2)}ms;height:10px;width:10px;background-color:#fff;border-radius:50%}
               ._${randomHex}_pagination-dotWrapper-top ._${randomHex}_pagination-dot{margin:0 7.5px}
               ._${randomHex}_pagination-dotWrapper-left ._${randomHex}_pagination-dot{margin:7.5px 0}
               ._${randomHex}_pagination-dotWrapper-bottom ._${randomHex}_pagination-dot{margin:0 7.5px}
               ._${randomHex}_pagination-dotWrapper-right ._${randomHex}_pagination-dot{margin:7.5px 0}
               ._${randomHex}_pagination-dot:hover{opacity:.75}
               ._${randomHex}_pagination-dot._${randomHex}_pagination-dot-ACTIVE{margin:5px 0;height:15px;width:15px;cursor:initial;opacity:1}
            `;      
            document.body.append(paginationStyle);

            //add classes to pagination elements
            document.body.classList.add(`_${randomHex}_pagination-documentBody`)
            pageWrapper.classList.add(`_${randomHex}_pagination-pageWrapper`);
            pageObjects.forEach(element => element.classList.add(`_${randomHex}_pagination-page`) );

            /*
                Creates dots of screen to show the active page
            */

            if( dots ){

                //create new DOM element and add it to the beginning of the body
                var newDots = document.createElement("div");
                    newDots.classList.add(`_${randomHex}_pagination-dotWrapper-${dots.dotPosition}`);
                    document.body.prepend(newDots);

                /**get that newly created element @see above */
                var dotWrapper = document.querySelector(`._${randomHex}_pagination-dotWrapper-top`) ||
                                 document.querySelector(`._${randomHex}_pagination-dotWrapper-right`) ||
                                 document.querySelector(`._${randomHex}_pagination-dotWrapper-bottom`) ||
                                 document.querySelector(`._${randomHex}_pagination-dotWrapper-left`);

                pageObjects.forEach(element => {
                    //create a new dot for each page element
                    var newDot = document.createElement("span");
                    newDot.classList.add(`_${randomHex}_pagination-dot`);
                    newDot.id = element.classList[0];
                    //change page on clicking on dot
                    newDot.addEventListener("click", e => {
                        if(!_pagination.vars.scrollLocked) this.changePage(e.target.id, "clickdots");
                    })
                    //add the new dot to the DOM
                    dotWrapper.append(newDot);
                })

            }

            /*
                Go to the correct page
            */

            //if hash anchors are disabled go to the first page
            if(!_pagination.vars.useHashes){
                this.changePage(_pagination.vars.pageNames[0], "first page", true)
            } else{
                // if a hash is present go to that page
                var urlHash =  _pagination.vars.pageNames.indexOf(window.location.hash.replace("#", ""));
                if(urlHash > -1 && urlHash != 0) this.changePage(_pagination.vars.pageNames[urlHash], "initial hash");
                
                // otherwise go to the first page
                else this.changePage(_pagination.vars.pageNames[0], "first page", true)
            }

            /*
                Add touch scrolling event listeners
            */
            
            var initialPosition = null;
            
            /** on the beginning of the touch, set the initial position @see above */
            window.addEventListener("touchstart", e => initialPosition = e.touches[0].clientY);

            //while moving
            window.addEventListener("touchmove", e => {

                //if no movement is detected
                if (initialPosition === null || _pagination.vars.scrollLocked) return;

                //calculate the position difference from old to new to find direction
                var newPosition = e.touches[0].clientY,
                    positionDifference = initialPosition - newPosition;

                //change to the page either 1 position up or down from the current pos
                if( positionDifference > 0 ) {
                    var nextpage = _pagination.vars.pageNames[_pagination.vars.pageNames.indexOf(_pagination.vars.activePage) + 1];
                    if (nextpage != undefined) this.changePage(nextpage, "touch")
                    else return;
                } else{
                    var nextpage = _pagination.vars.pageNames[_pagination.vars.pageNames.indexOf(_pagination.vars.activePage) - 1];
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

                /*if currently scrolling (_pagination.vars.scrollLocked)
                  or if the active page is not in the pageNames array (_pagination.vars.pageNames.indexOf(_pagination.vars.activePage))*/
                if (_pagination.vars.scrollLocked || _pagination.vars.pageNames.indexOf(_pagination.vars.activePage) < 0) {
                    return;
                } 
                
                /** @see: "(10 < e.deltaY || e.deltaY < -10)" | where 10 is the minimum "scroll sensitivity" */
                else if (!_pagination.vars.scrollLocked && (10 < e.deltaY || e.deltaY < -10)) {
                    var scrolldirection = e.deltaY >= 0 ? "up" : "down";
                
                    //scroll to the above page
                    if (scrolldirection == "up") {
                        var nextpage = _pagination.vars.pageNames[_pagination.vars.pageNames.indexOf(_pagination.vars.activePage) + 1];
                        if (nextpage) this.changePage(nextpage, "scroll")
                    } 
                
                    //scroll to the below page
                    else {
                        var nextpage = _pagination.vars.pageNames[_pagination.vars.pageNames.indexOf(_pagination.vars.activePage) - 1];
                        if (nextpage) this.changePage(nextpage, "scroll")
                    }
                }

            });

            /*
                Add listener for hash change (unless otherwise specified)
            */

            if (_pagination.vars.useHashes) {
                window.addEventListener("hashchange", e => {
                
                    //if not currently scrolling
                    if (!_pagination.vars.scrollLocked) {
                        var toPage = window.location.hash.replace('#', '');
                    
                        //scroll to the page wqith the new hash
                        if (toPage != _pagination.vars.activePage) this.changePage(toPage, "hashchange")
                    }
                    else return;
                });
            }


        },

        /* 
            Changes the shown page
        */

        changePage: function(changeToPage, relHandler = "unknown", noDisableScroll = false){
            
            var page = _pagination.vars.pageNames[_pagination.vars.pageNames.indexOf(changeToPage)]

            //changeToPage error handling
            if (!changeToPage) throw new Error('Pagination | To change to a page, an argument stating which page is required.');
            else if (typeof (changeToPage) != 'string') throw new Error('Pagination | The "changeToPage" variable must be of type "string"');
            else if (!page) {
                if (_pagination.vars.isDevMode) console.warn('Pagination | The chosen page was not found in the "pageNames" variables, thus the page was not changed.');
                if (window.location.hash.replace('#', '') != _pagination.vars.activePage) window.location.hash = _pagination.vars.activePage;
                return false
            }

            //animate the page change
            _pagination.vars.pageWrapper.style.transform = `translateY(-${_pagination.vars.pageNames.indexOf(page)}00vh)`

            //change the dev activePage variable to the new page
            _pagination.vars.activePage = page;

            //console.log if in dev mode
            if (_pagination.vars.isDevMode) console.log('Pagination | Changed page to', page, 'via "' + relHandler + '"')

            //set window hash to the changed to page
            if (_pagination.vars.useHashes) window.location.hash = page;

            //disable all scroll handlers unless otherwise specified
            if (!noDisableScroll) this.disableScroll(_pagination.vars.scrollSpeed);

            //if showdots variable
            if(_pagination.vars.dots){

                //get all of the dots
                var dotsWrapper = document.querySelector(`._${_pagination.vars.random}_pagination-dotWrapper-top`) ||
                           document.querySelector(`._${_pagination.vars.random}_pagination-dotWrapper-left`) ||
                           document.querySelector(`._${_pagination.vars.random}_pagination-dotWrapper-bottom`) ||
                           document.querySelector(`._${_pagination.vars.random}_pagination-dotWrapper-right`);
 
                var dots = dotsWrapper.childNodes;

                //remove active class from dot if it exists
                var activeDot;
                dots.forEach(elem => {
                    if(elem.classList.value.toString().includes(`_${_pagination.vars.random}_pagination-dot-ACTIVE`)) activeDot = elem;
                })
                if(activeDot) activeDot.classList.remove(`_${_pagination.vars.random}_pagination-dot-ACTIVE`);

                //add new active class to clicked dot
                var clickedDot;
                dots.forEach(elem => {
                    if(elem.id == changeToPage) clickedDot = elem;
                })
                if(clickedDot) clickedDot.classList.add(`_${_pagination.vars.random}_pagination-dot-ACTIVE`);
            }

            return true

        },

        /* 
            Disables all event handlers for x miliseconds
        */

        disableScroll: function(miliseconds){

            //set scrollLocked variable
            _pagination.vars.scrollLocked = true;
            if( _pagination.vars.isDevMode) console.log('Pagination | Disabled scrolling for',miliseconds,'miliseconds');
            
            //change back after "scrollSpeed" miliseconds
            setTimeout(e =>{
                _pagination.vars.scrollLocked = false
            }, miliseconds);

        }

    }
}