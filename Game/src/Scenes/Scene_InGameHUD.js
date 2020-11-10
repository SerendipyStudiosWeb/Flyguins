//Global variables
let powerUpTime;
let raceTimeCount = 30;

class Scene_InGameHUD extends Phaser.Scene {
    constructor() {
        super("InGameHUD");

        //Power up icons
        this.dashIcon = null;
        this.shieldIcon = null;
    }

    create() {

        //Times
        this.raceTime = this.add.text(game.config.width / 2, 0, '', {
            fontFamily: 'Gelato',
            fontStyle: 'Italic',
            fontSize: '128px',
            fill: '#000000'
        }).setOrigin(0.5, 0);

        powerUpTime = this.add.text(this.cameras.main.scrollX + 50, this.cameras.main.scrollY + 50, '', {
            fontFamily: 'Gelato',
            fontStyle: 'Italic',
            fontSize: '64px',
            fill: '#000000'
        });

        //Movement bar
        this.bar = this.add.sprite(game.config.width / 2, game.config.height - 70, 'bar');
        this.barMark = this.add.sprite(game.config.width / 2 - 238, game.config.height - 77.5, 'blueMark');
        this.ghostBarMark = this.add.sprite(-500, -500, 'blueMark');

        //Initialize bar
        player.movementBar.onMovementBarPressed.on('onMovementBarPressed', this.movementBarPressed, this);
        player.movementBar.setIsRunning(true);
        //this.StartCountdown();

        //PowerUp stuff
        this.powerUpBox = this.add.sprite(80, 80, 'powerUpEmpty').setScale(0.5);
        player.onPaintPowerUpIcon.on('onPaintPowerUpIcon', this.onPaintPowerUpIcon, this);

        //Race bar
        this.raceBar = this.add.sprite(60, 700, 'raceBar');
        this.playerMark = this.add.sprite(45, 1085, 'playerMark');

        //Race position
        this.racePosition = this.add.text(60, 230, '1st', {
            fontFamily: 'Gelato',
            fontStyle: 'Italic',
            fontSize: '48px',
            fill: '#000000'
        }).setOrigin(0.5, 0);

        //Exit button
        this.add.sprite(700, 70, 'exitButtonUI').setScale(0.6);
    }

    update() {
        if (player.controllable) {
            player.movementBar.update();
            //console.log("MARK Y: " + this.playerMark.y);
            this.playerMark.y = (this.raceBar.y + this.raceBar.height / 2) - Phaser.Math.Clamp( this.raceBar.height * (1 - ((player.y / level_01_Height))), 0, this.raceBar.height);
        }

        //Update sprite positions
        this.barMark.x =
            this.bar.x                                                                          //Center the sprite
            - (player.movementBar.barSpriteWidth - player.movementBar.markSpriteWidth) / 2 +    //Put it at the beginning
            Phaser.Math.Clamp(                                                                  //Update the position depending on the barValue
                (player.movementBar.barSpriteWidth - player.movementBar.markSpriteWidth) * (player.movementBar.movementBarValue / 100),
                0,
                player.movementBar.barSpriteWidth - player.movementBar.markSpriteWidth
            );
    }

    movementBarPressed(movementBarValue, tier) {
        let sprite;
        if (!player.canDash) {
            switch (tier) {
                case 0:
                    sprite = 'redMark';
                    break;
                case 1:
                    sprite = 'yellowMark';
                    break;
                case 2:
                    sprite = 'greenMark';
                    break;
            }
        } else {
            sprite = 'greenMark';
        }

        this.ghostBarMark.destroy();
        this.ghostBarMark = this.add.sprite(
            this.bar.x - (player.movementBar.barSpriteWidth - player.movementBar.markSpriteWidth) / 2 +
            (player.movementBar.barSpriteWidth - player.movementBar.markSpriteWidth) * (movementBarValue / 100),
            game.config.height - 77.5,
            sprite);

        this.barMark.destroy();
        this.barMark = this.add.sprite(game.config.width / 2 - 238, game.config.height - 77.5, 'blueMark');
    }

    onPaintPowerUpIcon(type, numDashes){
        if(type == "dash") {
            switch(numDashes){
                case 0:
                    this.dashIcon.destroy();
                    this.dashIcon = null;
                break;
                case 1:
                    this.dashIcon.setTexture('dashPowerUp1').setScale(0.5);
                break;
                case 2:
                    this.dashIcon.setTexture('dashPowerUp2').setScale(0.5);
                break;
                case 3:
                    this.dashIcon = this.add.sprite(80, 60, 'dashPowerUp3').setScale(0.5);
                break;
            }
        }else{
            if(this.shieldIcon == null) {
                this.shieldIcon = this.add.sprite(80, 65, 'shieldPowerUp').setScale(0.45);
            }else{
                this.shieldIcon.destroy();
                this.shieldIcon = null;
            }
        }
    }

    StartCountdown() {
        //While the player has not finished the race, count the time it is taking
        let thisRaceTime = this.raceTime; //Reference for the change of scope

        this.raceTimer = this.time.addEvent({ //Blink immunity effect
            delay: 1000,
            loop: true,
            callback: function () {
                raceTimeCount -= 1;
                thisRaceTime.setText(raceTimeCount);
            }
        });
    }

    UpdateRacePosition(spot){
        player.racePosition += spot;
        this.racePosition.setText(player.racePosition + "º");
    }

}