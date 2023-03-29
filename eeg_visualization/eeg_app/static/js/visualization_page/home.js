import {genSpheres} from './visualize.js';

//const button1 = document.querySelector('#button1');
//button1.addEventListener("click", () => { GetWithID('18') });
let dbObj;

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

function BuildMenu(dbData) {
    dbObj = JSON.parse(dbData);


    const menuDiv = document.querySelector('#menu');

    for (var i = 0; i < Object.keys(dbObj).length; i++) {
        var cur = dbObj[Object.keys(dbObj)[i]];
        var scanName = cur["fields"]["scan_name"];
        var scanJson = cur["fields"]["scan_json"];
        var label = document.createElement("P");
        label.textContent = scanName;
        label.addEventListener('click', () => {genSpheres(scanJson)});    //anonymous function is used to pass variable
        menuDiv.appendChild(label);
    }
};

LoadDBData();







/*
function Get() {
    'use strict';
    const getRequest = new XMLHttpRequest();
    getRequest.open('GET', 'getvisualizationdata', true);
    getRequest.send();

    getRequest.onreadystatechange = function() {
        if (getRequest.readyState == 4 && getRequest.status == 200) {
            var coordinates = getRequest.response;
            genSpheres(coordinates);
        }
    }
};

function GetWithID(id) {
    'use strict';
    const getRequest = new XMLHttpRequest();
    let path = 'getjsonfromdb/' + id;
    console.log(path);

    getRequest.open('GET', path, true);
    getRequest.send();

    getRequest.onreadystatechange = function() {
        if (getRequest.readyState == 4 && getRequest.status == 200) {
            var coordinates = getRequest.response;
            console.log(coordinates);
            genSpheres(coordinates);
        }
    }
};

*/