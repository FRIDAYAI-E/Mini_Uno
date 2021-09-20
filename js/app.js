const $cpuCard = $('<div>').addClass('cpu-hand');

//Global Variables 

const cpuHand = []; //store the cards that cpu have on hand
const playerHand = []; //store the cards that cpu have on hand

const drawDeck = []; //store the full cards to play
const discardDeck =[]; //store the cards that has been discarded

let cpuScore = 0;
let playerScore = 0;

// Variables to change during the game
let playerTurn = true;
let gameOn = true;
let colorPickerIsOpen = false;
let cpuDelay = Math.floor((Math.random() * cpuHand.length * 200) + 1500);


// Cards & DrawDecks =======================================
// Setting up the class of a card
class Card {
    constructor(rgb, value, changeTurn, drawValue, imgSrc) {
        this.color = rgb
        this.value = value
        this.changeTurn = changeTurn
        this.drawValue = drawValue
        this.src = imgSrc
        this.playedByPlayer = false
    }
}

const createCardGroup =(rgb, color) => {
    // number each card 
    for (let i = 0; i <= 14; i++){
        if (i === 0){
            drawDeck.push(new Card(rgb , i , true , 0,'images/' + color + i + '.png'));
 
        };    
        if (i > 0 && i <=9){
            drawDeck.push(new Card(rgb, i, true, 0, 'images/' + color + i + '.png'));
            drawDeck.push(new Card(rgb, i, true, 0, 'images/' + color + i + '.png'));
        };
        // this is for reverse and skip card
        if (i === 10 || i === 11 ){
            drawDeck.push(new Card(rgb, i, false, 0, 'images/' + color + i + '.png' ));
            drawDeck.push(new Card(rgb, i, false, 0, 'images/' + color + i + '.png' ));
        }
        // this is for the +2 cards
        if (i === 12){
            drawDeck.push(new Card(rgb, i, false, 0, 'images/' + color + i + '.png'));
            drawDeck.push(new Card(rgb, i, false, 0, 'images/' + color + i + '.png'));
        }
        // wild color
        if(i === 13){
            drawDeck.push(new Card (rgb, i, false, 0, 'images/wild' + i + '.png'));

        }
        // wild +4
        if(i === 14) {
            drawDeck.push(new Card (rgb, i, false, 0, 'images/wild' + i + '.png'));
        }
        
    }
}

const createDeck = () => {
    // reset the the previously saved deck in the system
    drawDeck.length = 0
    // create new deck
    for (let i = 0; i <= 3; i++){
        if (i === 0) {
            createCardGroup('rgb(255, 6, 0)', 'red');
        }
        else if (i === 1) {
            createCardGroup('rgb(0, 170, 69)', 'green');
        }
        else if (i === 2) {
            createCardGroup('rgb(0, 150, 224)', 'blue');
        }
        else {
            createCardGroup('rgb(255, 222, 0)', 'yellow');
        }
     }

    console.log(drawDeck.length)
}

const shuffleDeck = (drawDeck) => {
    for(let i = drawDeck.length -1; i > 0; i--){
        drawDeck.playedByPlayer = false;
        let j = Math.floor(Math.random()*(i + 1));
        // according to Fisher-Yates Shuffle https://javascript.info/task/shuffle
        [drawDeck[i], drawDeck[j]] = [drawDeck[j], drawDeck[i]];
    }
    console.log("Deck Shuffled!")
}

//* End of game set-up process


//* start of game

const dealCards = () => {
    $('.cpu-box').append($cpuCard);
    const $playerHand = $('<div>').addClass('player-hand');
    $('.player-area').append($playerHand)
    
    for (i = 0; i < 7; i++){
        // #region GAME behaviors
        cpuHand.push(drawDeck.shift());
        playerHand.push(drawDeck.shift());

        // place image in the front-end for the cpu (back-face of the uno card)
        $cpuCard.append($('<img>').attr('src',"images/back.png"))

    // place image on the front-end for the player(front-end of the uno card based on the value)
        $playerHand.append($('<img>').attr('src', `${playerHand[i].src}`).attr('id', i))
    }
    $('#cpuNumberCards').text(`${cpuHand.length}`);
    
}

const startPlayDiscard = () =>{
    const $discardDeck = $('<div>').addClass('discard-Deck')
    $('.deal-area').append($discardDeck)
    for(let i = 0; i < drawDeck.length; i++ ){
        if( drawDeck[i].color !=="any" && drawDeck[i].value <9){
            //being playing the game with the first valid card
            discardDeck.push(drawDeck[i])
            drawDeck.splice(i,1)
            break
        }
    }
    
    $discardDeck.append($('<img>').attr('src', `${discardDeck[0].src}`))
    console.log(discardDeck)
    console.log(drawDeck.length)
}

const newGame = () => {
    console.log('Lets go, new round')
    gameOn = true
    // clear hands and play pile
    $('.cpu-hand').remove()
    cpuHand.length = 0
    $('.player-hand').remove()
    playerHand.length = 0
    $('.discard-Deck').remove()
    discardDeck.length = 0

    // create new deck
    createDeck()
    // shuffle deck
    shuffleDeck(drawDeck)
    // deal cards and first play card
    dealCards()
    // set down first play card that isn't an action card
    startPlayDiscard()

    if (colorPickerIsOpen) hideColorPicker()
}

const updateDiscardPile = () =>{
    $('.discard-Deck').remove()
    const $discardDeck = $('<div>').addClass('discard-Deck')
    $('.deal-area').append($discardDeck)
    // will need to update the discardDeck
    $discardDeck.append($('<img>').attr('src', `${discardDeck[0].src}`))
}

const drawCard = (whoToGetCard) =>{
    // check if there are any cards in the deck to be drawn
    if (drawDeck.length > 0){
        const newCard = drawDeck.shift()
        whoToGetCard.push(newCard)
        console.log(whoToGetCard, "drew one card")
    } else {
        shuffleDeck(discardDeck)
        for (let i = 0; i < discardDeck.length - 1; i++){
            // push all the cards back to the drawDeck
            drawDeck.push(discardDeck[i])
            console.log(whoToGetCard.length)
        }
        // leave the last card in the deck to continue playing
        discardDeck.length = 1
        // draw the new card from the drawDeck
        const newCard = drawDeck.shift()
        whoToGetCard.push(newCard);
        console.log(whoToGetCard, "drew one card") 
        console.log(whoToGetCard.length)
    }
}

















const main = () =>{
    createDeck()
    shuffleDeck(drawDeck)
    dealCards()
    startPlayDiscard()
    drawCard(cpuHand)


}

$(main)