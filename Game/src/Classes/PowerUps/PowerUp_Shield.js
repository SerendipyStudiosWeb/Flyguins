class PowerUp_gen_powerUp_shield_sprite extends Gen_PowerUp/*extends Phaser.GameObjects.Sprite*/ {
    //Constructor
    constructor(player, scene) {
        super(player);
        this.scene = scene;

        scene.add.existing(this);

        //Setup power up variables
        this.gen_powerUp_shield_spriteTime = 5; //Time to control the power up's duration
        this.isActive = false; //Variable used to control whether the timer should or not destroy the sprite.
    }

    Pick() {
        //Assign it to the player
        this.player.powerUpObject_Boxed = this;

        //Display it in the box
        //console.log("Power up: gen_powerUp_shield_sprite.");
        this.player.onPaintPowerUpIcon.emit('onPaintPowerUpIcon', "shield", true, null);//Show the icon in the powerU  up box
    }

    Use() {
        this.isActive = true;
        this.player.scene.scene.get("MusicManager").sfx_play_powerUp_shield();

        //If you already have a gen_powerUp_shield_sprite, then destroy it and create a new one
        if (this.player.isgen_powerUp_shield_spriteed) {
            this.player.powerUpObject_Used.Destroy();
        }

        //Remove it from the box
        this.player.powerUpObject_Boxed = null;
        this.player.onPaintPowerUpIcon.emit('onPaintPowerUpIcon', "shield", false, null);

        //Assign it to the player
        this.player.powerUpObject_Used = this;

        //Create the gen_powerUp_shield_sprite
        this.player.isgen_powerUp_shield_spriteed = true;
        this.sprite = this.scene.add.sprite(this.player.x, this.player.y, 'gen_powerUp_shield_sprite').setScale(0.1);

        //Set the sield's sprite sort
        this.sprite.depth = 3;

        //Set the timer
        let thisObj = this;
        let thisgen_powerUp_shield_spriteTime = this.gen_powerUp_shield_spriteTime;

        this.scene.time.addEvent({
            delay: 1000,
            repeat: 5,
            loop: false,
            callback: function () {
                if (thisgen_powerUp_shield_spriteTime > 1)
                {
                } else {
                    if (thisObj.isActive)
                        thisObj.Destroy();
                }
            }
        });

    }

    Render() {
        this.sprite.x = this.player.x
        this.sprite.y = this.player.y;
    }

    Destroy() {
        this.isActive = false;

        this.player.isgen_powerUp_shield_spriteed = false;
        this.sprite.destroy();

        this.player.powerUpObject_Used = null;
        delete this;
    }
}