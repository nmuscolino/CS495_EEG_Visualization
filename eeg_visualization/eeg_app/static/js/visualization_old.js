/*
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

var text; //File data

// Setup File Input
const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', (event) => {
// Get selected files
const fileList = event.target.files;
var file = fileList[0]; // First file

// Create file reader
var fr = new FileReader();

// Load event
fr.addEventListener('load', () => {
    text = fr.result;
    console.log(text);  // Debug output
    genSpheres();       // Create spheres from data
    createScene();      // Create scene and handle events
});

fr.readAsText(file) // Calls 'load' event
});

// Create a global array for sphere objects
var spheres = [];

// Generate spheres from node data
function genSpheres() {
var nodes = text.split('\n');
// Create a sphere for each node
for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    
    // Extract name or ID
    var name = node.split(" ")[0];

    // Get Coordinate Data
    var coords = node.substring(node.indexOf("(") + 1, node.indexOf(")"));
    var xyz = coords.split(", "); //store values as array of strings

    // Convert each from string to float
    var x = parseFloat(xyz[0]);
    var y = parseFloat(xyz[1]);
    var z = parseFloat(xyz[2]);

    // Create a sphere
    var sphere = new THREE.SphereGeometry(0.1, 32, 32); // (size, resolution.x, resolution.y)
    sphere.translate(x, y, z);  // Translate sphere to it's position
    sphere.name = name;
    spheres.push(sphere);
}
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

*/