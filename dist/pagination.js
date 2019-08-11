/**
 
    Pagination | Simple, free, single-page websites.
    @version 1.0.0
    @author Ryan Comerford <https://ryncmrfrd.com>

*/

/*
    the only function intended to be run by the user
    ie. new pagination('pageWrapperID')
*/

"use strict";

const pagination = function(pageWrapperID, {
    useHashes = true,
    scrollSpeed = 1000,
    isDevMode = false
} = { "useHashes": true, "scrollSpeed": 1000, "isDevMode": false }) {

    /* 
        Error handling for incorrectly passed arguments
    */

    // pageWrapperID
    if (!pageWrapperID) throw new Error('Pagination | REQUIRED VARIABLE - The ID of your pagination wrapper must be provided.')
    else if (typeof (pageWrapperID) != 'string') throw new Error('Pagination | VARIABLE ERROR - The provided wrapper ID must be of type "string".')
    else if (!document.getElementById(pageWrapperID)) throw new Error('Pagination | VARIABLE ERROR - An element with the provided wrapper ID was not found.')
    //useHashes
    if (useHashes != false && typeof (useHashes) != 'boolean') throw new Error('Pagination | VARIABLE ERROR - useHashes must be of type "boolean".')
    //scrollSpeed
    if (scrollSpeed != 1000 && typeof (scrollSpeed) != 'number') throw new Error('Pagination | VARIABLE ERROR - useHashes must be of type "boolean".')
    else if (scrollSpeed < 0) throw new Error('Pagination | VARIABLE ERROR - scrollSpeed must have a value above 0.')
    else if (scrollSpeed > 10000) console.warn('Pagination | Painfully slow scroll speed detected.')
    //isDevMode
    if (isDevMode != false && typeof (isDevMode) != 'boolean') throw new Error('Pagination | VARIABLE ERROR - isDevMode must be of type "boolean".')

    /*
        get DOM details from the passed variabled
    */
    var pageWrapper = document.getElementById(pageWrapperID),
        pageObjects = pageWrapper.querySelectorAll("section"),
        pageNames = [];
    pageObjects.forEach(e => pageNames.push(e.className.split(" ")[0]))

    /*
        if isDevMode is true (default is false)
        log all of the variables to be passed to _pagination._api.init
    */
    if (isDevMode) {
        console.log(
            '%c Pagination | Dev Mode Enabled', 'color:red; font-size:35px; font-weight: bold; -webkit-text-stroke: 1px black;',
            '\nPage Wrapper DOMObject: ', pageWrapper, // the DOM object of the element with the pageWrapperID
            '\nPage Names', {
                'Strings': pageNames, // the raw text names of the pages
                'DOMObjects': pageObjects // the DOM objects of the pages
            },
            '\nSettings', {
                'scrollSpeed': scrollSpeed, // the speed at which which to change pages
                'isDevMode': isDevMode // whether to console log page changes
            }
        )
    }

    /*
        actually run the init code - to keep this fn short and abstract away some stuff
    */
    return _pagination._api.init(
        {
            useHashes: useHashes, // whether or not to use anchor hashes for pages
            scrollSpeed: scrollSpeed, // the speed at which which to change pages
            isDevMode: isDevMode, // whether to console log page changes
            pageWrapper: pageWrapper, // the DOM object of the element with the pageWrapperID
            pageObjects: pageObjects, // the DOM objects of the pages
            pageNames: pageNames // the raw text names of the pages
        }
    );

}

const _pagination = {

    /* 
        stores global variables
        overwritten by _pagination._api.init()
    */
    _vars: {
        //misc developer variables
        activePage: "",
        scrollLocked: false,
        pageWrapper: document.body,

        //set by init function
        pageNames: [],
        useHashes: true,
        scrollSpeed: 1000,
        isDevMode: false,
    },

    /* 
        in-app functions (ie. not intended to be run by internal methods)
    */
    _api: {

        /* 
            Sets the main variables and html styles
        */

        init: function (
            /** for argument descriptions @see Line_58 in function pagination() */
            { useHashes, scrollSpeed, isDevMode, pageWrapper, pageObjects, pageNames }
        ) {

            /*
                set global variables to passed arguments
            */
            _pagination._vars.pageWrapper = pageWrapper;
            _pagination._vars.pageNames = pageNames;
            _pagination._vars.useHashes = useHashes;
            _pagination._vars.scrollSpeed = scrollSpeed;
            _pagination._vars.isDevMode = isDevMode;

            /*
                set css for pagination-related elements
            */

            //first method to stop body scrolling (also see "touchmove" event listener)
            document.body.style.overflow = "hidden";
            document.body.style.margin = "0";
            document.body.style.padding = "0";

            //set all styles for the pagination wrapper
            var pageWrapperStyle = _pagination._vars.pageWrapper.style;
            pageWrapperStyle.height = "100vh";
            pageWrapperStyle.width = "100vw";
            pageWrapperStyle.transition = `transform ${_pagination._vars.scrollSpeed}ms ease`;

            /** set styles for the pages inside that wrapper ( @see above ) */
            pageObjects.forEach(element => {
                element.style.height = "100vh";
                element.style.width = "100vw";
            })

            /*
                go to the first page
            */

            //if user has specifically disabled hash anchors go to the first page
            if(!_pagination._vars.useHashes){
                this.changePage(_pagination._vars.pageNames[0], "first page", true)
            } else{
                // if a hash is present go to that page
                var urlHash =  _pagination._vars.pageNames.indexOf(window.location.hash.replace("#", ""));
                if(urlHash > -1 && urlHash != 0) this.changePage(_pagination._vars.pageNames[urlHash], "initial hash");
                
                // otherwise go to the first page
                else this.changePage(_pagination._vars.pageNames[0], "first page", true)
            }

            /*
                listen for touch scrolling
            */

            //store the initial position of the screen
            var initialPosition = null;
            
            /** on the beginning of the touch, set the initial position @see above */
            window.addEventListener("touchstart", e => initialPosition = e.touches[0].clientY);

            //while moving
            window.addEventListener("touchmove", e => {
                
                //if no movement is detected
                if (initialPosition === null || _pagination._vars.scrollDisabled) return;

                //calculate the position difference from old to new to find direction
                var newPosition = e.touches[0].clientY,
                    positionDifference = initialPosition - newPosition;

                //change to the page either 1 position up or down from the current pos
                if (positionDifference > 0) {
                    var nextpage = _pagination._vars.pageNames[_pagination._vars.pageNames.indexOf(_pagination._vars.activePage) + 1];
                    if (nextpage != undefined) this.changePage(nextpage, "touch listener")
                    else return;
                } else {
                    var nextpage = _pagination._vars.pageNames[_pagination._vars.pageNames.indexOf(_pagination._vars.activePage) - 1];
                    if (nextpage != undefined) this.changePage(nextpage, "touch listener")
                    else return;
                }

                //reset for next time the handler runs
                initialPosition = null;
            });

            /*
                listen for mousewheel scrolling
            */

            window.addEventListener("wheel", e => {

                //if currently scrolling (_pagination._vars.scrollLocked)
                //or if the active page is not in the pageNames array (_pagination._vars.pageNames.indexOf(_pagination._vars.activePage))
                if (_pagination._vars.scrollLocked || _pagination._vars.pageNames.indexOf(_pagination._vars.activePage) < 0) {
                    return;
                } 
                /** @see: "(10 < e.deltaY || e.deltaY < -10)" | where 10 is the minimum "scroll sensitivity" */
                else if (!_pagination._vars.scrollLocked && (10 < e.deltaY || e.deltaY < -10)) {
                    var scrolldirection = e.deltaY >= 0 ? "up" : "down";
                    
                    //scroll to the above page
                    if (scrolldirection == "up") {
                        var nextpage = _pagination._vars.pageNames[_pagination._vars.pageNames.indexOf(_pagination._vars.activePage) + 1];
                        if (nextpage) this.changePage(nextpage, "scroll")
                    } 
                    
                    //scroll to the below page
                    else {
                        var nextpage = _pagination._vars.pageNames[_pagination._vars.pageNames.indexOf(_pagination._vars.activePage) - 1];
                        if (nextpage) this.changePage(nextpage, "scroll")
                    }
                }
            });

            /*
                listen for hash change (unless user has specified otherwise)
            */

            if (_pagination._vars.useHashes) {
                window.addEventListener("hashchange", e => {
                    
                    //if not currently scrolling
                    if (!_pagination._vars.scrollLocked) {
                        var toPage = window.location.hash.replace('#', '');
                        
                        //scroll to the page wqith the new hash
                        if (toPage != _pagination._vars.activePage) this.changePage(toPage, "hashchange")
                    } else return;
                });
            }

        },

        /* 
            Changes the shown page to the changeToPage argument
        */

        changePage: function (changeToPage, relHandler = "unknown", noDisableScroll = false) {
            var page = _pagination._vars.pageNames[_pagination._vars.pageNames.indexOf(changeToPage)]

            //changeToPage error handling
            if (!changeToPage) throw new Error('Pagination | To change to a page, an argument stating which page is required.');
            else if (typeof (changeToPage) != 'string') throw new Error('Pagination | The "changeToPage" variable must be of type "string"');
            else if (!page) {
                if (_pagination._vars.isDevMode) console.warn('Pagination | The chosen page was not found in the "pageNames" variables, thus the page was not changed.');
                if (window.location.hash.replace('#', '') != _pagination._vars.activePage) window.location.hash = _pagination._vars.activePage;
                return false
            }

            //animate the page change
            _pagination._vars.pageWrapper.style.transform = `translateY(-${_pagination._vars.pageNames.indexOf(page)}00vh)`

            //change the dev activePage variable to the new page
            _pagination._vars.activePage = page;

            //console.log if in dev mode
            if (_pagination._vars.isDevMode) console.log('Pagination | Changed page to', page, 'via "' + relHandler + '"')

            //set window hash to the changed to page
            if (_pagination._vars.useHashes) window.location.hash = page;

            //disable all scroll handlers unless otherwise specified
            if (!noDisableScroll) this.disableScroll(_pagination._vars.scrollSpeed);

            return true
        },
        
        /* 
            Disables all event handlers for "miliseconds" miliseconds
        */

        disableScroll: function(miliseconds){
            
            //set scrollLocked variable
            _pagination._vars.scrollLocked = true;
            if( _pagination._vars.isDevMode) console.log('Pagination | Disabled scrolling for',miliseconds,'miliseconds');
            
            //change back after "scrollSpeed" miliseconds
            setTimeout(e =>{
                _pagination._vars.scrollLocked = false
            }, miliseconds);
        }
    }
}