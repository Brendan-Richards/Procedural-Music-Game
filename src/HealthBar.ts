import MountainScene from './MountainScene';

export default class HealthBar {

    bar: Phaser.GameObjects.Graphics;
    x: number;
    y: number;
    value: number;
    scene: MountainScene;
    healthColor: number;
    barWidth: number;
    barHeight: number;
    healthWidth: number;
    borderWidth = 1;
    borderHeight: number;
    healthHeight: number;
    emptyColor: number;
    character: Phaser.Physics.Matter.Sprite;

    constructor (scene, character, healthColor){

        this.scene = scene;
        this.character = character;
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.barWidth = 32;
        this.barHeight = 8;
        this.borderWidth = 1;
        this.borderHeight = 1;
        this.value = 100;
        this.healthWidth = this.barWidth - this.borderWidth * 2;
        this.healthHeight = this.barHeight - this.borderHeight * 2;
        this.emptyColor = 0xffffff;
        this.healthColor = healthColor;

        this.setPosition();


        scene.add.existing(this.bar);
    }

    setPosition(){
        this.x = this.character.x - this.barWidth/2;
        this.y = this.character.y - 28;
        this.draw();
    }

    decrease (amount: number)
    {
        this.value -= amount;

        if (this.value < 0)
        {
            this.value = 0;
        }

        //this.draw();
    }

    draw ()
    {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, this.barWidth, this.barHeight);

        //  Health

        this.bar.fillStyle(this.emptyColor);
        this.bar.fillRect(this.x + this.borderWidth, this.y + this.borderHeight, this.healthWidth, this.healthHeight);

        this.bar.fillStyle(this.healthColor);
        this.bar.fillRect(this.x + this.borderWidth, this.y + this.borderHeight, Math.floor((this.value/100) * this.healthWidth), this.healthHeight);
    }

}