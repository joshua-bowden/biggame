
// implementation of The Big Game
// runs code once all images have been loaded, ensures that game doesnt start without graphics being available
window.addEventListener("load", function () {


    //750 plays from analytics * 3
    const scoreDefault = 2250

    const time = Date.now()
    //quarter minutes since "start of day"
    const timeAccumulated = Math.trunc((Number(time) - Number(1668806036847))/15000)
    const scoreAccumulatedByTime = timeAccumulated * 4.25;
    //if has visited, set score to base + NEW time adjusted additive + user scores. increment visit
    if(localStorage.stanfordScore){
        localStorage.stanfordScore = scoreDefault + scoreAccumulatedByTime + Number(localStorage.userS);
        //random gap only 10 when refreshing so doenst look suspicious
        //also "its getting closer!!"
        const sameGap = 10

        localStorage.berkeleyScore = Number(localStorage.stanfordScore) + (Math.floor(Math.random() * (sameGap + sameGap) ) - sameGap) + Number(localStorage.userB);    
        //quarter minutes in integer since "start of day" or whenever we want (for math).
        //*so every 15sec score will update "serverside"
        localStorage.quarterMinutesSince = timeAccumulated;
        localStorage.currentTime = time;
        //can make it so after 50 visits, 150 pts is more than the 100 random gap below
        // >> so we just take away their points
        //visit not updating for some reason
        localStorage.visit = Number(localStorage.visit) + 1;
        localStorage.scoreDiff = (Number(localStorage.stanfordScore) - Number(localStorage.berkeleyScore))
    }
    //if hasn't visited site yet, set score to base + time adjusted additive
    else{
        localStorage.stanfordScore = scoreDefault + scoreAccumulatedByTime;
        //makes berkeley score within stanford by gap; random -gap to +gap
        const gap = 20
        localStorage.berkeleyScore = Number(localStorage.stanfordScore) + Math.floor(Math.random() * (gap + gap) ) - gap;       
        localStorage.quarterMinutesSince = timeAccumulated;
        localStorage.currentTime = time;
        localStorage.visit = 1
        localStorage.scoreDiff = (Number(localStorage.stanfordScore) - Number(localStorage.berkeleyScore))
        localStorage.userS = 0;
        localStorage.userB = 0;
    }
    
    // do this inside screen 1. then add to 3 to local cookie after make.
    // this cookie sticks with their device

    let chosenFillStyle = "";
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
    let win = false;
    let hasReset = true;

    const buttonWidth = 100;
    const buttonHeight = 100;

    // class creating an object for mouseevents
    class InputHandler {
        constructor() {
            this.keys = [];
            window.addEventListener('touchstart', e => {

                if (stage === 2) {
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
                if (stage === 2 && e.touches[0].clientX > canvas.width / 2 - buttonWidth / 2 && e.touches[0].clientX < canvas.width / 2 + buttonWidth / 2 && e.touches[0].clientY > canvas.height * 4 / 5 && e.touches[0].clientY < canvas.height * 4 / 5 + buttonHeight && ball.isKicked()) {
                    reset();
                }
                if (stage === 2 && win === true){
                    stage++;
                }
                /*if (stage === 3 && e.touches[0].clientX > canvas.width / 2 - buttonWidth / 2 && e.touches[0].clientX < canvas.width / 2 + buttonWidth / 2 && e.touches[0].clientY > canvas.height * 4 / 5 && e.touches[0].clientY < canvas.height * 4 / 5 + buttonHeight) {
                    stage = 2;
                    reset();
                }
                */

            });

        }
        resetKeys() {
            this.keys = [];
        }
    }
    // class creating object for the ball
    class Ball {
        constructor(gameWidth, gameHeight, ghost) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 45;
            this.height = 75;
            this.dx = 10;
            this.fall = false;
            this.x = gameWidth / 2 - this.width / 2;
            this.y = gameHeight * 6 / 7;
            this.kicked = false;
            if (ghost === false) {
                this.image = document.getElementById("footballImage");
            }
            else {
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
                this.y -= 15;
            }

            if (this.fall) {
                this.y += 6;
                if (this.y >= this.gameHeight / 2) {
                    this.width = 0;
                    this.height = 0;
                }
            }

            this.width = ball.width * 0.99;
            this.height = ball.height * 0.99;
            this.kicked = this.fall;
            return this.kicked;
        }


        getX() {
            return this.x;
        }

        isKicked() {
            return this.kicked;
        }

        reset() {
            this.x = this.gameWidth / 2 - this.width / 2;
            this.y = this.gameHeight * 6 / 7;
            this.fall = false;
            this.width = 45;
            this.height = 75;
            this.kicked = false;
            hasReset = true;
        }
    }
    // class creating object for the goal
    class Fieldgoal {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 2*108;
            this.height = 1.5*200;
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
            this.height = gameWidth / 3;
            this.x = x - this.width / 2;
            this.y = y - this.height / 2;
            this.image = document.getElementById("calImage");
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
    // class creating object for the stanford logo
    class StanfordLogo {
        constructor(gameWidth, gameHeight, x, y) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = gameWidth / 3;
            this.height = gameWidth / 3;
            this.x = x - this.width / 2;
            this.y = y - this.height / 2;
            this.image = document.getElementById("stanfordImage");
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    class QR {
        constructor(gameWidth, gameHeight, x, y) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = gameWidth / 2;
            this.height = gameWidth / 2;
            this.x = x - this.width / 2;
            this.y = y - this.height / 2;
            this.image = document.getElementById("qrCode");
        }
        draw(context) {
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

            if (color == "red"){
                this.image = document.getElementById("tree");
            }
            else{
                this.image = document.getElementById("bear");
            }
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }

        jump() {
            this.y -= 1;
        }
        fall() {
            this.y += 1;
        }

        getY() {
            return this.y;
        }
        getOffset() {
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
        draw(context) {
            context.textAlign = "center";
            context.font = "60px Arial";
            context.fillStyle = "white";
            context.fillText("Welcome to the BIG GAME!", this.x, this.y);
            context.fillText("Touch the screen to begin!", this.x, this.y + 50);
        }

        move() {
            this.y += 3 * this.direction;
        }

        getY() {
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
        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    class LoadLeft {
        constructor(gameWidth, gameHeight, x, y) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = gameWidth;
            this.height = gameHeight;
            this.x = x - this.width/2;
            this.y = y - this.height/2;
            this.image = document.getElementById("loadLeft");

        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
         }
    }

    class LoadRight {
        constructor(gameWidth, gameHeight, x, y) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = gameWidth;
            this.height = gameHeight;
            this.x = x - this.width/2;
            this.y = y - this.height/2;
            this.image = document.getElementById("loadRight");

        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
         }
    }

    class Button {
        constructor(gameWidth, gameHeight, x, y, width, height) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = width;
            this.height = height;
            this.x = x - this.width / 2;
            this.y = y;
            if(stage == 2){
                //retry when on field goal page
                this.image = document.getElementById("retryButton");    
            }
            else{
                //funny gradescope submit when on username page
                this.image = document.getElementById("submit");

            }
        }
        draw(context) {
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
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if(!(i == 4 && j == 2)){
                fans.push(new Fan(canvas.width*2, canvas.height*2, canvas.width * (j + 1) / 6, canvas.height * (i + 1) / 11));

            }
        }
    }
    // object representing the welcome sign in stage 1
    const welcomeSign = new WelcomeSign(canvas.width, canvas.height, canvas.width / 2, canvas.height / 2);

    // function that draws the field, fieldgoal, and ball (just cause this code is repeated multiple times)
    function drawBasicFBallSetup() {
        field.draw(ctx);
        fieldgoal.draw(ctx);
        ball.draw(ctx);
    }

    function animate() {
        let id = requestAnimationFrame(animate);
        // first stage of game
        if (stage === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // draws the start graphic (axe picture)
            const leftlogo = new LoadLeft(canvas.width, canvas.height, canvas.width / 2, canvas.height / 2);
            leftlogo.draw(ctx);
            const rightlogo = new LoadRight(canvas.width, canvas.height, canvas.width / 2, canvas.height / 2);
            rightlogo.draw(ctx);
            // draws the welcome sign and moves it up and down
            welcomeSign.draw(ctx);
            if (welcomeSign.getY() >= canvas.height * 3 / 4) {
                welcomeSign.direction = -1;
            }
            if (welcomeSign.getY() <= canvas.height / 4) {
                welcomeSign.direction = 1;
            }
            welcomeSign.move();
        }

        // second stage of game, choose team
        if (stage === 1) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            // draws the two sides
            //start from canvas.height "bottom of page" and draw in negative direction "up"
            if(localStorage.scoreDiff > 0){
                ctx.fillStyle = "red";
                ctx.fillRect(0, canvas.height, canvas.width / 2, canvas.height * -1 * 1/2 - (localStorage.scoreDiff * 5));
                ctx.fillStyle = "navy";
                ctx.fillRect(canvas.width / 2, canvas.height, canvas.width / 2, canvas.height * -1 * 1/2);

            }
            else{
                ctx.fillStyle = "red";
                ctx.fillRect(0, canvas.height, canvas.width / 2, canvas.height * -1 * 1/2);
                ctx.fillStyle = "navy";
                ctx.fillRect(canvas.width / 2, canvas.height, canvas.width / 2, canvas.height * -1 * 1/2  + (localStorage.scoreDiff * 5));
                
            }

            // creates the two logo objects
            const stanfordLogo = new StanfordLogo(canvas.width, canvas.height, canvas.width / 4, canvas.height / 2);
            const calLogo = new CalLogo(canvas.width, canvas.height, canvas.width * 3 / 4, canvas.height / 2);
            stanfordLogo.draw(ctx);
            calLogo.draw(ctx);

            ctx.font = "60px Trebuchet MS";

            ctx.fillStyle = "black";
            ctx.fillText("Choose your team:", canvas.width / 2, 50);
            //draw scores at bar level minus height * .2
            ctx.fillText(Math.trunc(localStorage.stanfordScore) + " pts", canvas.width * 1/ 4, canvas.height / 7);
            ctx.fillText(Math.trunc(localStorage.berkeleyScore) + " pts", canvas.width * 3 / 4, canvas.height / 7);
            
            ctx.font = "60px Trebuchet MS";


            ctx.fillStyle = "white";

        }

        // third stage of game, actual gameplay
        if (stage === 2) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //draws background white "stands"
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
            // draws the fans on top of the white background, makes them color of team chosen
            for (let i = 0; i < fans.length; i++) {
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
                        ctx.font = "60px Trebuchet MS";
                        //win = true;

                        const qr = new QR(canvas.width/2, canvas.height/2, canvas.width / 5, canvas.height * 3/ 5);
                        qr.draw(ctx);

                        if (team === "stanford" && hasReset) {
                            chosenFillStyle = "red";
                            localStorage.stanfordScore = Number(localStorage.stanfordScore) + 3;
                            localStorage.userS = Number(localStorage.userS) + 3;
                            localStorage.scoreDiff = Number(localStorage.scoreDiff) + 3;
                            hasReset = false;
                        }
                        if (team === "cal" && hasReset) {
                            chosenFillStyle = "navy";
                            localStorage.berkeleyScore = Number(localStorage.berkeleyScore) + 3;
                            localStorage.userB = Number(localStorage.userB) + 3;
                            localStorage.scoreDiff = Number(localStorage.scoreDiff) - 3;
                            hasReset = false;
                        }
                        ctx.font = "60px Trebuchet MS";
                        ctx.textAlign = "center";
                        ctx.fillStyle = "white";
                        ctx.fillText("You've scored:", canvas.width * 4 / 5, canvas.height * 3 / 5);
                        ctx.fillStyle = "red";
                        ctx.fillText(localStorage.userS + " for Stanford", canvas.width * 4 / 5, canvas.height * 3.2 / 5);
                        ctx.fillStyle = "navy";
                        ctx.fillText(localStorage.userB + " for Berkeley", canvas.width * 4 / 5, canvas.height * 3.4 / 5);
                        
                        ctx.fillStyle = chosenFillStyle;
                        ctx.font = "60px Trebuchet MS";
                        ctx.textAlign = "center";
                        ctx.fillText("You scored +3 for " + team.toUpperCase(), canvas.width / 2, canvas.height * 4 / 5);
                        ctx.fillText("See if your friends can make it ;) ", canvas.width / 2, canvas.height * 9 / 10);

                        const retryButton = new Button(canvas.width, canvas.height, canvas.width / 2, canvas.height * 4 / 5, buttonWidth, buttonHeight);
                        retryButton.draw(ctx);

                        // makes fans jump up and down
                        for (let i = 0; i < fans.length; i++) {
                            if (fans[i].getOffset() === 0) {
                                fans[i].falling = false;
                            }
                            if (fans[i].getOffset() <= 10 && fans[i].falling === false) {
                                fans[i].jump();
                                if (fans[i].getOffset() >= 10) {
                                    fans[i].falling = true;
                                }
                            }
                            if (fans[i].falling) {
                                fans[i].falling = true;
                                fans[i].fall();
                            }
                        }
                    }
                    // prints missed message to screen if kick is not good
                    else if (ball.isKicked())  {
                        ctx.font = "60px Arial";
                        ctx.fillStyle = "black";
                        ctx.textAlign = "center";
                        ctx.fillText("Missed:(", canvas.width / 2, canvas.height * 3/4);
                        const retryButton = new Button(canvas.width, canvas.height, canvas.width / 2, canvas.height * 4 / 5, buttonWidth, buttonHeight);
                        retryButton.draw(ctx);
                    }
                }
            }
        }

        // fourth stage of game, game over
        if (stage === 3) {
            cancelAnimationFrame(id);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (team === "stanford") {
                ctx.fillStyle = "red";
            }
            if (team === "cal") {
                ctx.fillStyle = "navy";
            }
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.fillText("YOU SCORED FOR " + team.toUpperCase() + "!", canvas.width / 2, canvas.height / 8);
            
            let div = document.getElementById("inputContainer");
            let input = document.createElement("input");
            input.style.height = "50px";
            input.style.width = "200px";
            input.type = "text";
            input.placeholder = "Enter a username";
            div.appendChild(input);

            ctx.fillText("Screenshot and Share!", canvas.width / 2, canvas.height * 1.2 / 4);

            const qr = new QR(canvas.width/2, canvas.height/2, canvas.width / 2, canvas.height * 2.5 / 4);
            qr.draw(ctx);
            //make submit button which SHOULD capture text and reset game. 
            //HIGH PRIO is reset game, can you fix? meddled with line 48; currently doesnt work
            const submitButton = new Button(canvas.width, canvas.height, canvas.width * 1.2/ 2, canvas.height /7, buttonWidth, buttonHeight/2);
            submitButton.draw(ctx);
            

        }        

    }

    function reset() {
        //set to 2 so we can reset from end screen as well
        stage = 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ball.reset();
        input.resetKeys();
    }


    //calls animate, which runs the entire game
    animate();



});


