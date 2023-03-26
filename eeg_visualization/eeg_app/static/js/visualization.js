import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    
export function resetCamera(camera, pos, rot, controls) {
    controls.reset();           // Reset controls (resets panning changes)
    camera.position.copy(pos);  // Reset camera position
    camera.rotation.copy(rot);  // Reset camera rotation
};

export function genSpheres(coordinates) {
    var spheres = [];
    var coordinateObj = JSON.parse(coordinates);
    for (var i = 0; i < Object.keys(coordinateObj).length; i++) {
        var cur = coordinateObj[Object.keys(coordinateObj)[i]];
        var sphere = new THREE.SphereGeometry(0.01, 32, 32); // (size, resolution.x, resolution.y)
        sphere.translate(cur[0]*5, cur[1]*5 - 0.3, cur[2]*5 - 1);  // Translate sphere to it's position (-0.3 on the x axis and -1 on the z centers the cluster)
        sphere.name = Object.keys(coordinateObj)[i];
        spheres.push(sphere);
    }
    createScene(spheres, coordinateObj);
};

export function createScene(spheres, coordinateObj) {
    // Used to calculate the camera's starting position
    var minX = null;
    var maxX = null;
    var minY = null;
    var maxY = null;
    var startingZ = 2;  // Initial camera zoom

    for (var i = 0; i < Object.keys(coordinateObj).length; i++) {
        // Create a sphere
        var cur = coordinateObj[Object.keys(coordinateObj)[i]];

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
    }
    // Average min and max values
    var startingX = (minX + maxX) / 2;
    var startingY = (minY + maxY) / 2;
    renderScene(startingX, startingY, startingZ, spheres);
}

function renderScene(startingX, startingY, startingZ, spheres) {
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
    controls.rotateSpeed = 0.5; // Default camera sensitivity

    // Rotate group (cluster) 90 degrees before adding to scene
    group.rotation.x = - (Math.PI / 2);

    // Add the group to the scene and setup default camera position
    scene.add(group);

    // Update the camera's starting position using the computed values
    camera.position.x = startingX;
    camera.position.y = startingY;
    camera.position.z = startingZ;
    camera.lookAt(new THREE.Vector3(0, 0, 0));  // Camera faces origin

    // Save default camera postion and rotation
    const initialCamPos = camera.position.clone();
    const initialCamRot = camera.rotation.clone();

    // Set the renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Append the renderer to the body
    document.body.appendChild(renderer.domElement);
    
    // Camera sensitivity slider
    var sensSlider = document.getElementById("sensSlider");

    //Update mouse sensitivity when slider is released
    sensSlider.addEventListener("mouseup", function() {
        controls.rotateSpeed = sensSlider.value * 0.1;
    })

    // Camera reset button
    var resetButton = document.getElementById("camera-reset");

    resetButton.addEventListener("click", function() {
        resetCamera(camera, initialCamPos, initialCamRot, controls);
    })

    // Listen for window resize events
    window.addEventListener("resize", (event) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix(); // Update camera position
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