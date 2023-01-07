let docTitle=document.title;
window.addEventListener("blur", ()=>{document.title="Come back : ("});
window.addEventListener("focus", ()=>{document.title=docTitle});


const element1 = document.getElementsByClassName('panda1');

element1.addEventListener('animationend', () => {
  // start the second animation
  element1.classList.add('backword');
});
const element = document.getElementById('panda2');

element.addEventListener('animationstart', () => {
  // start the second animation
  element.classList.add('backword');
});
