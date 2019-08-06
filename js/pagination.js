// --------- global dev-side variables only accessed in this script ---------
var developerVars = {
    isInited: false,
    activePage: "",
    scrollDisabled: false
}

var pagination = {
    // --------- global variables set by init fn ---------
    pageNames: [],
    scrollSpeed: 1500,
    transitionType: "ease-in-out",
    isDevMode: false,   
    // --------- start pagination and set user variables ---------
    init: function({
        pageNames,
        startingPage,
        scrollSpeed,
        transitionType,
        isDevMode = false
    }){
        // --------- error catching ---------
        if(developerVars.isInited) throw new Error("this fn could only be called once");
        if(!pageNames) throw new Error("no pagenames variable set");
        if(!startingPage) throw new Error("no startingpage variable set");
        if(!scrollSpeed) throw new Error("no scrollspeed variable set");
        if(!transitionType) throw new Error("no scrollspeed variable set");
        // --------- set global variables ---------
        this.pageNames = pageNames;
        this.scrollSpeed = scrollSpeed;
        this.transitionType = transitionType;
        this.isDevMode = isDevMode;
        // --------- set body css properties ---------
        document.body.style.cssText = `overflow: hidden; transition: transform ${this.scrollSpeed}ms ${transitionType}`;
        // --------- go to first page --------
        var hash = window.location.hash.replace("#","");
        if(hash) this.changePage(this.pageNames[this.pageNames.indexOf(hash)], "initialHash")
        else this.changePage(this.pageNames[this.pageNames.indexOf(startingPage)], "initialHash")
        this.disableScroll(this.scrollSpeed);
        // --------- listen for location hash change ---------
        window.addEventListener("hashchange", e => {
            var changeToPage = location.hash.replace("#","");
            if(this.pageNames.includes(changeToPage)) this.changePage(changeToPage, "norel");
        });
        // --------- listen for scrolling via mouse ---------
        window.addEventListener("wheel", e => {
            if(developerVars.scrollDisabled || this.pageNames.indexOf(developerVars.activePage) < -1  ){
                return false;
            } else if(!developerVars.scrollDisabled && this.pageNames.indexOf(developerVars.activePage) > -1 && (e.deltaY, 10 < e.deltaY || e.deltaY < -10)){
                var scrolldirection = e.deltaY >= 0 ? "up" : "down";
                if(scrolldirection == "up"){
                    var nextpage = this.pageNames[this.pageNames.indexOf(developerVars.activePage) + 1];
                    if(nextpage != undefined) this.changePage(nextpage, "scroll")
                } else{
                    var nextpage = this.pageNames[this.pageNames.indexOf(developerVars.activePage) - 1];
                    if(nextpage != undefined) this.changePage(nextpage, "scroll")
                }
                this.disableScroll(this.scrollSpeed);
            }
        });
        // --------- listen for scrolling via touch ---------
        var initialY = null;
        window.addEventListener("touchstart", e => initialY = e.touches[0].clientY);
        window.addEventListener("touchmove", e => {
            if(initialY === null || developerVars.scrollDisabled) return;
            var currentY = e.touches[0].clientY, diffY = initialY - currentY;
            if(diffY > 0) {
                var nextpage = this.pageNames[this.pageNames.indexOf(developerVars.activePage) + 1];
                if(nextpage != undefined) this.changePage(nextpage, "touch")
            } else {
                var nextpage = this.pageNames[this.pageNames.indexOf(developerVars.activePage) - 1];
                if(nextpage != undefined) this.changePage(nextpage, "touch")
            }

            this.disableScroll(this.scrollSpeed);
            initialY = null;
        });
        // --------- make sure this fn cannot be run more then once ---------
        developerVars.isInited = true;
    },
    // --------- pretty self explanitory - changes the page ---------
    changePage: function(changeToPage, relHandler){
        // --------- animate the page change ---------
        document.body.style.transform = `translateY(-${this.pageNames.indexOf(changeToPage)}00vh)`
        // --------- change url hash and dev activepage var ---------
        developerVars.activePage = changeToPage;
        window.location.hash = developerVars.activePage; 
        // --------- log page change if in dev mode ---------
        if(this.isDevMode){
            if(relHandler && relHandler != "norel") console.log("Pagination | Changed page to",changeToPage,"via the",relHandler,"handler")
            else if(relHandler != "norel") console.log("Pagination | Changed page to",changeToPage,"via an unknown handler")
        }
    },
    // --------- disable all scroll handlers for x milliseconds ---------
    disableScroll: function(miliseconds){
        developerVars.scrollDisabled = true;
        if(this.isDevMode) console.log("Pagination | Disabled scrolling for",miliseconds, "miliseconds")
        setTimeout(function(){
            developerVars.scrollDisabled = false;
            if(pagination.isDevMode) console.log("Pagination | Enabled scrolling after",miliseconds, "miliseconds")
        }, miliseconds);
    }
}
// --------- alert errors ---------
window.onerror = function(msg, url, linenumber) {
    alert(
        `Pagination.js Error :(\n
        Error message: ${msg}\n
        Line: ${linenumber}\n
        URL: ${url}`
    );
    return;
}