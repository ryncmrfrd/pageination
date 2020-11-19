const log = (

    txt = [],
    type = "log",
    spaced = false

) => {
    if(txt.length <= 0) return false;

    const _toUpperCase = x => { return x.charAt(0).toUpperCase() + x.slice(1) };
    
    type = !/(?:log|warning|error)/.test(type) ? "log" : type;
    spaced ? (txt.unshift(` \nPageination.js ${_toUpperCase(type)}\n`), txt.push("\n ")) : txt.unshift(`Pageination.js ${_toUpperCase(type)} |`);

    if (type === "log") return console.log(...txt);
    else if (type === "warning") return console.warn(...txt);
    else throw new Error(txt.join(' '));
};

function pageination(element, {

    type = "vertical",
    speed = 1000,
    dots = { 
        type: "right", 
        theme: "light" 
    },
    autoScroll = false,
    devMode = false,
    onInit = () => {},
    onPageChange = () => {}

} = {}){

    ( !/(?:vertical|horizontal)/.test(type) ) ? type = "vertical" : "";
    
    
    
    ( dots && !/(?:top|left|bottom|right)/.test(dots.type) ) ? dots.type = "right" : "";
    ( dots && !/(?:light|dark)/.test(dots.theme) ) ? dots.theme = "light" : "";
    
    // ( !/(?:vertical|horizontal)/.test(type) ) ? type = "vertical" : "";
    // Object.defineProperty(this, 'type', {value: type, writable: false});
    // Object.defineProperty(this, 'speed', {value: +speed||1000, writable: false});

    //     ( dots && !/(?:top|left|bottom|right)/.test(dots.type) ) ? dots.type = "right" : "";
    //     ( dots && !/(?:light|dark)/.test(dots.theme) ) ? dots.theme = "light" : "";
    // Object.defineProperty(this, 'dots', {value: dots||undefined, writable: false});

    // Object.defineProperty(this, 'autoScroll', {value: autoScroll, writable: false});
    // Object.defineProperty(this, 'isBody', {value: isBody||true, writable: false});
    // Object.defineProperty(this, 'devMode', {value: devMode||false, writable: false});
    // Object.defineProperty(this, 'element', {value: document.querySelector(element), writable: false});
    // Object.defineProperty(this, 'pages', {value: document.querySelectorAll(`${element} section`), writable: false});
        
    // var pageNames = []; this.pages.forEach((e, i) => pageNames.push(e.id || i));
    // Object.defineProperty(this, 'pageNames', {value: pageNames, writable: false});
    
    // Object.defineProperty(this, 'onInit', {value: onInit, writable: false});
    // Object.defineProperty(this, 'onPageChange', {value: onPageChange, writable: false});

};