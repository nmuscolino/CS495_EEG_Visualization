import * as THREE from '../../ThreeJS/three.module.js';
import { OrbitControls } from '../../ThreeJS/OrbitControls.js';


    
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
    var spheres = [];
    var coordinateObj = JSON.parse(coordinates);
    const positions = Object.values(coordinateObj);


    // Iterate through data
    for (var i = 0; i < positions.length; i++) {
        const position = positions[i];

        // Extract coordinates
        var x = position[0];
        var y = position[1];
        var z = position[2];

        // Sphere parameters
        const sphereGeo = new THREE.SphereGeometry(0.0025, 32, 32);   // Size and resolution
        const sphereMat = new THREE.MeshBasicMaterial({color: 0xffffff});   // White color
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);    // Create mesh

        sphere.position.set(x, y, z);                   // Translate spheres
        sphere.name = Object.keys(coordinateObj)[i];    // Extract name
        spheres.push(sphere);                           // Add to spheres array
    }
    //Begin rendering the scene
    renderScene(coordinateObj, spheres);
};

function renderScene(coordObj, spheres) {
    // Create a group to hold the spheres
    var group = new THREE.Group();

    // Add each sphere to the group
    for (var i = 0; i < spheres.length; i++) {
        var sphere = spheres[i];
        group.add(sphere);
    }

    // Create a scene, camera, and renderer
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5; // Default camera sensitivity
    
    // Calculate camera starting position
    const center = setCamera(scene, coordObj, camera);
    
    // Prevent camera clipping spheres
    camera.near = 0.01;
    camera.updateProjectionMatrix();
    
    // Camera look at center of cluster
    controls.target = center;
    controls.saveState();

    // Rotate group (cluster) 90 degrees before adding to scene
    group.rotateX(-Math.PI / 2);
    group.position.y -= 0.3;
    group.position.add(center);
    
    // Add the group to the scene and setup default camera position
    scene.add(group);

    // Debug center point visualization
    // const testGeo = new THREE.SphereGeometry(0.01, 32, 32);   // Size and resolution
    // const testMat = new THREE.MeshBasicMaterial({color: 0x00ff00});   // Green color
    // const testSphere = new THREE.Mesh(testGeo, testMat);    // Create mesh
    // testSphere.position.set(center.x, center.y, center.z);
    // scene.add(testSphere);

    // Save default camera postion and rotation
    const initialCamPos = camera.position.clone();
    const initialCamRot = camera.rotation.clone();

    // Append the scene to the correct div and replace old one if necessary
    const sceneDiv = document.querySelector('#visualization');
    
    // Set the renderer size
    renderer.setSize(sceneDiv.clientWidth, sceneDiv.clientHeight);
    
    if (sceneDiv.hasChildNodes()) {
        let oldChild = sceneDiv.childNodes[0];
        sceneDiv.replaceChild(renderer.domElement, oldChild);
    }
    else {
        sceneDiv.appendChild(renderer.domElement);
    }
    
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
        const sceneDiv = document.querySelector('#visualization');
        const width = sceneDiv.clientWidth;
        const height = sceneDiv.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix(); // Update camera position
        renderer.setSize(width, height); // Update scene size to match window
    });
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('mousemove', (event) => {
        // Normalize device coordinates (-1 to 1)
        // Since renderer is not full-size normalize using coordinates of its bounding box
        var rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;       
        mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;       
    });

    // Render scene
    var render = function () {
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

        requestAnimationFrame(render);
        controls.update();
        renderer.render(scene, camera);
    };
    
    render();
}   


function setCamera(scene, coordinateObj, camera) {
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
    
    // Debug bounding box visualization
    // const geometry = new THREE.BufferGeometry().setFromPoints(posVectors);
    // const bboxHelper = new THREE.BoxHelper(new THREE.Mesh(geometry), 0x0000ff);
    // scene.add(bboxHelper)

    //Calculate distance from center of cluster (bounding box) to the camera
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    var distance = Math.abs(maxDim / 4 * Math.tan(fov * 2));

    distance *= 0.9;   // Add offset to back camera up a bit

    camera.position.z = distance;   // Set camera position

    return center;
}