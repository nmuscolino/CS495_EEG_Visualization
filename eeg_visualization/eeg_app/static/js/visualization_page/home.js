import {genSpheres} from './visualization.js';

const visualize_button = document.querySelector('#visualize-button');
visualize_button.addEventListener('click', Get);

const button1 = document.querySelector('#button1');
button1.addEventListener("click", () => { GetWithID('19') });

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