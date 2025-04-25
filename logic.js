// --- Resource Variables ----
let shadows = 0;
let shadowsPerClick = 1;
let shadowsPerSec = 0; // Shadows per second from ninjas
let phantoms = 0;
let nextPhantomThreshold = 500000; // Shadows needed for next phantom

// ---- Achievement Counters ----
let lifetimeShadows = 0;
let lifetimePhantoms = 0;
let lifetimeNinjasHired = 0;

// ---- Upgrade Variables ----
let speedLevel = 0;
let speedCost = 500;
let stealthLevel = 0;
let stealthCost = 500;
const maxStealthLevel = 10;
const maxSpeedLevel = 10;

// ---- Phantom Tier Variables ----
let tier1Purchased = false;
let tier2Purchased = false;
let tier3Purchased = false;
let tier4Purchased = false;
let tier5Purchased = false;
const phantomCostIncrement = 500000; // Cost increment for phantoms

// ---- Achievements ----
const achievements = {
    shadowCollectorI: {
        name: "Shadow Collector I",
        description: "Collect 1,000 Shadows",
        completed: false
    },
    shadowCollectorII: {
        name: "Shadow Collector II",
        description: "Collect 100,000 Shadows",
        completed: false
    },
    shadowCollectorIII: {
        name: "Shadow Collector III",
        description: "Collect 10,000,000 Shadows",
        completed: false
    },
    phantomSeeker: {
        name: "Phantom Seeker",
        description: "Collect 3 Phantoms",
        completed: false
    },
    ninjaRecruiterI: {
        name: "Ninja Recruiter I",
        description: "Hire 10 ninjas",
        completed: false
    },
    ninjaRecruiterII: {
        name: "Ninja Recruiter II",
        description: "Hire 50 ninjas",
        completed: false
    },
    ninjaRecruiterIII: {
        name: "Ninja Recruiter III",
        description: "Hire 100 ninjas",
        completed: false
    },
    speedStalker: {
        name: "Speed Stalker",
        description: "Max the Speed upgrade",
        completed: false
    },
    stealthMaster: {
        name: "Stealth Master",
        description: "Max the Stealth upgrade",
        completed: false
    },
    shadowRebirth: {
        name: "Shadow Rebirth",
        description: "Prestige for the first time",
        completed: false
    }
};

// ---- Ninja Object ----
const ninjas = {
    novice: { baseCost: 10, cost: 10, increment: 5, sps: 1, count: 0},
    rogue: { baseCost: 100, cost: 100, increment:50, sps: 5, count: 0},
    elite: { baseCost: 1000, cost: 1000, increment:500, sps: 20, count: 0},
    grandmaster: { baseCost: 10000, cost: 10000, increment:5000, sps: 100, count: 0},
}

// ---- DOM elements for UI ----
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
const tierButtons = {
    1: document.getElementById('tier1Button'),
    2: document.getElementById('tier2Button'),
    3: document.getElementById('tier3Button'),
    4: document.getElementById('tier4Button'),
    5: document.getElementById('tier5Button'),
}
const saveGameButton = document.getElementById('saveGameButton');
const saveGameText = document.getElementById('saveGameText');

// ---- Prestige Tiers ----
const tiers = {
    1: {cost: 1, message: 'Reset and Gain +50% Ninja SPS (Shadows Per Second)'},
    2: {cost: 2, message: 'Reset and Gain -20% Phantom Cost for next Phantom'},
    3: {cost: 3, message: 'Reset and Gain +50% Click Value (Shadows Per Click)'},
    4: {cost: 4, message: 'Reset and Gain -30% Upgrade Costs'},
    5: {cost: 5, message: 'Reset and Gain -30% Ninja Costs'},
};

// ---- Save Game ----
function saveGame(){
    // For ninjas object
    const ninjaData = {};
    for(let key in ninjas){
        ninjaData[key] = {
            count: ninjas[key].count,
            cost: ninjas[key].cost
        };
    }

    const gameData = {
        shadows: shadows,
        lifetimeShadows: lifetimeShadows,
        phantoms: phantoms,
        lifetimePhantoms: lifetimePhantoms,
        lifetimeNinjasHired: lifetimeNinjasHired,
        speedLevel: speedLevel,
        speedCost: (typeof speedCost === 'number') ? speedCost : 0, // Checks if speedCost is a number or 'Maxed'
        stealthLevel: stealthLevel,
        stealthCost: (typeof stealthCost === 'number') ? stealthCost : 0, // Checks if stealthCost is a number of 'Maxed'
        tier1Purchased: tier1Purchased,
        tier2Purchased: tier2Purchased,
        tier3Purchased: tier3Purchased,
        tier4Purchased: tier4Purchased,
        tier5Purchased: tier5Purchased,
        ninjas: ninjaData,
        achievements: achievements,
        nextPhantomThreshold: nextPhantomThreshold
    };

    // Disable save button to prevent multiple clicks
    if(saveGameButton){
        saveGameButton.disabled = true;
    }

    fetch('/gameData', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(gameData)
    })
        .then(response => {
            if(response.ok){
                console.log('Game Saved');
                // Show confirmation message
                if(saveGameText){
                    saveGameText.classList.add('show');
                    setTimeout(()=>{
                        saveGameText.classList.remove('show');
                    }, 2000); // Hide after 2 seconds
                }
            }else{
                console.error('Failed to Save Game');
            }
        })
        .then(data => {
            console.log('Game Data Saved', data)
        })
        .catch(error => {
            console.error('Failed to Save Game Data', error);
        })
        .finally(() => {
            // Re-enable save button
            if(saveGameButton){
                saveGameButton.disabled = false;
            }
    })
}

// ---- Load Game ----
function loadGame() {
    fetch('/gameData', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => response.json())
        .then(gameData => {
            if (gameData) {
                // Get saved data or if not saved, default value
                shadows = gameData.shadows || 0;
                lifetimeShadows = gameData.lifetimeShadows || 0;
                phantoms = gameData.phantoms || 0;
                lifetimePhantoms = gameData.lifetimePhantoms || 0;
                lifetimeNinjasHired = gameData.lifetimeNinjasHired || 0;
                speedLevel = gameData.speedLevel || 0;
                speedCost = gameData.speedCost || 500;
                stealthLevel = gameData.stealthLevel || 0;
                stealthCost = gameData.stealthCost || 500;
                tier1Purchased = gameData.tier1Purchased || false;
                tier2Purchased = gameData.tier2Purchased || false;
                tier3Purchased = gameData.tier3Purchased || false;
                tier4Purchased = gameData.tier4Purchased || false;
                tier5Purchased = gameData.tier5Purchased || false;
                nextPhantomThreshold = gameData.nextPhantomThreshold || 500000;

                // Load Ninjas
                Object.keys(gameData.ninjas).forEach((type) => {
                    if(ninjas[type]){
                        ninjas[type].count = gameData.ninjas[type].count;
                        ninjas[type].cost = gameData.ninjas[type].cost;
                    }
                })

                // Load Achievements
                if(gameData.achievements){
                    Object.keys(achievements).forEach((key) => {
                        if(gameData.achievements[key]){
                            achievements[key].completed = gameData.achievements[key].completed;
                        }
                    })
                }

                // Update UI
                updateDisplay();
                updateNinjaStats();
                updateAchievements();
            } else {
                console.error('Failed to Load Game Data');
            }
        })
        .catch(error => {
            console.error('Failed to Load Game Data', error);
        });
}

// Show achievement popup when achievement unlocked
function showAchievementPopup(achievementName) {
    const popup = document.getElementById("achievement-popup");
    const popupText = document.getElementById("achievement_text"); // Text inside pop-up
    popupText.textContent = `Achievement Unlocked: ${achievementName}`;
    popup.classList.remove("active"); // Remove animation
    // Restart animation
    void popup.offsetWidth;
    popup.classList.add("active");
}

// Update Achievements list
function updateAchievements(){
    const achievementItems = document.querySelectorAll('.achievement_item');
    achievementItems.forEach(item => {
        const id = item.getAttribute("id"); // Get achievement id
        const achievementData = achievements[id]; // Get achievement data
        const status = item.querySelector('.status');
        if(achievementData.completed){
            item.classList.add('completed'); // Unlock achievement
            status.textContent = "Unlocked";
        }else {
            item.classList.remove('completed'); // Remove completed if not completed
            status.textContent = "Locked";
        }
    })
}

// Check if achievements have been completed
function checkAchievements(){
    // Check condition for achievement and make sure it is not yet completed
    // Shadow Collector I, II, III
    if(lifetimeShadows >= 1000 && !achievements.shadowCollectorI.completed){
        achievements.shadowCollectorI.completed = true;
        showAchievementPopup(achievements.shadowCollectorI.name);
    }
    if(lifetimeShadows >= 100000 && !achievements.shadowCollectorII.completed){
        achievements.shadowCollectorII.completed = true;
        showAchievementPopup(achievements.shadowCollectorII.name);
    }
    if(lifetimeShadows >= 10000000 && !achievements.shadowCollectorIII.completed){
        achievements.shadowCollectorIII.completed = true;
        showAchievementPopup(achievements.shadowCollectorIII.name);
    }

    // Phantom Seeker
    if (lifetimePhantoms >= 3 && !achievements.phantomSeeker.completed) {
        achievements.phantomSeeker.completed = true;
        showAchievementPopup(achievements.phantomSeeker.name);
    }

    // Ninja Recruiter I, II, III
    if (lifetimeNinjasHired >= 10 &&!achievements.ninjaRecruiterI.completed) {
        achievements.ninjaRecruiterI.completed = true;
        showAchievementPopup(achievements.ninjaRecruiterI.name);
    }
    if (lifetimeNinjasHired >= 50 && !achievements.ninjaRecruiterII.completed) {
        achievements.ninjaRecruiterII.completed = true;
        showAchievementPopup(achievements.ninjaRecruiterII.name);
    }
    if (lifetimeNinjasHired >= 100 && !achievements.ninjaRecruiterIII.completed) {
        achievements.ninjaRecruiterIII.completed = true;
        showAchievementPopup(achievements.ninjaRecruiterIII.name);
    }

    // Speed Stalker
    if (speedLevel >= maxSpeedLevel && !achievements.speedStalker.completed) {
        achievements.speedStalker.completed = true;
        showAchievementPopup(achievements.speedStalker.name);
    }

    // Stealth Master
    if (stealthLevel >= maxStealthLevel && !achievements.stealthMaster.completed) {
        achievements.stealthMaster.completed = true;
        showAchievementPopup(achievements.stealthMaster.name);
    }

    // Shadow Rebirth
    if (tier1Purchased && !achievements.shadowRebirth.completed) {
        achievements.shadowRebirth.completed = true;
        showAchievementPopup(achievements.shadowRebirth.name);
    }

    updateAchievements();
}

// Calculate cost for next Phantom
function getPhantomCost(){
    let baseCost = phantomCostIncrement; // Base cost for phantom
    // Applying 20% discount if Tier 2 is purchased
    if (tier2Purchased){
        baseCost = baseCost * 0.8;
    }
    return baseCost;
}

// Gain phantom based on shadows
function updatePhantoms(){
    let costPerPhantom = getPhantomCost();

    // Check if there is enough shadows for phantom
    while(shadows >= nextPhantomThreshold){
        phantoms++;
        lifetimePhantoms++;
        // Increase threshold for next phantom
        nextPhantomThreshold = nextPhantomThreshold + costPerPhantom;
        checkAchievements();
    }
    phantomCounter.textContent = phantoms; // Update phantom counter
}

// Update Ninja Statistics
function updateNinjaStats(){
    shadowsPerSec = 0;
    Object.values(ninjas).forEach(ninja => {
        // Calculate shadows per second
        shadowsPerSec += ninja.count * ninja.sps * (1 + stealthLevel * 0.1) * (tier1Purchased ? 1.5 : 1);
    });
    updateDisplay();
}

// Update Display
function updateDisplay(){
    // Calculate Click Value based on Speed upgrade
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
    phantomProgressText.textContent = currentShadows + '/' + phantomCostRounded + ' (' + percentageRounded + '%)';
    phantomProgressBar.style.width = percentageRounded + '%';

    // Update Resources and Upgrades Display
    shadowCounter.textContent = Math.round(shadows);
    shadowsPerSecDisplay.textContent = shadowsPerSec;
    speedLevelDisplay.textContent = speedLevel;
    speedCostDisplay.textContent = speedCost;
    shadowsPerClickDisplay.textContent = shadowsPerClick;
    stealthLevelDisplay.textContent = stealthLevel;
    stealthCostDisplay.textContent = stealthCost;
    phantomCounter.textContent = phantoms;

    // Updating Ninja cost and count buttons and displays
    ninjaHireButtons.forEach(button => {
        const type = button.dataset.type;
        const ninja = ninjas[type];
        const cost = button.querySelector('.cost');
        const count = button.parentElement.querySelector('.count');

        // Update UI
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
        speedUpgradeButton.classList.add('ghosted'); // Make button ghosted
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
        stealthUpgradeButton.classList.add('ghosted'); // Make button ghosted
        stealthUpgradeButton.disabled = true;
        if(stealthLevel >= maxStealthLevel){
            stealthUpgradeButton.classList.add('maxed');
        }
    }

    // Updating Tier Buttons
    for(let tier = 1; tier <= 5; tier++){
        const isPurchased = eval(`tier${tier}Purchased`);
        if(phantoms >= tiers[tier].cost && !isPurchased){
            tierButtons[tier].classList.remove('ghosted', 'maxed');
            tierButtons[tier].disabled = false;
        }else {
            tierButtons[tier].classList.add('ghosted');
            tierButtons[tier].disabled = true;
            if(isPurchased){
                tierButtons[tier].classList.add('maxed');
                tierButtons[tier].classList.remove('ghosted')
            }
        }
    }
}

// Tier Purchasing
function tierPurchase(tier){
    const tierID = tiers[tier];
    const userConfirmation = confirm(`Buy Tier ${tier}: ${tierID.message}`);
    if(userConfirmation){
        phantoms -= tierID.cost;
        eval(`tier${tier}Purchased = true`);
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
        checkAchievements();
    }
}

// ---- Event Listeners ----

// Gain Shadows button
gainShadowButton.addEventListener('click', function(){
    shadows += shadowsPerClick;
    lifetimeShadows = lifetimeShadows + shadowsPerClick;
    updatePhantoms();
    updateDisplay();
    checkAchievements()
})

// Upgrade Speed button
speedUpgradeButton.addEventListener('click', function(){
    if (speedLevel < maxSpeedLevel && shadows >= speedCost){
        shadows  = shadows - speedCost; // Deduct cost
        speedLevel++;
        updatePhantoms();
        updateDisplay();
        checkAchievements()
    }
})

// Upgrade Stealth Button
stealthUpgradeButton.addEventListener('click', function(){
    if (stealthLevel < maxStealthLevel && shadows >= stealthCost){
        shadows = shadows - stealthCost; // Deduct cost
        stealthLevel++;
        updatePhantoms();
        updateNinjaStats();
        updateDisplay();
        checkAchievements();
    }
})

// Tier Buttons
for(let tier = 1; tier <= 5; tier++){
    if(tierButtons[tier]){
        tierButtons[tier].addEventListener('click', () => tierPurchase(tier));
    }
}

// Save Game Button
if(saveGameButton){
    saveGameButton.addEventListener('click', saveGame);
}

// Ninja Hiring
ninjaHireButtons.forEach(button => {
    button.addEventListener('click', () => {
        const type = button.dataset.type; // Get ninja type
        const ninja = ninjas[type]; // Get ninja data
        if (shadows >= ninja.cost){ // Hire ninja if affordable
            shadows -= ninja.cost;
            ninja.count ++;
            lifetimeNinjasHired++;
            let baseNinjaCost = ninja.baseCost + (ninja.increment * ninja.count); // Calculate cost for next ninja
            // Apply 30% discount if Tier 5 is purchased
            if(tier5Purchased){
                ninja.cost = baseNinjaCost * 0.7;
            } else {
                ninja.cost = baseNinjaCost;
            }

            // Trigger pulse animation
            const ninjaSection = button.closest('.ninja_section');
            ninjaSection.classList.remove('pulse'); // Remove existing animation
            void ninjaSection.offsetWidth; // Restart the animation
            ninjaSection.classList.add('pulse');

            updatePhantoms();
            updateNinjaStats();
            updateDisplay();
            checkAchievements();
        }
    });
})

// Toggle Achievements list
const achievementButton = document.getElementById("achievements_button");
achievementButton.addEventListener("click", () => {
    const achievementsList = document.getElementById("achievements");
    achievementsList.classList.toggle("active"); // Make list visible
});

// ---- Initialization ----
// Passive Shadow gain
setInterval(() => {
    let shadowGain = shadowsPerSec / 10;
    shadows = shadows + shadowGain;
    lifetimeShadows = lifetimeShadows + shadowGain;
    updatePhantoms();
    updateDisplay();
    checkAchievements();
}, 100); // Update every 100ms

updateDisplay();
updateNinjaStats();
updateAchievements();

// Load game when page loads
document.addEventListener('DOMContentLoaded', loadGame);

// Save game every 30 seconds
setInterval(saveGame, 30000);