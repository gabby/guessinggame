function generateWinningNumber(){
 	return Math.floor((Math.random() * 100) + 1); 
} 

function shuffle(arr){
	let m = arr.length, t, i;
	while(m){
		i = Math.floor(Math.random() * m--);
		t = arr[m];
		arr[m] = arr[i];
		arr[i] = t;
	}
	return arr;
} 

function Game(){
	this.playersGuess = null; 
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
} 

Game.prototype.difference = function(){
	return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
	return (this.playersGuess < this.winningNumber) ? true : false;
}

Game.prototype.playersGuessSubmission = function(num){
	if (num<=0 || num>100 || typeof num != 'number')
		throw "That is an invalid guess."
	else 
		this.playersGuess = num;
		return this.checkGuess(num);
} 

Game.prototype.checkGuess = function(){
	if (this.playersGuess===this.winningNumber) {
		$('#hint, #submit').prop("disabled", true);
		$('#subtitle').text("Press the Reset button to play again!")
		return 'You Win!'
	}
	else {
		if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
			return 'You have already guessed that number.';
		}
		else {
			this.pastGuesses.push(this.playersGuess);
			$('#guess-list li:nth-child(' + this.pastGuesses.length +')').text(this.playersGuess);
			if(this.pastGuesses.length === 5) {
				$('#hint, #submit').prop("disabled",true);
				$('subtitle').text("Press the Reset button to play again!")
				return 'You Lose. Winning Number: ' + this.winningNumber;
			}
			else {
				var diff=this.difference();
				if(this.isLower()) {
					$('#subtitle').text("Guess Higher!")
				} else {
					$('#subtitle').text("Guess Lower!")
				}
				if (diff < 10) return  "You're burning up!";
				else if(diff < 25) return "You're lukewarm.";
				else if (diff < 50) return "You're a bit chilly.";
				else return "You're ice cold!";
			}
		}
	}
}

function newGame(){
	return new Game;
}

Game.prototype.provideHint = function(){
	let hintArr = [this.winningNumber]; 
	while (hintArr.length<3)
		hintArr.push(generateWinningNumber());
	return shuffle(hintArr);
};

function makeAGuess(game){
	var guess = $('#player-input').val();
	$('#player-input').val('');
	var output = game.playersGuessSubmission(parseInt(guess,10));
	$('#title').text(output);
}

$(document).ready(function(){
	var game = new Game();

	$('#submit').click(function(x){
		makeAGuess(game);
	}) 

	$('#player-input').keypress(function(event){
		if (event.which == 13){
			makeAGuess(game);
		} 
	})

	$('#hint').click(function(){
		var hints = game.provideHint();
		$('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
	}); 

	$('#reset').click(function(){
		game = new Game(); 
		$('#title').text('Play the Guessing Game!');
		$('#subtitle').text('Guess a number between 1-100!');
		$('.guess').text('-');
		$('#hint, #submit').prop('disabled',false);
	})
});



