import {genSpheres} from './visualization.js';


const visualize_button = document.querySelector('#visualize-button');
visualize_button.addEventListener('click', Get);

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