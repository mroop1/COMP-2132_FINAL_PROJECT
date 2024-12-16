class HangmanGame {
    constructor() {
        this.getWords('http://34.229.116.131/words.json')
        this.setWord()

        this.word = JSON.parse(localStorage.getItem('word'));
        this.maximumGuesses = 6
        this.incorrectGuess = 0
        this.guessedLetters = []
        this.correctWord = this.word["word"].toUpperCase()
        
    }   

    getWords(url){
        fetch(url, {
            method: 'GET',
        })
            .then( function(response) {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
            })
            .then( function(data) {
            localStorage.setItem('words', JSON.stringify(data));
            })
            .catch(function(error) {
            console.error('Error fetching data:', error);
            });
        }

    setWord(){
        let wordList = JSON.parse(localStorage.getItem('words'));
        let randomInt = Math.floor(Math.random() * wordList.length);
        let word = wordList[randomInt];
        localStorage.setItem('word', JSON.stringify(word));
    }
    setEmptySpaces(){
        for (let index = 0; index < this.correctWord.length; index++) {
            let li = document.createElement('li');
            li.setAttribute('class', 'letter');
            document.getElementById('word_display').appendChild(li);

       }
    }
    setHint(){
        document.getElementById('hint_message').textContent = this.word["hint"];
    }
    startGame(){
        this.setEmptySpaces()
        this.setHint()
        document.querySelectorAll('.btn-letter').forEach(item => {
            item.addEventListener('click', this.guessLetter.bind(this));
        });
        document.getElementById("play_again").addEventListener('click',this.playAgain)
        document.getElementById("replay").addEventListener('click',this.playAgain)
    }
    gameOver(){
        document.getElementById("game_outcome_popup").style.display = "flex";
        document.getElementById("correct_word").textContent = this.word["word"]
    
    }
    guessLetter () {
        if (this.word["word"].includes(event.target.textContent)){
            this.correctGuess(event.target.textContent)
        }
        else{
            event.target.disabled= true;
            this.incrementIncorrectGuess()
    
        }
    }
    incrementIncorrectGuess() {
        
        if (this.incorrectGuess === this.maximumGuesses){
            this.gameOver()
            
        }
        if (this.incorrectGuess + 1 === this.maximumGuesses) {
            this.incorrectGuess += 1
            let remainingGuesses = [this.incorrectGuess,this.maximumGuesses]
            document.getElementById("remaining_guesses").textContent = remainingGuesses.join("/")
            this.updateHangmanImage()
            this.gameOver()
            
        }
        else{

            this.incorrectGuess += 1
            let remainingGuesses = [this.incorrectGuess,this.maximumGuesses]
            document.getElementById("remaining_guesses").textContent = remainingGuesses.join("/")
            this.updateHangmanImage()
        }
    }
    updateHangmanImage (){
        let img = document.getElementById("hangman_image")
        img.src = `../images/hangman-${this.incorrectGuess}.svg`    
    }
    playAgain(){
        location.reload()
    }

    correctGuess (letter){
        if (!this.guessedLetters.includes(letter)){
            this.guessedLetters.push(letter)
        }
        this.updateLetters()
        this.checkGameWon()
    }
    updateLetters(){
        for (let index = 0; index < this.correctWord.length; index++) {
            let letter = this.correctWord[index]
            if (this.guessedLetters.includes(letter)){
                document.querySelector(`#word_display li:nth-child(${index+1})`).textContent = letter
            }
        }
    }
    checkGameWon(){
        let guessed = document.querySelectorAll(".letter")
        let word = ""
        for (let index = 0; index < guessed.length; index++) {
            word += guessed[index].textContent
       }
       if (word == this.correctWord) {
            this.gameWon()
        
       }
    }
    gameWon(){
        document.getElementById("game_result_gif").src = "../images/victory.gif"
        document.querySelector(".game-outcome-content p").style.display = "none";
        document.getElementById("game_result").textContent = "Game Won!!!"
        document.getElementById("game_outcome_popup").style.display = "flex";

    }
}
const newGame = new HangmanGame();
newGame.startGame()




