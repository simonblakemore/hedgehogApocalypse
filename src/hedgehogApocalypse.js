(function(){

//The game map
let map =
[
  [7,7,7,8,9,7,7,8,9,7,7,7,8,9,7,7],
  [8,9,7,7,4,9,7,7,7,8,9,7,7,7,8,5],
  [4,7,7,7,7,7,8,9,7,7,7,8,9,7,4,4],
  [7,7,4,7,7,4,4,4,4,7,7,7,7,7,7,7],
  [7,7,4,7,7,7,7,8,9,7,7,4,8,9,7,7],
  [7,4,4,4,7,8,9,7,7,7,4,4,7,7,4,7],
  [9,7,8,9,7,7,7,8,9,4,7,4,9,7,7,8],
  [7,7,7,7,7,4,4,7,7,7,7,4,4,4,4,7],
  [8,9,7,7,7,7,7,7,7,8,9,7,7,8,9,7],
  [7,7,4,4,4,4,7,7,4,7,7,7,7,7,7,7],
  [7,7,7,7,7,7,7,7,7,4,7,7,7,7,7,7],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6]
];

// The game objects map
let gameObjects =
[
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0]
];

//Set the size of the game world in rows and columns based of the map array
const ROWS = map.length;
const COLUMNS = map[0].length;

//Map code
let EMPTY = 0;
let CAT = 1;
let HEDGEHOG = 2;
let BOX = 4;
let DOOR = 5;

//The size of each tile cell
let SIZE = 64;

//Initialize game object variables
let cat = null;
let door = null;
let gameOverDisplay = null;
let gameOverMessage = null;
let hedgehogsSquashed = 0;

//Initialize game arrays
let sprites = [];
let hedgehogs = [];
let boxes = [];
let messages = [];

//Set up the canvas
let canvas = document.querySelector("canvas");
let drawingSurface = canvas.getContext("2d");

//Arrays to count the assets that need to be loaded
let assetsToLoad = [];
let assetsLoaded = 0;

//Load the tile sheet
let image = new Image();
image.addEventListener("load", loadHandler, false);
image.src = "../images/hedgehogApocalypse.png";
assetsToLoad.push(image);

let tilesheetColumns = 3;

//The game states
const LOADING = 0;
const BUILDMAP = 1;
const PLAYING = 2;
const OVER = 3;
let gameState = LOADING;

//Arrow key codes
const RIGHT = 39;
const LEFT = 37;
const SPACE = 32;

//Directions
//let moveUp = false;
//let moveDown = false;
let moveRight = false;
let moveLeft = false;
let jump = false;
let jumpRelease = true;

//Add keyboard listeners
window.addEventListener("keydown", function(event)
{
  switch(event.keyCode)
  {
    case RIGHT:
      moveRight = true;
      break;

    case LEFT:
      moveLeft = true;
      break;

    case SPACE:
      jump = true;
      break;
  }
  event.preventDefault();

}, false);

window.addEventListener("keyup", function(event)
{
  switch(event.keyCode)
  {
    case RIGHT:
      moveRight = false;
      break;

    case LEFT:
      moveLeft = false;
      break;

    case SPACE:
      jump = false;
      jumpRelease = true;
      break;
  }
}, false);

//Start the game animation loop
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

    case BUILDMAP:
      buildMap(map);
      buildMap(gameObjects);
      createOtherObjects();
      gameState = PLAYING;
      break;

    case PLAYING:
      playGame();
      break;

    case OVER:
      endGame();
  }

  //Render the gameState
  render();
}


function loadHandler()
{
  assetsLoaded++;
  if (assetsLoaded === assetsToLoad.length)
  {
    gameState = BUILDMAP;
  }
}

function buildMap(levelMap)
{
  for(let row = 0; row < ROWS; row++)
  {
    for(let column = 0; column < COLUMNS; column++)
    {
      let currentTile = levelMap[row][column];

      if(currentTile != EMPTY)
      {
        //find the tile's x and y position in the tilesheet
        let tilesheetX = Math.floor((currentTile - 1) % tilesheetColumns) * SIZE;
        let tilesheetY = Math.floor((currentTile - 1) / tilesheetColumns) * SIZE;

        switch(currentTile)
        {
          case CAT:
            cat = Object.create(spriteObject);
            cat.sourceX = tilesheetX;
            cat.sourceY = tilesheetY;
            cat.x = column * SIZE;
            cat.y = row * SIZE;
            sprites.push(cat);
            break;

          case HEDGEHOG:
            let hedgehog = Object.create(hedgehogObject);
            hedgehog.sourceX = tilesheetX;
            hedgehog.sourceY = tilesheetY;
            hedgehog.x = column * SIZE;
            hedgehog.y = row * SIZE;
            hedgehog.vx = hedgehog.speed;
            sprites.push(hedgehog);
            hedgehogs.push(hedgehog);
            break;

          case BOX:
            let box = Object.create(spriteObject);
              box.sourceX = tilesheetX;
              box.sourceY = tilesheetY;
              box.x = column * SIZE;
              box.y = row * SIZE;
              sprites.push(box);
              boxes.push(box);
              break;

          case DOOR:
            door = Object.create(spriteObject);
            door.sourceX = tilesheetX;
            door.sourceY = tilesheetY;
            door.x = column * SIZE;
            door.y = row * SIZE;
            sprites.push(door);
            break;

          default:
            let sprite = Object.create(spriteObject);
            sprite.sourceX = tilesheetX;
            sprite.sourceY = tilesheetY;
            sprite.x = column * SIZE;
            sprite.y = row * SIZE;
            sprites.push(sprite);
        }
      }
    }
  }
}

function createOtherObjects()
{
  gameOverDisplay = Object.create(spriteObject);
  gameOverDisplay.sourceX = 0;
  gameOverDisplay.sourceY = 192;
  gameOverDisplay.sourceWidth = 192;
  gameOverDisplay.sourceHeight = 128;
  gameOverDisplay.width = 192;
  gameOverDisplay.height = 128;
  gameOverDisplay.x = canvas.width / 2 - gameOverDisplay.width / 2;
  gameOverDisplay.y = canvas.height / 2 - gameOverDisplay.height / 2;
  gameOverDisplay.visible = false;
  sprites.push(gameOverDisplay);

  gameOverMessage = Object.create(messageObject);
  gameOverMessage.x = gameOverDisplay.x + 20;
  gameOverMessage.y = gameOverDisplay.y + 34;
  gameOverMessage.font = "bold 30px Helvetica";
  gameOverMessage.fillStyle = "black";
  gameOverMessage.text = "";
  gameOverMessage.visible = false;
  messages.push(gameOverMessage);
}

function squashHedgehog(hedgehog)
{
  //Change the hedgehogs state and update it
  hedgehog.state = hedgehog.SQUASHED;
  hedgehog.update();

  //Remove hedgehog after one secong
  setTimeout(removeHedgehog, 1000);

  function removeHedgehog()
  {
    hedgehog.visible = false;
  }
}

function playGame()
{
  //--- The Cat

    //Left
    if(moveLeft && !moveRight)
    {
      cat.accelerationX = -0.2;
      cat.friction = 1;
    }
    //Right
    if(!moveLeft && moveRight)
    {
      cat.accelerationX = 0.2;
      cat.friction = 1;
    }

    if(jump && cat.isOnGround)
    {
      if(jumpRelease)
      {
        jumpRelease = false;
        cat.vy += cat.jumpForce;
        cat.isOnGround = false;
        cat.friction = 1;
      }
    }

    // //Set the cat's velocity an acceleration to zero if none of the key are beings pressed
    if(!moveLeft && !moveRight)
    {
      cat.accelerationX = 0;
      cat.friction = spriteObject.friction;
      cat.gravity = 0.3;
    }

    //Apply the acceleration
    cat.vx += cat.accelerationX;
    cat.vy += cat.accelerationY;

    //Apply friction
    if(cat.isOnGround)
    {
      cat.vx *= cat.friction;
    }

    //Apply gravity
    cat.vy += cat.gravity;

    //Limit the speed
    //Dont limit the upward speed because it will choke the jump effect
    if(cat.vx > cat.speedLimit)
    {
      cat.vx = cat.speedLimit;
    }
    if(cat.vx < -cat.speedLimit)
    {
      cat.vx = -cat.speedLimit;
    }
    if(cat.vy > cat.speedLimit * 2)
    {
      cat.vy = cat.speedLimit * 2;
    }

    //Move the cat
    cat.x += cat.vx;
    cat.y += cat.vy;

    //Check for collisions between the cat and the boxes
    for(let i = 0; i < boxes.length; i++)
    {
      let collisionSide = blockRectangle(cat, boxes[i], false);

      if(collisionSide === "bottom" && cat.vy >= 0)
      {
        //Tell the game that the cat is on the ground if it is standing on top of a platform
        cat.isOnGround = true;

        //Neutralize gravity by applying its exact opposite forece to the character's vy
        cat.vy = -cat.gravity;
      }
      else if(collisionSide === "top" && cat.vy <= 0)
      {
        cat.vy = 0;
      }
      else if(collisionSide === "right" && cat.vx >= 0)
      {
        cat.vx = 0;
      }
      else if(collisionSide === "left" && cat.vx <= 0)
      {
        cat.vx = 0;
      }
      if(collisionSide !== "bottom" && cat.vy > 0)
      {
        cat.isOnGround = false;
      }
    }

    //Screen boundaries
    //Left
    if(cat.x < 0)
    {
      cat.vx = 0;
      cat.x = 0;
    }
    //Up
    //if(cat.y < 0)
    // {
    //   cat.vy = 0;
    //   cat.y = 0;
    // }
    //Right
    if(cat.x + cat.width > canvas.width)
    {
      cat.vx = 0;
      cat.x = canvas.width - cat.width;
    }
    //Down
    if(cat.y + cat.height > canvas.height)
    {
      cat.vy = 0;
      cat.y = canvas.height - cat.height;
      cat.isOnGround = true;
      cat.vy = -cat.gravity;
    }

    //--- The Hedgehog

    for (let i = 0; i < hedgehogs.length; i++)
    {
      let hedgehog = hedgehogs[i];

      //Move the hedgehog if its state is NORMAL
      if(hedgehog.state === hedgehog.NORMAL)
      {
        hedgehog.x += hedgehog.vx;
        hedgehog.y += hedgehog.vy;
      }

      if(Math.floor(hedgehog.x) % SIZE === 0 && Math.floor(hedgehog.y) % SIZE === 0)
      {
        //Change the hedgehog's direction if there's no BOX under it
        //or if there's a BOX to the left or right of it
        //Find the hedgehog's column and row in the array
        let hedgehogColumn = Math.floor(hedgehog.x / SIZE);
        let hedgehogRow = Math.floor(hedgehog.y / SIZE);

        if(hedgehogRow < ROWS -1)
        {
          let thingBelowLeft = map[hedgehogRow + 1][hedgehogColumn - 1];
          let thingBelowRight = map[hedgehogRow + 1][hedgehogColumn + 1];

          if(thingBelowLeft !== BOX || thingBelowRight !== BOX)
          {
            hedgehog.vx *= -1;
          }
        }

        if(hedgehogColumn > 0)
        {
          let thingToTheLeft = map[hedgehogRow][hedgehogColumn -1];
          if(thingToTheLeft === BOX)
          {
            hedgehog.vx *= -1;
          }
        }

        if(hedgehogColumn < COLUMNS - 1)
        {
          let thingToTheRight = map[hedgehogRow][hedgehogColumn + 1];
          if(thingToTheRight === BOX)
          {
            hedgehog.vx *= -1;
          }
        }
      }
    }

    //Collision between the cat and the hedgehogs
    for(let i = 0; i < hedgehogs.length; i++)
    {
      let hedgehog = hedgehogs[i];

      if(hedgehog.visible && hitTestCircle(cat, hedgehog) && hedgehog.state === hedgehog.NORMAL)
      {
        if(cat.vy > 0)
        {
          blockCircle(cat, hedgehog, true);
          hedgehogsSquashed++;
          squashHedgehog(hedgehog);
        }
        else
        {
          gameState = OVER;
        }
      }
    }

    //Collision between the cat and the door
    if(hitTestRectangle(cat, door))
    {
      //Check if all the hedgehogs have been squashed
      if(hedgehogsSquashed === 3)
      {
        gameState = OVER;
      }
    }
}

function endGame()
{
  gameOverDisplay.visible = true;
  gameOverMessage.visible = true;

  if(hedgehogsSquashed === 3)
  {
    gameOverMessage.text = "You Won!";
  }
  else
  {
    gameOverMessage.text = "You Lost!";
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

  //Display the game messages
  if(messages.length !== 0)
  {
    for(let i = 0; i < messages.length; i++)
    {
      let message = messages[i];
      if(message.visible)
      {
        drawingSurface.font = message.font;
        drawingSurface.fillStyle = message.fillStyle;
        drawingSurface.textBaseline = message.textBaseline;
        drawingSurface.fillText(message.text, message.x, message.y);
      }
    }
  }
}

}());
