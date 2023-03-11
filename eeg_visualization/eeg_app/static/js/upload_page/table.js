export function GetRequestDbData() {
    'use strict';
    const getRequest = new XMLHttpRequest();
    getRequest.open('GET', 'getdbdata', true);
    getRequest.send();
    getRequest.onreadystatechange = function() {
        if (getRequest.readyState == 4 && getRequest.status == 200) {
            dbData = getRequest.response;
            CreateTable(table, JSON.parse(dbData));
        }
    }
};

export function UpdateTable() {
    let scanName = nameOfFile.value;
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let status = 'Uploading...';
    let dateString = month.toString() + "/" + day.toString() + "/" + year.toString();
    let rowData = [scanName, dateString, status];
    let tr = CreateRow(rowData);
    table.insertBefore(tr, table.children[1]);
    nameOfFile.value = '';
};

function CreateRow(rowData) {
    let tr = document.createElement('tr');
    for (let i = 0; i < 3; i++) {
        let td = document.createElement('td');
        td.appendChild(document.createTextNode(rowData[i]));
        tr.appendChild(td);
    }
    return tr;
};

function CreateHeader(headerData) {
    let tr = document.createElement('tr');
    for (let i = 0; i < 3; i++) {
        let th = document.createElement('th');
        th.appendChild(document.createTextNode(headerData[i]));
        tr.appendChild(th);
    }
    return tr;
};

function CreateTable(table, data) {
    let headerData = ['Scan Name', 'Date Uploaded', 'Status'];
    table.appendChild(CreateHeader(headerData));
    for (let i = 0; i < Object.keys(data).length; i++) {
        let scanName = Object.keys(data)[i];
        let date = data[Object.keys(data)[i]][0];
        let status = data[Object.keys(data)[i]][1];
        let rowData = [scanName, date, status];
        table.appendChild(CreateRow(rowData));
    }
};

