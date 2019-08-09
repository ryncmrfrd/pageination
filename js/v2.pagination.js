/*
    the only function intended to be run by the user
    eg. new pagination('pageWrapperID')
*/
function pagination(pageWrapperID, {
    useHashes = true,
    scrollSpeed = 1000,
    isDevMode = false
} = { "useHashes": true, "scrollSpeed": 1000, "isDevMode": false }) {

    /* 
        Error Handling -> incorrectly passed arguments
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
            '\nPage Wrapper DOMObject', pageWrapper, // the DOM object of the element with the pageWrapperID
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
        pageWrapperID,
        {
            useHashes, // whether or not to use anchor hashes for pages
            scrollSpeed, // the speed at which which to change pages
            isDevMode // whether to console log page changes
        },
        {
            pageWrapper, // the DOM object of the element with the pageWrapperID
            pageObjects, // the DOM objects of the pages
            pageNames // the raw text names of the pages
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

        init: function () {

            //scroll to the first page
            if (!_pagination._vars.useHashes) {
                this.changePage(_pagination._vars.pageNames[0], "first page", true)
            } else {
                var urlHash = window.location.hash.replace("#", ""),
                    firstPageOverride = _pagination._vars.pageNames.indexOf(urlHash);
                if (firstPageOverride > -1 && firstPageOverride != 0) this.changePage(_pagination._vars.pageNames[firstPageOverride], "initial hash");
                else this.changePage(_pagination._vars.pageNames[0], "first page", true)
            }

            //listen for touch scrolling
            var initialPosition = null;
            window.addEventListener("touchstart", e => initialPosition = e.touches[0].clientY);
            window.addEventListener("touchmove", e => {
                //if no movement is detected
                if (initialPosition === null || _pagination._vars.scrollDisabled) return;

                //calculate the position difference from old to new to calculate direction
                var newPosition = e.touches[0].clientY,
                    positionDifference = initialPosition - newPosition;

                //do the page changing
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

            //listen for scrolling via mousewheel
            window.addEventListener("wheel", e => {
                if (_pagination._vars.scrollLocked || _pagination._vars.pageNames.indexOf(_pagination._vars.activePage) < -1) {
                    return false;
                } else if (!_pagination._vars.scrollLocked && (10 < e.deltaY || e.deltaY < -10)) {
                    var scrolldirection = e.deltaY >= 0 ? "up" : "down";
                    if (scrolldirection == "up") {
                        var nextpage = _pagination._vars.pageNames[_pagination._vars.pageNames.indexOf(_pagination._vars.activePage) + 1];
                        if (nextpage) this.changePage(nextpage, "scroll")
                    } else {
                        var nextpage = _pagination._vars.pageNames[_pagination._vars.pageNames.indexOf(_pagination._vars.activePage) - 1];
                        if (nextpage) this.changePage(nextpage, "scroll")
                    }
                }
            });

            //listen for hash change
            if (_pagination._vars.useHashes) {
                window.addEventListener("hashchange", e => {
                    if (!_pagination._vars.scrollLocked) {
                        var toPage = window.location.hash.replace('#', '');
                        if (toPage != _pagination._vars.activePage) this.changePage(toPage, "hashchange")
                    } else return;
                });
            }

        },

        changePage: function(changeToPage, relHandler = "unknown", noDisableScroll = false){
            var page = _pagination._vars.pageNames[_pagination._vars.pageNames.indexOf(changeToPage)]
    
            //changeToPage error handling
            if(!changeToPage) throw new Error('Pagination | To change to a page, an argument stating which page is required.');
            else if(typeof(changeToPage) != 'string') throw new Error('Pagination | The "changeToPage" variable must be of type "string"');
            else if(!page){ 
                if(_pagination._vars.isDevMode) console.warn('Pagination | The chosen page was not found in the "pageNames" variables, thus the page was not changed.'); 
                if(window.location.hash.replace('#','') != _pagination._vars.activePage) window.location.hash = _pagination._vars.activePage;
                return false 
            }
    
            //animate the page change
            document.body.style.transform = `translateY(-${_pagination._vars.pageNames.indexOf(page)}00vh)`
    
            //change the dev activePage variable to the new page
            _pagination._vars.activePage = page;
    
            //console.log if in dev mode
            if(_pagination._vars.isDevMode) console.log('Pagination | Changed page to',page,'via "'+relHandler+'"')
    
            //set window hash to the changed to page
            if(_pagination._vars.useHashes) window.location.hash = page;
    
            //disable all scroll handlers unless otherwise specified
            if(!noDisableScroll) this.disableScroll(_pagination._vars.scrollSpeed);
    
            return true
        },
        disableScroll: function () {
            console.log("disable scroll")
        },
    }
}