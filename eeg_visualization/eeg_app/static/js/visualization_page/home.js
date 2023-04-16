import {genSpheres} from './visualize.js';

let dbObj;

//Get the data from the database
function LoadDBData() {
    'use strict';
    const getRequest = new XMLHttpRequest();
    getRequest.open('GET', 'getdbdatawithjson', true);
    getRequest.send();
    getRequest.onreadystatechange = function() {
        if (getRequest.readyState == 4 && getRequest.status == 200) {
            let dbData = getRequest.response;
            BuildMenu(dbData);
        }
    }   
}

//Create the menu to select a scan
function BuildMenu(dbData) {
    dbObj = JSON.parse(dbData);
    const menuDiv = document.querySelector('#menu');

    for (var i = 0; i < Object.keys(dbObj).length; i++) {
        var cur = dbObj[Object.keys(dbObj)[i]];
        var scanName = cur["fields"]["scan_name"];
        var scanJson = cur["fields"]["scan_json"];
        var label = document.createElement("P");
        label.textContent = scanName;
        label.addEventListener('click', GenerateVisualization);    //anonymous function is used to pass variable
        menuDiv.appendChild(label);
    }
};

//Callback that gets the json for the scan name and calls genSpheres
function GenerateVisualization() {
    let jsonString = FindJsonByScanName(this.textContent);
    const scanName = document.querySelector('#scan-name');
    scanName.textContent = 'Scan Name: ' + this.textContent;
    genSpheres(jsonString);
};

//Search through the database object for the matching scan name
function FindJsonByScanName(scanName) {
    for (var i = 0; i < Object.keys(dbObj).length; i++) {
        var cur = dbObj[Object.keys(dbObj)[i]];
        var curScanName = cur["fields"]["scan_name"];
        if (curScanName === scanName) {
            let scanJson = cur["fields"]["scan_json"];
            return scanJson;
        }
    } 
}

function DownloadFile() {
    
}

LoadDBData();

const fileDownload = document.querySelector('#download-file'); //file input hidden button
fileSelector.addEventListener('change', DownloadFile);