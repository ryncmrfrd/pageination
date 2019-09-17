new pageination(
    'wrapper', {
        dots: { dotPosition: "right", dotTheme: "light" },
        onPageChange: page => {
            document.title = `${page} | Pagination.js`
        }
    }
);

fitty('.fit');

const arrowHand = document.querySelector("#arrow-hand");

window.addEventListener("load", e => {
    if (window.innerWidth < 550) {
        arrowHand.classList.add("fa-hand-point-down");
    } else if (window.innerWidth > 550) {
        arrowHand.classList.add("fa-hand-point-right");
    }
})

window.addEventListener("resize", e => {
    if (window.innerWidth < 550) {
        if (arrowHand.classList.contains("fa-hand-point-down")) return;
        arrowHand.classList.remove("fa-hand-point-right");
        arrowHand.classList.add("fa-hand-point-down");
    } else if (window.innerWidth > 550) {
        if (arrowHand.classList.contains("fa-hand-point-right")) return;
        arrowHand.classList.remove("fa-hand-point-down");
        arrowHand.classList.add("fa-hand-point-right");
    }
});

const downArrow = document.querySelector("#down-arrow");

downArrow.addEventListener("click", e => {
    _pageination.api.changePage("Mobile");
});

downArrow.addEventListener("mouseover", e => {
    if (document.querySelector("#down-arrow").classList[0] == "is-animated") return;
    downArrow.classList.add("is-animated");
    setTimeout(function () { downArrow.classList.remove("is-animated") }, 2000);
});