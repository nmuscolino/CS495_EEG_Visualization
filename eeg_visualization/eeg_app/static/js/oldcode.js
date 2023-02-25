/*

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
    //}
}

*/