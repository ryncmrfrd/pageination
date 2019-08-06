

const pagination = {
    activePage: "",
    scrollLocked: false,
    //global variables set by init function
    pageNames: [],
    scrollSpeed: 1500,
    isDevMode: false,
    //set initial variables, set styles, and run error checks
    init: function({
        pageNames,
        startingPage = pageNames[0],
        scrollSpeed = 1500,
        isDevMode = false
    }){
        //pageNames error handling
        if(!pageNames) throw new Error('A list of page names MUST be privided in the "pageNames" argument of the "init" function.');
        else if(typeof(pageNames) != "object") throw new Error('The "pageNames" variable must be of type "array/object"');
        else if(pageNames.length < 1) throw new Error('At least 1 page must be present in the "pageNames" variable.');

        //startingPage error handling
        if(!startingPage) console.warn('It is recommended that a initial loading page is provided. Currently it is set to',pageNames[0]);
        else if(typeof(startingPage) != "string") throw new Error('The "startingPage" variable must be of type "string"');
        else if(pageNames.indexOf(startingPage) < 0) throw new Error('The "startingPage" must be part of the "pageNames" array.');
    
        //mist other options error handling (generally just type checks)
        if(typeof(isDevMode) != "boolean") throw new Error('Variable "isDevMode" must be of type "boolean".');
        if(typeof(scrollSpeed) != "number") throw new Error('Variable "scrollSpeed" must be of type "number".');
        
        //setting the global variables
        this.pageNames = pageNames;
        this.scrollSpeed = scrollSpeed;
        this.isDevMode = isDevMode;

        //set body css to stop scrolling and add scroll animation
        document.body.style.overflow = "hidden";
        document.body.style.transition = `transform ${this.scrollSpeed}ms ease-in-out`;

        //scroll to the first page
        var urlHash = window.location.hash.replace("#",""),
            firstPageOverride = pageNames.indexOf(urlHash);
        if(firstPageOverride  > -1) this.changePage(pageNames[firstPageOverride], "initial hash");
        else this.changePage(startingPage, "starting page variable")

        //listen for touch scrolling
        var initialPosition = null;
        window.addEventListener("touchstart", e => initialPosition = e.touches[0].clientY);
        window.addEventListener("touchmove", e => {
            //if no movement is detected
            if(initialPosition === null || this.scrollDisabled) return;
            
            //calculate the position difference from old to new to calculate direction
            var newPosition = e.touches[0].clientY, 
                positionDifference = initialPosition - newPosition;
            
            //do the page changing
            if(positionDifference > 0) {
                var nextpage = this.pageNames[this.pageNames.indexOf(this.activePage) + 1];
                if(nextpage != undefined) this.changePage(nextpage, "touch listener")
                else return;
            } else {
                var nextpage = this.pageNames[this.pageNames.indexOf(this.activePage) - 1];
                if(nextpage != undefined) this.changePage(nextpage, "touch listener")
                else return;
            }
            
            this.disableScroll(this.scrollSpeed);

            //reset for next time the handler runs
            initialPosition = null;
        });

        //listen for scrolling via mousewheel
        window.addEventListener("wheel", e => {
            if(this.scrollDisabled || this.pageNames.indexOf(this.activePage) < -1  ){
                return false;
            } else if(!this.scrollDisabled && this.pageNames.indexOf(this.activePage) > -1 && (e.deltaY, 10 < e.deltaY || e.deltaY < -10)){
                var scrolldirection = e.deltaY >= 0 ? "up" : "down";
                if(scrolldirection == "up"){
                    var nextpage = this.pageNames[this.pageNames.indexOf(this.activePage) + 1];
                    if(nextpage != undefined) this.changePage(nextpage, "scroll")
                } else{
                    var nextpage = this.pageNames[this.pageNames.indexOf(this.activePage) - 1];
                    if(nextpage != undefined) this.changePage(nextpage, "scroll")
                }
                this.disableScroll(this.scrollSpeed);
            }
        });

        return true
    },
    //change to the desired page
    changePage: function(changeToPage, relHandler = "unknown"){
        var page = this.pageNames[this.pageNames.indexOf(changeToPage)]

        //changeToPage error handling
        if(!changeToPage) throw new Error('To change to a page, that page is required.');
        else if(typeof(changeToPage) != 'string') throw new Error('The "changeToPage" variable must be of type "string"');
        else if(!page) console.warn('The chosen page was not found in the "pageNames" variables, thus the page was not changed.');

        //animate the page change
        document.body.style.transform = `translateY(-${this.pageNames.indexOf(page)}00vh)`

        //
        pagination.activePage = page;

        //wait until half way through the scroll animation
        setTimeout(function(){
            //set window hash to the changed to page
            window.location.hash = page;
            //console.log if in dev mode
            if(pagination.isDevMode) console.log('Changed page to',page,'via "'+relHandler+'"')
        }, this.scrollSpeed / 2);

        return true
    },
    //disable the scroll handlers for x miliseconds
    disableScroll: function(miliseconds){
        this.scrollLocked = true;
        if(this.isDevMode) console.log('Disabled scrolling for',miliseconds,'miliseconds');
        setTimeout(function(){
            this.scrollLocked = false;
            if(pagination.isDevMode) console.log('Enabled scrolling after',miliseconds,'miliseconds')
        }, miliseconds);
    }
}