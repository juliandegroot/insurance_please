var InsurancePlz = InsurancePlz || {};

InsurancePlz.game = new Phaser.Game(896, 504, Phaser.AUTO);
//attackmap is 640x405
//attackpanel is 640x99
//newspanel is 256x504

InsurancePlz.game.state.add('Boot', InsurancePlz.BootState);
InsurancePlz.game.state.add('Preload', InsurancePlz.PreloadState);
InsurancePlz.game.state.add('Game', InsurancePlz.GameState);

InsurancePlz.game.state.start('Boot');
