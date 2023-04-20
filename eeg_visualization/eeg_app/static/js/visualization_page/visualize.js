import * as THREE from '../../ThreeJS/three.module.js';
import { OrbitControls } from '../../ThreeJS/OrbitControls.js';

// Global Variables
let scene, camera, renderer, controls, group;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
    renderer = new THREE.WebGLRenderer();

    // Append the scene to the correct div and replace old one if necessary
    const sceneDiv = document.querySelector('#visualization');
    
    if (sceneDiv.hasChildNodes()) {
        let oldChild = sceneDiv.childNodes[0];
        sceneDiv.replaceChild(renderer.domElement, oldChild);
    }
    else {
        sceneDiv.appendChild(renderer.domElement);
    }

    renderer.setSize(sceneDiv.clientWidth, sceneDiv.clientHeight);  // Set the renderer size

    //Set up controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;

    // EVENT LISTENERS
    // Camera sensitivity slider
    var sensSlider = document.getElementById("sensSlider");

    //Update mouse sensitivity when slider is released
    sensSlider.addEventListener("mouseup", function() {
        controls.rotateSpeed = sensSlider.value * 0.1;
    })

    // Save default camera postion and rotation
    const initialCamPos = camera.position.clone();
    const initialCamRot = camera.rotation.clone();

    // Camera reset button
    var resetButton = document.getElementById("camera-reset");

    resetButton.addEventListener("click", function() {
        resetCamera(camera, initialCamPos, initialCamRot, controls);
    })
    
    // Listen for window resize events
    window.addEventListener("resize", (event) => {
        const sceneDiv = document.querySelector('#visualization');
        const width = sceneDiv.clientWidth;
        const height = sceneDiv.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix(); // Update camera position
        renderer.setSize(width, height); // Update scene size to match window
    });

    window.addEventListener('mousemove', (event) => {
        // Normalize device coordinates (-1 to 1)
        // Since renderer is not full-size normalize using coordinates of its bounding box
        var rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;       
        mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;       
    });
}

// Group memory management
function createGroup(spheres) {
    const group = new THREE.Group();
    for (var i = 0; i < spheres.length; i++) {
        group.add(spheres[i]);  // Add each sphere to new group
    }
    return group;
}

// Clear group
function resetGroup() {
    if (group) {
        scene.remove(group);
    }
}

function animate() {
    // Update ray position
    raycaster.setFromCamera(mouse, camera);
        
    // Get intersection objects
    const intersections = raycaster.intersectObjects(scene.children);
    if (intersections.length > 0 && intersections[0].object instanceof THREE.Mesh) {
        var obj = intersections[0].object;
        obj.material.color.set(0xff0000);   // Color change on select (red)

        // Extract electrode data
        const xPos = obj.position.x;
        const yPos = obj.position.y;
        const zPos = obj.position.z;
        const name = obj.name;
        
        // Log data to console
        //console.log("Name: ", name, " Position: ", xPos, ", ", yPos, ", ", zPos);
        UpdateCoordinates(name, xPos, yPos, zPos);

        // Change selected sphere color back to white
        // setTimeout adds function call to the end of the js task queue
        setTimeout(function(){ obj.material.color.set(0xffffff); }, 0);
    }
    else {
        ResetCoordinates();
    }

    // Call 'animate' again (render loop)
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

export function resetCamera(camera, pos, rot, controls) {
    controls.reset();           // Reset controls (resets panning changes)
    camera.position.copy(pos);  // Reset camera position
    camera.rotation.copy(rot);  // Reset camera rotation
};

function UpdateCoordinates(name, xPos, yPos, zPos) {
    if (xPos < 0) xPos = String(xPos).substring(0, 6);
    else {
        xPos = String(xPos).substring(0, 5);
        xPos = ' ' + xPos;
    }

    if (yPos < 0) yPos = String(yPos).substring(0, 6);
    else {
        yPos = String(yPos).substring(0, 5);
        yPos = ' ' + yPos;
    }
    
    if (zPos < 0) zPos = String(zPos).substring(0, 6);
    else {
        zPos = String(zPos).substring(0, 5);
        zPos = ' ' + zPos;
    }

    if (name.length == 1) name = name + '   ';
    else if (name.length == 2) name = name + '  ';
    else if (name.length == 3) name = name + ' ';

    document.querySelector('#node-name').textContent = 'Electrode Name: ' + name + '   ';
    document.querySelector('#x-coord').textContent = 'X: ' + xPos + '   ';
    document.querySelector('#y-coord').textContent = 'Y: ' + yPos + '   ';
    document.querySelector('#z-coord').textContent = 'Z: ' + zPos + '   ';

    document.querySelector('#node-name').style.color = 'red';
    document.querySelector('#x-coord').style.color = 'red';
    document.querySelector('#y-coord').style.color = 'red';
    document.querySelector('#z-coord').style.color = 'red';


}

function ResetCoordinates() {
    document.querySelector('#node-name').textContent = 'Electrode Name:        ';
    document.querySelector('#x-coord').textContent = 'X:          ';
    document.querySelector('#y-coord').textContent = 'Y:          ';
    document.querySelector('#z-coord').textContent = 'Z:          ';

    document.querySelector('#node-name').style.color = 'white';
    document.querySelector('#x-coord').style.color = 'white';
    document.querySelector('#y-coord').style.color = 'white';
    document.querySelector('#z-coord').style.color = 'white';
}

export function genSpheres(coordinates) {
    var coordinateObj = JSON.parse(coordinates);
    const positions = Object.values(coordinateObj);
    var spheres = [];

    // Iterate through data
    for (var i = 0; i < positions.length; i++) {
        const position = positions[i];

        // Sphere parameters
        const sphereGeo = new THREE.SphereGeometry(0.0025, 32, 32);   // Size and resolution
        const sphereMat = new THREE.MeshBasicMaterial({color: 0xffffff});   // White color
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);    // Create mesh
        sphere.position.set(position[0], position[1], position[2]);                   // Translate spheres
        sphere.name = Object.keys(coordinateObj)[i];    // Extract name
        spheres.push(sphere);                           // Add to spheres array
    }
    
    // Update group object
    resetGroup();
    group = createGroup(spheres);
    scene.add(group);

    // Reorient and center the cluster of points
    const center = setCamera(coordinateObj, camera);    // Calculate initial camera position
    controls.target = center;                           // Point camera at center of cluster
    controls.saveState();                               // Update controls
    rotateObject(group, center);                        // Rotate group -90 degrees on x-axis
};

function setCamera(coordinateObj, camera) {
    const positions = Object.values(coordinateObj);
    var posVectors = [];

    // Create three.js vectors for each position
    for (var i = 0; i < positions.length; i++) {
        var currPos = positions[i];
        var x = currPos[0];
        var y = currPos[1];
        var z = currPos[2];
        var vector = new THREE.Vector3(x, y, z);
        posVectors.push(vector);
    }

    // Set up bounding box
    const boundingBox = new THREE.Box3().setFromPoints(posVectors);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());

    //Calculate distance from center of cluster (bounding box) to the camera
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    var distance = maxDim / 2 / Math.tan(fov / 2);

    distance *= 1.7;   // Add offset to back camera up a bit

    camera.position.z = center.z - distance;   // Set camera position

    return center;
}

function rotateObject(object, center) {
    object.rotateX(-Math.PI / 2);   // Rotate object 90 degrees on the x-axis
    object.position.y -= center.z;  // Account for center point offset
    object.position.add(center);    // Translate object back to center point
}

init();
animate();