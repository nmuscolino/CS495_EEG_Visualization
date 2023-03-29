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
    let dateString = year.toString() + "-" + monthString + "-" + day.toString();
    let rowData = [scanName, dateString, 'Uploading... Do not refresh or close the page'];
    let tr = CreateRow(rowData, 'td');
    table.insertBefore(tr, table.children[1]);
};

export function ChangeStatus(status) {
    table.children[1].children[2].textContent = status;
}

function CreateRow(rowData, type) {
    let tr = document.createElement('tr');
    for (let i = 0; i < 3; i++) {
        let col = document.createElement(type);
        col.appendChild(document.createTextNode(rowData[i]));
        tr.appendChild(col);
    }
    return tr;
};


function BuildTable(table, data) {
    let headerData = ['Scan Name', 'Date Uploaded', 'Status'];
    table.appendChild(CreateRow(headerData, 'th'));
    for (let i = 0; i < Object.keys(data).length; i++) {
        //let scanName = Object.keys(data)[i];
        //let date = data[Object.keys(data)[i]][0];
        //let status = data[Object.keys(data)[i]][1];
        let scanName = data[Object.keys(data)[i]].fields.scan_name;
        let date = data[Object.keys(data)[i]].fields.upload_date.substring(0, 10);
        console.log(typeof(date));
        let status = "Ready";
        let rowData = [scanName, date, status];
        table.appendChild(CreateRow(rowData, 'td'));
    }
};

