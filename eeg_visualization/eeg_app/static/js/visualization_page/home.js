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
    let name = document.querySelector('#scan-name').textContent;
    if (name == 'Scan Name:') {
        return;
    }
    name = name.split(' ');
    name = name[2];
    

    let json = FindJsonByScanName(name);
    let jsonObj = JSON.parse(json);

    let text = '';
        
    for (var i = 0; i < Object.keys(jsonObj).length; i++) {
        let scanName = Object.keys(jsonObj)[i];
        let data = jsonObj[scanName];

        let xPos = data[0];
        if (xPos < 0) xPos = String(xPos).substring(0, 6);
        else {
            xPos = String(xPos).substring(0, 5);
            xPos = ' ' + xPos;
        }

        let yPos = data[1];
        if (yPos < 0) yPos = String(yPos).substring(0, 6);
        else {
            yPos = String(yPos).substring(0, 5);
            yPos = ' ' + yPos;
        }
        
        let zPos = data[2];
        if (zPos < 0) zPos = String(zPos).substring(0, 6);
        else {
            zPos = String(zPos).substring(0, 5);
            zPos = ' ' + zPos;
        }
    
        text = text + scanName + '\t' + xPos + '\t' + yPos + '\t' + zPos + '\n';
    }

    let fname = name + '.txt';
    const a = document.querySelector('#download');
    a.setAttribute('href', 'data:text/plain; charset=utf-8,' + encodeURIComponent(text));
    a.setAttribute('download', fname);
    a.click();
}

LoadDBData();

const fileDownload = document.querySelector('#download-file'); //file input hidden button
fileDownload.addEventListener('click', DownloadFile);