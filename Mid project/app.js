// Inspired by https://camillemormal.com/
// Creating an invisible slider for moving the image track that can be accessed at any point on the screen

const track = document.querySelector("#image-track");

// e stands for event

//stores X axis value for mouse on mouse click
const handleOnDown = (e) => (track.dataset.mouseDownAt = e.clientX);

const handleOnUp = () => {
  // Resets mouse down at position to 0 when mouse is released
  track.dataset.mouseDownAt = "0";
  track.dataset.prevPercentage = track.dataset.percentage;
};

const handleOnMove = (e) => {
  //skips the code that moves the track if mouse isn't pressed as value is set at 0 in HTML
  if (track.dataset.mouseDownAt === "0") return;

  // subtracts current mouse position value from starting point
  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
    //end of slider equal to mouse movement equal to half the width of the window
    maxDelta = window.innerWidth / 2;

  //dividing the relative position by the max distance converts value into a decimal, multiplying by 100 gives a percentage value (negative value as positive moves track wrong direction)
  const percentage = (mouseDelta / maxDelta) * -100,
    nextPercentageUnconstrained =
      parseFloat(track.dataset.prevPercentage) + percentage,
    // stops the track scrolling infinitely
    nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

  //constantly tracks percentage and stores it on release of mouse on line 14 - line 29 uses this new percentage as starting point for slider on next mouse click
  track.dataset.percentage = nextPercentage;

  //used animate for a smoother effect instead of updating the CSS directly as the resetting behaviour looks choppy
  track.animate(
    {
      transform: `translate(${nextPercentage}%, -50%)`,
    },
    { duration: 1200, fill: "forwards" }
  );

  //code for scrolling the individual images with a parallax effect
  for (const image of track.querySelectorAll(".image")) {
    image.animate(
      {
        // add 100 to correct the range for nextPercentage
        objectPosition: `${100 + nextPercentage}% center`,
      },
      { duration: 1200, fill: "forwards" }
    );
  }
};

window.onmousedown = (e) => handleOnDown(e);

window.ontouchstart = (e) => handleOnDown(e.touches[0]);

window.onmouseup = (e) => handleOnUp(e);

window.ontouchend = (e) => handleOnUp(e.touches[0]);

window.onmousemove = (e) => handleOnMove(e);

window.ontouchmove = (e) => handleOnMove(e.touches[0]);
