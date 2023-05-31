"use strict";

import { Pageination } from "../Pageination"

/**
 * Themes dots can be shown with.
 */
enum DotsTheme 
{
	Light,
	Dark
}

/**
 * Locations dots can be shown.
 */
enum DotsLocation 
{
	Top,
	Right,
	Bottom,
	Left
}

export class Dots {

	/**
	 * @constructor
	 * Class representing the page's navigation dots.
	 * 
	 * @param {DotsLocation} location - Rendered position of navigation dots.
	 * @param {DotsTheme} theme - Colour theme of navigation dots.
	 * @param {Pageination} PAGE_INSTANCE - The pageination class with the dots.
	 */
	constructor(
		location: DotsLocation,
		theme: DotsTheme,
		PAGE_INSTANCE: Pageination
	){
		this.location = location;
		this.theme = theme;
		this.PAGE_INSTANCE = PAGE_INSTANCE
	}

	// Constructor Parameters
	readonly location: DotsLocation;
	readonly theme: DotsTheme;

	// Constants
	private readonly PAGE_INSTANCE: Pageination;

	/**
	 * Create dots HTML elements and add to body.
	 */
	initialise()
	{
		const NEW_ELEMENT: HTMLDivElement = document.createElement("div");

		NEW_ELEMENT.classList.add(
			this.PAGE_INSTANCE.WRAPPER_CLASS,
			`${this.PAGE_INSTANCE.WRAPPER_CLASS}${this.location}`, 
			`${this.PAGE_INSTANCE.WRAPPER_CLASS}${this.theme}`
		);
	
		this.PAGE_INSTANCE.pageNames.forEach(function(pageName, i){{

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
	
			NEW_ELEMENT.append(dot);
		})
				
		this.BODY_ELEMENT.prepend(NEW_ELEMENT);
	}

	/**
	 * Changes the currently active dot to that at pageIndex.
	 * @param {number} pageIndex - The index of the newly active page.
	 */
	changeActive(
		pageIndex: number
	){
		// Constant Variables
		const DOTS_WRAPPER: HTMLElement = document.querySelector(`.${this.WRAPPER_CLASS}`);
		const DOTS_ELEMENTS: NodeListOf<HTMLSpanElement> = DOTS_WRAPPER.querySelectorAll('span')
		const ACTIVE_DOTS_ELEMENT: Element = DOTS_WRAPPER.querySelector(`.${this.ACTIVE_DOT_CLASS}`);

		// Remove current active class and add to element at index
		ACTIVE_DOTS_ELEMENT.classList.remove(this.ACTIVE_DOT_CLASS);
		DOTS_ELEMENTS[pageIndex].classList.add(this.ACTIVE_DOT_CLASS);
	}
}