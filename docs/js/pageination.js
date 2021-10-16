/**
 
    Pageination | Simple, free, single-page websites.
    @version 3.0.0
    @author Ryan Comerford <https://ryncmrfrd.com>

*/

"use strict";function pageination(t=(()=>{throw new Error(`Pageination | ${txt}`)}),{type:e="vertical",speed:i=1e3,dots:a,autoScroll:o=!1,isBody:n=!0,onInit:s=(()=>{}),onPageChange:r=(()=>{})}={}){let l=0;!/(?:vertical|horizontal)/.test(e)&&(e="vertical"),Object.defineProperty(this,"type",{value:e,writable:!1}),Object.defineProperty(this,"speed",{value:+i||1e3,writable:!1}),a&&!/(?:top|left|bottom|right)/.test(a.type)&&(a.type="right"),a&&!/(?:light|dark)/.test(a.theme)&&(a.theme="light"),Object.defineProperty(this,"dots",{value:a||void 0,writable:!1}),Object.defineProperty(this,"autoScroll",{value:o,writable:!1}),Object.defineProperty(this,"isBody",{value:n||!0,writable:!1}),Object.defineProperty(this,"element",{value:document.querySelector(t),writable:!1}),Object.defineProperty(this,"pages",{value:document.querySelectorAll(`${t} section`),writable:!1});var d=[];this.pages.forEach((t,e)=>d.push(t.id||e)),Object.defineProperty(this,"pageNames",{value:d,writable:!1}),Object.defineProperty(this,"onInit",{value:s,writable:!1}),Object.defineProperty(this,"onPageChange",{value:r,writable:!1});var h=document.createElement("style");if(h.innerText=`.pageinationbody{height:100vh;width:100vw;margin:0}.pageinationbodyvertical{margin:0;overflow-y:hidden}.pageinationbodyhorizontal{margin:0;overflow-x:hidden}.pageinationwrapper{height:100%;-webkit-transition:-webkit-transform ${this.pageNames.length}ms ease-in-out;transition:-webkit-transform ${Number(this.speed/2)}ms ease-in-out;-o-transition:transform ${Number(this.speed/2)}ms ease-in-out;transition:transform ${Number(this.speed/2)}ms ease-in-out;transition:transform ${Number(this.speed/2)}ms ease-in-out,-webkit-transform ${Number(this.speed/2)}ms ease-in-out}.pageinationwrappervertical{-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);width:100%}.pageinationwrapperhorizontal{-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0);display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-flow:row nowrap;flex-flow:row nowrap;width:${this.pageNames.length}00%}.pageinationpage{height:100%!important;width:100%;overflow:hidden;-webkit-box-flex:2;-ms-flex-positive:2;flex-grow:2}.pageinationdots{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;margin:15px;z-index:999}.pageinationdotsleft, .pageinationdotsright{width:15px;position:fixed;top:50%;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.pageinationdotsright{right:0}.pageinationdotsleft{left:0}.pageinationdotsleft .pageinationdot, .pageinationdotsright .pageinationdot{margin:7.5px 0}.pageinationdotsleft .pageinationdotactive, .pageinationdotsright .pageinationdotactive{margin:5px 0!important}.pageinationdotsbottom, .pageinationdotstop{height:15px;position:fixed;left:50%;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.pageinationdotstop{top:50%}.pageinationdotsbottom{bottom:0}.pageinationdotsbottom .pageinationdot, .pageinationdotstop .pageinationdot{margin:0 7.5px}.pageinationdotsbottom .pageinationdotactive, .pageinationdotstop .pageinationdotactive{margin:0 5px!important}.pageinationdotactive{opacity:1!important;cursor:default!important;height:15px!important;width:15px!important}.pageinationdot{${this.autoScroll?"":"cursor:pointer"};height:10px;width:10px;opacity:.5;border-radius:7.5px;-webkit-transition:opacity ${Number(this.speed/2)}ms,height ${Number(this.speed/2)}ms,width ${Number(this.speed/2)}ms,margin ${Number(this.speed/2)}ms;-o-transition:opacity ${Number(this.speed/2)}ms,height ${Number(this.speed/2)}ms,width ${Number(this.speed/2)}ms,margin ${Number(this.speed/2)}ms;transition:opacity ${Number(this.speed/2)}ms,height ${Number(this.speed/2)}ms,width ${Number(this.speed/2)}ms,margin ${Number(this.speed/2)}ms}${this.autoScroll?"":".pageinationdot:hover{opacity:.75}"}.pageinationdotslight .pageinationdot{background:#fff}.pageinationdotsdark .pageinationdot{background:#000}`,document.body.append(h),document.body.classList.add(`pageinationbody${this.type}`),this.isBody&&document.body.classList.add("pageinationbody"),this.element.classList.add("pageinationwrapper"),this.element.classList.add(`pageinationwrapper${this.type}`),this.pages.forEach(t=>t.classList.add("pageinationpage")),this.dots){var p=document.createElement("div");p.classList.add("pageinationdots"),this.dots.position?p.classList.add(`pageinationdots${this.dots.position}`):"horizontal"==this.type?p.classList.add("pageinationdotsbottom"):p.classList.add("pageinationdotsright"),p.classList.add(`pageinationdots${this.dots.theme}`),document.body.prepend(p);var m=document.querySelector(".pageinationdots");this.pageNames.forEach(t=>{var e=document.createElement("span");e.classList.add("pageinationdot"),e.id=t,this.autoScroll||e.addEventListener("click",t=>{this.changePage(t.target.id)}),m.append(e)}),document.querySelector(".pageinationdots").childNodes[0].classList.add("pageinationdotactive")}if(this.autoScroll){!function t(e){setTimeout(function(){l==e.pageNames.length-1?e.changePage(0):e.nextPage(),t(e)},2.5*e.speed)}(this)}else{this.element.addEventListener("wheel",t=>{var e;e=Math.abs(event.deltaY)>=Math.abs(t.deltaX)?t.deltaY>=0?"down":"up":t.deltaX>=0?"right":"left","horizontal"==this.type?"left"==e?this.prevPage():this.nextPage():"up"==e?this.prevPage():this.nextPage(),"horizontal"==this.type&&0==l?setTimeout(()=>{document.querySelector("html").style["overscroll-behavior-x"]="initial",document.querySelector("body").style["overscroll-behavior-x"]="initial"},this.speed):"horizontal"==this.type&&(document.querySelector("html").style["overscroll-behavior-x"]="none",document.querySelector("body").style["overscroll-behavior-x"]="none")});var g=null,c=null;this.element.addEventListener("touchstart",t=>{g=t.touches[0].clientX,c=t.touches[0].clientY}),this.element.addEventListener("touchmove",t=>{if(null!=g&&null!=c){var e,i=g-t.touches[0].clientX,a=c-t.touches[0].clientY;e=Math.abs(a)>=Math.abs(i)?a>=0?"down":"up":i>=0?"right":"left","horizontal"==this.type?"left"==e?this.prevPage():this.nextPage():"up"==e?this.prevPage():this.nextPage(),"horizontal"==this.type&&0==l?setTimeout(()=>{document.querySelector("html").style["overscroll-behavior-x"]="initial",document.querySelector("body").style["overscroll-behavior-x"]="initial"},this.speed):"horizontal"==this.type&&(document.querySelector("html").style["overscroll-behavior-x"]="none",document.querySelector("body").style["overscroll-behavior-x"]="none"),g=null,c=null}})}window.addEventListener("resize",t=>{"horizontal"==this.type?this.element.style.transform=`translateX(-${l*window.innerWidth}px)`:this.element.style.transform=`translateY(-${l*window.innerHeight}px)`});return Object.defineProperty(this,"changePage",{value:t=>{if(!this.autoScroll&&this.scrollDisabled)return!1;var e="number"==typeof t?t:this.pageNames.indexOf(t);if(e<0&&(e=0),e>this.pageNames.length-1&&(e=this.pageNames.length-1),"horizontal"==this.type?this.element.style.transform=`translateX(-${e*window.innerWidth}px)`:this.element.style.transform=`translateY(-${e*window.innerHeight}px)`,this.dots){var i=document.querySelector(".pageinationdots");i.querySelector(".pageinationdotactive").classList.remove("pageinationdotactive"),i.childNodes[e].classList.add("pageinationdotactive")}return this.scrollDisabled=!0,setTimeout(()=>this.scrollDisabled=!1,this.speed-.1*this.speed),l=e,this.onPageChange(this.pageNames[e],e)},writable:!1}),this.nextPage=(()=>this.changePage(l+1)),this.prevPage=(()=>this.changePage(l-1)),window.onbeforeunload=(()=>window.scrollTo(0,0)),this.changePage(0),this.onInit(this)}