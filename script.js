let docTitle=document.title;
window.addEventListener("blur", ()=>{document.title="Come back : ("});
window.addEventListener("focus", ()=>{document.title=docTitle});

const left = document.getElementById("left-side");

const handleMove = e => {
  left.style.width = `${e.clientX / window.innerWidth * 100}%`;
}

document.onmousemove = e => handleMove(e);

document.ontouchmove = e => handleMove(e.touches[0]);
const sayan=document.getElementById("arrow1");
sayan.onclick=function(){
  document.getElementById("arrow2").scrollLeft+=510;
}
const sayan2=document.getElementById("arrow3");
sayan2.onclick=function(){
  document.getElementById("arrow2").scrollLeft-=510;
}
