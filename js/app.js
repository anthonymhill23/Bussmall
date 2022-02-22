'use strict'
const allImageOptions = document.getElementById('image-options');

const glob = {
    count: 0,
    leftImage: undefined,
    centerImage: undefined,
    rightImage: undefined,
    usedImagesArray: []
}

function Product(name, url) {
    this.name = name;
    this.url = url;
    this.timesShown = 0;
    this.timesClicked = 0;

    Product.productArray.push(this);
}


Product.productArray = [];

// renders images, specifically if there are no images stored in local storage

let imageCreator = function () {
    new Product('bag', 'assets/bag.jpg');
    new Product('banana', 'assets/banana.jpg');
    new Product('bathroom', 'assets/bathroom.jpg');
    new Product('boots', 'assets/boots.jpg');
    new Product('breakfast', 'assets/breakfast.jpg');
    new Product('bubblegum', 'assets/bubblegum.jpg');
    new Product('chair', 'assets/chair.jpg');
    new Product('cthulhu', 'assets/cthulhu.jpg');
    new Product('dog-duck', 'assets/dog-duck.jpg');
    new Product('dragon', 'assets/dragon.jpg');
    new Product('pen', 'assets/pen.jpg');
    new Product('pet-sweep', 'assets/pet-sweep.jpg');
    new Product('scissors', 'assets/scissors.jpg');
    new Product('shark', 'assets/shark.jpg');
    new Product('sweep', 'assets/sweep.jpg');
    new Product('tauntaun', 'assets/tauntaun.jpg');
    new Product('unicorn', 'assets/unicorn.jpg');
    new Product('water-can', 'assets/water-can.jpg');
    new Product('wine-glass', 'assets/wine-glass.jpg');
}

// picks a random image from NewImage.imageArray

let randomizer = function () {
    let imageGenerated = Product.productArray[Math.floor(Math.random() * (Product.productArray.length))]
    return imageGenerated;
}

// renders 3 images from NewImage.imageArray, that are generated with randomizer and checked with isNewChecker

let imageRenderer = function () {
    let tempArrayImages = [];
    let numGeneratedImages = 3;
    const firstImageTag = document.getElementById('first-image');
    const secondImageTag = document.getElementById('second-image');
    const thirdImageTag = document.getElementById('third-image');

    for (let i = 0; i < numGeneratedImages; i += 1) {
        if (i === 0) {
            glob.leftImage = imageIsNewChecker(glob.leftImage);
            firstImageTag.src = glob.leftImage.url;
            tempArrayImages[i] = glob.leftImage;
            glob.leftImage.timesShown++;
        } else if (i === 1) {
            glob.centerImage = imageIsNewChecker(glob.centerImage, glob.leftImage);
            secondImageTag.src = glob.centerImage.url;
            tempArrayImages[i] = glob.centerImage;
            glob.centerImage.timesShown++;
        } else if (i === 2) {
            glob.rightImage = imageIsNewChecker(glob.rightImage, glob.leftImage, glob.centerImage);
            thirdImageTag.src = glob.rightImage.url;
            tempArrayImages[i] = glob.rightImage;
            glob.rightImage.timesShown++;
        }
    }
    glob.usedImagesArray = tempArrayImages;
}

// this handles the clicks of both the 3 images and tallying votes AND the click of the submission, which renders column, chart, and stores data locally

let handleClick = function (event) {
    let num = 25;
    const id = event.target.id;

    if (glob.count < num) {
        if (id === 'first-image') {
            glob.leftImage.timesClicked += 1;
        } else if (id === 'second-image') {
            glob.centerImage.timesClicked += 1;
        } else if (id === 'third-image') {
            glob.rightImage.timesClicked += 1;
        } else {
            alert("please click an image option, you've been docked a vote");
        }
        glob.count += 1;
    }

    if (glob.count === num) {
        allImageOptions.removeEventListener('click', handleClick);

        const appender = document.getElementById('append-here')
        const addButton = document.createElement('button');
        addButton.setAttribute('id', 'button');
        addButton.textContent = 'Submit Results';
        appender.appendChild(addButton);
        const sumbitButton = document.getElementById('button');
        sumbitButton.addEventListener('click', submitButtonHandle);
        return;
    }
    imageRenderer();
}

// takes totals stored in each image object and renders them to left column on screen

let renderTotalsColumn = function () {
    let index = 0;

    Product.productArray.forEach(element => {
        let list = document.getElementById('append-list');
        let listItem = document.createElement('li');
        listItem.setAttribute('id', `list-item${index}`);
        list.appendChild(listItem);
        let tempName = element.name;
        let timesClicked = element.timesClicked;
        let timesShown = element.timesShown;
        listItem.textContent = `- ${tempName} was clicked ${timesClicked}/${timesShown} times shown`
        index += 1;
    })
}


// checks image object to ensure it is 1) not one that was previously shown and 2) not one of the other images currently rendered

let imageIsNewChecker = function (valueToCheck, cantBeThis, cantBeThisEither) {
    valueToCheck = randomizer();

    while (glob.usedImagesArray.includes(valueToCheck) || valueToCheck === cantBeThis || valueToCheck === cantBeThisEither) {
        valueToCheck = randomizer();
    }
    return valueToCheck;

}

// simply packages all functions for the sumbit button into one event for the sumbit button eventHandler

let submitButtonHandle = function () {
    renderTotalsColumn();
    renderChart();
    storeData();
    const submitButton = document.getElementById('button');
    submitButton.removeEventListener('click', submitButtonHandle);
}

let renderChart = function () {

    const imageNamesArray = [];
    const imageVotesArray = [];
    const ImageShownArray = [];

    for (let i = 0; i < Product.productArray.length; i += 1) {
        const image = Product.productArray[i];

        const singleImageName = image.name;
        imageNamesArray.push(singleImageName);

        const singleImageVotes = image.timesClicked;
        imageVotesArray.push(singleImageVotes);

        const singleImageShown = image.timesShown;
        ImageShownArray.push(singleImageShown);
    }


    // chart info , layout and build

    const ctx = document.getElementById('results-chart').getContext('2d');
    const imageChart = new Chart(ctx, {

        type: 'bar',


        data: {
            labels: imageNamesArray,
            datasets: [{
                label: 'Image Votes',
                borderColor: '#F2C078',
                backgroundColor: '#345995',
                hoverBackgroundColor: '#F2C078',
                data: imageVotesArray
            }, {
                label: 'Times Image Was Shown',
                borderColor: '#F2C078',
                backgroundColor: '#CA1551',
                hoverBackgroundColor: '#3A2E39',
                data: ImageShownArray
            }]
        },

        options: {
            scales: {
                yAxis: [{
                    ticks: {
                        beginAtZero: true
                    },
                    stacked: true
                }],
                xAxis: [{
                }]
            }
        }
    })
}

let storeData = function () {
                    const imageJSON = JSON.stringify(Product.productArray);
                    localStorage.setItem('images', imageJSON);
                }

// renders images, specifically based off the data stored locally


let imageRecreater = function (imageJSON) {
                    const rawImages = JSON.parse(imageJSON);

                    rawImages.forEach(element => {
                        let singleObject = new Product(element.name, element.url);
                        singleObject.timesClicked = element.timesClicked;
                        singleObject.timesShown = element.timesShown;
                    })
                }

let imageProduction = function () {

                    const imageJSON = localStorage.getItem('images');
                    if (imageJSON) {
                        imageRecreater(imageJSON);
                    } else {
                        imageCreator();
                    }
                }
imageProduction();

imageRenderer();
allImageOptions.addEventListener('click', handleClick);



