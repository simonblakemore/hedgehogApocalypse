(function(){

//Set up the canvas
let canvas = document.querySelector("canvas");
let drawingSurface = canvas.getContext("2d");

//Arrays to count the assets that need to be loaded
let sprites = [];
let assetsToLoad = [];
let assetsLoaded = 0;

//The cat
let cat = Object.create(spriteObject);
cat.x = canvas.width / 2 - cat.halfWidth();
cat.y = canvas.height / 2 - cat.halfHeight();
sprites.push(cat);

//Load the tile sheet
let image = new Image();
image.addEventListener("load", loadHandler, false);
image.src = "../images/cat.png";
assetsToLoad.push(image);

//The game states
const LOADING = 0;
const PLAYING = 1;
let gameState = LOADING;

//Arrow key codes
const UP = 38;
const DOWN = 40;
const RIGHT = 39;
const LEFT = 37;

//Directions
let moveUp = false;
let moveDown = false;
let moveRight = false;
let moveLeft = false;

//Add keyboard listeners
window.addEventListener("keydown", function(event)
{
  switch(event.keyCode)
  {
    case UP:
      moveUp = true;
      break;

    case DOWN:
      moveDown = true;
      break;

    case RIGHT:
      moveRight = true;
      break;

    case LEFT:
      moveLeft = true;
      break;
  }
}, false);

window.addEventListener("keyup", function(event)
{
  switch(event.keyCode)
  {
    case UP:
      moveUp = false;
      break;

    case DOWN:
      moveDown = false;
      break;

    case RIGHT:
      moveRight = false;
      break;

    case LEFT:
      moveLeft = false;
      break;
  }
}, false);

//Start the game animation loop
debugger;
update();


function update()
{
  //The animation loop
  requestAnimationFrame(update, canvas);

  //Change what the game is doing based on the game states
  switch(gameState)
  {
    case LOADING:
      console.log("loading...");
      break;

    case PLAYING:
      playGame();
      break;
  }

  //Render the gameState
  render();
}


function loadHandler()
{
  assetsLoaded++;
  if (assetsLoaded === assetsToLoad.length)
  {
    gameState = PLAYING;
  }
}

function playGame()
{
    //Set the cats accelerationif the keys are being pressed
    //Up
    if(moveUp && !moveDown)
    {
      cat.accelerationY = -0.2;
    }
    //Down
    if(!moveUp && moveDown)
    {
      cat.accelerationY = 0.2;
    }
    //Left
    if(moveLeft && !moveRight)
    {
      cat.accelerationX = -0.2;
    }
    //Right
    if(!moveLeft && moveRight)
    {
      cat.accelerationX = 0.2;
    }

    //Set the cat's velocity an acceleration to zero if none of the key are beings pressed
    if(!moveUp && ! moveDown)
    {
      cat.accelerationY = 0;
      cat.vy = 0;
    }
    if(!moveLeft && !moveRight)
    {
      cat.accelerationX = 0;
      cat.vx = 0;
    }

    //Apply the acceleration
    cat.vx += cat.accelerationX;
    cat.vy += cat.accelerationY;

    //Limit the speed
    if(cat.vx > cat.speedLimit)
    {
      cat.vx = cat.speedLimit;
    }
    if(cat.vx < -cat.speedLimit)
    {
      cat.vx = -cat.speedLimit;
    }
    if(cat.vy > cat.speedLimit)
    {
      cat.vy = cat.speedLimit;
    }
    if(cat.vy < -cat.speedLimit)
    {
      cat.vy = -cat.speedLimit;
    }

    //Move the cat
    cat.x += cat.vx;
    cat.y += cat.vy;

    //Display the result
    console.log("cat.vx: " + cat.vx);
    console.log("cat.vy: " + cat.vy);
    console.log("-----------------");

    //Screen boundaries
    if(cat.x < 0)
    {
      cat.x = 0;
    }
    if(cat.y < 0)
    {
      cat.y = 0;
    }
    if(cat.x + cat.width > canvas.width)
    {
      cat.x = canvas.width - cat.width;
    }
    if(cat.y + cat.height > canvas.height)
    {
      cat.y = canvas.height - cat.height;
    }
}

function render()
{
  //Clear the drawing surface
  drawingSurface.clearRect(0, 0, canvas.width, canvas.height);


  //Display the sprites
  if(sprites.length !== 0)
  {
    for(let i = 0; i < sprites.length; i++)
    {
      let sprite = sprites[i];

      //Display the scrolling sprites
      if(sprite.visible)
      {
        drawingSurface.drawImage
        (
          image,
          sprite.sourceX, sprite.sourceY,
          sprite.sourceWidth, sprite.sourceHeight,
          Math.floor(sprite.x), Math.floor(sprite.y),
          sprite.width, sprite.height
        );
      }
    }
  }
}

}());
