// Resource variables
let shadows = 0;
let shadowsPerClick = 1;
let shadowsPerSec = 0;

// Upgrade variables
let speedLevel = 0;
let speedCost = 500;
let stealthLevel = 0;
let stealthCost = 500;
const maxStealthLevel = 10;
const maxSpeedLevel = 10;

// Linkage of scripts
const gainShadowButton = document.getElementById('gainShadow');
const shadowCounter = document.getElementById('shadowCounter');
const shadowsPerSecDisplay = document.getElementById('shadowsPerSec');
const ninjaHireButtons = document.querySelectorAll('.ninja_button');
const speedLevelDisplay = document.getElementById('speed_level');
const speedCostDisplay = document.getElementById('speed_cost');
const speedUpgradeButton = document.getElementById('speed_upgrade_button');
const shadowsPerClickDisplay = document.getElementById('shadowsPerClick');
const stealthLevelDisplay = document.getElementById('stealth_level');
const stealthCostDisplay = document.getElementById('stealth_cost');
const stealthUpgradeButton = document.getElementById('stealth_upgrade_button');

// Ninja Object with different properties
const ninjas = {
    novice: { baseCost: 10, cost: 10, increment: 5, sps: 1, count: 0},
    rogue: { baseCost: 100, cost: 100, increment:50, sps: 5, count: 0},
    elite: { baseCost: 1000, cost: 1000, increment:500, sps: 20, count: 0},
    grandmaster: { baseCost: 10000, cost: 10000, increment:5000, sps: 100, count: 0},
}

// Update Display
function updateDisplay(){
    shadowsPerClick = 1 + (speedLevel * 5);
    if (speedLevel < maxSpeedLevel) {
        speedCost = 500 * (speedLevel + 1);
    }else {
        speedCost = 'Maxed';
    }
    if (stealthLevel < maxStealthLevel){
        stealthCost = 500 * (stealthLevel + 1)
    }else {
        stealthCost = 'Maxed';
    }

    shadowCounter.textContent = Math.round(shadows);
    shadowsPerSecDisplay.textContent = shadowsPerSec;
    speedLevelDisplay.textContent = speedLevel;
    speedCostDisplay.textContent = speedCost;
    shadowsPerClickDisplay.textContent = shadowsPerClick;
    stealthLevelDisplay.textContent = stealthLevel;
    stealthCostDisplay.textContent = stealthCost;

    // Updating Ninja button cost and count display
    ninjaHireButtons.forEach(button => {
        const type = button.dataset.type;
        const ninja = ninjas[type];
        const cost = button.querySelector('.cost');
        const count = button.parentElement.querySelector('.count');

        cost.textContent = ninja.cost;
        count.textContent = ninja.count;

        // If not affordable, Ghost Button
        if(shadows >= ninja.cost){
            button.classList.remove('ghosted');
            button.disabled = false;
        } else {
            button.classList.add('ghosted');
            button.disabled = true;
        }
    })

    // Updating Speed Button
    if(speedLevel < maxSpeedLevel && shadows >= speedCost){
        speedUpgradeButton.classList.remove('ghosted', 'maxed');
        speedUpgradeButton.disabled = false;
    }else{
        speedUpgradeButton.classList.add('ghosted');
        speedUpgradeButton.disabled = true;
        if(speedLevel >= maxSpeedLevel){
            speedUpgradeButton.classList.add('maxed');
        }
    }

    // Updating Stealth Button
    if(stealthLevel < maxStealthLevel && shadows >= stealthCost){
        stealthUpgradeButton.classList.remove('ghosted', 'maxed');
        stealthUpgradeButton.disabled = false;
    }else{
        stealthUpgradeButton.classList.add('ghosted');
        stealthUpgradeButton.disabled = true;
        if(stealthLevel >= maxStealthLevel){
            stealthUpgradeButton.classList.add('maxed');
        }
    }
}

// Gain Shadows button
gainShadowButton.addEventListener('click', function(){
    shadows += shadowsPerClick;
    updateDisplay();
})

// Upgrade Speed button
speedUpgradeButton.addEventListener('click', function(){
    if (speedLevel < maxSpeedLevel && shadows >= speedCost){
        shadows  = shadows - speedCost;
        speedLevel++;
        updateDisplay();
    }
})

// Upgrade Stealth Button
stealthUpgradeButton.addEventListener('click', function(){
    if (stealthLevel < maxStealthLevel && shadows >= stealthCost){
        shadows = shadows - stealthCost;
        stealthLevel++;
        updateNinjaStats();
        updateDisplay();
    }
})

// Passive Shadow gain
setInterval(() => {
    shadows += shadowsPerSec / 10;
    updateDisplay();
}, 100);

// Update Ninja Statistics
function updateNinjaStats(){
    shadowsPerSec = 0;
    Object.values(ninjas).forEach(ninja => {
        shadowsPerSec += ninja.count * ninja.sps * (1 + stealthLevel * 0.1);
    });
    updateDisplay();
}

// Ninja Hiring
ninjaHireButtons.forEach(button => {
    button.addEventListener('click', () => {
        const type = button.dataset.type;
        const ninja = ninjas[type];
        if (shadows >= ninja.cost){
            shadows -= ninja.cost;
            ninja.count ++;
            ninja.cost = ninja.baseCost + (ninja.increment * ninja.count);
            updateNinjaStats();
        }
    });
})
updateDisplay();
updateNinjaStats();