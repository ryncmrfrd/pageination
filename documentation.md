# :computer: Pageination.js Documentation
[![GitHub forks](https://img.shields.io/github/forks/ryncmrfrd/pageination?label=Fork&style=social)](https://githubcom/ryncmrfrd/pageination)
[![GitHub stars](https://img.shields.io/github/stars/ryncmrfrd/pageination?style=social)](https://githubcom/ryncmrfrd/pageination)

> Here you can find the FULL documentation for Pageination.js. For a less comprehensive look (ie. a bit more "quickstarty") take a look [here](https://github.com/ryncmrfrd/pageination/blob/master/readme.md).

Pageination.Js contains 2 main js objects - pageination and _pageination.

The first object, pageination is a constructor and is the only function intended to be run by the end user. It handles config options (listed below) and adds all the necessary CSS and eventListeners for pageination to run.

:nerd_face: Config options are as follows:

Variable | Description | Type | Values | Required
--- | --- | --- | --- | ---
pageinationWrapperID | ID of the HTML main tag that wraps all pages.  | `string` |  Any string. |  `true`
scrollSpeed | How fast to scroll between pages in milliseconds. | `number` |  Number > 0 |  `false`
isDevMode | Enables/disables developer console logs. | `boolean` |  True/False |  `false`
dots | Contains *dotPosition* and *dotTheme*.  | `object` |  { dotPosition: "", dotTheme: ""} |  `false`
* dotPosition | Where to place the page dots on the screen. | `string` |  "top", "left", "bottom", "right" |  If *dots* `true`
* dotTheme | The "colour" of the dots. | `string` |  "light", "dark" |  If *dots* `true`
onInit | Function which calls after pageination hass initialised. | `function` |  Valid function |  `false`
onPageChange | Function which calls after a page change. | `function` |  Valid function |  `false`

## :tv: Demo HTML Structure

```html
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

## :iphone: Demo JS
```js
    new pageination(pageinationWrapperID, {

        scrollSpeed = 1000,
        isDevMode = false,
        dots = { dotPosition: "left", dotTheme: "light" },

        onInit = function () {},
        onPageChange = function () {})
    });
```

## :wave: Say Hi!

[![GitHub followers](https://img.shields.io/github/followers/ryncmrfrd?label=Follow&style=social)](https://github.com/ryncmrfrd)
[![Twitter Follow](https://img.shields.io/twitter/follow/ryncmrfrd?label=Follow&style=social)](https://twitter.com/ryncmrfrd)
Or :email: me at [ryncmrfrd@outlook.com](mailto:ryncmrfrd@outlook.com).