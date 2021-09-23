/////////////////////////////////////////////////////////////////
//! Setting up Global Variables
//////////////////////////////////////////////////////////////

const CPUHAND = []; // this will be use as the CPU handcard
const PLAYERHAND =[]; // this will be use as the PLAYER handcard
const drawDeck = []; // this will be use as the Fresh pile of cards
const discardDeck =[]; // this will be use as the discard pile of cards

// Variables that needs to be change throughout the game
let playerTurn = true;
let gameOn = true;
let colorPickerIsOpen = false;
let delayTurn = (Math.floor(Math.random()* CPUHAND.length * 150) + 2000);

let playerScore = 0;
let cpuScore = 0;


/////////////////////////////////////////////////////////////////
//! Setting up drawDeck and DiscardDeck
//////////////////////////////////////////////////////////////
class Card {
    constructor(rgb, value, changeTurn, drawValue, imgSrc) {
        this.color = rgb
        this.value = value
        this.changeTurn = changeTurn // mainly use for power cards to reverse or change
        this.drawValue = drawValue // This will be the card that decide how many coards the opponent needs to draw 
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
            drawDeck.push(new Card ('any', i, false, 0, 'images/wild' + i + '.png'));

        }
        // wild +4
        if(i === 14) {
            drawDeck.push(new Card ('any', i, false, 4, 'images/wild' + i + '.png'));
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

/////////////////////////////////////////////////////////////////
//! Setting up Game Behaviours
//////////////////////////////////////////////////////////////

////// mainly in the deal area
const dealCards = () => {
    const $cpuCard = $('<div>').addClass('cpu-hand');
    $('.cpu-box').append($cpuCard);
    const $playerHand = $('<div>').addClass('player-hand');
    $('.player-area').append($playerHand)
    
    for (i = 0; i < 7; i++){
        // #region GAME behaviors
        CPUHAND.push(drawDeck.shift());
        CPUHAND[i].id = `${i}`;
        PLAYERHAND.push(drawDeck.shift());
        PLAYERHAND[i].id = `${i}`;

        // place image in the front-end for the cpu (back-face of the uno card)
        $cpuCard.append($('<img>').attr('src',"images/back.png"))

    // place image on the front-end for the player(front-end of the uno card based on the value)
        $playerHand.append($('<img>').attr('src', `${PLAYERHAND[i].src}`).addClass('playerHandCard').attr('id',`${i}`))
    }
    $('#cpuNumberCards').text(`${CPUHAND.length}`);
}

const startPlayDiscard = () =>{
    const $discardDeck = $('<div>').addClass('discard-Deck')
    $('.deal-area').append($discardDeck)
    for(let i = 0; i < drawDeck.length; i++ ){
        if( drawDeck[i].color !=="any" && drawDeck[i].value <10){
            //being playing the game with the first valid card
            discardDeck.push(drawDeck[i])
            drawDeck.splice(i,1)
            break
        }
    }
    $discardDeck.append($('<img>').attr('src', `${discardDeck[discardDeck.length - 1].src}`))
    //* console.log(discardDeck)
    //* console.log(drawDeck.length)
}

const newGameRound = () => {
    // this is for users to play another round (refresh)
    console.log("begin of new round")
    gameOn = true; // is the game still on
    // clear out cards on hand
    $('.cpu-hand').remove()
    CPUHAND.length = 0
    $('.player-hand').remove()
    PLAYERHAND.length = 0
    $('.discard-Deck').remove()
    discardDeck.length = 0

    // create new deck
    // the previous deck of card will be rest
    createDeck()
    // shuffle deck
    shuffleDeck(drawDeck)
    // deal cards and first play card
    dealCards()
    // set down first play card that isn't an action card
    startPlayDiscard()

    if (colorPickerIsOpen === true){
        hideColorPicker()
    } 
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
    }
}

const showUno = (winningHand) => {
    // create uno! sign
    if (winningHand === PLAYERHAND){
        $('.player-area').append($('<img>').attr('src','images/uno!.png').attr('id', 'uno'))
    }
    else{
        $('.cpu-box').append($('<img>').attr('src','images/uno!.png').attr('id', 'uno'))
    }

}

///////////// player area function 
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
    hideColorPicker(); //hide the color bar
    playerTurn = false;
    
    /// need to switch over to CPU
    setTimeout(playCPU, delayTurn)

}

const hideColorPicker = () => {
    $('.choose-color').hide();
}

const skipOrEndTurn =() => {
    if (discardDeck[discardDeck.length - 1].changeTurn === true){
        playherHand = false;

        setTimeout(playCPU, delayTurn);
    }
}

const turnIdentifier = () => {
    if (playerTurn === true) {
        $('.player-name').css('color','red').css('font-size','30px');
        $('.cpu-name').css('color','white').css('font-size','20px');
    } else {
        $('.cpu-name').css('color','red').css('font-size','30px');
        $('.player-name').css('color','white').css('font-size','20px');
    }
}


/// END OF ROUND AND END OF GAME FUNCTIONS
const pointsCalculation = () => {
    if (PLAYERHAND.length === 0 && CPUHAND.length !== 0) {
        playerScore ++
    } else if(CPUHAND.length === 0 && PLAYERHAND.length !==0) {
        cpuScore ++
    }
}

const checkForWinners = () => {
    if (playerScore <= 3 && cpuScore <= 3){
        if (PLAYERHAND.length === 0 && playerScore === 3){
            endRound(PLAYERHAND)
        }

    }
    if (CPUHAND.length === 0 && Score === 3){
        endRound(CPUHAND)
    }

    else {
        endgame();
    }
    
}

const showCpuCard = () =>{
    $('.cpu-hand').remove();
    const $cpuCard = $('<div>').addClass('cpu-hand');
    $('.cpu-box').append($cpuCard);
    for (let i=0; i<= CPUHAND.length-1; i++){
        $cpuCard.append($('<img>').attr("src", `${CPUHAND[i].src}`))
    } 
}

const showCpuBackCard = () =>{
    $('.cpu-hand').remove();
    const $cpuCard = $('<div>').addClass('cpu-hand');
    $('.cpu-box').append($cpuCard);
    for (let i=0; i<= CPUHAND.length-1; i++){
        $cpuCard.append($('<img>').attr("src", "images/back.png"))
    } 
}

const showPlayerCard = () => {
    $('.player-hand').remove();
    const $playerhand = $('<div>').addClass('player-hand')
    $('.player-area').append($playerhand);
    for (let i = 0; i < PLAYERHAND.length; i++){
        $playerhand.append($('<img>').attr("src", `${PLAYERHAND[i].src}`).addClass('playerHandCard').attr('id',`${i}`))
    }
}

const endRound =(winner) => {
    console.log('Round over', winner)
    gameOn = false;
    if (CPUHAND.length > 0) {
        showCpuCard();
    }

    if (winner === PLAYERHAND){
        console.log('you won this round');
    }
    else {
        console.log('Computer Won this round');
    }

    playerturn = !playerturn
    newGameRound();
    if(playerturn != playerturn){
        setTimeout(playCPU, delayTurn)
    }
}

const endGame = () => {
    // end of the game
    gameOn = false;
    if (CPUHAND.length > 0) {
        showCpuCard();
    }

    if(playerScore === 3){
        console.log("Congrats on winning the game! Play Again?")
    }
    else {
        console.log("CPU won the game! Play Again?")
    }
     // add event listener to 'play again' button
    //  document.querySelector('.play-again').addEventListener('click', () => {
    //     playAgain.play()
    //     // hide end of game element on click
    //     endOfGameDom.classList.add('hidden')
    //     playerScore = 0
    //     cpuScore = 0
    //     updateScores()
    //     playerTurn = !playerTurn
    //     newHand()
    //     if (!playerTurn) setTimeout(playCPU, cpuDelay)
    // })
}

const updateHand = (hands,array,value ) => {
    //console.log(array)
    updatedCards = hands.filter(array => array.id !== value)
    //console.log(updatedCards)
    return updatedCards
}

/////////////////////////////////////////////////////////////////
//! CPU LOGIC AND AUTOMATED GAME PLAY
//////////////////////////////////////////////////////////////
// This is to check if there are any +2 cards or +4 cards in the deck that needs to be taken care off
const letCpuDrawPowerCards = () => {
    if (drawDeck[discardDeck.length - 1].drawValue > 0) {
        // add however many cards based on drawValue of last played card
        for (let i = 0; i < drawDeck[drawDeck.length - 1].drawValue; i++) {
            drawCard(CPUHAND)
        }
    }
}

const playCPU = () => {   
    // the main CPU processing logic for the overall game
    if (!playerTurn && gameOn === true) {
        console.log('cpu beginning turn')

        // create temp array of playable cards based on last card played
        const playableCards = determinePlayableCards()

        // if there is no playable cards available
        if(playableCards.length === 0){
            console.log("Cpu Draw Cards")
            // draw cards
            drawCard(CPUHAND);
            showCpuBackCard();
            settimeout(() =>{
                playerTurn = true;
            },100);
        }
        // if there are 1 card that the CPU can play
        else if(playableCards.length === 1){
            playCpuCard(playable[0])
            settimeout(() =>{
                playerTurn = true;
            },100);
        }
        else if (playable.length > 1) {
            let chosenCard = runtatics(playable)
            playCpuCard(chosenCard)
            settimeout(() =>{
                playerTurn = true;
            },100)
        
        }
    }

    const determinePlayableCards = () => {
        const playableCards = [];

        console.log(discardDeck[discardDeck.length - 1]);
        for (let i = 0; i< CPUHAND.length; i++) {
            if (CPUHAND[i].color === discardDeck[discardDeck.length - 1].color || CPUHAND[i].value === discardDeck[discardDeck.length-1].value || CPUHAND[i].color === 'any' || discardDeck[discardDeck.length-1].value ==="any") {
                let validCard = CPUHAND.splice(i,1)
                playableCards.push(validCard[0])
            }
        }
        console.log(playableCards)
        return playableCards
    }

    const runtactics =(playable) =>{
        let cardIndex = 0;
        const playableCards = [];

        let strategy = Math.random();
        //if there are more than 2 cards in the discard deck
        // player only have 3 cards on hand now
        // the number of cards that the CPU have 2 times more than the player
        // the users has used power cards that are +2 or +4 wild
        // which means that the CPU needs to clear up the strongest card
        // the play has used 2 time in a row of powercards {
        if (discardDeck.length > 2 && 
            (strategy > 0.7 ||
            PLAYERHAND.length < 3 || 
            CPUHAND.length > (PLAYERHAND.length * 2) ||
            (discardDeck[discardDeck.length - 1].playedByPlayer === true && discardDeck[discardDeck.length - 1].drawValue > 0) || 
            (discardDeck[discardDeck.length - 1].playedByPlayer === true && discardDeck[discardDeck.length - 1].drawValue > 0))) {
            let highestValueCard = 0;
            for (let i = 0; playable.length; i++){
                if playable[i].value > highestValue) {
                    highestValue = playable[i].value
                    cardIndex = i
                }
            }
            // will play card determined by the strategy and remove it from the playable c
            chosenCard = playable.splice(cardIndex,1)
            console.log(chosenCard)

            // return playable to cpuhand
            returnPlayablesToHand()
        }
        else {
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

        return chosenCard[0]

        const returnPlayablesToHand=() =>{
            if (playable.length > 0) {
                for (const card of playable) {
                    cpuHand.push(card)
                }
            }
        }
    }
    
    const playCpuCard = (chosenCard) => {
        console.log(chosenCard);

        // Add the chosen card into the discard pile of cards
        discardDeck.push(chosenCard)
        updateDiscardPile()
    
        // check if the chosen card is wild card
        if(discardDeck[discardDeck.length - 1].color =='any' && discardDeck[discardDeck.length - 1].value === 0 && discardDeck[discardDeck.length - 1].playedByPlayer === false){
            chooseColorAfterWild();
        }

        // check cpuHand length and update cpuHandDom
        if (CPUHAND.length >= 1){
            showCpuBackCard()
            if (CPUHAND.length===1){
                showUno(CPUHAND);
            }
        }
        else {
            pointsCalculation()
            checkForWinners()
        }

        // if cpu played a +2 card
        if (chosenCard.drawValue > 0){
            for (let i = 0; i < chosenCard.drawValue; i++) {
                drawCard(PLAYERHAND)
            }
            checkChangeTurn()
        }

        else {
            setTimeout(checkChangeTurn,1000)
        }
        
        const checkChangeTurn = () => {
            if (chosenCard.changeTurn === true){
                console.log("CPU turn over")
                playerTurn = true;
                return
            }
            else{
                console.log("CPU turn")
                setTimeout(playCPU, delayTurn)
            }
        }


        const chooseColorAfterWild = () => {
            const colors = ['rgb(255, 6, 0)', 'rgb(0, 170, 69)', 'rgb(0, 150, 224)', 'rgb(255, 222, 0)']
            const colorsInHand = [0, 0, 0, 0]

            // cpu needs to check now many colors it has on hand
            for (const card of cpuHand) {
                if (card.color === colors[0]) {colorsInHand[0]++}
                if (card.color === colors[1]) {colorsInHand[1]++}
                if (card.color === colors[2]) {colorsInHand[2]++}
                if (card.color === colors[3]) {colorsInHand[3]++}
            }
            // find the index of the max value
            let indexOfMax = colorsInHand.indexOf(Math.max(...colorsInHand))

            // style the wild card and it's color
            // const wildCardDom = playPileDom.childNodes[0]
            // wildCardDom.style.border = '5px solid ' + colors[indexOfMax]
            // wildCardDom.style.width = '105px'
            playPile[playPile.length - 1].color = colors[indexOfMax]
        }
    }
    
}


/////////////////////////////////////////////////////////////////
//! USER GAME PLAY
//////////////////////////////////////////////////////////////
// this function is to extract the card that is chosen by the player and be placed into the discard deck
const playPlayerCard = (chosenCard) =>{
    let cardToPlay = PLAYERHAND.splice(chosenCard,1)
    let newSet = PLAYERHAND
    PLAYERHAND.length = 0;
    cardToPlay[0].playedByPlayer= true;
    discardDeck.push(cardToPlay[0]);
    for (let i = 0; i <newset.length; i++){
        PLAYERHAND.push(newset[i])
            PLAYERHAND[i].id = `${i}`
        }


    // show the latest card in the discard deck
    updateDiscardPile();
}

const playUser = () =>{
    let chosen = 0
    const $playerHand = $(".playerHandCard")
    $playerhand.on('click', (event) => {
        if (playerTurn == true && !colorPickerIsOpen){
            for (let i = 0; i< playerHand.length; i++){
                if(playerHand[i].id === `${event.currentTarget.id}`){
                    chosen = event.currentTarget.id);
                    // check if the card against the discardDeck
                    if(chosen[chosen].value === discardDeck[discardDeck.length - 1].value || 
                        chosen[chosen].value === discardDeck[discardDeck.length -]color === discardDeck[discardDeck.length - 1].color ||
                        chosen[chosen].value === discardDeck[discardDeck.length -]color === 'any'){

                            // the chosen card pass the first 3 criteria
                            playPlayerCard(chosen)

                            // let CPU drawCards if there are any powercards
                            letCpuDrawCards()

                            // check playerhand length and update DOM 
                            if(PLAYERHAND.length >= 1){                                                          // update player hand
                                showPlayerCard()
                                if(PLAYERHAND.length === 1) {
                                    showUno(PLAYERHAND);
                                }
                            else{
                                showPlayerCard();
                                pointsCalculation();
                                checkForWinners();
                                }
                            }
                        }
                        // check if CPU throws out a wildcard
                    if(discardDeck[discardDeck.length - 1].color === 'any' && discardDeck[discardDeck.length - 1].value === 0 && discardDeck[discardDeck.length - 1].playedByPlayer === false){
                        // Set new color
                        colorSelector();
                        return;
                        }
                        skipOrEndTurn();
                    else {
                        console.log("Please draw a card")
                        $('#Draw').on('click, ()') => {
                            drawCard(PLAYERHAND);
                            playerTurn = false;
                            setTimeout(playCPU, delayTurn)
                        }
                    }
                }
            }
        }
    }
}
const gameStart = () => {

    playerScore = 0;
    cpuScore = 0;

    if (!playerTurn) {
        settimeout(playCPU, delayTurn);

    playerUser();
    }
}
$(gameStart)