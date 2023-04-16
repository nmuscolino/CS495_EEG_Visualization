const table = document.querySelector('#data-table');    //table tag

export function LoadTable() {
    'use strict';
    const getRequest = new XMLHttpRequest();
    getRequest.open('GET', 'getdbdata', true);
    getRequest.send();
    getRequest.onreadystatechange = function() {
        if (getRequest.readyState == 4 && getRequest.status == 200) {
            let dbData = getRequest.response;
            BuildTable(table, JSON.parse(dbData));
        }
    }
    return 1;
};

export function UpdateTable() {
    const nameOfFile = document.querySelector('#name-of-file');
    let scanName = nameOfFile.value;
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let monthString = (month < 10 ? "0" + month.toString() : month.toString());
    let day = date.getDate();
    let dayString = (day < 10 ? "0" + day.toString() : day.toString());
    let dateString = year.toString() + "-" + monthString + "-" + dayString;
    let rowData = [scanName, dateString, 'Uploading...', 'Delete'];
    let tr = CreateRow(rowData, 'td');
    table.insertBefore(tr, table.children[1]);
};

export function ChangeStatus(status) {
    table.children[1].children[2].textContent = status;
}

function CreateRow(rowData, type, scanID) {
    let tr = document.createElement('tr');
    let scanName = rowData[0];

    // Create the three columns always shown in the table
    for (let i = 0; i < 3; i++) {
        let col = document.createElement(type);
        col.appendChild(document.createTextNode(rowData[i]));
        tr.appendChild(col);
    }

    // Add the delete column
    let deleteCol = '';
    // If element is the header, label the column 'Delete'
    if (type == 'th') {
        deleteCol = document.createElement(type);
        deleteCol.appendChild(document.createTextNode('Delete'));
    }
    // If element is a td, create a link to delete a scan
    else if (type == 'td') {
        deleteCol = document.createElement('a');
        deleteCol.setAttribute('href', '/delete/' + scanID);
        deleteCol.onclick = function() {confirmation(scanName);};
        deleteCol.innerText = 'Delete';
    }
    tr.appendChild(deleteCol);

    return tr;
};

function BuildTable(table, data) {
    let headerData = ['Scan Name', 'Date Uploaded', 'Status', 'Delete'];
    table.appendChild(CreateRow(headerData, 'th'));
    for (let i = 0; i < Object.keys(data).length; i++) {
        let scanName = data[Object.keys(data)[i]].fields.scan_name;
        let date = data[Object.keys(data)[i]].fields.upload_date.substring(0, 10);
        let status = 'Ready';
        let rowData = [scanName, date, status];
        let scanID = data[Object.keys(data)[i]].pk;
        table.appendChild(CreateRow(rowData, 'td', scanID));
    }
};

// Confirm delete operation
function confirmation(scanName) {
    if (confirm("Delete this scan: " + scanName + "?")) {
        return true;
    } else {
        event.preventDefault();
        console.log("Cancelling deletion");
        return false;
    }
}