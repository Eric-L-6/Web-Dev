var character = document.getElementById("character");
var game = document.getElementById("game");
var interval;
var both = 0;
var counter = 0;
var currentBlocks = [];
var difficulty = 0.5;

function moveLeft(){
    var left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if (left > 0) {
        character.style.left = left - 2 + "px"; 
    }
}

function moveRight(){
    var left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if (left < 380) {
        character.style.left = left + 2 + "px";
    }
    
}

document.addEventListener("keydown", event => {
    if (both == 0) {
        both++;
        if (event.key==="ArrowLeft") {
            interval = setInterval(moveLeft, 1);
        } else if (event.key==="ArrowRight") {
            interval = setInterval(moveRight, 1);
        }
    }

});

document.addEventListener("keyup", event => {
    clearInterval(interval);
    both = 0;
});


//Create block obstacles on timer
var blocks = setInterval(function(){

    //get last block obstacle position
    var blockLast = document.getElementById("block" + (counter - 1));
    var holeLast = document.getElementById("hole" + (counter - 1));
    if (counter > 0) {
        var blockLastTop = parseInt(window.getComputedStyle(blockLast).getPropertyValue("top"));
        var holeLastTop = parseInt(window.getComputedStyle(holeLast).getPropertyValue("top"));
    }

    //Only make new block if theres space in game window
    if (counter == 0 || blockLastTop < 400) {

        var block = document.createElement("div");
        var hole = document.createElement("div");
        
        block.setAttribute("class", "block");
        block.setAttribute("id", "block" + counter);
        
        hole.setAttribute("class", "hole");
        hole.setAttribute("id", "hole" + counter);
        
        //make new blocks below current block
        block.style.top = blockLastTop + 100 + "px";
        hole.style.top = holeLastTop + 100 + "px";
        
        var random = Math.floor(Math.random() * 360);
        hole.style.left = random + "px";
        
        game.appendChild(block);
        game.appendChild(hole);

        currentBlocks.push(counter);
        counter++;
    }

    //create character collision variables
    var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    var characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    var drop = 0;

    if (characterTop <= 0) {
        alert("Game Over. Score: " + (counter - 9));
        clearInterval(blocks);
        location.reload();
    }

    //Make blocks continually move upwards
    for (var i = 0; i < currentBlocks.length; i++) {
        let current_id = currentBlocks[i];
        let ithBlock = document.getElementById("block" + current_id);
        let ithHole = document.getElementById("hole" + current_id);
        let ithBlockTop = parseFloat(window.getComputedStyle(ithBlock).getPropertyValue("top"));
        let ithHoleLeft = parseFloat(window.getComputedStyle(ithHole).getPropertyValue("left"));
        ithBlock.style.top = ithBlockTop - difficulty + "px";
        ithHole.style.top = ithBlockTop - difficulty + "px";

        if (ithBlockTop < -20) {
            currentBlocks.shift();
            ithBlock.remove();
            ithHole.remove();
        }
        
        //implement character collision
        //if in hole, drop through hole
        if (ithBlockTop - 20 < characterTop && ithBlockTop > characterTop) {
            drop++;
            if (ithHoleLeft <= characterLeft && ithHoleLeft + 20 >= characterLeft) {
                drop = 0;
            }
        }
    }
        
    if (drop == 0) {
        if (characterTop < 480) {
            character.style.top = characterTop + 2 + "px";
        }
    } else {
        character.style.top = characterTop - difficulty + "px";
    }
    difficulty += 0.00001;

}, 1);


