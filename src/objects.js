//--- The sprite object

let spriteObject =
{
  sourceX: 0,
  sourceY: 0,
  sourceWidth: 64,
  sourceHeight: 64,
  width: 64,
  height: 64,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  visible: true,
  scrollable: true,

  //Physics properties
  accelerationX: 0,
  accelerationY: 0,
  speedLimit: 5,
  friction: 0.9,
  bounce: -0.7,
  gravity: 0.3,

  //Platform game properties
  isOnGround: undefined,
  jumpForce: -10,


  //Getters
  centerX: function()
  {
    return this.x + (this.width / 2);
  },
  centerY: function()
  {
    return this.y + (this.height / 2);
  },
  halfWidth: function()
  {
    return this.width / 2;
  },
  halfHeight: function()
  {
    return this.height / 2;
  },
  left: function()
  {
    return this.x;
  },
  right: function()
  {
    return this.x + this.width;
  },
  top: function()
  {
    return this.y;
  },
  bottom: function()
  {
    return this.y + this.height;
  }
};

//--- The message object

let messageObject =
{
  x: 0,
  y: 0,
  visible: true,
  text: "Message",
  font: "normal bold 20px Helvetica",
  fillStyle: "red",
  textBaseline: "top"
};

//--- The gameTimer object

let gameTimer =
{
  time: 0,
  interval: undefined,

  start: function()
  {
    let self = this;
    this.interval = setInterval(function(){self.tick();}, 1000);
  },

  tick: function ()
  {
    this.time--;
  },

  stop: function()
  {
    clearInterval(this.interval);
  },

  reset: function()
  {
    this.time = 0;
  }
};
