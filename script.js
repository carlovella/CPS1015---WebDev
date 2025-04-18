let shadows = 0;
let shadowsPerClick = 1;

const gainShadowButton = document.getElementById('gainShadow');
const shadowCounter = document.getElementById('shadowCounter');

function updateDisplay(){
    shadowCounter.textContent = shadows;
}
gainShadowButton.addEventListener('click', function(){
    shadows += shadowsPerClick;
    updateDisplay();
})
updateDisplay();


