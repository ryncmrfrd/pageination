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
        this.activePage = this.pageNames[this.pageNames.indexOf(hash)];
        document.body.style.transform = `translateY(-${this.pageNames.indexOf(hash)}00vh)`;

        // --------- listen for location hash change ---------
        window.addEventListener("hashchange", e => {
            var changeToPage = location.hash.replace("#","");

            if(this.pageNames.includes(changeToPage)){
                this.changePage(changeToPage, "hashchange")
            }
        });

        // --------- listen for scrolling ---------
        window.addEventListener("wheel", e => {

            if(this.scrollDisabled || this.pageNames.indexOf(this.activePage) < 0){
                console.log("yeet", this.scrollDisabled, this.pageNames.indexOf(this.activePage) < 0);
            } else if(!this.scrollDisabled && this.pageNames.indexOf(this.activePage) > 0){

                console.log("yooo",this.scrollDisabled, this.pageNames.indexOf(this.activePage))

                var scrolldirection = e.deltaY >= 0 ? "up" : "down";
                if(scrolldirection == "up"){
                    this.changePage(this.pageNames[this.pageNames.indexOf(this.activePage) + 1], "scroll")
                } else{
                    this.changePage(this.pageNames[this.pageNames.indexOf(this.activePage) - 1], "scroll")
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
            if(relHandler) console.log(`Pagination | Changed page to ${ changeToPage} via "${relHandler}" handler`)
            else console.log(`Pagination | Changed page to ${ changeToPage} via an unknown handler`)
        }
    },
}