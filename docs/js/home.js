/*
 
    Pageination Demo Page.

*/

let _pageination = new pageination("#wrapper", {
    type: "vertical",
    onPageChange: function(e){ document.title = e + "| Pagination.js" }
});

_pageination.type = "horizontal";
console.log(_pageination.type)

fitty(".fit");

const downArrow = document.querySelector("#down-arrow");

downArrow.addEventListener("click", function(e){
    _pageination.nextPage();
});
downArrow.addEventListener("mouseover", function(e){
    downArrow.classList.add("is-animated")
    setTimeout(function () {
        downArrow.classList.remove("is-animated");
    }, 2e3);
});
