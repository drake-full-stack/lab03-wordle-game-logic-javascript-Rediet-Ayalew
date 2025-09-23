// ===== GAME STATE VARIABLES =====
const TARGET_WORD = "WORDS";  // Our secret word for testing
let currentRow = 0;           // Which row we're filling (0-5)
let currentTile = 0;          // Which tile in the row (0-4)
let gameOver = false;         // Is the game finished?

// DOM element references (set up on page load)
let gameBoard, rows, debugOutput;

// ===== HELPER FUNCTIONS (PROVIDED) =====


// /*Add, check, delete and submit letter_the 4 functions needed for lab03*/



// Debug/Testing Functions
function logDebug(message, type = 'info') {
    // Log to browser console
    console.log(message);
    
    // Also log to visual testing area
    if (!debugOutput) {
        debugOutput = document.getElementById('debug-output');
    }
    
    if (debugOutput) {
        const entry = document.createElement('div');
        entry.className = `debug-entry ${type}`;
        entry.innerHTML = `
            <span style="color: #666; font-size: 12px;">${new Date().toLocaleTimeString()}</span> - 
            ${message}
        `;
        
        // Add to top of debug output
        debugOutput.insertBefore(entry, debugOutput.firstChild);
        
        // Keep only last 20 entries for performance
        const entries = debugOutput.querySelectorAll('.debug-entry');
        if (entries.length > 20) {
            entries[entries.length - 1].remove();
        }
    }
}

function clearDebug() {
    const debugOutput = document.getElementById('debug-output');
    if (debugOutput) {
        debugOutput.innerHTML = '<p style="text-align: center; color: #999; font-style: italic;">Debug output cleared - ready for new messages...</p>';
    }
}

// Helper function to get current word being typed
function getCurrentWord() {
    const currentRowElement = rows[currentRow];
    const tiles = currentRowElement.querySelectorAll('.tile');
    let word = '';
    tiles.forEach(tile => word += tile.textContent);
    return word;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    gameBoard = document.querySelector('.game-board');
    rows = document.querySelectorAll('.row');
    debugOutput = document.getElementById('debug-output');
    
    logDebug("🎮 Game initialized successfully!", 'success');
    logDebug(`🎯 Target word: ${TARGET_WORD}`, 'info');
    logDebug("💡 Try typing letters, pressing Backspace, or Enter", 'info');
});

// ===== YOUR CHALLENGE: IMPLEMENT THESE FUNCTIONS =====

// TODO: Add keyboard event listener
document.addEventListener("keydown", (event) => {
    if (gameOver) {
        return; // Ignore input if game is over
        }
        const key =event.key.toUpperCase(); // converts "a" to "A"
           if(key ==="BACKSPACE"){
            deleteLetter();
        }
        else if(key==="ENTER"){
        submitGuess(key);
    }
    else if (key.length === 1 && key >= 'A' && key <='Z'){
        addLetter(key);
    }
});

// TODO: Implement addLetter function
function addLetter(letter) {
    logDebug(`🎯 addLetter("${letter}") called`, 'info');

    // If full, log error message and return early
    if (currentTile >=5){
        logDebug(`❌ cannot add more letters, row is full`, 'error');
        currentRow++;
        currentTile=0;
        return; // row is full
    }
    
    const rowElement = rows[currentRow];
    const tiles =rowElement.querySelectorAll('.tile');
    const specificTile = tiles[currentTile];

    specificTile.textContent= letter;
    specificTile.classList.add('filled');
    currentTile++;
    logDebug(`✅ Added letter "${letter}" to tile ${currentTile-1} in row ${currentRow}`, 'success');
    logDebug(`💡 Current word: "${getCurrentWord()}"`, 'info')  ;

}

// TODO: Implement deleteLetter function  
function deleteLetter() {
    logDebug(`🎯 deleteLetter() called`, 'info');
    if (currentTile <=0){
        logDebug(`❌ cannot delete letter, row is empty`, 'error')  
        return;
        
      }
      currentTile--;  
      const currentRowElement= rows[currentRow];
      const tiles =currentRowElement.querySelectorAll('.tile');
      const specificTile =tiles[currentTile];

      specificTile.textContent='';
      specificTile.classList.remove('filled');
      logDebug(`✅ Deleted letter from tile ${currentTile} in row ${currentRow}`, 'success');
      logDebug(`💡 Current word: "${getCurrentWord()}"`, 'info');

}

// TODO: Implement submitGuess function
function submitGuess() {
    logDebug('🎯 submitGuess() called', 'info');
    if(currentTile !==5) {
        alert(`❌ cannot submit guess, row is not full`);
        return;
    }
    const currentRowElement=rows[currentRow];
    const tiles=currentRowElement.querySelectorAll('.tile');
    let guess ='';
    tiles.forEach(tile=>{
        guess +=tile.textContent;
    })
    // Log the guess and target word for debugging
    logDebug(`💡 Current guess: "${guess}"`, 'info')
    logDebug(`💡 Target word: "${TARGET_WORD}"`, 'info');

    // Call checkGuess function (to be implemented)
    checkGuess(guess, tiles);
    currentRow++;
    currentTile=0;

    if(guess === TARGET_WORD){
        setTimeout(() => alert(`🎉 Congratulations! You won`), 500);
        logDebug("🏆 Correct guess detected! Triggering win alert...", 'success');
        gameOver=true;
    } else if(currentRow>=6){
        setTimeout(() => alert(`❌ Game Over! You lost!`), 500);
        logDebug("💀 Maximum attempts reached! Triggering game over alert...", 'error');
        gameOver=true;
    }
    
}

// TODO: Implement checkGuess function (the hardest part!)
function checkGuess(guess, tiles) {
    logDebug(`🔍 Starting analysis for "${guess}"`, 'info');
    
    // TODO: Split TARGET_WORD and guess into arrays
    const target = TARGET_WORD.split('');
    const guessArray = guess.split('');
    const result = ['absent', 'absent', 'absent', 'absent', 'absent'];
    
    // STEP 1: Find exact matches
    for (let i = 0; i < 5; i++) {
        if (guessArray[i]===target[i]) {
            result[i] = 'correct';
            guessArray[i]=null;
            target[i]=null;
        }
    }
    
    // STEP 2: Find wrong position matches  
    for (let i = 0; i < 5; i++) {
        if (guessArray[i] !== null) {
            // TODO: look for guessArray[i] in remaining target letters
            // TODO: if found, mark as 'present' and set target position to null
            const index = target.findIndex(letter => letter === guessArray[i]);
            if(index !== -1){
                result[i]='present';
                target[index]=null;
            }
        }
    }
    
    // TODO: Apply CSS classes to tiles -- we'll do this in the next step
    for (let i = 0; i < 5; i++) {
        tiles[i].classList.add(result[i]);
    }
    
    logDebug(`✅ Analysis complete: [${result.join(', ')}]`, 'success');    
    return result;
}
