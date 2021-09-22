

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
// Setting up game components
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
            drawDeck.push(new Card(rgb, i, false, 2, 'images/' + color + i + '.png'));
            drawDeck.push(new Card(rgb, i, false, 2, 'images/' + color + i + '.png'));
        }
        // wild color
        if(i === 13){
            drawDeck.push(new Card (rgb, i, false, 0, 'images/wild' + i + '.png'));

        }
        // wild +4
        if(i === 14) {
            drawDeck.push(new Card (rgb, i, false, 4, 'images/wild' + i + '.png'));
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
// End of game set-up process


//* Game Functions

const dealCards = () => {
    const $cpuCard = $('<div>').addClass('cpu-hand');
    $('.cpu-box').append($cpuCard);
    const $playerHand = $('<div>').addClass('player-hand');
    $('.player-area').append($playerHand)
    
    for (i = 0; i < 7; i++){
        // #region GAME behaviors
        cpuHand.push(drawDeck.shift());
        cpuHand[i].id = `${i}`;
        playerHand.push(drawDeck.shift());
        playerHand[i].id = `${i}`;

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
        whoToGetCard.id = `${whoToGetCard.length - 1}`
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
    $('.choose-color').hide();
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

const showCpuBackCard = () =>{
    $('.cpu-hand').remove();
    const $cpuCard = $('<div>').addClass('cpu-hand');
    $('.cpu-box').append($cpuCard);
    for (let i=0; i<= cpuHand.length-1; i++){
        $cpuCard.append($('<img>').attr("src", "images/back.png"))
    } 
}

const showplayerCard = () => {
    $('.player-hand').remove();
    const $playerhand = $('<div>').addClass('player-hand')
    $('.player-area').append($playerhand);
    for (let i = 0; i < playerHand.length; i++){
        $playerhand.append($('<img>').attr("src", `${playerHand[i].src}`).addClass('playerHandCard').attr('id',`${i}`))
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

const updateHand = (hands,array,value ) => {
    //console.log(array)
    updatedCards = hands.filter(array => array.id !== value)
    //console.log(updatedCards)
    return updatedCards
}


// const conditionChecker =() => {
//     for (let i = 0; i<playerHand.length; i++){
        
//     }
//     if(playerHand.value === discardDeck[discardDeck.length - 1].value || playerHand.color === discardDeck[discardDeck.length - 1].color || playerHand.value >= 10){
//         console.log("inital user turn")
//         return true
//     } 
// }

//! CPU LOGIC AND AUTOMATED GAME PLAY
////////////////////////////////////////////////////////////////////////////////////////////////
const letCpuDrawCards = () => {
    if (drawDeck[discardDeck.length - 1].drawValue > 0) {
        // add however many cards based on drawValue of last played card
        for (let i = 0; i < playPile[drawDeck.length - 1].drawValue; i++) {
            drawCard(cpuHand)
        }
    }
}

const playCPU = () => {   
    if (!playerTurn && gameOn === true) {
        console.log('cpu beginning turn') // TODO: remove

        // create temp array of playable cards based on last card played
        const playable = determinePlayableCards()

        // if no playable cards
        if (playable.length === 0) {
            console.log('CPU has no cards to play') // TODO: remove
            // draw card
            drawCard(cpuHand)
            // end turn
            setTimeout(() => {
                console.log('CPU ending turn') // TODO: remove
                playerTurn = true
                return
            }, 500)
        }
        // if one playable card is playble card 
        else if (playable.length === 1) {
            playCPUCard(playable[0])
        }

        // if more than one playable cards
        else if (playable.length > 1) {
            console.log('cpu has', playable.length, 'playable cards')
            
            let chosenCard = runtatics(playable)
            playCPUCard(chosenCard)
            
            //playCPUCard(chosenCard)
        }
    }

    /////////// CPU FUNCTIONS
    function determinePlayableCards() {
        const playableCards = []

        console.log('last card played:') // TODO: remove
        console.log(discardDeck[discardDeck.length - 1])
        for (let i = 0; i < cpuHand.length; i++) {
            if (cpuHand[i].color === discardDeck[discardDeck.length - 1].color || cpuHand[i].value === discardDeck[discardDeck.length - 1].value || cpuHand[i].color === 'any' || discardDeck[discardDeck.length - 1].color === 'any') {
                let validCard = cpuHand.splice(i, 1)
                playableCards.push(validCard[0])
            }
        }
        console.log('playable cards:')
        console.log(playableCards) // TODO: remove
        
        return playableCards
    }
  
    function runtatics(playable) {
        let cardIndex = 0
            
        // run strategist to determine strategy
        let strategist = Math.random()
        console.log('strategist:', strategist) // TODO: remove
        // if strategist > 0.5 || playerHand <= 3
        if (discardDeck.length > 2 && (strategist > 0.7 || playerHand.length < 3 || cpuHand.length > (playerHand.length * 2) || (discardDeck[discardDeck.length - 1].playedByPlayer === true && discardDeck[discardDeck.length - 1].drawValue > 0) || (discardDeck[discardDeck.length - 2].playedByPlayer === true && drawDeck[drawDeck.length - 1].drawValue > 0))) {
            // prioritize action/high point cards
            console.log('cpu chose high card') // TODO: remove
            let highestValue = 0

            for (let i = 0; i < playable.length; i++){
                if (playable[i].value > highestValue) {
                    highestValue = playable[i].value
                    cardIndex = i
                }
            }
            // play card determined by strategist
            // remove card from playable
            chosenCard = playable.splice(cardIndex, 1)

            // return playable to cpuHand
            returnPlayablesToHand()
    }
        else {
            // else prioritize color || number cards
            console.log('cpu chose low card') // TODO: remove
            let lowestValue = 14

            for (let i = 0; i < playable.length; i++){
                if (playable[i].value < lowestValue) {
                    lowestValue = playable[i].value
                    cardIndex = i
                }
            }

            // play card determined by strategist
            // remove card from playable
            chosenCard = playable.splice(cardIndex, 1)

            returnPlayablesToHand()           
        }

        console.log(chosenCard[0])  // TODO: remove
        return chosenCard[0]

        function returnPlayablesToHand() {
            if (playable.length > 0) {
                for (const card of playable) {
                    cpuHand.push(card)
                }
            }
        }
    }

    function playCPUCard(chosenCard) {
        console.log('playing card:') // TODO: remove
        console.log(chosenCard)

        // push the selected card to the discardDeck

        discardDeck.push(chosenCard)
        updateDiscardPile()

        // check if cpu play any wild cards
        if (discardDeck[discardDeck.length - 1].value === 13 && discardDeck[discardDeck.length - 1].drawValue === 0){
            console.log('CPU played a wild card:') // TODO: remove
            chooseColorAfterWild();
        }
        // check if cpu play wild card +4
        // if (discardDeck[discardDeck.length - 1].value === 14 && discardDeck[discardDeck.length - 1].drawValue === 4){
        //     console.log('CPU play +4 wild card')
        //     chooseColorAfterWild();
        //     for (i = 0; i <5; i++) {
        //         drawCard(playerHand);
        //         showplayerCard() 
        //     }
        // }

        if (cpuHand.length >= 1){
            showCpuBackCard()
            if (cpuHand.length===1){
                showUno(cpuUno)
            }
        }

        else{
            showCpuBackCard()
        }

        // if cpu draws a card
        if (chosenCard.drawValue > 0){
            // alert('cpu played a +' + chosenCard.drawValue)
            // check if cpu play wild card +4
            for (i = 0; i < chosenCard.drawValue; i++) {
                drawCard(playerHand);
                showplayerCard()
            }
            checkChangeTurn();
        }
        else checkChangeTurn();

        function checkChangeTurn() {
            if (chosenCard.changeTurn === true) {
                // if changeTurn, playerTurn = true
                console.log('cpu has finished its turn') // TODO: remove
                playerTurn = true
                return
            }
            else {
                // else cpuTurn() again
                console.log('cpu goes again') // TODO: remove
                playCPU()
            }
        }
    }
    function chooseColorAfterWild() {
        console.log('cpu picking new color') // TODO: remove
        const colors = ['rgb(255, 6, 0)', 'rgb(0, 170, 69)', 'rgb(0, 150, 224)', 'rgb(255, 222, 0)']
        const colorsInHand = [0, 0, 0, 0]

        // cpu checks how many of each color it has
        for (const card of cpuHand) {
            if (card.color === colors[0]) colorsInHand[0]++
            if (card.color === colors[1]) colorsInHand[1]++
            if (card.color === colors[2]) colorsInHand[2]++
            if (card.color === colors[3]) colorsInHand[3]++
        }

        // find the index of the max value
        let indexOfMax = colorsInHand.indexOf(Math.max(...colorsInHand))

        // style the wild card and it's color
        // const wildCardDom = playPileDom.childNodes[0]
        // wildCardDom.style.border = '5px solid ' + colors[indexOfMax]
        // wildCardDom.style.width = '105px'
        discardDeck[discardDeck.length - 1].color = colors[indexOfMax]
    }
    //#endregion
}











const gameStart = () =>{

playerTurn = true; //The player will be playing in this round when
gameOn = true; // is the game still on
colorPickerIsOpen = false;


createDeck()
shuffleDeck(drawDeck)
dealCards()
startPlayDiscard()
//drawCard(cpuHand)
//colorSelector()
turnIdentifier()
//showCpuCard()


//!USER LOGIC PROCESSING
////////////////////////////////////////////////////////////////////////////////////////////////
const inital =() => {

}
const $playerhand = $(".playerHandCard")
$playerhand.on('click', (event) => {
    let x = []
    let y = 0
    console.log('this is the playerHand', playerHand)
    for (let i = 0; i< playerHand.length; i++){
        //console.log(playerHand[i].src)
        if(playerHand[i].src.split('/').at(-1) === `${event.currentTarget.src.split('/').at(-1)}`){
            x.push(playerHand[i])
        }
    }
    console.log(x);
    //if (x[0].value === discardDeck[discardDeck.length-1].value || x[0].color === discardDeck[discardDeck.length-1].color || discardDeck[discardDeck.length-1].value > 10) {
    if (x[0].value === discardDeck[discardDeck.length-1].value || x[0].color === discardDeck[discardDeck.length-1].color && x[0].value <10) {    
        y = x[0].id
    //     let z = x[0].src
        console.log('This is the card Id', y)
    //     //console.log(playerHand)
        discardDeck.push(x[0])
        console.log("this is Discard", discardDeck)
        updateDiscardPile()
        const newset = updateHand(playerHand,x,y);
        console.log('new set', newset)
        playerHand.length = 0
        for (let i = 0; i <newset.length; i++){
            playerHand.push(newset[i])
            playerHand[i].id = `${i}`
        }
        
         console.log(playerHand)
         showplayerCard()

        playerTurn = false;
        turnIdentifier();
        playCPU()


    // //     $playerhand.remove(even.currentTarget)
    } else if (x[0].color === discardDeck[discardDeck.length-1].color && (x[0].value === 10 || x[0].value === 11)){
        y = x[0].id
        console.log('Powercard Selected')
    //     let z = x[0].src
        console.log('This is the card Id', y)
    //     //console.log(playerHand)
        discardDeck.push(x[0])
        console.log("this is Discard", discardDeck)
        updateDiscardPile()
        const newset = updateHand(playerHand,x,y);
        console.log('new set', newset)
        playerHand.length = 0
        for (let i = 0; i <newset.length; i++){
            playerHand.push(newset[i])
            playerHand[i].id = `${i}`
        }
        
         console.log(playerHand)
         showplayerCard()

         // SKIP computer turn


        turnIdentifier();

    } else if (x[0].color === discardDeck[discardDeck.length-1].color && (x[0].value === 12)){
        y = x[0].id
        console.log('+2 card Selected')
    //     let z = x[0].src
        console.log('This is the card Id', y)
    //     //console.log(playerHand)
        discardDeck.push(x[0])
        console.log("this is Discard", discardDeck)
        updateDiscardPile()
        const newset = updateHand(playerHand,x,y);
        console.log('new set', newset)
        playerHand.length = 0
        for (let i = 0; i <newset.length; i++){
            playerHand.push(newset[i])
            playerHand[i].id = `${i}`
        }
        
        console.log(playerHand)
        showplayerCard()

        for (i = 0; i <3; i++) {
            drawCard(cpuHand);
        }
        showCpuBackCard()
        //console.log(cpuHand)
        playerTurn = false;
        turnIdentifier();
        playCPU()
        
    
    } else if ((x[0].value === 13)){
        y = x[0].id
        console.log('wild card Selected')
    //     let z = x[0].src
        console.log('This is the card Id', y)
    //     //console.log(playerHand)
        discardDeck.push(x[0])
        console.log("this is Discard", discardDeck)
        updateDiscardPile()
        const newset = updateHand(playerHand,x,y);
        console.log('new set', newset)
        playerHand.length = 0
        for (let i = 0; i <newset.length; i++){
            playerHand.push(newset[i])
            playerHand[i].id = `${i}`
        }
        colorPickerIsOpen = true;
        colorSelector();
        
        playerTurn = false;
        turnIdentifier();
        playCPU()
    
    
    } else if ((x[0].value === 14)){
        y = x[0].id
        console.log('wild card Selected')
    //     let z = x[0].src
        console.log('This is the card Id', y)
    //     //console.log(playerHand)
        discardDeck.push(x[0])
        console.log("this is Discard", discardDeck)
        updateDiscardPile()
        const newset = updateHand(playerHand,x,y);
        console.log('new set', newset)
        playerHand.length = 0
        for (let i = 0; i <newset.length; i++){
            playerHand.push(newset[i])
            playerHand[i].id = `${i}`
        }
        colorPickerIsOpen = true;
        colorSelector();
        

        for (i = 0; i <5; i++) {
            drawCard(cpuHand);
        }
        showCpuBackCard()
        // console.log(cpuHand)
        playerTurn = false;
        turnIdentifier();
        playCPU()
    


    }else{
        console.log("please draw a card");
        $('#Draw').on('click', ()=>{
            drawCard(playerHand)
        });
        showplayerCard()
        playerTurn = false; 
        playCPU()
     }
    
}) 


// 
//     if(playerHand[i].src.split('/').at(-1) === `${event.currentTarget.src.split('/').at(-1)}`) {
//     console.log(playerHand[i]);
//     break;
}
$(gameStart)