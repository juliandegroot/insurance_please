var InsurancePlz = InsurancePlz || {};

InsurancePlz.AttackBox = function(game, x, y, options) {
    Phaser.Group.call(this, game);
    this.x = x;
    this.y = y;

    var opt = options || {
        width: 640,
        height: 120
    };

    this.add(new InsurancePlz.BackgroundBox(game, 0, 0, {
        background: 0x262626,
        opacity: 1,
        outline: 0xBBFA28,
        outlineThickness: 1,
        outlineOpacity: 1,
        width: opt.width,
        height: opt.height,
        margin: 3
    }));

    //create attack instances
    this.attacks = game.add.group();
    var attackData = JSON.parse(game.cache.getText('attacks')).attacks;
    for (var i = 0; i < attackData.length; i++) {
        var attack = new InsurancePlz.Attack(InsurancePlz.GameState, attackData[i]);

        var style = {
            font: "35px Arial",
            fill: "#ff0000"
        };

        var label_score = game.add.text(10, -45, "AP cost " + attackData[i].points, style); // adding attackweights/points as labels above the sprite
        label_score.stroke = '#000000'; // give it a black outline (stroke)
        label_score.strokeThickness = 6;
        attack.addChild(label_score); // add it as child to the original instance
        game.world.bringToTop(label_score); // put it on top of the actual sprite
        this.attacks.add(attack);
        if (InsurancePlz.isTutorial) { // were in tutorial mode now
            for (var i = 1; i < this.attacks.children.length; i++) {
                this.attacks.children[i].inputEnabled = false;
                this.attacks.children[i].visible = false;
            }
        }
    }
};

InsurancePlz.AttackBox.prototype = Object.create(Phaser.Group.prototype);
InsurancePlz.AttackBox.prototype.constructor = InsurancePlz.AttackBox;

InsurancePlz.AttackBox.prototype.resetAlpha = function() {
    this.attacks.setAll('alpha', 1);
}
