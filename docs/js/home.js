/*
 
    Pageination Demo Page.

*/

new pageination("wrapper",{dots:{dotPosition:"right",dotTheme:"light"},onPageChange:n=>{document.title=`${n} | Pagination.js`}}),fitty(".fit");const arrowHand=document.querySelector("#arrow-hand");window.addEventListener("load",n=>{window.innerWidth<550?arrowHand.classList.add("fa-hand-point-down"):window.innerWidth>550&&arrowHand.classList.add("fa-hand-point-right")}),window.addEventListener("resize",n=>{if(window.innerWidth<550){if(arrowHand.classList.contains("fa-hand-point-down"))return;arrowHand.classList.remove("fa-hand-point-right"),arrowHand.classList.add("fa-hand-point-down")}else if(window.innerWidth>550){if(arrowHand.classList.contains("fa-hand-point-right"))return;arrowHand.classList.remove("fa-hand-point-down"),arrowHand.classList.add("fa-hand-point-right")}});const downArrow=document.querySelector("#down-arrow");downArrow.addEventListener("click",n=>{_pageination.api.changePage("Mobile")}),downArrow.addEventListener("mouseover",n=>{"is-animated"!=document.querySelector("#down-arrow").classList[0]&&(downArrow.classList.add("is-animated"),setTimeout(function(){downArrow.classList.remove("is-animated")},2e3))});