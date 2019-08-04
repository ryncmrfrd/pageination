var pagination = {
    isInited: false,
    isDevMode: false,
    activePage: "",
    scrollDisabled: false,
    pageNames: [],
    init: function(
        pageNames,
        startingPage,
        isDevMode
    ){
        // --------- error handling ---------
        if(this.isInited) throw new Error("Page already intialised - this function can only be called once.")
        else if(!pageNames) throw new Error("names of each page is required")
        else if(!startingPage) throw new Error("page to load onto unless otherwise specified")

        // --------- set global variables ---------
        this.pageNames = pageNames;
        if(isDevMode) this.isDevMode = isDevMode;

        // go to first page
        var hash = window.location.hash.replace("#","");
        if(hash) this.changePage(this.pageNames[this.pageNames.indexOf(hash)], "initialHash")

        // --------- listen for location hash change ---------
        window.addEventListener("hashchange", e => {
            var changeToPage = location.hash.replace("#","");
            if(this.pageNames.includes(changeToPage)){
                this.changePage(changeToPage, "norel");
            }
        });

        // --------- listen for scrolling ---------
        window.addEventListener("wheel", e => {

            if(this.scrollDisabled || this.pageNames.indexOf(this.activePage) < -1  ){
                return false;
            } else if(!this.scrollDisabled && this.pageNames.indexOf(this.activePage) > -1){

                var scrolldirection = e.deltaY >= 0 ? "up" : "down";
                if(scrolldirection == "up"){
                    var nextpage = this.pageNames[this.pageNames.indexOf(this.activePage) + 1];
                    if(nextpage != undefined) this.changePage(nextpage, "scroll")
                } else{
                    var nextpage = this.pageNames[this.pageNames.indexOf(this.activePage) - 1];
                    if(nextpage != undefined) this.changePage(nextpage, "scroll")
                }
    
                this.scrollDisabled = true;
                setTimeout(function(){
                    pagination.scrollDisabled = false;
                }, 1500);

            }

        });
    },
    changePage: function(changeToPage, relHandler){

        document.body.style.transform = `translateY(-${this.pageNames.indexOf(changeToPage)}00vh)`

        this.activePage = changeToPage;
        window.location.hash = this.activePage; 

        //for dev mode logs
        if(this.isDevMode){
            if(relHandler && relHandler != "norel") console.log(`Pagination | Changed page to ${ changeToPage} via "${relHandler}" handler`)
            else if(relHandler != "norel")console.log(`Pagination | Changed page to ${ changeToPage} via an unknown handler`)
        }
    },
}