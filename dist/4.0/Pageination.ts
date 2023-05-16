/**
 
    Pageination | Simple, free, single-page websites.
    @version 4.0
    @author Ryan Comerford <https://ryncmrfrd.com>

*/

"use strict";

/**
 * The main Pageination object
 * @constructor
 * @param {string} elementID - The ID of the main Pageination wrapper element.
 * @param {boolean} devMode - The ID of the main Pageination wrapper element.
 * @param {Direction} direction - The ID of the main Pageination wrapper element.
 * @param {Dots} dots - The ID of the main Pageination wrapper element.
 * @param {number} speed - The ID of the main Pageination wrapper element.
 * @param {number} scrollSensitivity - The ID of the main Pageination wrapper element.
 */
class Pageination {

	/**
	 * The ID of the main Pageination element
	 * @readonly
	 * @type {string}
	 */
	readonly elementID: string;

	readonly devMode: boolean;
	readonly direction: Direction;
	readonly dots: Dots;
	readonly speed: number;
	readonly scrollSensitivity: number;
   
	constructor(
		elementID: string,
		devMode: boolean,
		direction: Direction,
		dots: Dots,
		speed: number,
		scrollSensitivity: number
	) {
		this.elementID = elementID;
		this.devMode = devMode;
		this.direction = direction;
		this.dots = dots;
		this.speed = speed;
		this.scrollSensitivity = scrollSensitivity;
	}

	/**
	 * Automatically assign CSS classes to HTML structure
	 */
	initaliseCSS(){

	}

	createNavigationDots(){

	}

	addEventListeners(){

	}

	changePage(){

	}

	handleScrollWheel(){

	}

	handleTouchStart(){

	}

	handleTouchMove(){

	}

	handleResize(){

	}

}