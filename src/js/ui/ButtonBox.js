var InsurancePlz = InsurancePlz || {};

InsurancePlz.ButtonBox = function(game, state, x, y, options) {
  Phaser.Group.call(this, game);
  this.x = x;
  this.y = y;

  var opt = options || {
    width: 320,
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

  var style = { font: "bold 24px Arial", fill: "#ffffff", align: "center" };

  var btn = game.add.button(200,10,'button_small', function() {console.log("help")})
  this.add(btn)
  var text = game.add.text(0, 0, "Help", style);
  text.anchor.set(0.5);
  text.x = Math.floor(btn.x + btn.width / 2);
  text.y = Math.floor(btn.y + btn.height / 2);
  this.add(text)

  btn = game.add.button(200, 60, 'button_small', function() {console.log("exit")})
  this.add(btn);
  text = game.add.text(0, 0, "Exit", style);
  text.anchor.set(0.5);
  text.x = Math.floor(btn.x + btn.width / 2);
  text.y = Math.floor(btn.y + btn.height / 2);
  this.add(text)

  btn = game.add.button(20, 10, 'button_large', function() {console.log("attack") })
  this.add(btn);
  text = game.add.text(0, 0, "Execute\nAttacks", style);
  text.anchor.set(0.5);
  text.x = Math.floor(btn.x + btn.width / 2);
  text.y = Math.floor(btn.y + btn.height / 2);
  this.add(text)
};

InsurancePlz.ButtonBox.prototype = Object.create(Phaser.Group.prototype);
InsurancePlz.ButtonBox.prototype.constructor = InsurancePlz.ButtonBox;
