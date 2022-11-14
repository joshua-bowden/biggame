// implementation of The Big Game
// runs code once all images have been loaded, ensures that game doesnt start without graphics being available
window.addEventListener("load", function () {

    // initializes the canvas
    const canvas = document.getElementById("canvas1");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // gets the context of the canvas, ctx then used to draw everything
    let ctx = canvas.getContext("2d");
    // stores what stage the game is on
    let stage = 0;
    // stores the team that is chosen, starts as empty team ""
    let team = "";

    // class creating an object for mouseevents
    class InputHandler {
        constructor() {
            this.keys = [];
            window.addEventListener('touchstart', e => {
                
                if(stage === 2){
                    this.keys.push(true);
                    console.log(e.touches[0].clientX, this.keys);
                }
                if (stage === 1) {
                    if (e.touches[0].clientX < canvas.width / 2) {
                        team = "stanford";
                    }
                    if (e.touches[0].clientX > canvas.width / 2) {
                        team = "cal";
                    }
                    stage++;
                }
                if (stage === 0) {
                    stage++;
                }
                
            });

        }
    }
    // class creating object for the ball
    class Ball {
        constructor(gameWidth, gameHeight, ghost) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 45;
            this.height = 75;
            this.dx = 5;
            this.fall = false;
            this.x = gameWidth / 2 - this.width / 2;
            this.y = gameHeight * 6 / 7;
            if (ghost === false){
                this.image = document.getElementById("footballImage");
            }
            else{
                this.image = document.getElementById("ghostballImage");
            }
        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }

        moveLR() {
            if (this.x >= this.gameWidth - this.width) {
                this.dx = -this.dx;
            }
            if (this.x <= 0) {
                this.dx = -this.dx;
            }
            this.x += this.dx;
        }

        kick() {

            if (this.y <= this.gameHeight * 1 / 3) {
                this.fall = true;
            }

            if (!this.fall) {
                this.y -= 5;
            }

            if (this.fall) {
                this.y += 3;
                if (this.y >= this.gameHeight / 2) {
                    this.width = 0;
                    this.height = 0;
                }
            }

            this.width = ball.width * 0.99;
            this.height = ball.height * 0.99;
            return this.fall;
        }


        getX() {
            return this.x;
        }
    }
    // class creating object for the goal
    class Fieldgoal {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 108;
            this.height = 200;
            this.x = gameWidth / 2 - this.width / 2;
            this.y = gameHeight * 2 / 5;
            this.image = document.getElementById("fieldgoalImage");
        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }

        getX() {
            return this.x;
        }

        getWidth() {
            return this.width;
        }
    }
    // class creating object for the field
    class Field {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = gameWidth;
            this.height = gameHeight / 2;
            this.x = 0;
            this.y = gameHeight / 2;
            this.image = document.getElementById("fieldImage");
        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
    // class creating object for the cal logo
    class CalLogo {
        constructor(gameWidth, gameHeight, x, y) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = gameWidth / 3;
            this.height = gameHeight / 3.5;
            this.x = x - this.width / 2;
            this.y = y - this.height / 2;
            this.image = document.getElementById("calImage");
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
    // class creating object for the stanford logo
    class StanfordLogo {
        constructor(gameWidth, gameHeight, x, y) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = gameWidth / 4;
            this.height = gameHeight / 4;
            this.x = x - this.width / 2;
            this.y = y - this.height / 2;
            this.image = document.getElementById("stanfordImage");
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
    // class creating object for a single fan
    class Fan {
        constructor(gameWidth, gameHeight, x, y) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = gameWidth / 15;
            this.height = gameHeight / 15;
            this.x = x - this.width / 2;
            this.y = y - this.height / 2;
            this.initialY = this.y;
            this.falling = false;
        }
        draw(context, color){
            context.fillStyle = color;
            context.fillRect(this.x, this.y, this.width, this.height);
        }

        jump(){
            this.y -= 1;
        }
        fall(){
            this.y += 1;
        }

        getY(){
            return this.y;
        }
        getOffset(){
            return this.initialY - this.y;
        }
    }
    // class creating object for the welcome sign
    class WelcomeSign {
        constructor(gameWidth, gameHeight, x, y) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = gameWidth / 2;
            this.height = gameHeight / 4;
            this.x = x;
            this.y = y;
            this.direction = 1;
        }
        draw(context){
            context.textAlign = "center";
            context.font = "30px Arial";
            context.fillStyle = "white";
            context.fillText("Welcome to the BIG GAME!", this.x, this.y);
            context.fillText("Touch the screen to begin!", this.x, this.y + 50);
        }

        move(){
            this.y += 3 * this.direction;
        }

        getY(){
            return this.y;
        }
    }
    // class creating object for the axe sign
    class Axe {
        constructor(gameWidth, gameHeight, x, y) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = gameWidth / 2;
            this.height = gameHeight / 3;
            this.x = x - this.width / 2;
            this.y = y - this.height / 2;
            this.image = document.getElementById("axeImage");
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
    // class creating object for the referee
    class Referee {
        
    }

    const input = new InputHandler();
    // object representing the football
    const ball = new Ball(canvas.width, canvas.height, false);
    // object representing the fieldgoal
    const fieldgoal = new Fieldgoal(canvas.width, canvas.height);
    //object representing the field
    const field = new Field(canvas.width, canvas.height);
    //array containing all the fans
    const fans = [];
    //for loop that draws 5 rows of 10 fans in the top half of the screen and adds them to the fans array
    for(let i = 0; i < 5; i++){
        for(let j = 0; j < 10; j++){
            fans.push(new Fan(canvas.width, canvas.height, canvas.width * (j + 1) / 11, canvas.height * (i + 1) / 11));
        }
    }
    // object representing the welcome sign in stage 1
    const welcomeSign = new WelcomeSign(canvas.width, canvas.height, canvas.width / 2, canvas.height / 2);
    const ghostballs = [];
    // for loop holding the 5 ghost balls
    for(let i = 0; i < 5; i++){
        ghostballs.push(new Ball(canvas.width, canvas.height, true));
    }

    // function that draws the field, fieldgoal, and ball (just cause this code is repeated multiple times)
    function drawBasicFBallSetup(){
        field.draw(ctx);
        fieldgoal.draw(ctx);
        ball.draw(ctx);
    }

    function animate() {

        // first stage of game
        if (stage === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // draws the start graphic (axe picture)
            const axe = new Axe(canvas.width, canvas.height, canvas.width / 2, canvas.height / 2);
            axe.draw(ctx);
            // draws the welcome sign and moves it up and down
            welcomeSign.draw(ctx);
            if (welcomeSign.getY() >= canvas.height * 3 / 4){
                welcomeSign.direction = -1;
            }
            if (welcomeSign.getY() <= canvas.height / 4){
                welcomeSign.direction = 1;
            }
            welcomeSign.move();
        }

        // second stage of game, choose team
        if(stage === 1){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // draws the two sides
            ctx.fillStyle = "red";
            ctx.fillRect(0, 0, canvas.width / 2, canvas.height);
            ctx.fillStyle = "navy";
            ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);
            // creates the two logo objects
            const stanfordLogo = new StanfordLogo(canvas.width, canvas.height, canvas.width / 4, canvas.height / 2);
            const calLogo = new CalLogo(canvas.width, canvas.height, canvas.width * 3 / 4, canvas.height / 2);
            stanfordLogo.draw(ctx);
            calLogo.draw(ctx);
            ctx.fillStyle = "white";
            ctx.fillText("Choose your team:", canvas.width / 2, canvas.height / 4);            
        }

        // third stage of game, actual gameplay
        if (stage === 2) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //draws background white "stands"
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
            // draws the fans on top of the white background, makes them color of team chosen
            for(let i = 0; i < fans.length; i++){
                if (team === "stanford") {
                    fans[i].draw(ctx, "red");
                }
                if (team === "cal") {
                    fans[i].draw(ctx, "navy");
                }
            }
            // draws the field, fieldgoal, and ball and animates ball (if kick hasnt happened yet)
            if (input.keys.indexOf(true) === -1) {
                drawBasicFBallSetup();
                ball.moveLR();
                
            }
            // if kick occurs, draws the field, fieldgoal, and ball and animates ball kick
            if (input.keys.indexOf(true) !== -1) {
                drawBasicFBallSetup();
                //ball.kick returns a boolean true when kick happens
                if (ball.kick()) {
                    // if kick is good, prints message on screen that player has scored for their chosen team
                    if (ball.getX() > fieldgoal.getX() + fieldgoal.getWidth() * 0.1 && ball.getX() < fieldgoal.getX() + fieldgoal.getWidth() - fieldgoal.getWidth() * 0.1) {
                        ctx.font = "30px Trebuchet MS";
                        if(team === "stanford"){
                            ctx.fillStyle = "red";
                        }
                        if(team === "cal"){
                            ctx.fillStyle = "navy";
                        }
                        ctx.textAlign = "center";
                        ctx.fillText("You scored for " + team.toUpperCase(), canvas.width / 2, canvas.height * 4 / 5);
                        // makes fans jump up and down
                        for(let i = 0; i < fans.length; i++){
                            if(fans[i].getOffset() === 0){
                                fans[i].falling = false;
                            }
                             if(fans[i].getOffset() <= 10 && fans[i].falling === false){
                                fans[i].jump();
                                if(fans[i].getOffset() >= 10){
                                    fans[i].falling = true;
                                }
                             }
                             if(fans[i].falling){
                                fans[i].falling = true;
                                fans[i].fall();
                             }
                        }
                    }
                    // prints missed message to screen if kick is not good
                    else {
                        ctx.font = "30px Arial";
                        ctx.fillStyle = "black";
                        ctx.textAlign = "center";
                        ctx.fillText("Missed:(", canvas.width/2, canvas.height * 4 / 5);
                    }
                }
            }
        }

        
        // animates this function (animate), so that it runs repeatedly
        requestAnimationFrame(animate);

    }


    //calls animate, which runs the entire game
    animate();



});














