var block = document.getElementById("block");
var hole = document.getElementById("hole");
var character = document.getElementById("character");
var jumping = 0;
var counter = 0;

//Randomise hole generation in each block
hole.addEventListener("animationiteration", () => {
    var random = (Math.floor((Math.random()*250) + 50));
    hole.style.top = random + "px";
    counter++;
})

//General game tick
setInterval(function(){

    //Create gravity for character
    var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    if (jumping == 0) {
        character.style.top = (characterTop + 3) + "px";
    }

    //Create block collision
    var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    var blockRight = blockLeft + parseInt(window.getComputedStyle(block).getPropertyValue("width"));
    var characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    var characterRight = characterLeft + parseInt(window.getComputedStyle(character).getPropertyValue("width"));
    var characterBottom = characterTop + parseInt(window.getComputedStyle(character).getPropertyValue("height")); 
    var holeTop = parseInt(window.getComputedStyle(hole).getPropertyValue("top"));
    var holeBottom = holeTop + parseInt(window.getComputedStyle(hole).getPropertyValue("height"));
    var collision = 0;
    console.log(character.style.height);

    //Block not between hole
    if (blockRight > characterLeft && blockLeft < characterRight) {
        if (characterTop <= holeTop || characterBottom >= holeBottom) {
            collision = 1;
        }   
    }

    //Create losing condition for character
    if (characterTop > 480 || collision) {
        alert("Game Over. Score: " + counter);
        character.style.top = 100 + "px";
        counter = 0;
    }


}, 10);

//User interaction
function jump(){
    jumping = 1;
    let jumpCount = 0;
    var jumpInterval = setInterval(function() {
        var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
        
        //Only jump below ceiling
        if(characterTop > 5 && jumpCount < 15) {
            character.style.top = (characterTop - 5) + "px";
        }
        jumpCount++;
        
        //Only jump for a set amount of time
        if(jumpCount > 20) {
            clearInterval(jumpInterval);
            jumping = 0;
            jumpcount = 0;
        }
    }, 10);
}

