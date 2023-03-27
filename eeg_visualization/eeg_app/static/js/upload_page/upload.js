import { LoadTable } from "./table.js";
import { RemoveCharacters, SelectFile, PrepareForUpload} from "./interactivity.js";
import {UploadData} from "./uploadfunctionality.js";


const nameOfFile = document.querySelector('#name-of-file');
nameOfFile.addEventListener('keyup', RemoveCharacters);     //Remove special characters from file name
nameOfFile.addEventListener('keydown', RemoveCharacters);   //Remove special characters from file name


const fileSelectButton = document.querySelector("#file-select-button"); //file input button shown
fileSelectButton.addEventListener('click', SelectFile);

const fileSelector = document.querySelector('#file-input'); //file input hidden button
fileSelector.addEventListener('change', PrepareForUpload);

const uploadButton = document.querySelector('#upload-button'); // The button that triggers the upload
uploadButton.addEventListener('click', UploadData);

LoadTable();

















