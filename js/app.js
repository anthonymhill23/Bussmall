'use strict';
console.log('js file is connected');

// GLOBAL VARIABLES //
let imageElements = document.getElementsByTagName('img');
console.log('imageElements ', imageElements);

let productIndex1 = 0;
let productIndex2 = 1;
let productIndex3 = 2;
let rounds = 25;
let allProducts = [];

// CONSTRUCTOR FUNCTION //
function Product(name, imageURL, timesClicked, timesShown) {
  this.name = name;
  this.imageURL = imageURL;

  if (timesClicked) {
    this.timesClicked = timesClicked;
  } else {
    this.timesClicked = 0;
  }
  if (timesShown) {
    this.timesShown = timesShown;
  } else {
    this.timesShown = 0;
  }
  allProducts.push(this);
}

console.log(allProducts);

function getProductArray(nameOfThePropertyIWant) {
  let answer = [];
  for (let i = 0; i < allProducts.length; i++) {
    answer[i] = allProducts[i][nameOfThePropertyIWant];
  }
  console.log(answer);
  return answer;
}

let savedProductString = localStorage.getItem('savedProduct');

if (savedProductString) {
  let arrayOfNotProduct = JSON.parse(savedProductString);
  console.log('if condition what is our type ', arrayOfNotProduct);

  for (let j = 0; j < arrayOfNotProduct.length; j++) {
    new Product(
      arrayOfNotProduct[j].name,
      arrayOfNotProduct[j].imageURL,
      arrayOfNotProduct[j].timesClicked,
      arrayOfNotProduct[j].timesShown
    );
  }
} else {

  new Product('Bag', 'images/bag.jpg');
  new Product('Banana', 'images/banana.jpg');
  new Product('Bathroom', 'images/bathroom.jpg');
  new Product('Boots', 'images/boots.jpg');
  new Product('Breakfast', 'images/breakfast.jpg');
  new Product('Bubblegum', 'images/bubblegum.jpg');
  new Product('Chair', 'images/chair.jpg');
  new Product('Cthulhu', 'images/cthulhu.jpg');
  new Product('Dog-Dug', 'images/dog-duck.jpg');
  new Product('Dragon', 'images/dragon.jpg');
  new Product('Pen', 'images/pen.jpg');
  new Product('Pet-sweep', 'images/pet-sweep.jpg');
  new Product('Scissors', 'images/scissors.jpg');
  new Product('Shark', 'images/shark.jpg');
  new Product('Sweep', 'images/sweep.png');
  new Product('Tauntaun', 'images/tauntaun.jpg');
  new Product('Unicorn', 'images/unicorn.jpg');
  new Product('Water-can', 'images/water-can.jpg');
  new Product('Wine-Glass', 'images/wine-glass.jpg');
}

allProducts[0].timesShown = 1;
allProducts[1].timesShown = 1;

let totalClicks = 0;

function imageWasClicked(event) {
  totalClicks++;
  console.log('is this click working?');


  if (event.srcElement.id === '1') {
    allProducts[productIndex1].timesClicked++;
  } else if (event.srcElement.id === '2') {
    allProducts[productIndex2].timesClicked++;
  } else if (event.srcElement.id === '3') {
    allProducts[productIndex3].timesClicked++;
  }

  let nextProductIndex1 = Math.floor(Math.random() * allProducts.length);
  let nextProductIndex2 = Math.floor(Math.random() * allProducts.length);
  let nextProductIndex3 = Math.floor(Math.random() * allProducts.length);

  while ((nextProductIndex1 === productIndex1) ||
    (nextProductIndex1 === productIndex2) ||
    (nextProductIndex1 === productIndex3) ||
    (nextProductIndex1 === nextProductIndex2) ||
    (nextProductIndex1 === nextProductIndex3)) {
    nextProductIndex1 = Math.floor(Math.random() * allProducts.length);
  }
  while ((nextProductIndex2 === productIndex1) ||
    (nextProductIndex2 === productIndex2) ||
    (nextProductIndex2 === productIndex3) ||
    (nextProductIndex2 === nextProductIndex1) ||
    (nextProductIndex2 === nextProductIndex3)) {
    nextProductIndex2 = Math.floor(Math.random() * allProducts.length);
  }
  while ((nextProductIndex3 === productIndex1) ||
    (nextProductIndex3 === productIndex2) ||
    (nextProductIndex3 === productIndex3) ||
    (nextProductIndex3 === nextProductIndex2) ||
    (nextProductIndex3 === nextProductIndex1)) {
    nextProductIndex3 = Math.floor(Math.random() * allProducts.length);
  }

  productIndex1 = nextProductIndex1;
  productIndex2 = nextProductIndex2;
  productIndex3 = nextProductIndex3;

  imageElements[0].src = allProducts[productIndex1].imageURL;
  allProducts[productIndex1].timesShown++;

  imageElements[1].src = allProducts[productIndex2].imageURL;
  allProducts[productIndex2].timesShown++;

  imageElements[2].src = allProducts[productIndex3].imageURL;
  allProducts[productIndex3].timesShown++;

  if (totalClicks >= rounds) {

    localStorage.setItem('savedProduct', JSON.stringify(allProducts));

    let footerElement = document.getElementById('footer');

    if (footerElement.firstChildElement) {
      footerElement.firstChildElement.remove();
    }

    let asideUL = document.getElementById('voteResults');

    for (let i = 0; i < allProducts.length; i++) {
      let voteResultsListItem = document.createElement('li');
      voteResultsListItem.textContent = `${allProducts[i].name} was clicked on ${allProducts[i].timesClicked} times and was shown ${allProducts[i].timesShown} times `;
      asideUL.appendChild(voteResultsListItem);

      let percentageListItem = document.createElement('li');
      let math;
      if (allProducts[i].timesClicked === 0) {
        math = `zero click and shown ${allProducts[i].timesShown} times. Must be a bad product`;
      } else {
        math = Math.round(((allProducts[i]['timesClicked'] / allProducts[i]['timesShown']).toFixed(2) * 100)) + '%';
      }
      percentageListItem.textContent = `${allProducts[i].name} percentage of times clicked on vs. times shown is ${math}`;
      asideUL.appendChild(percentageListItem);
    }

    for (let i = 0; i < imageElements.length; i++) {
      imageElements[i].removeEventListener('click', imageWasClicked);
      console.log('is this thing working?');
    }
    runMyChartNow();
  }

}
for (let i = 0; i < imageElements.length; i++) {
  imageElements[i].addEventListener('click', imageWasClicked);
}


function runMyChartNow() {
  let ctx = document.getElementById('myChart').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: getProductArray('name'),
      datasets: [{
        label: '# of Votes',
        data: getProductArray('timesClicked'),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}