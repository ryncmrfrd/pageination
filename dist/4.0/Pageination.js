// @ts-check
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Pageination = /** @class */ (function () {
    /**
     * @constructor
     * The main Pageination object, representing a scrolling screen window.
     *
     * @param {string} elementID - The ID of the main Pageination wrapper element.
     * @param {boolean} [devMode] - Run Pageination with developmer console output.
     * @param {ScrollDirection} [scrollDirection] - The scroll direction of the page.
     * @param {number} [scrollSensitivity] - The minimum scroll value to trigger a page change.
     * @param {number} [scrollSpeed] - Time taken to scroll between pages (milliseconds).
     * @param {number} [resizeSensitivity] - Time taken to resize the page on window size change (milliseconds).
     * @param {Dots} [dots] - If present, dots displaying the current page are shown.
     * @param {DotsLocation} [dots.location] - Rendered position of navigation dots.
     * @param {DotsTheme} [dots.theme] - Colour theme of navigation dots.
     *
     * @param {Function} [onInit] - Callback for finished page initialisation.
     * @param {Function} [onPageChange] - Callback for any type of page change.
     */
    function Pageination(elementID, devMode, scrollDirection, scrollSensitivity, scrollSpeed, resizeSensitivity, dots, onInit, onPageChange) {
        // Constants
        this.BODY_ELEMENT = document.body;
        this.BODY_CLASS = "pageinationbody";
        this.WRAPPER_CLASS = "pageinationwrapper";
        this.PAGE_CLASS = "pageinationpage";
        this.DOT_WRAPPER_CLASS = "pageinationdots";
        this.DOT_CLASS = "pageinationdot";
        this.scrollDisabled = false;
        this.activePageIndex = 0;
        this.initialPositionX = null;
        this.initialPositionY = null;
        this.reizeTimer = null;
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;
        // Validate constructor arguments
        this.validateParameters(elementID, devMode, scrollDirection, scrollSensitivity, scrollSpeed, resizeSensitivity, dots, onInit, onPageChange);
        // Assign parameters
        this.elementID = elementID;
        this.devMode = devMode;
        this.scrollDirection = scrollDirection;
        this.scrollSensitivity = scrollSensitivity;
        this.scrollSpeed = scrollSpeed;
        this.resizeSensitivity = resizeSensitivity;
        this.dots = dots;
        // Assign callbacks
        this.onInit = onInit;
        this.onPageChange = onPageChange;
        // Assign
        this.element = document.querySelector(this.elementID);
        this.pageElements = document.querySelectorAll("".concat(this.elementID, " section"));
        this.pageNames = Array.prototype.map.call(this.pageElements, function (el) { return el.id; });
        // Initialisation functions
        this.initaliseCSS();
        this.initialiseNavigationDots();
        this.initialiseEventListeners();
        // Call given onInit function
        this.onInit(this);
    }
    /**
     * The main Pageination object
     * @throws {Error} - If parameter does not match validation rules.
     */
    Pageination.prototype.validateParameters = function (elementID, devMode, scrollDirection, scrollSensitivity, scrollSpeed, resizeSensitivity, dots, onInit, onPageChange) {
        // TODO implement
        if (false) {
            throw new Error("Invalid devMode. Must be of type boolean.");
        }
    };
    Pageination.prototype.initaliseCSS = function () {
        // Add HTML body element classes
        this.BODY_ELEMENT.classList.add("".concat(this.BODY_CLASS));
        this.BODY_ELEMENT.classList.add("".concat(this.BODY_CLASS).concat(this.scrollDirection));
        // Add pageination element classes
        this.element.classList.add("".concat(this.WRAPPER_CLASS));
        this.element.classList.add("".concat(this.WRAPPER_CLASS).concat(this.scrollDirection));
        // Add PAGE_CLASS to each page element
        this.pageElements.forEach(function (element) {
            element.classList.add("".concat(this.PAGE_CLASS));
        });
    };
    Pageination.prototype.initialiseNavigationDots = function () {
        var newDotsElement = document.createElement("div");
        newDotsElement.classList.add("".concat(this.DOT_WRAPPER_CLASS));
        newDotsElement.classList.add("".concat(this.DOT_WRAPPER_CLASS).concat(this.dots.type), "".concat(this.DOT_WRAPPER_CLASS).concat(this.dots.theme));
        this.pageNames.forEach(function (pageName, i) {
            {
                var dot = document.createElement("span");
                dot.id = pageName;
                dot.classList.add("".concat(this.DOT_CLASS));
                if (i === 0) {
                    dot.classList.add("".concat(this.DOT_CLASS, "active"));
                }
                dot.addEventListener("click", function (e) {
                    e.preventDefault();
                    Pageination.changePage(pageNames.indexOf(e.target.id));
                });
                dotsWrapper.append(dot);
            }
        });
        this.BODY_ELEMENT.prepend(newDotsElement);
    };
    Pageination.prototype.initialiseEventListeners = function () {
        window.addEventListener("wheel", this.handleScrollWheel);
        window.addEventListener("touchstart", this.handleTouchStart);
        window.addEventListener("touchmove", this.handleTouchMove);
        window.addEventListener("resize", this.handleResize);
    };
    Pageination.prototype.handleScrollWheel = function () {
    };
    Pageination.prototype.handleTouchStart = function () {
    };
    Pageination.prototype.handleTouchMove = function () {
    };
    Pageination.prototype.handleResize = function () {
    };
    Pageination.prototype.changePage = function (pageIndex) {
    };
    /**
     * Navigate to the next page (down/right).
     * If on the last page, does nothing.
     */
    Pageination.prototype.nextPage = function () {
        this.changePage(this.activePageIndex + 1);
    };
    /**
     * Navigate to the previous page (up/left).
     * If on the first page, does nothing.
     */
    Pageination.prototype.prevPage = function () {
        this.changePage(this.activePageIndex - 1);
    };
    return Pageination;
}());
