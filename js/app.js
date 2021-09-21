

//Global Variables 

const cpuHand = []; //store the cards that cpu have on hand
const playerHand = []; //store the cards that cpu have on hand

const drawDeck = []; //store the full cards to play
const discardDeck =[]; //store the cards that has been discarded

let cpuScore = 0;
let playerScore = 0;

// Variables to change during the game
let playerTurn = true; //The player will be playing in this round when
let gameOn = true; // is the game still on
let colorPickerIsOpen = false;
let gameOver = 0
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


//* Game Functions

const dealCards = () => {
    const $cpuCard = $('<div>').addClass('cpu-hand');
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
        $playerHand.append($('<img>').attr('src', `${playerHand[i].src}`).addClass('playerHandCard').attr('id',`${i}`))
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
    $discardDeck.append($('<img>').attr('src', `${discardDeck[discardDeck.length - 1].src}`))
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

const colorSelector = () =>{
    // show the color picker
    const $colorPicker = $('.choose-color')
    $colorPicker.fadeTo("fast", 1)
    colorPickerIsOpen = true
    

    // assign event handler to the buttons
    $(".red").on('click', (event)=>{
        console.log('Red Selected')
        chooseColor('rgb(255, 6, 0)')
    })

    $('.green').on('click', (event) => {
        // pass thru the class name for color
        console.log('Green Selected')
        chooseColor('rgb(0, 170, 69)')
    })
    $('.blue').on('click', (event) => {
        // pass thru the class name for color
        console.log('Blue Selected')
        chooseColor('rgb(0, 150, 224)')
    })
    $('.yellow').on('click', (event) => {
        // pass thru the class name for color
        console.log('Yellow Selected');
        chooseColor('rgb(255, 222, 0)')
    })

}

const chooseColor = (rgb) =>{
    //assign the color the wild card used
    discardDeck[discardDeck.length - 1].color = rgb

    //hide the color picker
    $('.choose-color').fadeTo('fast', 0);
    colorPickerIsOpen = false;
    playerTurn = false;
    /// need to switch over to CPU

    //* 
}

const skipOrEndTurn =() => {
    // this will be used in the event of skip, reverse card being used
    if (discardDeck[discardDeck.length - 1].changeTurn === true){
        playerTurn = false;
    }

    // Start the CPU to play

    //*
}

const turnIdentifier = () => {
    if (playerTurn === true) {
        $('.player-name').css('color','red').css('font-size','30px').css('text-align', 'center');
        $('.cpu-name').css('color','white').css('font-size','20px').css('text-align', 'center');
    } else {
        $('.cpu-name').css('color','red').css('font-size','30px').css('text-align', 'center');
        $('.player-name').css('color','white').css('font-size','20px').css('text-align', 'center');
    }
}

//* End of Functions


// start of game loops

const checkWinner = () =>{
    if(playerHand.length === 0) {
        endRound(playerHand);
    }
    if(cpuHand.length === 0) {
        endRound(cpuHand);
    }
    else {
        // game gameover
        endgame();
    }

}

const showCpuCard = () =>{
        $('.cpu-hand').remove();
        const $cpuCard = $('<div>').addClass('cpu-hand');
        $('.cpu-box').append($cpuCard);
        for (let i=0; i<= cpuHand.length-1; i++){
            $cpuCard.append($('<img>').attr("src", `${cpuHand[i].src}`))
        } 
}

// const endRound = () => {
//     gameOn = false;
//     playerTurn = false;

//     if (cpuHand.length > 0) {
//         showCpuCard()
//     }
//     // const endOfroundDom = document.querySelector('.end-of-round')
//     // const roundDom = document.querySelector('.round')
    
//     // // show end of round element & format it based on who won
//     // endOfroundDom.classList.remove('hidden')
//     // if (winner === playerHand) roundDom.textContent = 'You won the round!'
//     // else roundDom.textContent = 'CPU won the round...'
    
//     // // hide end of round element after 2 seconds
//     // setTimeout(() => {
//     //     endOfroundDom.classList.add('hidden')
//     //     playerTurn = !playerTurn
//     //     newHand()
//     //     if (!playerTurn) setTimeout(playCPU, cpuDelay)
        
//     // }, 3000)
// }

const endGame = () => {
    gameOn = false;
    if (cpuHand.length > 0 && playerHand.length === 0 ) {
        showCpuCard();
        console.log("Player has won the round")
    }
    if (cpuHand.length === 0 && playerHand.length > 0){
        conosle.log("Cpu has won the round")
    }
}


/// player selection process function














const gameStart = () =>{

    playerTurn = true; //The player will be playing in this round when
    gameOn = true; // is the game still on
    colorPickerIsOpen = false;


    createDeck()
    shuffleDeck(drawDeck)
    dealCards()
    startPlayDiscard()
    //drawCard(cpuHand)
    colorSelector()
    turnIdentifier()
    showCpuCard()
    
    console.log(discardDeck[discardDeck.length-1])

    const $playerhand = $(".playerHandCard")

    $playerhand.on('click', (event) => {

    } 

    

 }

$(gameStart)




for (let i = 0; i< playerHand.length; i++){
    if(playerHand[i].src.split('/').at(-1) === `${event.currentTarget.src.split('/').at(-1)}`) {
    console.log(playerHand[i]);
    break;