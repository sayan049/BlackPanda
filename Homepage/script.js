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

const sayan=document.getElementById("arrow1");
sayan.onclick=function(){
  document.getElementById("arrow2").scrollLeft+=510;
}
const sayan2=document.getElementById("arrow3");
sayan2.onclick=function(){
  document.getElementById("arrow2").scrollLeft-=510;
}
/*//////////////////////////////////////////*/
const input = document.getElementById('ghost-input');
const bubble = document.getElementById('ghost-bubble');

const mouth = document.querySelector('.ghost__mouth');

input.onkeydown = e => {
  if (e.keyCode == 13) {
    // bubble.innerText = e.target.value;
    e.target.value = '';

    mouthChatter
    let i = 0;
    if (mouthChatter) clearInterval(mouthChatter);

    const mouthChatter = setInterval(() => {
      mouth.classList.toggle('ghost__mouth--open');
      if (i === 6) clearInterval(mouthChatter);
      i++;
    }, 300);
  }
};

