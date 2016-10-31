function generateWinningNumber() {
    return Math.ceil(Math.random()*100);
}

function shuffle(ary) {
    var length = ary.length, i, temp;
    while (length) {
        i = Math.floor(Math.random()*length--);
        temp = ary[length];
        ary[length] = ary[i];
        ary[i] = temp;
    }
    return ary;
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function () {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function () {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(num) {
    if (num < 1 || num > 100 || typeof num != 'number') {
        throw "That is an invalid guess.";
    }
    else {
        this.playersGuess = num;
    }
    return this.checkGuess();
}

Game.prototype.checkGuess = function () {
    if (this.winningNumber === this.playersGuess) {
        $('#hint,#players-input,#submit').prop('disabled',true);
        return 'You Win!';
    }
    else {
        if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
                $('#title').text("Guess Again!");
                return 'You have already guessed that number.';
        }
        else {
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child('+this.pastGuesses.length +')').text(this.playersGuess);
            if (this.pastGuesses.length === 5) {
                $('#hint,#submit,#players-input').prop('disabled',true);
                $('#title').text("You Lose!");
                $('#subtitle').text("Press Reset to Play Again");
                return "You Lose.";
            }
            else {
                if (this.difference() < 10) {
                    
                    return 'You\'re burning up!';
                }
                else if (this.difference() < 25) {
                    return 'You\'re lukewarm.';
                }
                else if (this.difference() < 50) {
                    return 'You\'re a bit chilly.';
                }
                else if (this.difference() < 100) {
                    return 'You\'re ice cold!';
                }
            }
        }
    }
}

function newGame() {
    return new Game();
}

Game.prototype.provideHint = function() {
    var hint = [this.winningNumber,generateWinningNumber(),generateWinningNumber()];
    return shuffle(hint);
}

function makeAGuess(game) {
    var guess = +$('#players-input').val();
    $('#players-input').val('');
    var answer = game.playersGuessSubmission(guess);
    $('#title').text(answer);
}

$(document).ready(function() {
    var game = new Game();
    
    $('#submit').click(function() {
        makeAGuess(game);
    })
    
    $('#players-input').keypress(function(e) {
        if (e.which === 13) {
            makeAGuess(game);
        }
    })
    
    $('#reset').click(function() {
        game = new Game();
        $('#title').text("Play the Guessing Game!");
        $('#subtitle').text("Guess a number between 1-100");
        $('.guess').text('-');
        $('#hint,#players-input,#submit').prop('disabled',false);
    })
    
    $('#hint').click(function() {
        var output = game.provideHint();
        $('#title').text('The winning number is '+output[0]+', '+output[1]+', or '+output[2]+'');
    })
})
