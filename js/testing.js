// //* variables 

const cpuHand = []; 
const playerHand = [];

const drawDeck = [];
const discardDeck =[];

let cpuScore = 0;
let playerScore = 0;


//* Variables to change during the game
let playerTurn = true;
let colorPicker = false;
let cpuDelay = Math.floor((Math.random() * cpuHand.length * 200) + 1500);


//* Cards & DrawDecks =======================================
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
    const $cpubox = $('<div>').addClass('cpu-box');
    const $cpuCard = $('<div>').addCalss('cpu-hand');
    const $h3 = $('<h3>').text(`CPU cards: ${cpuHand.length}`);
    $cpubox.append($h3);

    for (i = 0; i < 7; i++){
        // #region GAME behaviors
        cpuHand.push(drawDeck.shift());
        playerHand.push(drawDeck.shift());

        // place image in the front-end for the cpu (back-face of the uno card)





        // place image on the front-end for the player(front-end of the uno card based on the value)


    }
    // show the number of cards that is on the CPU hand
    $('#cpuNumberCards').text(cpuHand.length);
    console.log(cpuHand.length) //TODO to be commented out
    console.log(playerHand.length) //TODO to be commented out
    console.log(drawDeck.length) //TODO to be commented out
}

const startPlayDiscard = () =>{
    for(let i = 0; i < drawDeck.length; i++ ){
        if( drawDeck[i].color !=="any" && drawDeck[i].value <9){
            //being playing the game with the first valid card
            discardDeck.push(drawDeck[i])
            drawDeck.splice(i,1)
            break
        }
    }
    console.log(discardDeck)
    console.log(drawDeck.length)

    // set played card with the correct image

}



createDeck()
shuffleDeck(drawDeck)
dealCards()
startPlayDiscard()




















// 




// const main =() =>{


//  }

//  $(main)
