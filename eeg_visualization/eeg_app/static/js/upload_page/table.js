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

    // Create the three columns always shown in the table
    for (let i = 0; i < 3; i++) {
        let col = document.createElement(type);
        col.appendChild(document.createTextNode(rowData[i]));
        tr.appendChild(col);
    }

    // If user is an admin, add delete column
    let deleteCol = '';
    // If element is the header, label the column 'Delete'
    if (type == 'th') {
        deleteCol = document.createElement(type);
        deleteCol.appendChild(document.createTextNode('Delete'));
    }
    // If element is a td, create a link to delete a scan
    else if (type == 'td') {
        deleteCol = document.createElement('a');
        deleteCol.setAttribute('href', '/delete/' + scanID); // Update to delete view after adding it
        deleteCol.innerText = 'Delete';
    }
    tr.appendChild(deleteCol);
    
    console.log(tr);

    return tr;
};


function BuildTable(table, data) {
    // Change depending on whether user is an admin
    let headerData = ['Scan Name', 'Date Uploaded', 'Status', 'Delete'];
    table.appendChild(CreateRow(headerData, 'th'));
    for (let i = 0; i < Object.keys(data).length; i++) {
        //let scanName = Object.keys(data)[i];
        //let date = data[Object.keys(data)[i]][0];
        //let status = data[Object.keys(data)[i]][1];
        let scanName = data[Object.keys(data)[i]].fields.scan_name;
        let date = data[Object.keys(data)[i]].fields.upload_date.substring(0, 10);
        let status = 'Ready';
        let rowData = [scanName, date, status];
        let scanID = data[Object.keys(data)[i]].pk;
        table.appendChild(CreateRow(rowData, 'td', scanID));
    }
};