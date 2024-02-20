window.onload = function() {
    alert('Page is in development !');
};
const container = document.querySelector('.container')
const navbar = document.querySelectorAll('[to]')


navbar.forEach(element=>{
    element.addEventListener('click',(e)=>{
        e.preventDefault();
        switch(element.getAttribute('to')){
            case 'home':
                showHomePage()
                break;
            case 'aboutme':
                showAboutMePage()
                break;
                
            case 'contactme':
                showContactMePage()
                break;
            default:
                console.log('unknown error!')
        }
    })
})

function showHomePage(){
    container.style.setProperty('--rotate-x','0deg');
    container.style.setProperty('--rotate-y','0deg');
    setTimeout(() => {
        resetLoaders();    
    }, 100);
}
function showAboutMePage(){
    container.style.setProperty('--rotate-x','0deg');
    container.style.setProperty('--rotate-y','90deg');
    setTimeout(() => {
        setLoaders();    
    }, 500);
}
function showContactMePage(){
    container.style.setProperty('--rotate-x','-90deg');
    container.style.setProperty('--rotate-y','0deg');
    setTimeout(() => {
        resetLoaders();    
    }, 100);
}

const jsLoader = document.querySelector('#js-loader');
const htmlLoader = document.querySelector('#html-loader');
const css3Loader = document.querySelector('#css-loader');
const javaLoader = document.querySelector('#java-loader');
const pythonLoader = document.querySelector('#python-loader');
function setLoaders(){
    jsLoader.style.width="95%";
    jsLoader.innerHTML = '95%';
    htmlLoader.style.width="92%";
    htmlLoader.innerHTML = '92%';
    css3Loader.style.width="95%";
    css3Loader.innerHTML = '95%'
    javaLoader.style.width="71%";
    javaLoader.innerHTML = "71%";
    pythonLoader.style.width="67%";
    pythonLoader.innerHTML = "67%";
}
function resetLoaders(){
    jsLoader.style.width="0%";
    jsLoader.innerHTML = '95%';
    htmlLoader.style.width="0%";
    htmlLoader.innerHTML = '92%';
    css3Loader.style.width="0%";
    css3Loader.innerHTML = '95%'
    javaLoader.style.width="0%";
    javaLoader.innerHTML = "71%";
    pythonLoader.style.width="0%";
    pythonLoader.innerHTML = "67%";
}