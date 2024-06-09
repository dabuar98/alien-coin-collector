/* Game Project

By Daniel Mauricio Bulla Arias
Student # 220305778 

Credits:
 - Font Grobold by Guy Buhry: https://www.dafont.com/es/grobold.font
 - Heart Image: https://www.pngegg.com/en/png-bzbdp
 - loseSound https://freesound.org/people/cabled_mess/sounds/371451/
 - winSound https://freesound.org/people/Fupicat/sounds/521643/7
 - bgMusic: 
 
    Deliberate Thought by Kevin MacLeod is licensed under a Creative Commons Attribution 4.0 license. https://creativecommons.org/licenses/by/4.0/
    Source: http://incompetech.com/music/royalty-free/?keywords=deliberate+thought
    Artist: http://incompetech.com/

 - The rest of the music was created via https://sfxr.me/

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var isLeft;
var isRight;
var isJumping;
var isFalling;
var isPlummeting;
var distance;
var trees_x;
var clouds;
var mountains;
var cameraPosX;
var collectables;
var canyons;
var game_score;
var flagpole;
var lives;
var img;
var fontGrobold;
var walkSound;
var bgMusic;
var loseSound;
var winSound;
var pickupSound;
var hurtSound;
var fallSound;
var platforms;
var enemies;

function setup()
{
    createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 3;
    startGame();
}

function preload()
{
    img = loadImage('images/heart.png');
    fontGrobold = loadFont('grobold.ttf');
    soundFormats('mp3','wav');
    walkSound = loadSound('music/walking.wav');
    walkSound.setVolume(0.5);
    bgMusic = loadSound('music/background.mp3');
    bgMusic.setVolume(0.5);
    loseSound = loadSound('music/lose.wav');
    winSound = loadSound('music/win.wav');
    pickupSound = loadSound('music/pickupCoin.wav');
    fallSound = loadSound('music/fall.wav');
    hurtSound = loadSound('music/hurt.wav');

}

function startGame()
{
    bgMusic.play();
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
    isJumping = false;
    isFound = false;
	gameChar_x = width/2;
	gameChar_y = floorPos_y - 30;
    canyons = 
    [
        {leftBorder_x: 150, 
         leftBorder_y: 432,
         width: 150,
         height: floorPos_y,
         waterDeep: 550,
         waterHeight: floorPos_y/3},
        
        {leftBorder_x: 600, 
         leftBorder_y: 432,
         width: 100,
         height: floorPos_y,
         waterDeep: 550,
         waterHeight: floorPos_y/3},
        
        {leftBorder_x: 950, 
         leftBorder_y: 432,
         width: 830,
         height: floorPos_y,
         waterDeep: 550,
         waterHeight: floorPos_y/3},
        
         {leftBorder_x: -620, 
         leftBorder_y: 432,
         width: 500,
         height: floorPos_y,
         waterDeep: 550,
         waterHeight: floorPos_y/3},
    ]
    
    trees_x = [50, 450, 790, 880, 2000, -930, -1050];
    
    clouds = 
    [
        {x_pos: 0, y_pos: 0, diameter: 0},
        {x_pos: 800, y_pos: 100, diameter: 0},
        {x_pos: 1000, y_pos: 50, diameter: 10}
    ]
    
    mountains = 
    [
        {x1: 0, y1: height, x2: 250, y2: 210, x3: 500, y3: height},
        {x1: 300, y1: height, x2: 550, y2: 100, x3: 800, y3: height},
        {x1: 300, y1: height, x2: 900, y2: 300, x3: 1500, y3: height}, 
    ]
    
    collectables = 
    [
        {x:50, y: floorPos_y - 30, isFound: false},
        {x:830, y: floorPos_y - 30, isFound: false},
        {x:1055, y: floorPos_y - 120, isFound: false},
        {x:1625, y: floorPos_y - 120, isFound: false},
        {x:-280, y: floorPos_y - 270, isFound: false},
        {x:-770, y: floorPos_y - 30, isFound: false}
    ]
    
    flagpole = {
        body_x: 2000, 
        body_y: floorPos_y - 35,
        cabin_x: 2000,
        cabin_y: floorPos_y - 50,
        isReached: false,
        lightON: false};
    
    cameraPosX = 0;
    game_score = 0;
    platforms = [];
    
    platforms.push(createPlatforms(950, floorPos_y - 80, 400));
    platforms.push(createPlatforms(-125, floorPos_y - 80, 125));
    platforms.push(createPlatforms(-250, floorPos_y - 160, 125));
    platforms.push(createPlatforms(-375, floorPos_y - 240, 125));
    platforms.push(createPlatforms(-500, floorPos_y - 160, 125));
    platforms.push(createPlatforms(-625, floorPos_y - 80, 125));
    platforms.push(createPlatforms(1400, floorPos_y - 160, 200));
    platforms.push(createPlatforms(1600, floorPos_y - 80, 100));
    
    enemies = [];
    enemies.push(new Enemy(-120, floorPos_y - 30, 200));
    enemies.push(new Enemy(-960, floorPos_y - 30, 250));
    enemies.push(new Enemy(950, floorPos_y - 110, 370));
}

function draw()
{
    // allows movement of the camera
    cameraPosX = gameChar_x - width/2

	///////////DRAWING CODE//////////
    
    console.log(gameChar_x);

    // fill sky
    background(204, 153, 255);
    
    // draw the sun
    noStroke();
    fill(255,255,0);
    ellipse(700, 200, 200, 200);

    // draw clouds
    drawClouds();
    
    // draw mountains
    drawMountains();
    
    // draw ground
    
    noStroke();
    fill(51,25,0);
    rect(0, floorPos_y, width, height - floorPos_y);
    
    // draw score & live text 
    textSize(20);
    fill(0);
    textFont(fontGrobold);
    text("SCORE " + game_score, 20, 30);
    text("LIVES ", 150, 30);
    
    // start a new drawing state
    push();
    translate(-cameraPosX, 0);
    
    // draw trees
    for (var t = 0; t < trees_x.length; t++)
    {
        // draw the trunk
        fill(102, 51, 0); 
        rect(trees_x[t], 300, 20, 132); 
        // draw crown 1
        fill(51, 102, 0);
        rect(trees_x[t] - 20, 100, 60, 200, 20);
        // draw crown 2
        rect(trees_x[t] - 5, 50, 30, 200, 20);
    }
    
    renderFlagpole();
    
	// draw canyon & water
    for (var i = 0; i < canyons.length; i++)
    {
        drawCanyon(canyons[i]);
    }

    // draw platforms
    for (var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
    
	// draw collectible tokens
    for (var i = 0; i < collectables.length; i++)
    {
        if (!collectables[i].isFound)
        {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }

  // game character
	if(isLeft && isFalling)
	{
		// jumping-left code
        
        // body
        noStroke();
        fill(66, 245, 96);
        rect(gameChar_x, gameChar_y, 30);
        // face
        ellipse(gameChar_x + 15, gameChar_y, 30);
        // eye
        fill(255);
        ellipse(gameChar_x + 15, gameChar_y, 15);
        // pupil
        fill(0);
        ellipse(gameChar_x + 10, gameChar_y-3, 5);
        // mouth
        fill(0);
        ellipse(gameChar_x + 15, gameChar_y+15, 10); 

	}
    else if(isJumping)
    {
        // body
        noStroke();
        fill(66, 245, 96);
        rect(gameChar_x, gameChar_y, 30);
        // face
        ellipse(gameChar_x + 15, gameChar_y, 30);
        // eye
        fill(255);
        ellipse(gameChar_x + 15, gameChar_y, 15);
        // pupil
        fill(0);
        ellipse(gameChar_x + 15, gameChar_y - 5, 5);
        // mouth
        fill(0);
        ellipse(gameChar_x + 15, gameChar_y + 15, 10);
    }
	else if(isRight && isFalling)
	{
		// jumping-right code
        
        // body
        noStroke();
        fill(66, 245, 96);
        rect(gameChar_x, gameChar_y, 30);
        // face
        ellipse(gameChar_x + 15, gameChar_y, 30);
        // eye
        fill(255);
        ellipse(gameChar_x + 15, gameChar_y, 15);
        // pupil
        fill(0);
        ellipse(gameChar_x + 18, gameChar_y-3, 5);
        // mouth
        fill(0);
        ellipse(gameChar_x + 15, gameChar_y + 15, 10); 
	}
	else if(isLeft)
	{
		// walking left code
        noStroke();
        fill(66, 245, 96);
        rect(gameChar_x, gameChar_y, 30);
        // face
        ellipse(gameChar_x + 15, gameChar_y, 30);
        // eye
        fill(255);
        ellipse(gameChar_x + 15, gameChar_y, 15);
        // pupil
        fill(0);
        ellipse(gameChar_x + 10, gameChar_y, 5);
        // mouth
        fill(0);
        arc(gameChar_x + 15, gameChar_y + 10, 20, 15, 0, PI, CHORD); 
        // tongue
        fill(255,0,0);
        arc(gameChar_x + 15, gameChar_y + 15, 10, 5, PI, 0, CHORD); 

	}
	else if(isRight)
	{
		// walking right code
        noStroke();
        fill(66, 245, 96);
        rect(gameChar_x, gameChar_y, 30);
        // face
        ellipse(gameChar_x + 15, gameChar_y, 30);
        // eye
        fill(255);
        ellipse(gameChar_x + 15, gameChar_y, 15);
        // pupil
        fill(0);
        ellipse(gameChar_x + 20, gameChar_y, 5);
        // mouth
        fill(0);
        arc(gameChar_x + 15, gameChar_y + 10, 20, 15, 0, PI, CHORD); 
        // tongue
        fill(255,0,0);
        arc(gameChar_x + 15, gameChar_y + 15, 10, 5, PI, 0, CHORD); 

	}
	else if(isFalling || isPlummeting)
	{
		// jumping facing forwards code
        
        // body
        noStroke();
        fill(66, 245, 96);
        rect(gameChar_x, gameChar_y, 30);
        // face
        ellipse(gameChar_x + 15, gameChar_y, 30);
        // eye
        fill(255);
        ellipse(gameChar_x + 15, gameChar_y, 15);
        // pupil
        fill(0);
        ellipse(gameChar_x + 15, gameChar_y + 5, 5);
        // mouth
        fill(0);
        ellipse(gameChar_x + 15, gameChar_y + 15, 10); 

	}
	else
	{
		// standing front facing code
        
        // body
        noStroke();
        fill(66, 245, 96);
        rect(gameChar_x, gameChar_y, 30);
        // face
        ellipse(gameChar_x + 15, gameChar_y, 30);
        // eye
        fill(255);
        ellipse(gameChar_x + 15, gameChar_y, 15);
        // pupil
        fill(0);
        ellipse(gameChar_x + 15, gameChar_y, 5);
        // mouth
        fill(0);
        arc(gameChar_x + 15, gameChar_y + 10, 20, 15, 0, PI, CHORD); 
        // tongue
        fill(255,0,0);
        arc(gameChar_x + 15, gameChar_y + 15, 10, 5, PI, 0, CHORD); 
	}
    
    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();
        enemies[i].checkContact(gameChar_x, gameChar_y);
    }
    
    pop();
    
    if(lives < 1)
    {
        fill(0);
        textFont(fontGrobold);
        textSize(40);
        text("GAME OVER. PRESS SPACE TO CONTINUE.", 70, height/2);
        return
    }

    if (flagpole.isReached)
    {
        fill(0);
        textFont(fontGrobold);
        textSize(40);
        text("LEVEL COMPLETE. PRESS SPACE TO CONTINUE.", 70, height/2);
        return
    }
	///////////INTERACTION CODE//////////

	// conditional statements to move the game character
    
    // walking left
    if (isLeft == true){
        gameChar_x -= 5;
    }
    // walking right
    if (isRight == true){
        gameChar_x += 5;
    }
    // falling
    if (gameChar_y < floorPos_y - 30)
    {
        let isContact = false;
        for(var i = 0; i < platforms.length; i++)
        {
            if (platforms[i].checkContact(gameChar_x, gameChar_y))
            {
                isContact = true;
                isFalling = false;
                break;
            }
        }
        if (!isContact)
        {
            gameChar_y += 2;
            isFalling = true;
        }
    }
    else
    {
        isFalling = false;
    }
    
    // falling interaction
    for (var i = 0; i < canyons.length; i++)
    {
        checkCanyon(canyons[i]);
    }
    
    checkFlagpole();
    checkPlayerDie();
}

function keyPressed()
{
    if (keyCode == 65) // letter 'A'
    {
        isLeft = true;
        walkSound.play();
    }
    else if (keyCode == 68) // letter 'D'
    {
        isRight = true;
        walkSound.play();
    }
    if (keyCode == 87 && !isFalling) // letter 'W'
    {
        gameChar_y -= 100;
        isJumping = true;
        walkSound.play();
    }
}

function keyReleased()
{  
    if (keyCode == 65) // letter 'A'
    {
        isLeft = false;
    }
    else if (keyCode == 68) // letter 'D'
    {
        isRight = false;
    }
    if (keyCode == 87) // letter 'W'
    {
        isJumping = false;
        isFalling = true;
    }
    if(keyCode == 32 && (flagpole.isReached || lives < 1))
    {
        lives = 3;
        startGame();
    }
}

function drawClouds()
{
    for (var i = 0; i < clouds.length; i++)
    {
        fill(255);
        triangle(clouds[i].x_pos + 200, clouds[i].y_pos + 100, //x1, y1
                 clouds[i].x_pos + 50, clouds[i].y_pos + 200, //x2, y2
                 clouds[i].x_pos + 400, clouds[i].y_pos + 200); //x3, y3
        ellipse(clouds[i].x_pos + 200, clouds[i].y_pos + 100, clouds[i].diameter + 100);
        ellipse(clouds[i].x_pos + 130, clouds[i].y_pos + 150, clouds[i].diameter + 90);
        ellipse(clouds[i].x_pos + 260, clouds[i].y_pos + 130, clouds[i].diameter + 90);
        ellipse(clouds[i].x_pos + 330, clouds[i].y_pos + 160, clouds[i].diameter + 80);
    }
}

function drawMountains()
{
    for (var i = 0; i < mountains.length ; i++)
    {
        fill(51,0,102);
        triangle(mountains[i].x1, mountains[i].y1, 
                 mountains[i].x2, mountains[i].y2, 
                 mountains[i].x3, mountains[i].y3);
    }
}

function drawCollectable(t_collectable)
{
    fill(204, 0, 102);
    circle(t_collectable.x, t_collectable.y, 50);
    fill(255,102,178);
    circle(t_collectable.x, t_collectable.y, 25);
}

function drawCanyon(t_canyon)
{
    fill(160, 82, 45);
    rect(t_canyon.leftBorder_x, t_canyon.leftBorder_y, t_canyon.width, t_canyon.height);
    fill(0, 153, 153)
    rect(t_canyon.leftBorder_x, t_canyon.waterDeep, t_canyon.width, t_canyon.waterHeight);
}

function checkCollectable(t_collectables)
{
    distance = dist(t_collectables.x, t_collectables.y, gameChar_x, gameChar_y);
    if (distance < 28)
    {
        t_collectables.isFound = true;
        pickupSound.play();
        game_score += 1;
    }
    
}

function checkCanyon(t_canyon)
{
    if (gameChar_x < (t_canyon.leftBorder_x + t_canyon.width) && gameChar_x > t_canyon.leftBorder_x && gameChar_y >= floorPos_y - 30)
    {
        gameChar_x = constrain(gameChar_x, t_canyon.leftBorder_x, t_canyon.leftBorder_x + t_canyon.width);
        gameChar_y += 30;
        isPlummeting = true;
    } 
}

function renderFlagpole()
{
    push()
    noStroke();
    fill(247, 237, 49);

    // wobble the spaceship
    var wobble = random(-1, 1);
    flagpole.cabin_y += wobble;
    flagpole.body_y += wobble;
    
    // cabin
    ellipse(flagpole.cabin_x, flagpole.cabin_y, 50, 50);
    
    // light
    if (flagpole.lightON)
    {
        fill(252, 250, 202);
        beginShape();
        vertex(flagpole.cabin_x - 25, flagpole.body_y);
        vertex(flagpole.cabin_x + 25, flagpole.body_y);
        vertex(flagpole.cabin_x + 50, floorPos_y);
        vertex(flagpole.cabin_x - 50, floorPos_y);
        endShape();
    }
    
    // body
    fill(111, 122, 114);
    ellipse(flagpole.body_x, flagpole.body_y, 250, 40); 
    
    if (flagpole.isReached)
    {
        flagpole.lightON = true;
        gameChar_y -= 5;
        gameChar_x = flagpole.body_x - 10;
        isJumping = true;
        flagpole.body_y -= 8;
        flagpole.cabin_y -= 8;
    }

    pop()
}

function checkFlagpole()
{
    var d = abs(gameChar_x - flagpole.body_x);
    if (d < 20)
    {
        if (game_score == 6)
        {
            flagpole.isReached = true;
            bgMusic.stop();
            winSound.play();  
        }
        else 
        {
            fill(0);
            textSize(25);
            text("Collect all the coins before getting into the spaceship!", 160, height/2);
            return;
        }
    }
}

function checkPlayerDie()
{
    for (var i = 0; i < lives ; i++)
    {
        image(img, 220 + i * 50, 10, 25, 25);
    }
    if (gameChar_y > height)
    {
        lives -= 1;
        if (lives > 0)
        {
            bgMusic.stop();
            startGame();
        }
        else
        {
            lives = 0;
            bgMusic.stop();
            loseSound.play();
        }
    }
}

function createPlatforms (x, y, length)
{
    let platform = {
        x: x,
        y: y,
        length: length,
        draw : function()
        {
            fill(51,25,0);
            rect(this.x, this. y, this.length, 20);
        },

        checkContact : function(gcX, gcY)
        {
            if (gcX > this.x && gcX < this.x + this.length)
            {
                var d  = this.y - (gcY + 30);
                if (d >= 0 && d < 5)
                {
                    return true;
                }
            }
            return false;
        }

    }

    return platform;
}

function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.currentX = x;
    this.incr = 1;
    
    this.update = function()
    {
        this.currentX += this.incr;
        if (this.currentX >= this.x + this.range)
        {
            this.incr = -1;
        }
        else if (this.currentX < this.x)
        {
            this.incr = 1;
        }  
    }
    
    this.draw = function()
    {
        this.update();
        noStroke();
        fill(255, 0, 0);
        rect(this.currentX, this.y, 30);
        // face
        ellipse(this.currentX + 15, this.y, 30);
        // eye
        fill(255);
        ellipse(this.currentX + 15, this.y, 15);
        // pupil
        fill(0);
        ellipse(this.currentX + 15, this.y, 5);
        // tongue
        fill(0,0,0);
        arc(this.currentX + 15, this.y + 15, 10, 5, PI, 0, CHORD); 

    }
    
    this.checkContact = function(gcX, gcY)
    {
        let d = dist(this.currentX, this.y, gcX, gcY);
        if (d < 25)
        {
            if(lives > 0)
            {
                lives -= 1;
                bgMusic.stop();
                hurtSound.play();
                startGame();
            }
            if (lives < 1)
            {
                loseSound.play();
                bgMusic.stop(); 
                hurtSound.play();
            }
        }
    }
}