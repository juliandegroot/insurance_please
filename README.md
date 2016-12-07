# Insurance Please
The internet is becoming ever more prevalent in people's lives. However, it is not just cyber activity which is growing, but also cyber crime. In spite of this growing danger, many people are not aware of the actual dangers they are facing nor how to avoid or prevent it. For this reason we have chosen to design a game to help address this issue and raise awareness to the dangers of an online world and the cybercrime that occurs in there.  
The target audience for this game is insurance workers. However, it can also be used to teach the dangers of cybercrime to company/office workers in general.

Some useful sites:  
https://phaser.io/docs  
https://phaser.io/learn  
https://www.udemy.com/phaser-tutorial/  
And many more..

# Running Grunt
In order to run Grunt, the Node.js service for packaging all javascript files into a minified version (which `index-batch.html` and `index-min.html` require to function) it is required to install [Node.js](https://nodejs.org/en/download/). It is recommended to use version 6.9.1 or higher.  
Once Node.js is installed it is required to run `npm-setup.bat` (located in the `folder`) which ensures the Node Package Manager and Grunt is installed/up to date.  
After installing Node.js you can run `grunt-once.bat` to minify the JavaScript once, or `grunt-watch.bat` to automatically minify whenever files are updated. Both these files are also located in the `src` folder.

Note that minification requires a few seconds to complete. When developing, it is recommended to use `index-batch.html` instead of `intex-min.html`.