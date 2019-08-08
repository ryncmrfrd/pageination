// const pagination = {
//     //"developer" variables
//     activePage: "",
//     scrollLocked: false,
    
//     //global variables set by init function
//     pageNames: [],
//     scrollSpeed: 1500,
//     isDevMode: false,
    
//     //set initial variables, set styles, and run error checks
//     init: function(pageWrapperID, {
//         scrollSpeed = 1500,
//         isDevMode = false
//     } = {"scrollSpeed": 1500, "isDevMode": false}){

//         // ------------- error handling -------------
//         if(typeof pageWrapperID != 'string') throw new Error('VARIABLE ERROR | The provided wrapper ID must be of type "string".')
//         if(!pageWrapperID) throw new Error('REQUIRED VARIABLE | The ID of your pagination wrapper must be provided.')
//         if(!document.getElementById(pageWrapperID)) throw new Error('VARIABLE ERROR | An element with the provided wrapper ID was not found.')

//         //
//         var pageWrapper = document.getElementById(pageWrapperID),
//             pageObjects = pageWrapper.querySelectorAll("section")

//         //
//         var pageNames = [];
//         pageObjects.forEach(e => pageNames.push(e.className.split(" ")[0]))

//         //setting the global variables
//         this.pageNames = pageNames;
//         this.scrollSpeed = scrollSpeed;
//         this.isDevMode = isDevMode;

//         //set body css to stop scrolling and add scroll animation
//         document.body.style.overflow = "hidden";
//         document.body.style.margin = "0";
//         document.body.style.padding = "0";
//         document.body.style.transition = `transform ${this.scrollSpeed}ms ease-in-out`;

//         //set css on page elements
//         pageObjects.forEach(element => {
//             element.style.height = "100vh";
//             element.style.width = "100vw";
//         })

//         //console.log the set of initial variables and setting
//         if(this.isDevMode){
//             console.log(
//                 '%c Pagination | Dev Mode Enabled', 'color:red; font-size:35px; font-weight: bold; -webkit-text-stroke: 1px black;',
//                 '\nPage Wrapper DOMObject',pageWrapper,
//                 '\nPage Names',{
//                     'Strings':this.pageNames,
//                     'DOMObjects':pageObjects
//                 },
//                 '\nSettings',{
//                     'scrollSpeed': this.scrollSpeed,
//                     'isDevMode': this.isDevMode
//                 }
//             )
//         }

//         //scroll to the first page
//         var urlHash = window.location.hash.replace("#",""),
//             firstPageOverride = this.pageNames.indexOf(urlHash);
//         if(firstPageOverride > -1 && firstPageOverride != 0) this.changePage(pageNames[firstPageOverride], "initial hash");
//         else this.changePage(pageNames[0], "first page", true)

//         //listen for touch scrolling
//         var initialPosition = null;
//         window.addEventListener("touchstart", e => initialPosition = e.touches[0].clientY);
//         window.addEventListener("touchmove", e => {
//             //if no movement is detected
//             if(initialPosition === null || this.scrollDisabled) return;
            
//             //calculate the position difference from old to new to calculate direction
//             var newPosition = e.touches[0].clientY, 
//                 positionDifference = initialPosition - newPosition;
            
//             //do the page changing
//             if(positionDifference > 0) {
//                 var nextpage = this.pageNames[this.pageNames.indexOf(this.activePage) + 1];
//                 if(nextpage != undefined) this.changePage(nextpage, "touch listener")
//                 else return;
//             } else {
//                 var nextpage = this.pageNames[this.pageNames.indexOf(this.activePage) - 1];
//                 if(nextpage != undefined) this.changePage(nextpage, "touch listener")
//                 else return;
//             }

//             //reset for next time the handler runs
//             initialPosition = null;
//         });

//         //listen for scrolling via mousewheel
//         window.addEventListener("wheel", e => {
//             if(this.scrollLocked || this.pageNames.indexOf(this.activePage) < -1  ){
//                 return false;
//             } else if(!this.scrollLocked && (10 < e.deltaY || e.deltaY < -10)){
//                 var scrolldirection = e.deltaY >= 0 ? "up" : "down";
//                 if(scrolldirection == "up"){
//                     var nextpage = this.pageNames[this.pageNames.indexOf(this.activePage) + 1];
//                     if(nextpage) this.changePage(nextpage, "scroll")
//                 } else{
//                     var nextpage = this.pageNames[this.pageNames.indexOf(this.activePage) - 1];
//                     if(nextpage) this.changePage(nextpage, "scroll")
//                 }
//             }
//         });

//         //listen for hash change
//         window.addEventListener("hashchange", e => {
//             if(!this.scrollLocked){
//                 var toPage = window.location.hash.replace('#','');
//                 if(toPage != this.activePage) this.changePage(toPage, "hashchange")
//             } else return;
//         });

//         return true
//     },
//     //change to the desired page
//     changePage: function(changeToPage, relHandler, noDisableScroll = false){
//         var page = this.pageNames[this.pageNames.indexOf(changeToPage)]

//         //changeToPage error handling
//         if(!changeToPage) throw new Error('Pagination | To change to a page, that page is required.');
//         else if(typeof(changeToPage) != 'string') throw new Error('Pagination | The "changeToPage" variable must be of type "string"');
//         else if(!page){ 
//             if(this.isDevMode) console.warn('Pagination | The chosen page was not found in the "pageNames" variables, thus the page was not changed.'); 
//             if(window.location.hash.replace('#','') != this.activePage) window.location.hash = this.activePage;
//             return false 
//         }

//         //animate the page change
//         document.body.style.transform = `translateY(-${this.pageNames.indexOf(page)}00vh)`

//         //change the dev activePage variable to the new page
//         this.activePage = page;

//         //disable all scroll handlers unless otherwise specified
//         if(!noDisableScroll) this.disableScroll(this.scrollSpeed);

//         //set window hash to the changed to page
//         window.location.hash = page;
            
//         //console.log if in dev mode
//         if(pagination.isDevMode) console.log('Pagination | Changed page to',page,'via "'+relHandler+'"')

//         return true
//     },
//     //disable the scroll handlers for x miliseconds
//     disableScroll: function(miliseconds){
//         //set scrollLocked variable
//         this.scrollLocked = true;
//         if(this.isDevMode) console.log('Pagination | Disabled scrolling for',miliseconds,'miliseconds');
        
//         //change back after "scrollSpeed" miliseconds
//         setTimeout(function(){
//             pagination.scrollLocked = false;
//             if(pagination.isDevMode) console.log('Pagination | Enabled scrolling after',miliseconds,'miliseconds')
//         }, miliseconds);
//     }
// }

var paginationVars = {
    
}

const pagination = function(pageWrapperID, {
    scrollSpeed = 1500,
    isDevMode = false
} = {"scrollSpeed": 1500, "isDevMode": false}){
    
        // ------------- error handling -------------
        if(typeof pageWrapperID != 'string') throw new Error('VARIABLE ERROR | The provided wrapper ID must be of type "string".')
        if(!pageWrapperID) throw new Error('REQUIRED VARIABLE | The ID of your pagination wrapper must be provided.')
        if(!document.getElementById(pageWrapperID)) throw new Error('VARIABLE ERROR | An element with the provided wrapper ID was not found.')

        //
        var pageWrapper = document.getElementById(pageWrapperID),
            pageObjects = pageWrapper.querySelectorAll("section")

        //
        var pageNames = [];
        pageObjects.forEach(e => pageNames.push(e.className.split(" ")[0]))

        //setting the global variables
        paginationVars.pageNames = pageNames;
        paginationVars.scrollSpeed = scrollSpeed;
        paginationVars.isDevMode = isDevMode;

        //set body css to stop scrolling and add scroll animation
        document.body.style.overflow = "hidden";
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.transition = `transform ${paginationVars.scrollSpeed}ms ease-in-out`;

        //set css on page elements
        pageObjects.forEach(element => {
            element.style.height = "100vh";
            element.style.width = "100vw";
        })

        //console.log the set of initial variables and setting
        if(paginationVars.isDevMode){
            console.log(
                '%c Pagination | Dev Mode Enabled', 'color:red; font-size:35px; font-weight: bold; -webkit-text-stroke: 1px black;',
                '\nPage Wrapper DOMObject',pageWrapper,
                '\nPage Names',{
                    'Strings':paginationVars.pageNames,
                    'DOMObjects':pageObjects
                },
                '\nSettings',{
                    'scrollSpeed': paginationVars.scrollSpeed,
                    'isDevMode': paginationVars.isDevMode
                }
            )
        }

        //scroll to the first page
        var urlHash = window.location.hash.replace("#",""),
            firstPageOverride = paginationVars.pageNames.indexOf(urlHash);
        if(firstPageOverride > -1 && firstPageOverride != 0) paginationVars.changePage(pageNames[firstPageOverride], "initial hash");
        else paginationVars.changePage(pageNames[0], "first page", true)

        //listen for touch scrolling
        var initialPosition = null;
        window.addEventListener("touchstart", e => initialPosition = e.touches[0].clientY);
        window.addEventListener("touchmove", e => {
            //if no movement is detected
            if(initialPosition === null || paginationVars.scrollDisabled) return;
            
            //calculate the position difference from old to new to calculate direction
            var newPosition = e.touches[0].clientY, 
                positionDifference = initialPosition - newPosition;
            
            //do the page changing
            if(positionDifference > 0) {
                var nextpage = paginationVars.pageNames[paginationVars.pageNames.indexOf(paginationVars.activePage) + 1];
                if(nextpage != undefined) paginationVars.changePage(nextpage, "touch listener")
                else return;
            } else {
                var nextpage = paginationVars.pageNames[paginationVars.pageNames.indexOf(paginationVars.activePage) - 1];
                if(nextpage != undefined) paginationVars.changePage(nextpage, "touch listener")
                else return;
            }

            //reset for next time the handler runs
            initialPosition = null;
        });

        //listen for scrolling via mousewheel
        window.addEventListener("wheel", e => {
            if(paginationVars.scrollLocked || paginationVars.pageNames.indexOf(paginationVars.activePage) < -1  ){
                return false;
            } else if(!paginationVars.scrollLocked && (10 < e.deltaY || e.deltaY < -10)){
                var scrolldirection = e.deltaY >= 0 ? "up" : "down";
                if(scrolldirection == "up"){
                    var nextpage = paginationVars.pageNames[paginationVars.pageNames.indexOf(paginationVars.activePage) + 1];
                    if(nextpage) paginationVars.changePage(nextpage, "scroll")
                } else{
                    var nextpage = paginationVars.pageNames[paginationVars.pageNames.indexOf(paginationVars.activePage) - 1];
                    if(nextpage) paginationVars.changePage(nextpage, "scroll")
                }
            }
        });

        //listen for hash change
        window.addEventListener("hashchange", e => {
            if(!paginationVars.scrollLocked){
                var toPage = window.location.hash.replace('#','');
                if(toPage != paginationVars.activePage) paginationVars.changePage(toPage, "hashchange")
            } else return;
        });

        return true
}