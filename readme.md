# Hi, thanks for checking out Pagination.js!
Well, you've found yourself on the github repository for Pagination.js. What next?
First, **what is Pagination.js?**
Pagnation.js is a fast, easy and simple way to create beautiful single-age websites. Being just 4.93kb in size when minifified, and availible for FREE, Pagination.js loads quickly, doesn't hurt your bank account, and is not Fullscreen.js. Sorry not sorry.

Below you'll find instructions on [getting started](), [downloading](), as well as comprehensive [documentation]() of Pagination.js. Have an explore, or skip right to the [demo page](https://ryncmrfrd.com/pagination)

# Getting Started

Pagination.js is so easy to use, getting started takes only a minute, 4 lines of HTML and 1 JS function.
The required HTML:
```HTML
<main id="wrapper">
    <section class="page1">page1</section>
    <section class="page2">page2</section>
    <section class="page3">page3</section>
</main>
```
The `<main>` tag is the pagination wrapper in this case, and holds all the pages (the `<section>` tags). The ID of the wrapper is required for the script to find the HTML structure, and the (first) class of each section is used as the section name.
As for JS, the only required code is as such:
```Javascript
new pagination("wrapper")
```
The `pagination` constructor requires only 1 argument - the ID of the wrapper (the `<main>` in this demo case), however a second argument of options can be provided for more fidelity. Currently only 3 options are availible but I plan to add more in the future. The current options:
```Javascript
{
    useHashes: true,
    scrollSpeed: 1000,
    isDevMode: false,
}
```
The exact details of each variable are explained in the Full Documentation section.

# Download

To download Pagintion.js simply save [pagination.min.js](https://raw.githubusercontent.com/ryncmrfrd/pagination/master/js/pagination.min.js). If you skipped here from the top, now is probably a good time to read the "Getting Started" section.

# Full Documentation (for nerds)

Pagination.Js contains 2 main js objects - pagination and _pagination. Below are the details of each object:

#### pagination

The first object, "pagination" is used as an init function, and is the only function intended to be called by the end user. It is a constructor, thus the intended way of running this function is `new pagination(pageWrapperID, Options)`. The arguments passed (pageWrapperID and "Options") dictate where and how the sections will be presented. pageWrapperID is the HTML ID of the wrapper element containing the sections. For example:
```HTML
<main id="wrapper">
    <section class="page1">page1</section>
    <section class="page2">page2</section>
    <section class="page3">page3</section>
</main>
```
In this situation, by running `new pagination("wrapper")`, pagination.js will create a 3 section page with all default options. 
The "Options" argument is passed as an object iself (`{}`), and dictates 3 variables which can be changed by the user.
- The `useHashes` boolean dictates if pagination.js will utilise URL hashes/anchors while changing pages (there are found by) looking for the first class of each section element. Default `true`.
- The `scrollSpeed` variable specifies (in miliseconds) how quickly the user can scroll between pages and in turn how long scrolling is disabled for while the page changes. Default `1000`.
- `isDevMode` is a boolean that dictates if pagination.js will console.log page changes and other developer options. Default `false`.

#### _pagination

As opposed to the pagination constructor, _pagination stores variables and functions used inside the script but are not intended to be called by the end user. Under _pagination is the _vars object and the _api object.

**_vars** - Obviously stores both the objects specified by the pagination() constructor and other miscelaneous objects used inside the script.
- activePage  | default `""`
- scrollLocked  | default `false`
- pageWrapper  | default `document.body`
- pageNames  | default `[]`
- useHashes  | default `true`
- scrollSpeed  | default `1000`
- isDevMode | default `false`

**_api** - Provides access to the 2 main internal functions.

 - `changePage(changeToPage, relHandler)` - This function is pretty self-explanitory - it changes the shown page.
    Arguments:
    - changeToPage - The name of the page to be changed to.
    - relHandler - For console.log purposes, speficies the origin of the function call. Eg. `hashchange`
- `disableScroll(miliseconds)` - Disable all page changing for "miliseconds" miliseconds.
 - Arguments:
    - miliseconds - How long to disable all handlers for in milliseconds. Eg. `1000` will disable all handlers for 1 second.