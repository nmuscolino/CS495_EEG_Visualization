import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    

export function genSpheres(coordinates) {
    var spheres = [];
    var coordinateObj = JSON.parse(coordinates);
    var coordinateObj2 = JSON.parse(coordinateObj);
    //something weird where i had to parse twice to get an object
    for (var i = 0; i < Object.keys(coordinateObj2).length; i++) {
        var cur = coordinateObj2[Object.keys(coordinateObj2)[i]];
        var sphere = new THREE.SphereGeometry(0.01, 32, 32); // (size, resolution.x, resolution.y)
        sphere.translate(cur[0]*5, cur[1]*5, cur[2]*5);  // Translate sphere to it's position
        sphere.name = Object.keys(coordinateObj2)[i];
        spheres.push(sphere);
    }
    createScene(spheres, coordinateObj2);
};

export function createScene(spheres, coordinateObj) {
        // Used to calculate the camera's starting position
        var minX = null;
        var maxX = null;
        var minY = null;
        var maxY = null;
        var startingZ = 5;

        for (var i = 0; i < Object.keys(coordinateObj).length; i++) {
            // Create a sphere
            var cur = coordinateObj[Object.keys(coordinateObj)[i]];
            console.log(cur[0]);
            console.log(cur[1]);
            console.log(cur[2])
            console.log(typeof cur[2]);

            // Initialize the bounds of the x coordinates with the first x-value
            if (minX == null && maxX == null) {
                minX = cur[0]; 
                maxX = cur[0];
            }
            // Update the bounds of the x coordinate as needed
            else if (cur[0] < minX) minX = cur[0];
            else if (cur[0] > maxX) maxX = cur[0];

            // Initialize the bounds of the y coordinates with the first y-value
            if (minY == null && maxX == null) {
                minY = cur[1]; 
                maxY = cur[1];
            }
            // Update the bounds of the y coordinates as needed
            else if (cur[1] < minY) minY = cur[1];
            else if (cur[1] > maxY) maxY = cur[1];
            
            // Update the starting z coordinate as needed
            if (cur[2] > startingZ) startingZ = cur[2] + 5;

            var sphere = new THREE.SphereGeometry(0.1, 32, 32); // (size, resolution.x, resolution.y)
            sphere.translate(cur[0], cur[1], cur[2]);  // Translate sphere to it's position
            sphere.name = Object.keys(coordinateObj)[i];
            spheres.push(sphere);
        }
        var startingX = (minX + maxX) / 2;
        var startingY = (minY + maxY) / 2;
        renderScene(startingX, startingY, startingZ, spheres);
}

function renderScene(startingX, startingY, startingZ, spheres) {
    // Create a group to hold the spheres
    console.log("in create scene");
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

    // Update the camera's starting position using the computed 
    camera.position.x = startingX;
    camera.position.y = startingY;
    camera.position.z = startingZ;
    console.log(camera.position.x);
    console.log(camera.position.y);
    console.log(camera.position.z); 

    // Set the renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Append the renderer to the body
    document.body.appendChild(renderer.domElement);

    
    // Camera sensitivity slider
    var sensSlider = document.getElementById("sensSlider");

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
        //controls.update();
        renderer.render(scene, camera);
    };

    render();
}   