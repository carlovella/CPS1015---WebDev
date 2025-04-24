// Resource variables
let shadows = 0;
let shadowsPerClick = 1;
let shadowsPerSec = 0; // Shadows per second from ninjas
let phantoms = 0;
let nextPhantomThreshold = 500000; // Shadows needed for next phantom

// Counters for Achievements
let lifetimeShadows = 0;
let lifetimePhantoms = 0;
let lifetimeNinjasHired = 0;

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
const phantomCostIncrement = 500000; // Cost increment for phantoms

// Achievements Structure
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

// Ninja Object with different properties
const ninjas = {
    novice: { baseCost: 10, cost: 10, increment: 5, sps: 1, count: 0},
    rogue: { baseCost: 100, cost: 100, increment:50, sps: 5, count: 0},
    elite: { baseCost: 1000, cost: 1000, increment:500, sps: 20, count: 0},
    grandmaster: { baseCost: 10000, cost: 10000, increment:5000, sps: 100, count: 0},
}

// DOM elements for UI (Linkage of scripts)
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
const saveGameButton = document.getElementById('saveGameButton');
const saveGameText = document.getElementById('saveGameText');

// Saving Game Stats
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

// Loading Game Stats
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

    // Update Resource and Upgrades Display
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

    // Updating Tier 1 button
    if (phantoms >= 1 && !tier1Purchased){ // Check condition and make sure it is not purchased
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
    if (phantoms >= 2 && !tier2Purchased){ // Check condition and make sure it is not purchased
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
    if (phantoms >= 3 && !tier3Purchased){ // Check condition and make sure it is not purchased
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
    if (phantoms >= 4 && !tier4Purchased){ // Check condition and make sure it is not purchased
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
    if (phantoms >= 5 && !tier5Purchased){ // Check condition and make sure it is not purchased
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

// Tier 1 Button
tier1Button.addEventListener('click', function(){
    let userConfirmation = confirm('Buy Tier 1: Reset and Gain +50% Ninja SPS (Shadows Per Second)');
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
        checkAchievements();
    }
})

// Tier 2 Button
tier2Button.addEventListener('click', function(){
    let userConfirmation = confirm('Buy Tier 2: Reset and Gain -20% Phantom Cost for next Phantom');
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
        checkAchievements();
    }
})

// Tier 3 Button
tier3Button.addEventListener('click', function(){
    let userConfirmation = confirm('Buy Tier 3: Reset and Gain +50% Click Value (Shadows per Click)');
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
        checkAchievements();
    }
})

// Tier 4 Button
tier4Button.addEventListener('click', function(){
    let userConfirmation = confirm('Buy Tier 4: Reset and Gain -30% Upgrade Costs');
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
        checkAchievements();
    }
})

// Tier 5 Button
tier5Button.addEventListener('click', function(){
    let userConfirmation = confirm('Buy Tier 5: Reset and Gain -30% Ninja Costs');
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
        checkAchievements();
    }
})

// Save Game Button
if(saveGameButton){
    saveGameButton.addEventListener('click', saveGame);
}

// Passive Shadow gain
setInterval(() => {
    let shadowGain = shadowsPerSec / 10;
    shadows = shadows + shadowGain;
    lifetimeShadows = lifetimeShadows + shadowGain;
    updatePhantoms();
    updateDisplay();
    checkAchievements();
}, 100); // Update every 100ms

// Update Ninja Statistics
function updateNinjaStats(){
    shadowsPerSec = 0;
    Object.values(ninjas).forEach(ninja => {
        // Calculate shadows per second
        shadowsPerSec += ninja.count * ninja.sps * (1 + stealthLevel * 0.1) * (tier1Purchased ? 1.5 : 1);
    });
    updateDisplay();
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

updateDisplay();
updateNinjaStats();
updateAchievements();

// Load game when page loads
document.addEventListener('DOMContentLoaded', loadGame);

// Save game every 30 seconds
setInterval(saveGame, 30000);