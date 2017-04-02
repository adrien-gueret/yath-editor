(function(window, undefined) {
    if (!window.yath) {
        throw new ReferenceError('yath is not defined: did you include yath.js file?');
    }

    var texts = {
        welcome: {
            header: {
                fr: 'Bienvenue dresseur !',
                en: 'Welcome, trainer!'
            },
            description: {
                fr: 'Ceci sera un <b data-yath-go-to="tuto1">chouette</b> jeu.',
                en: 'This will be a <b data-yath-go-to="tuto1">very cool</b> game.'
            },
            continue: {
                fr: 'Continuer',
                en: 'Continue'
            }
        }
    };

    var callbacks = {
      test: function() {
          console.log(this);
      }
    };

    var myGame = new window.yath.Game(texts, callbacks);
    myGame.language = 'fr';
    myGame.goToScreen('welcome');

    window.myGame =  myGame;

})(window);