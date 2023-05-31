/**
 
    Pageination | Simple, free, single-page websites.
    @version 4.0
    @author Ryan Comerford <https://ryncmrfrd.com>

*/

import { ScrollDirection } from "./enums/ScrollDirection" 
import { Dots } from "./modules/Dots" 

export class Pageination 
{
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
	constructor(
		elementID: string,
		devMode: boolean,
		scrollDirection: ScrollDirection,
		scrollSensitivity: number,
		scrollSpeed: number,
		resizeSensitivity: number,
		dots: Dots,
		onInit: Function,
		onPageChange: Function,
	){
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
		this.pageElements = document.querySelectorAll(`${this.elementID} section`);
		this.pageNames = Array.prototype.map.call(this.pageElements, el => el.id);

		// Initialisation functions
		this.initaliseCSS();
		this.initialiseNavigationDots();
		this.initialiseEventListeners();

		// Call given onInit function
		this.onInit(this);
	}

	// Constructor Parameters & Callbacks
	readonly elementID: string;
	readonly devMode: boolean;
	readonly scrollDirection: ScrollDirection;
	readonly dots: Dots;
	readonly scrollSpeed: number;
	readonly scrollSensitivity: number;
	readonly resizeSensitivity: number;
	readonly onInit: Function;
	readonly onPageChange: Function;

	// Constants
	readonly BODY_ELEMENT: HTMLElement = document.body;
	readonly BODY_CLASS: string = "pageinationbody";
	readonly WRAPPER_CLASS: string = "pageinationwrapper";
	readonly PAGE_CLASS: string = "pageinationpage";
	readonly DOT_WRAPPER_CLASS: string = "pageinationdots";
	readonly DOT_CLASS: string = "pageinationdot";

	// Private Variables
	element: HTMLElement;
	pageElements: NodeListOf<Element>;
	pageNames: Array<string>;
	scrollDisabled: boolean = false;
	activePageIndex: number = 0;
	initialPositionX: number = null;
	initialPositionY: number = null;
	reizeTimer: number = null;
	windowHeight: number = window.innerHeight;
	windowWidth: number = window.innerWidth;

	/**
	 * The main Pageination object
	 * @throws {Error} - If parameter does not match validation rules.
	 */
	private validateParameters(
		elementID: string,
		devMode: boolean,
		scrollDirection: ScrollDirection,
		scrollSensitivity: number,
		scrollSpeed: number,
		resizeSensitivity: number,
		dots: Dots,
		onInit: Function,
		onPageChange: Function,
	){
		// TODO implement
		if(false) 
		{
			throw new Error("Invalid devMode. Must be of type boolean.");
		}
	}

	private initaliseCSS()
	{
		// Add HTML body element classes
		this.BODY_ELEMENT.classList.add(`${this.BODY_CLASS}`);
		this.BODY_ELEMENT.classList.add(`${this.BODY_CLASS}${this.scrollDirection}`);

		// Add pageination element classes
		this.element.classList.add(`${this.WRAPPER_CLASS}`)
		this.element.classList.add(`${this.WRAPPER_CLASS}${this.scrollDirection}`)

		// Add PAGE_CLASS to each page element
		this.pageElements.forEach(function(element){
			element.classList.add(`${this.PAGE_CLASS}`);
		});
	}

	private initialiseNavigationDots()
	{
		var newDotsElement: HTMLDivElement = document.createElement("div");

		newDotsElement.classList.add(`${this.DOT_WRAPPER_CLASS}`);

		newDotsElement.classList.add(
			`${this.DOT_WRAPPER_CLASS}${this.dots.type}`, 
			`${this.DOT_WRAPPER_CLASS}${this.dots.theme}`
		);
	
		this.pageNames.forEach(function(pageName, i){{

			var dot: HTMLSpanElement = document.createElement("span");

			dot.id = pageName;
			dot.classList.add(`${this.DOT_CLASS}`);

			if(i === 0) 
			{
				dot.classList.add(`${this.DOT_CLASS}active`);
			}

			dot.addEventListener("click", function(e){
				e.preventDefault();
				changePage(pageNames.indexOf(e.target.id) );
			});
	
			dotsWrapper.append(dot);
		})
				
		this.BODY_ELEMENT.prepend(newDotsElement);
	}

	private initialiseEventListeners()
	{
		window.addEventListener("wheel", this.handleScrollWheel);
		window.addEventListener("touchstart", this.handleTouchStart);
		window.addEventListener("touchmove", this.handleTouchMove);
		window.addEventListener("resize", this.handleResize);
	}

	private handleScrollWheel()
	{

	}

	private handleTouchStart()
	{

	}

	private handleTouchMove()
	{

	}

	private handleResize()
	{

	}

	changePage(pageIndex: number)
	{

	}

	/**
	 * Navigate to the next page (down/right).
	 * If on the last page, does nothing.
	 */
	nextPage()
	{
		this.changePage(this.activePageIndex + 1);
	}

	/**
	 * Navigate to the previous page (up/left).
	 * If on the first page, does nothing.
	 */
	prevPage()
	{
		this.changePage(this.activePageIndex - 1);
	}

}