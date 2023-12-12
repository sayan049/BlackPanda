
// document.body.addEventListener('click', function(event) {
//     var x = event.clientX;
//     var y = event.clientY;


  
//     var displayedImage = document.getElementById('displayedImage');
//     displayedImage.style.left = x + 'px';
//     displayedImage.style.top = y + 'px';
//     displayedImage.style.display = 'block';
  
//     // Automatically erase the image after 3 seconds (3000 milliseconds)
    
//   });
// import loginCollection from '../server/login-data';
  
var counter = 0;

var bgColor = [
  "#e8dff5", // color array for background-color
  "#fce1e4",
  "#fcf4dd",
  "#ddedea"
];

var imgArray = [
  `img/panda1-removebg-preview.png`,
  `img/panda2-removebg-preview.png`,
  `img/panda3-removebg-preview.png`,
  `img/panda4-removebg-preview.png`,
  `img/panda5-removebg-preview.png`,
  `img/panda6-removebg-preview.png`,
  `img/panda7-removebg-preview.png`,
  `img/panda8-removebg-preview.png`,
  `img/panda9-removebg-preview.png`,
  `img/panda10-removebg-preview.png`
 
];

var container = document.getElementById('containerr');
var counter = 0;
var imageWidth = 40; // Set the desired width for the images
var imageHeight = 31; // Set the desired height for the images

function displayImage(event) {
  if (counter == imgArray.length) counter = 0; //loop images
  var pic = document.createElement('img'); //create new element 
  pic.src = imgArray[counter];//add URL for images
  pic.classList.add("image"); //add class name for images
  pic.style.position = 'absolute';
  pic.style.top = event.clientY + 'px'; //place images where user clicks
  pic.style.left = event.clientX + 'px';
  pic.style.width = imageWidth + 'px'; // Set the width of the image
  pic.style.height = imageHeight + 'px'; // Set the height of the image
  container.appendChild(pic);
  counter++;

  setTimeout(function() {
    container.removeChild(pic); //remove the image after 3 seconds
  }, 1000);
}

container.onclick = function(event) {
  displayImage(event);
};

const popup=document.getElementById('popup')
function forgotpassword(){
  popup.style.cssText='visibility: visible;'
}
function crossicon(){ 
  popup.style.cssText='visibility: hidden;'
}




const spans = document.querySelectorAll('.word span');

spans.forEach((span, idx) => {
	span.addEventListener('click', (e) => {
		e.target.classList.add('active');
	});
	span.addEventListener('animationend', (e) => {
		e.target.classList.remove('active');
	});
	
	// Initial animation
	setTimeout(() => {
		span.classList.add('active');
	}, 750 * (idx+1))
});