let docTitle=document.title;
window.addEventListener("blur", ()=>{document.title="Come back : ("});
window.addEventListener("focus", ()=>{document.title=docTitle});

const left = document.getElementById("left-side");

const handleMove = e => {
  left.style.width = `${e.clientX / window.innerWidth * 100}%`;
}

document.onmousemove = e => handleMove(e);

document.ontouchmove = e => handleMove(e.touches[0]);
 const rightSlide=document.getElementById("rightSlide");
 rightSlide.onclick=function (){
  document.getElementById("content").scrollLeft+=300;
 }
const leftSlide=document.getElementById("leftSlide");
leftSlide.onclick=function(){
  document.getElementById("content").scrollLeft-=300;
}