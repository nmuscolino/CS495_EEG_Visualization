import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

var fileToSend = "";

const file_element = document.getElementById('file-button');
file_element.addEventListener("change", function () {
    console.log("in outer fun");
    const reader = new FileReader();
    reader.onload = function() {
        console.log("here");
        fileToSend = reader.result;
        console.log(fileToSend);
        //Post();
    }
    reader.readAsDataURL(file_element.files[0]);
    //maybe read as text for the actual file?
});


function Post() {
    console.log("in post");
    if (fileToSend == "") {
        console.log("No file selected");
        return;
    }
    'use strict';
    const request = new XMLHttpRequest();
    request.open('POST', 'postdata', true);
    request.send(fileToSend);
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            genSpheres(request.response);
        }
    }
};


//global array for spheres
var spheres = [];

// Generate spheres from node data
function genSpheres(coordinates) {
        console.log("in genSpheres");
        //console.log(coordinates);
        //console.log(typeof coordinates);
        const coordinateObj = JSON.parse(coordinates);
        //console.log(coordinateObj);
        //console.log(typeof coordinateObj);

        //console.log(Object.keys(coordinateObj).length);

        for (var i = 0; i < Object.keys(coordinateObj).length; i++) {
             // Create a sphere
             var cur = coordinateObj[Object.keys(coordinateObj)[i]];
             //console.log(cur[0]);
             //console.log(cur[1]);
             //console.log(typeof cur[2]);

            var sphere = new THREE.SphereGeometry(0.1, 32, 32); // (size, resolution.x, resolution.y)
            sphere.translate(cur[0], cur[1], cur[2]);  // Translate sphere to it's position
            sphere.name = Object.keys(coordinateObj)[i];
            spheres.push(sphere);
        }
        createScene();
}

function createScene() {
    // Create a group to hold the spheres
    var group = new THREE.Group();

    // Add each sphere to the group
    for (var i = 0; i < spheres.length; i++) {
        var sphere = spheres[i];
        var mesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffffff })); //white sphere mesh
        group.add(mesh);
    }

    // Create a scene, camera, and renderer
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);
    var leftButtonDown = false; // Left mouse button flag
    controls.rotateSpeed = 0.5; // Default camera sensitivity

    // Add the group to the scene and setup default camera position
    scene.add(group);
    camera.position.z = 5; 

    // Set the renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Append the renderer to the body
    document.body.appendChild(renderer.domElement);

    // Camera sensitivity slider
    var sensSlider = document.getElementById("sensSlider");

    // Prevent moving camera when using slider
    sensSlider.addEventListener("mousedown", function() {
        controls.rotateSpeed = 0.0;
    });

    //Update mouse sensitivity when slider is released
    sensSlider.addEventListener("mouseup", function() {
        controls.rotateSpeed = sensSlider.value * 0.1;
    });

    // Listen for mouse wheel events
    window.addEventListener("wheel", (event) => {
        event.preventDefault();   // FIXME: Doesn't prevent page scrolling
        var delta = event.deltaY; // Changes sign depending on scroll direction

        // Zoom in or out
        camera.position.z += delta * 0.01;
    });

    const resizeUpdateInterval = 500;

    // Listen for window resize events
    window.addEventListener("resize", (event) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix(); // Update camera positioning
        renderer.setSize(width, height); // Update scene size to match window
    });

    // Render scene
    var render = function () {
        requestAnimationFrame(render);
        controls.update();
        renderer.render(scene, camera);
    };

    render();
}    