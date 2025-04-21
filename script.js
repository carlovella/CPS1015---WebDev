// Resource variables
let shadows = 0;
let shadowsPerClick = 1;
let shadowsPerSec = 0;
let phantoms = 0;
let nextPhantomThreshold = 500000;

// Upgrade variables
let speedLevel = 0;
let speedCost = 500;
let stealthLevel = 0;
let stealthCost = 500;
const maxStealthLevel = 10;
const maxSpeedLevel = 10;

// Phantom tier variables
let  tier1Purchased = false;
let  tier2Purchased = false;
let  tier3Purchased = false;
let  tier4Purchased = false;
let  tier5Purchased = false;
const phantomCostIncrement = 500000;

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
const phantomCounter = document.getElementById('phantomCounter');
const phantomProgressText = document.getElementById('progressText');
const phantomProgressBar = document.getElementById('progressBar');
const tier1Button = document.getElementById('tier1Button');
const tier2Button = document.getElementById('tier2Button');
const tier3Button = document.getElementById('tier3Button');
const tier4Button = document.getElementById('tier4Button');
const tier5Button = document.getElementById('tier5Button');

// Ninja Object with different properties
const ninjas = {
    novice: { baseCost: 10, cost: 10, increment: 5, sps: 1, count: 0},
    rogue: { baseCost: 100, cost: 100, increment:50, sps: 5, count: 0},
    elite: { baseCost: 1000, cost: 1000, increment:500, sps: 20, count: 0},
    grandmaster: { baseCost: 10000, cost: 10000, increment:5000, sps: 100, count: 0},
}

// Calculate cost for next Phantom
function getPhantomCost(){
    let baseCost = phantomCostIncrement;
    // Applying 20% discount if Tier 2 is purchased
    if (tier2Purchased){
        baseCost = baseCost * 0.8;
    }
    return baseCost;
}

// Gain phantom based on shadows
function updatePhantoms(){
    let costPerPhantom = getPhantomCost();

    // Check current shadows against threshold
    if(shadows >= nextPhantomThreshold){
        phantoms++;
        // Increase threshold
        nextPhantomThreshold = nextPhantomThreshold + costPerPhantom;
    }
    phantomCounter.textContent = phantoms;
}

// Update Display
function updateDisplay(){

    // Calculate Click Value
    shadowsPerClick = 1 + (speedLevel * 5);
    // 50% increase if Tier 3 is purchased
    if(tier3Purchased){
        shadowsPerClick = shadowsPerClick * 1.5;
    }

    // Calculate Speed Cost
    if (speedLevel < maxSpeedLevel) {
        speedCost = 500 * (speedLevel + 1);
        // 30% discount if Tier 4 is purchased
        if(tier4Purchased){
            speedCost = speedCost * 0.7;
        }
    }else {
        speedCost = 'Maxed';
    }

    // Calculate Stealth Cost
    if (stealthLevel < maxStealthLevel){
        stealthCost = 500 * (stealthLevel + 1);
        // 30% discount if Tier 4 is purchased
        if(tier4Purchased){
            stealthCost = stealthCost * 0.7;
        }
    }else {
        stealthCost = 'Maxed';
    }

    // Update Phantom progress bar
    const progressPercentage = Math.min((shadows/ nextPhantomThreshold) * 100, 100);
    let currentShadows = Math.round(shadows);
    let phantomCostRounded = Math.round(nextPhantomThreshold);
    let percentageRounded = Math.round(progressPercentage);
    phantomProgressText.textContent = 'Shadows to next Phantom: ' + currentShadows + '/' + phantomCostRounded + ' (' + percentageRounded + '%)';
    phantomProgressBar.style.width = percentageRounded + '%';

    shadowCounter.textContent = Math.round(shadows);
    shadowsPerSecDisplay.textContent = shadowsPerSec;
    speedLevelDisplay.textContent = speedLevel;
    speedCostDisplay.textContent = speedCost;
    shadowsPerClickDisplay.textContent = shadowsPerClick;
    stealthLevelDisplay.textContent = stealthLevel;
    stealthCostDisplay.textContent = stealthCost;
    phantomCounter.textContent = phantoms;

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

    // Updating Tier 1 button
    if (phantoms >= 1 && !tier1Purchased){
        tier1Button.classList.remove('ghosted', 'maxed');
        tier1Button.disabled = false;
    }else {
        tier1Button.classList.add('ghosted');
        tier1Button.disabled = true;
        if(tier1Purchased){
            tier1Button.classList.add('maxed');
            tier1Button.classList.remove('ghosted')
        }
    }

    // Updating Tier 2 button
    if (phantoms >= 2 && !tier2Purchased){
        tier2Button.classList.remove('ghosted', 'maxed');
        tier2Button.disabled = false;
    }else {
        tier2Button.classList.add('ghosted');
        tier2Button.disabled = true;
        if(tier2Purchased){
            tier2Button.classList.add('maxed');
            tier2Button.classList.remove('ghosted')
        }
    }

    // Updating Tier 3 button
    if (phantoms >= 3 && !tier3Purchased){
        tier3Button.classList.remove('ghosted', 'maxed');
        tier3Button.disabled = false;
    }else {
        tier3Button.classList.add('ghosted');
        tier3Button.disabled = true;
        if(tier3Purchased){
            tier3Button.classList.add('maxed');
            tier3Button.classList.remove('ghosted')
        }
    }

    // Updating Tier 4 button
    if (phantoms >= 4 && !tier4Purchased){
        tier4Button.classList.remove('ghosted', 'maxed');
        tier4Button.disabled = false;
    }else {
        tier4Button.classList.add('ghosted');
        tier4Button.disabled = true;
        if(tier4Purchased){
            tier4Button.classList.add('maxed');
            tier4Button.classList.remove('ghosted')
        }
    }

    // Updating Tier 5 button
    if (phantoms >= 5 && !tier5Purchased){
        tier5Button.classList.remove('ghosted', 'maxed');
        tier5Button.disabled = false;
    }else {
        tier5Button.classList.add('ghosted');
        tier5Button.disabled = true;
        if(tier5Purchased){
            tier5Button.classList.add('maxed');
            tier5Button.classList.remove('ghosted')
        }
    }

}

// Gain Shadows button
gainShadowButton.addEventListener('click', function(){
    shadows += shadowsPerClick;
    updatePhantoms();
    updateDisplay();
})

// Upgrade Speed button
speedUpgradeButton.addEventListener('click', function(){
    if (speedLevel < maxSpeedLevel && shadows >= speedCost){
        shadows  = shadows - speedCost;
        speedLevel++;
        updatePhantoms();
        updateDisplay();
    }
})

// Upgrade Stealth Button
stealthUpgradeButton.addEventListener('click', function(){
    if (stealthLevel < maxStealthLevel && shadows >= stealthCost){
        shadows = shadows - stealthCost;
        stealthLevel++;
        updatePhantoms();
        updateNinjaStats();
        updateDisplay();
    }
})

// Tier 1 Button
tier1Button.addEventListener('click', function(){
    if(phantoms < 1){
        return;
    }
    if(tier1Purchased){
        return;
    }
    let userConfirmation = confirm('Buy Tier 1: +50% Ninja SPS (Shadows Per Second) and Reset?');
    if(userConfirmation){
        phantoms = phantoms - 1;
        tier1Purchased = true;
        // Reset threshold
        nextPhantomThreshold = 500000 + (phantoms * getPhantomCost());
        // Reset Game
        shadows = 0;
        speedLevel = 0;
        stealthLevel = 0;
        Object.values(ninjas).forEach(ninja => {
            ninja.count = 0;
            ninja.cost = ninja.baseCost;
        });
        updatePhantoms()
        updateNinjaStats();
        updateDisplay();
    }
})

// Tier 2 Button
tier2Button.addEventListener('click', function(){
    if(phantoms < 2){
        return;
    }
    if(tier2Purchased){
        return;
    }
    let userConfirmation = confirm('Buy Tier 2: -20% Phantom Cost for next Phantom and Reset?');
    if(userConfirmation){
        phantoms = phantoms - 2;
        tier2Purchased = true;
        // Reset threshold
        nextPhantomThreshold = 500000 + (phantoms * getPhantomCost());
        // Reset Game
        shadows = 0;
        speedLevel = 0;
        stealthLevel = 0;
        Object.values(ninjas).forEach(ninja => {
            ninja.count = 0;
            ninja.cost = ninja.baseCost;
        });
        updatePhantoms()
        updateNinjaStats();
        updateDisplay();
    }
})

// Tier 3 Button
tier3Button.addEventListener('click', function(){
    if(phantoms < 3){
        return;
    }
    if(tier3Purchased){
        return;
    }
    let userConfirmation = confirm('Buy Tier 3: +50% Click Value (Shadows per Click) and Reset?');
    if(userConfirmation){
        phantoms = phantoms - 3;
        tier3Purchased = true;
        // Reset threshold
        nextPhantomThreshold = 500000 + (phantoms * getPhantomCost());
        // Reset Game
        shadows = 0;
        speedLevel = 0;
        stealthLevel = 0;
        Object.values(ninjas).forEach(ninja => {
            ninja.count = 0;
            ninja.cost = ninja.baseCost;
        });
        updatePhantoms()
        updateNinjaStats();
        updateDisplay();
    }
})

// Tier 4 Button
tier4Button.addEventListener('click', function(){
    if(phantoms < 4){
        return;
    }
    if(tier4Purchased){
        return;
    }
    let userConfirmation = confirm('Buy Tier 4: -30% Upgrade Costs and Reset?');
    if(userConfirmation){
        phantoms = phantoms - 4;
        tier4Purchased = true;
        // Reset threshold
        nextPhantomThreshold = 500000 + (phantoms * getPhantomCost());
        // Reset Game
        shadows = 0;
        speedLevel = 0;
        stealthLevel = 0;
        Object.values(ninjas).forEach(ninja => {
            ninja.count = 0;
            ninja.cost = ninja.baseCost;
        });
        updatePhantoms()
        updateNinjaStats();
        updateDisplay();
    }
})

// Tier 5 Button
tier5Button.addEventListener('click', function(){
    if(phantoms < 5){
        return;
    }
    if(tier5Purchased){
        return;
    }
    let userConfirmation = confirm('Buy Tier 5: Ninja Cost 30% less and Reset?');
    if(userConfirmation){
        phantoms = phantoms - 5;
        tier5Purchased = true;
        // Reset threshold
        nextPhantomThreshold = 500000 + (phantoms * getPhantomCost());
        // Reset Game
        shadows = 0;
        speedLevel = 0;
        stealthLevel = 0;
        Object.values(ninjas).forEach(ninja => {
            ninja.count = 0;
            ninja.cost = ninja.baseCost;
        });
        updatePhantoms()
        updateNinjaStats();
        updateDisplay();
    }
})

// Passive Shadow gain
setInterval(() => {
    let shadowGain = shadowsPerSec / 10;
    shadows = shadows + shadowGain;
    updatePhantoms();
    updateDisplay();
}, 100);

// Update Ninja Statistics
function updateNinjaStats(){
    shadowsPerSec = 0;
    Object.values(ninjas).forEach(ninja => {
        shadowsPerSec += ninja.count * ninja.sps * (1 + stealthLevel * 0.1) * (tier1Purchased ? 1.5 : 1);
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
            let baseNinjaCost = ninja.baseCost + (ninja.increment * ninja.count);
            // Apply 30% discount if Tier 5 is purchased
            if(tier5Purchased){
                ninja.cost = baseNinjaCost * 0.7;
            } else {
                ninja.cost = baseNinjaCost;
            }
            updatePhantoms();
            updateNinjaStats();
        }
    });
})
updateDisplay();
updateNinjaStats();