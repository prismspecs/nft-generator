let gifLength = 80;

let ethereum_model;
let bitcoin_model;

let font,
  fontsize = 40;

let emojis = [];
var emoji_count = 1;

let mandel;
let mandel_texture;

function preload() {
  ethereum_model = loadModel('assets/ethereum.obj');
  bitcoin_model = loadModel('assets/btc.obj');
  //font = loadFont('assets/OpenSansEmoji.otf');
  font = loadFont('assets/SyneMono-Regular.ttf');
  
  // load in emojis fuckfuckfuck
  emojis[0] = loadImage("assets/emoji_poop.png");
  emojis[1] = loadImage("assets/emoji_laugh.png");
  emojis[2] = loadImage("assets/emoji_100.png");
  emojis[3] = loadImage("assets/emoji_flex.png");
  emojis[4] = loadImage("assets/emoji_alien.png");
  emojis[5] = loadImage("assets/emoji_angry.png");
  emojis[6] = loadImage("assets/emoji_baby.png");
  emojis[7] = loadImage("assets/emoji_clown.png");
  emojis[8] = loadImage("assets/emoji_cool.png");
  emojis[9] = loadImage("assets/emoji_cry.png");
  emojis[10] = loadImage("assets/emoji_money.png");
  emojis[11] = loadImage("assets/emoji_palmface.png");
  emojis[12] = loadImage("assets/emoji_scream.png");
  
  mandel = loadShader('assets/shader.vert', 'assets/shader.frag');

}


var spin_speed;
var color_vibe;
var intensity_slider; var lights_delta = 0.0;
var ether_3d; // ethereum logo
var emoji_slider;
var save_gif_button;
var save_image_button;

var emoji_loc = []; // vectors to save randomized emoji locations
let snowflakes = []; // array to hold snowflake objects
var colors = [];

// recording
let canvas;
let can;
let capturer;

function setup() {

  randomize();

  frameRate(30);

  can = createCanvas(200, 150, WEBGL);
  canvas = can.canvas;
  can.parent("canvas-container");

  mandel_texture = createGraphics(width, height, WEBGL);
  mandel_texture.noStroke();

  $("canvas").width("100%");
  $("canvas").height($("canvas").width() * .75);
  
  spin_speed = document.getElementById("spin_speed");
  color_vibe = document.getElementById("color_vibe");
  intensity_slider = document.getElementById("intensity_slider");
  ether_3d = document.getElementById("ether_3d");
  emoji_slider = document.getElementById("emoji_slider");
  trippy = document.getElementById("trippy");
  save_gif_button = document.getElementById("save_gif_button");
  save_image_button = document.getElementById("save_image_button");
  snow_slider = document.getElementById("snow_slider");
  musk_slider = document.getElementById("musk_slider");

  save_gif_button.onclick = record;
  save_image_button.onclick = snapshot;
  randomize_button.onclick = randomize;

  emoji_count = parseFloat(emojis.length);
  console.log(emoji_count + " emojis loaded");

  // emoji locations
  for(var i = 0; i < emoji_slider.max; i++) {
    emoji_loc[i] = createVector(random(-width,width)*.9, random(-height,height)*.9, random(10,80));
  }

  textFont(font);
  textSize(fontsize);
  textAlign(CENTER, CENTER);

  // set up colors
  colors = [
    // 0: background, 1: snow, 2: eth logo
    [color(100), color(255), color(121,134,204)],
    [color(0), color(255,0,0), color(111)],
    [color(255,0,255), color(255,255,0), color(0,255,55,90)],
    [color(77,77,155), color(0,0,0), color(255,134)],
    [color(255), color(255), color(255)]
  ];

  background(colors[color_vibe.value][0]);


  mandel_texture.shader(mandel);
  mandel.setUniform('p', [-0.74364388703, 0.13182590421]);
}

function draw() {

  if(color_vibe.value == 4) {
    push();
    fill(0,10);
    rectMode(CENTER);
    translate(0,0,-100);
    rect(0, 0, width*2, height*2);
    pop();
  } else {
    background(colors[color_vibe.value][0]);
  }
  

  let t = frameCount / 30; // update time

  // snowflakes
  if(snow_slider.value > 0) {
    // create snowflakes each frame
    for (let i = 0; i < snow_slider.value; i++) {
      snowflakes.push(new snowflake()); // append snowflake object
    }
  }
  push();
  noStroke();
  if(color_vibe.value == 4)
    fill(random(255), random(255), random(255));
  else
    fill(colors[color_vibe.value][1]);
  translate(0,0,-10);
  // loop through snowflakes 
  for (let flake of snowflakes) {
    flake.update(t); // update snowflake position
    flake.display(); // draw snowflake
  }
  pop();


  // trippy
  if(trippy.value == 1) {
    push();
    mandel.setUniform('r', 5.5 * exp(-6.5 * (1 + sin(millis() / 5000))));
    mandel_texture.quad(-1, -1, 1, -1, 1, 1, -1, 1);
    pop();

    push();
    noStroke();
    rectMode(CENTER);
    translate(0,0,-130);
    texture(mandel_texture);
    rect(0,0,width*2,height*2);
    pop();
  }


  // lights zoom around
  lights_delta += parseFloat(intensity_slider.value);
  var lx = cos(lights_delta) * width/2;
  var ly = sin(lights_delta) * height/2;
  pointLight(255, 255, 255, lx, ly, 200);


  // edgelord
  let n_intensity = map(parseFloat(intensity_slider.value),0.0,0.1,0.0,1.0);
  if(n_intensity > 0) {
    
    push();
    // translate(,);
    scale(2);
    strokeWeight(n_intensity * 4);
    rotate(frameCount * -spin_speed.value /3);
    //rotate(n_intensity * TWO_PI);
    stroke(inverse_color(colors[color_vibe.value][0]));
    for(let i = 0; i < height; i++) {
      line(0-width/2,i-height/2,noise(i+frameCount/2)*width-width/2,i-height/2);
    }
    pop();
  }
  


  // logo 
  push();
  scale(25);
  noStroke();
  if(color_vibe.value == 4) {
    fill(255,0);
    stroke(0);
  } else {
    fill(colors[color_vibe.value][2]);
  }

  if(spin_speed.value > .01)
    rotateX(frameCount * spin_speed.value);
  else
    rotateX(-.3);

  rotateY(frameCount * spin_speed.value);
  if(ether_3d.value == 1)
    model(ethereum_model);
  if(ether_3d.value == 2)
    model(bitcoin_model);
  pop();


  // emojis
  imageMode(CENTER);
  
  for(var i = 0; i < emoji_slider.value; i++) {
    //let r = floor(random(0, emojis.length));
    let pos = emoji_loc[i];
    let which_emoji = parseInt(i%emoji_count);
    push();
    translate(pos.x,pos.y,-100);
    
    image(emojis[which_emoji], 0, 0, pos.z, pos.z);
    pop();
  }
  
  

  // bootlicker musk
  if(musk_slider.value > 0) {
    var the_text = "";
    switch(parseInt(musk_slider.value)) {
      case 1:
        the_text = "dapps";
      break;

      case 2:
        the_text = "musk";
      break;

      case 3:
        the_text = "spaceX";
      break;
    }

    push();
    fill(inverse_color(colors[color_vibe.value][1]));
    translate(0,30,30);

    if(spin_speed.value > .02) {
      rotateX(frameCount * spin_speed.value);
    }
    text(the_text, 0, -10);
    pop();

  }
  

  if (capturer) {
    // console.log("!");
    capturer.capture(canvas);
  }
}

// save gif
function record() {
  capturer = new CCapture({
    format: "gif",
    framerate: 30,
    workersPath: './libraries/'
  });
  capturer.start()
  save_gif_button.textContent = "stop recording";
  save_gif_button.onclick = e => {
    capturer.stop();
    capturer.save();
    capturer = null;
    save_gif_button.textContent = "start recording";
    save_gif_button.onclick = record;
  };
}

// save image
function snapshot() {
  save("nft.png");
}


// randomize new values
function randomize() {
  $('[type=range]').each(function (index, Element) {
    let min_val = $(Element).prop('min');
    let max_val = $(Element).prop('max');
    let new_value = random(min_val,max_val);
    $(Element).val(new_value);
  });
  $("#intensity_slider").val(random(0.0,0.1));
  $("#spin_speed").val(random(0.0,0.04));
}


// snowflake class
function snowflake() {
  // initialize coordinates
  this.posX = 0;
  this.posY = -height/2 * 1.2;
  this.initialangle = random(0, 2 * PI);
  this.size = random(2, 5);

  // radius of snowflake spiral
  // chosen so the snowflakes are uniformly spread out in area
  this.radius = sqrt(random(pow(width / 2, 2)));

  this.update = function(time) {
    // x position follows a circle
    let w = map(intensity_slider.value,0,.1,0,1); // angular speed
    let angle = w * time + this.initialangle;
    this.posX = this.radius * sin(angle) *1.2;

    // different size snowflakes fall at slightly different y speeds
    // let mapped_speed = map(intensity_slider.value,0,.1,.1,1);
    this.posY += pow(this.size, .3);

    // delete snowflake if past end of screen
    if (this.posY > height/2) {
      let index = snowflakes.indexOf(this);
      snowflakes.splice(index, 1);
    }
  };

  this.display = function() {
    
    ellipse(this.posX, this.posY, this.size);
    
  };
}


function inverse_color(c) {
  let r, g, b;

  r = 255 - red(c); //get the mathmatical inverse
  g = 255 - green(c); //get the mathmatical inverse
  b = 255 - blue(c); //get the mathmatical inverse
  
  return color(r,g,b); //return a p5 color function containing our inverse color!
}
