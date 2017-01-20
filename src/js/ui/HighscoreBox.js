var InsurancePlz = InsurancePlz || {};

InsurancePlz.HighscoreBox = function(game, options) {
    Phaser.Group.call(this, game);
    this.game = game;
    this.x = game.world.centerX;
    this.y = game.world.centerY;

    var opt = options || {
        width: 500,
        height: 150
    };

    var graphics = game.add.graphics();
    // Draw the semi-transparent background
    graphics.inputEnabled = true;
    graphics.beginFill(0x000000, 0.5);
    graphics.drawRect(-InsurancePlz.game.width / 2, -InsurancePlz.game.height / 2,
        InsurancePlz.game.width,
        InsurancePlz.game.height
    );
    graphics.endFill();
    this.add(graphics);

    this.add(new InsurancePlz.BackgroundBox(game, -opt.width / 2, -opt.height / 2, {
        background: 0x262626,
        opacity: 1,
        outline: 0xBBFA28,
        outlineThickness: 1,
        outlineOpacity: 1,
        width: opt.width,
        height: opt.height,
        margin: 3
    }));

    this.nameBox = game.add.inputField(-100, -50, {
        font: '18px Arial',
        fill: '#212121',
        fontWeight: 'bold',
        width: 200,
        padding: 8,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 6,
        placeHolder: 'Name',
        type: PhaserInput.InputType.text
    });
    this.add(this.nameBox);

    var style = {
        font: "bold 22px Arial",
        fill: "#ffffff",
        align: "center"
    };

    var btn = game.add.button(-125, 40, 'button', this.submit, this);
    this.add(btn);
    btn.anchor.setTo(0.5);
    text = game.add.text(0, 3, "Submit Highscore", style);
    text.anchor.set(0.5);
    btn.addChild(text);

    btn = game.add.button(125, 40, 'button', game.loadMenu, game);
    this.add(btn);
    btn.anchor.setTo(0.5);
    text = game.add.text(0, 3, "Close", style);
    text.anchor.set(0.5);
    btn.addChild(text);
};

InsurancePlz.HighscoreBox.prototype = Object.create(Phaser.Group.prototype);
InsurancePlz.HighscoreBox.prototype.constructor = InsurancePlz.HighscoreBox;

/**
 * Submits the score to the leaderboard.
 */
InsurancePlz.HighscoreBox.prototype.submit = function() {
    $.post({
        url: "submit-highscore.php",
        data: {
            'name': this.nameBox.value,
            'score': InsurancePlz.GameState.gameProgress.score
        },
        dataType: "json"
    });
    InsurancePlz.GameState.loadMenu.call(this.game);
};