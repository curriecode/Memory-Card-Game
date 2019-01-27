/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// @description Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


let allCards = [];
let showCards = [];
let moves = document.querySelector('.moves');
let firstClick = true; // @description firstClick variable is set to true and calls startTimer() to start the timer then sets firstClick to false so it cannot be called again
let time;
let canClick = true; // @ description is set to false after 2 cards are clicked so that no more than 2 cards can be shown at a time
let modal = document.querySelector('.modal');
let totalSeconds = 0;
let stars = document.querySelectorAll('.stars');
let resetButton = document.querySelector('.restart').firstElementChild;
resetButton.addEventListener('click', resetGame);
let modalButton = document.querySelector('.playagain');
modalButton.addEventListener('click', resetGame);
let cardClasses = [
    'fa-diamond', 
    'fa-diamond', 
    'fa-paper-plane-o', 
    'fa-paper-plane-o',
    'fa-anchor', 
    'fa-anchor',
    'fa-bolt', 
    'fa-bolt',
    'fa-cube', 
    'fa-cube',
    'fa-leaf', 
    'fa-leaf',
    'fa-bicycle', 
    'fa-bicycle',
    'fa-bomb', 
    'fa-bomb'
];
// @description calls all the different function that should run after the first card is clicked
function assignCardListeners() {
    allCards = document.querySelectorAll('.card')
    allCards.forEach(function (card) {
        card.addEventListener('click', function(evt) {
            if (firstClick){
                startTimer()
                firstClick = false
            }

            if (isCardClosed(card) && canClick) {
                openCard(card)
                addCardToArray(card)
            }

            if (showCards.length == 2 && canClick) {
                canClick = false
                addMove()
                if (isMatch() == true) {
                    addMatch()                   
                    // addStarRating()

                } else {
                    minusStarRating()
                    notMatch(card)
                }
                // @description flips cards back over after apprx 1 second has passed
                setTimeout (function() {
                    showCards.forEach(function(card) {
                        card.classList.remove('open', 'show', 'wrong')
                    })
                    canClick = true
                    showCards = [];
                }, 1000);
            }
        })
    });
}
// @description opens card
function openCard(card) {
    card.classList.add('open', 'show');
}

// @description adds cards to array
function addCardToArray(card) {
    showCards.push(card);
}

// @description checks if card has open/show/match class
function isCardClosed(card) {
    return !card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match');
}

function getCardClassName(card) {
    return card.firstElementChild.classList[1];
}

// @description checks for a match
function isMatch() {
    let firstCardClass = getCardClassName(showCards[0])
    let secondCardClass = getCardClassName(showCards[1])
    if (firstCardClass == secondCardClass){
        return true;
    } else {
        return false;
    }
}

// @description adds 'match' class to card
function addMatch() {
    showCards[0].classList.add('match')
    showCards[1].classList.add('match');
}

// @description adds 'wrong' class to card
function notMatch(card) {
    showCards[0].classList.add('wrong')
    showCards[1].classList.add('wrong');
}

// @description adds 1 to move the counter only if card is not a match
function addMove() {
    moves.textContent = Number(moves.textContent) + 1;
}

// @description checks for match class and adds them to an array
function matchedCards () {
    let matchedCardsArray = []
    allCards.forEach(function(card) {
        if (card.classList.contains('match')) {
            matchedCardsArray.push(card)
        }
    })
    return matchedCardsArray;
}

// @description redefines value to const time and calls timer()
function startTimer(){
    time = setInterval(timer, 1000);
} 

function timer() {
    totalSeconds = totalSeconds + 1
    document.querySelector('.time').firstElementChild.innerHTML = formatTime(totalSeconds);
    if (matchedCards().length == 16) {
        clearInterval(time)
        congrats();
    }
}

// @descrpition formats time into minutes and seconds
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60 )
    let sec = seconds - (minutes * 60)
    if (sec < 10) {
       sec = '0' + sec
    }
    let finalTime = `${minutes} : ${sec}`
    return finalTime;
}

// @description deletes stars after 3 wrong moves
function minusStarRating() {
    if (moves.innerHTML % 4 == 0 && stars[0].children.length > 1 ) {
        stars[0].firstElementChild.remove();
    }
}

// function addStarRating() {
//     if(matchedCards().length % 4 == 0) {
//         let addStar = document.createElement('li')
//         addStar.innerHTML = '<i class="fa fa-star"></i>' 
//         document.getElementsByClassName('stars')[0].appendChild(addStar);
//     }
// }

// @description makes congrats modal pop up when game is won
function congrats() {
    if(matchedCards().length == 16){
        modal.style.visibility = 'visible'
        congratsContent();
    }
}
// @description adds final time to modal
function congratsContent() {
    let finalTime = document.querySelector('.time').firstElementChild.innerHTML
    document.querySelector('.endtime').firstElementChild.innerHTML = finalTime
    let finalScore = document.querySelector('.score-panel').firstElementChild.children.length + ' stars in ' + moves.innerHTML + ' moves'
    document.querySelector('.endscore').firstElementChild.innerHTML = finalScore;
}

// @description Reset button
function resetTime() {
    firstClick = true
    totalSeconds = 0
    clearInterval(time)
    document.querySelector('.time').firstElementChild.innerHTML = '0:00';
}
// @description sets moves to 0 when reset button is clicked
function resetMoves() {
    moves.innerHTML = 0;
}
// @description resets stars to 3 when rest button is clicked
function resetStars(){   
    while (stars[0].children.length > 3) {
        stars[0].firstElementChild.remove();
    }
    while (stars[0].children.length < 3) {
        let addStar = document.createElement('li')
        addStar.innerHTML = '<i class="fa fa-star"></i>'        
        document.getElementsByClassName('stars')[0].appendChild(addStar);
    }
}
//@description removes cards from the HTML
function destroyCards() {
    let emptyDeck = document.getElementsByClassName('deck')[0]
    emptyDeck.innerHTML = '';
}
// @description calls all the reset functions to reset the whole game when the reset button is clicked
function resetGame(event) {
    modal.style.visibility = 'hidden';
    if (resetButton) {
        resetTime()
        resetMoves()
        resetStars()
        destroyCards()
        makeCards()
        showCards = [];
    }
}
// @description adds cards to the HTML
function makeCards() {
    shuffle(cardClasses)
    let deck = document.getElementsByClassName('deck')
    cardClasses.forEach((cardClass) => {
        let genCard = document.createElement('li')
        genCard.classList.add('card')
        genCard.innerHTML = `<i class="fa ${cardClass}"></i>`
        deck[0].appendChild(genCard)       
    });
    assignCardListeners();
};

makeCards();
