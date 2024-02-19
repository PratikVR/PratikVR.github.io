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
}
function showAboutMePage(){
    container.style.setProperty('--rotate-x','0deg');
    container.style.setProperty('--rotate-y','90deg');
}
function showContactMePage(){
    container.style.setProperty('--rotate-x','-90deg');
    container.style.setProperty('--rotate-y','0deg');
}

