// Linking the main page to the CSS





//* variables ===============================================
const cpuHand = [];
const playerHands = [];

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














// const main =() =>{

// }

// $(main)
