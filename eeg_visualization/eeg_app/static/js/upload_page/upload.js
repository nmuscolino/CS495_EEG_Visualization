import { GetRequestDbData, UpdateTable } from "./table.js";

//Declare Global Variables
let x, y, z, l, r, g, b;
let chunkCounter = 0;
let dbData;

//get important DOM elements
const table = document.querySelector('#data-table');    //table tag
const fileSelector = document.querySelector('#file-input'); //file input hidden button
const fileSelectButton = document.querySelector("#file-select-button"); //file input button shown
const fileNameLabel = document.querySelector("#file-name-label");  //displays the name of the file selected
const nameOfFile = document.querySelector('#name-of-file');     //gets the inputted name of the file
const uploadButton = document.querySelector('#upload-button'); // The button that triggers the upload

//Set up event listeners
nameOfFile.addEventListener('keyup', RemoveCharacters);     //Remove special characters from file name
nameOfFile.addEventListener('keydown', RemoveCharacters);   //Remove special characters from file name
uploadButton.addEventListener('click', UploadData);
fileSelector.addEventListener('change', ReadUploadedFile)


//Event listeners with short functions
fileSelectButton.addEventListener('click', function() {
    fileSelector.click();
});


//First things to do on page load
fileNameLabel.textContent = '';
GetRequestDbData();

















