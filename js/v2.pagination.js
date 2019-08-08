/** 
    @constructor
    the only function intended to be run by the user
    eg. new pagination('pageWrapperID')
*/ 
const pagination = function(pageWrapperID, {
    useHashes = true,
    scrollSpeed = 1000,
    isDevMode = false
} = {"useHashes": true,"scrollSpeed": 1000, "isDevMode": false}){

    /* 
        handle incorrect passed arguments
    */

    // pageWrapperID
    if(!pageWrapperID) throw new Error('Pagination | REQUIRED VARIABLE - The ID of your pagination wrapper must be provided.')
    else if(typeof pageWrapperID != 'string') throw new Error('Pagination | VARIABLE ERROR - The provided wrapper ID must be of type "string".')
    else if(!document.getElementById(pageWrapperID)) throw new Error('Pagination | VARIABLE ERROR - An element with the provided wrapper ID was not found.')

    console.log(
        pageWrapperID,
        useHashes,
        scrollSpeed,
        isDevMode
    )
}

// const _pagination = {
    
//     /* 
//         stores global variables
//         overwritten by _pagination._api.init()
//     */ 
//     _vars = {

//     },

//     /* 
//         in-app functions (ie. not intended to be run by internal methods)
//     */ 
//     _api = {
        
//         init = function(){
            
//         },
        
//         changePage = function(){

//         },
        
//         disableScroll = function(){

//         },
//     }
// }