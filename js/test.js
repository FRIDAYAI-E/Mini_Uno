let cars = [
    {
      "color": "purple",
      "type": "minivan",
      "registration": new Date('2017-01-03'),
      "capacity": 7
    },
    {
      "color": "red",
      "type": "station wagon",
      "registration": new Date('2018-03-03'),
      "capacity": 5
    },
]

let car = {
    "color": "red",
    "type": "cabrio",
    "registration": new Date('2016-05-02'),
    "capacity": 2
   }


let redCars = cars.filter(car => car.color !== car.color);
console.log(redCars);



let card = [{
'changeTurn': true,
'color': "rgb(255, 222, 0)",
'drawValue': 0,
'playedByPlayer': false,
'src': "images/yellow2.png",
'value': 2
}]

let cards = [ 
{   
'changeTurn': true,
'color': "rgb(255, 222, 0)",
'drawValue': 0,
'playedByPlayer': false,
'src': "images/yellow2.png",
'value': 2
},
{
'changeTurn': true,
'color': "rgb(255, 222, 0)",
'drawValue': 0,
'playedByPlayer': false,
'src': "images/yellow3.png",
'value': 3
},
{
    'changeTurn': true,
    'color': "rgb(255, 222, 0)",
    'drawValue': 0,
    'playedByPlayer': false,
    'src': "images/yellow4.png",
    'value': 4
    },
{
        'changeTurn': true,
        'color': "rgb(255, 222, 0)",
        'drawValue': 0,
        'playedByPlayer': false,
        'src': "images/blue4.png",
        'value': 4
        }
    
]

const updateHand = (hands,array,value,value2 ) => {
    //console.log(array)
    updatedCards = hands.filter(array => array.value !== value && array.src !== value2 )
    console.log(updatedCards)
}

updateHand(cards, card, 4, "images/yellow4.png")
