
//Creating 25 slider elements
for (let i = 25; i > 0; i--) {
    let slider = document.createElement("div");
    slider.setAttribute("class", "slider animate");
    slider.setAttribute("id", "slider" + i);
    document.getElementById("game").append(slider);
}

var slideWidth = 300;

function stopSliding(slider) {

    var sliderCurrent = document.getElementById("slider" + slider);
    var sliderAbove = slider == 25 ? sliderCurrent : document.getElementById("slider" + (slider + 1));
    var sliderBelow = slider == 1 ? sliderCurrent : document.getElementById("slider" + (slider - 1));

    //Stop animation and fix current slider
    var left = window.getComputedStyle(sliderCurrent).getPropertyValue("left");
    sliderCurrent.classList.remove("animate");
    sliderCurrent.style.left = left;

    //Add cutting functionality
    var width = parseInt(window.getComputedStyle(sliderCurrent).getPropertyValue("width"));
    var leftBelow = parseInt(window.getComputedStyle(sliderBelow).getPropertyValue("left"));

    left = parseInt(left);
    var diff = left - leftBelow;
    var absDiff = Math.abs(diff);

    //Losing condition
    if (absDiff > width) {
        alert("Score: " + (slider - 1));
        location.reload();
    }

    //Cutting off overhang
    if (diff > 0) {
        left += absDiff;
    } else {
        left -= diff;
        sliderCurrent.style.left = left.toString() + "px";
    }
    
    var offset = (width - absDiff).toString().concat("px");
    sliderCurrent.style.width = offset;
    sliderAbove.style.width = offset;
    sliderAbove.style.visibility = "visible";

    //Win condition
    if (slider == 25) {
        alert("Congratulations! You Win!\nScore: 25");
        location.reload();
    }

    //Make newly sized slider go to end of box
    slideWidth += absDiff;
    document.documentElement.style.setProperty("--width", slideWidth + "px");

    //Resetting onclick function
    var onclick = "stopSliding(" + (slider + 1) + ")";
    document.getElementById("btn").setAttribute("onclick", onclick);
}

