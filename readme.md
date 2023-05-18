# 📄 Pageination.JS

### Introduction

`pageination.js` is a small, light, library for building single-page, scrolling websites. It was originally build as a personal challenge, as the most ambitious project I had undertaken at the time, in 2019.

Over the years I've returned to the project several times to improve it with the skills I'd gathered in the time being, and just recently I've undertaken development of the next major version, including a migration from CSS and JS to Sass and TypeScript.

### Get Started

1. Download the main Javascript file [here](https://github.com/ryncmrfrd/pageination/blob/master/dist/3.1.0/pageination-3.1.0.min.js).
2. Add a basic HTML structure.
	```HTML
	<main id="wrapper">
	    <section class="Page1">
	        Page1
	    </section>
	    <section class="Page2">
	        Page2
	    </section>
	    <section class="Page3">
	    	Page3
	    </section>
	</main>
	```
3. Sprinkle in a tiny bit of JS.
	```javascript
	new pageination("#wrapper");
	```
4. And you're done! (Easy right?).

### Contributing

Contributions, issues, and feature requests are welcome! Feel free to check issues page, or to email me personally - just click the link on my website.

# 💻 Documentation

### Compatibility

`pageination.js` uses many JS features introduced by EMCAScript 2015, including arrow functions, let and const, default parameters, and the spread operator. Below is a full compatibility table for most modern browsers.
Chrome | Edge | Safari | Firefox | Opera | IE | Chrome (Android) | Firefox (Android) | Samsung Internet
:---: | :---: | :---: | :---: | :---:| :---:| :---:| :---:| :---:
51 | 15 | 10 | 54 | 38 | No Support | 113 | 20 | 113 

### Usage

The only file required in order to use `pageination.js` is the `pageination-3.1.1.min.js` javascript file. There aren't any CDNs currently serving these files, so it has to be downloaded from [Github](https://github.com/ryncmrfrd/pageination/blob/master/dist/3.1.0/pageination-3.1.0.min.js). Otherwise, you can use the development, non-minified version [here](https://github.com/ryncmrfrd/pageination/blob/master/dist/3.1.0/pageination-3.1.0.js), and explore the CSS (which is automatically injected by the Javascript file), [here](https://github.com/ryncmrfrd/pageination/blob/master/dist/3.1.0/pageination-3.1.0.min.js).

The required HTML structure consists of a `<main>` tag wrapping the entire page, with `<section>` tags for each page. An example full HTML file can be seen below.

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
	<title>Pageination.JS</title>
	<meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body>
	<main id="wrapper">
		<section class="Page1">
			Page1
		</section>
		<section class="Page2">
			Page2
		</section>
		<section class="Page3">
			Page3
		</section>
	</main>
	<script type="text/javascript" src="pageination-3.1.0.min.js"></script>
</body>
</html>
```

In terms of javascript, the required code for `pageination.js` is deliberately very little.

```javascript
new pageination("#wrapper");
```

Even with all options initialised with their default values, the javascript is still quite minimal.

```javascript
new pageination(elementName, {
	type = "vertical",
	speed = 500,
	scrollSensitivity = 25,
  dots = {
		type: "right",
		theme: "light"
	},
  devMode = false,
	onInit = (pageination) => {},
	onPageChange = (pageName, pageIndex) => {}
});
```

### Options

Variable | Description | Type | Values | Required
--- | --- | --- | --- | ---
elementName | Query selector of the main tag that wrapping all pages.  | `string` |  Any string |  `true`
scrollSpeed | ID of the HTML main tag that wraps all pages.  | `string` |  Any string |  `true`
scrollSensitivity | Speed to scroll between pages (milliseconds). | `integer` |  > 0 |  `false`
dots | Contains *dotPosition* and *dotTheme*.  | `object` |  { type: "", theme: ""} |  `false`
type | Position of the dots on the screen. | `string` |  "top", "left", "bottom", "right" |  If *dots* `true`
theme | The colour of the dots. | `string` |  "light", "dark" |  If *dots* `true`
isDevMode | Enables useful developer console logs. | `boolean` |  True/False |  `false`

### Callbacks

#### onInit(`pageination`)
Required: `false`
Callback which fires after all initialisation functions have been completed. Parameters:
* `pageination`: the object created by the pageination constructor.

#### onPageChange(`pageName`, `pageIndex`)
Required: `false`
Callback which fires after any page change. Parameters:
* `pageName`: string, the ID of the page changed to, ie. the newly active page.
* `pageIndex`: int, the index of the page changed to (in order of `<section>` tags).
