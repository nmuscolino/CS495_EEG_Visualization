export function RemoveCharacters() {
    const nameOfFile = document.querySelector('#name-of-file');
    const regExp = new RegExp('[^0-9a-zA-Z_]')
    var res = nameOfFile.value.replace(regExp, '');
    nameOfFile.value = res;
};

export function SelectFile() {
    const fileSelector = document.querySelector('#file-input'); //file input hidden button
    fileSelector.click();
};


export function PrepareForUpload() {
    const fileNameLabel = document.querySelector('#file-name-label');
    const fileSelector = document.querySelector('#file-input'); //file input hidden button
    fileNameLabel.textContent = fileSelector.files[0].name;
};

export function RecoverFromUpload() {
    const fileSelector = document.querySelector('#file-input');
    fileSelector.value = '';    //This makes it so files can be uploaded after the initial file.
    const fileNameLabel = document.querySelector('#file-name-label');
    fileNameLabel.textContent = '';
    const fileSelectButton = document.querySelector('#file-select-button');
    const uploadButton = document.querySelector('#upload-button');
    fileSelectButton.disabled = false;
    uploadButton.disabled = false;
    fileSelectButton.style.backgroundColor = 'white';
    uploadButton.style.backgroundColor = 'white';
    const body = document.querySelector('body');
    body.style.cursor = 'default';
    const nameOfFile = document.querySelector('#name-of-file');
    nameOfFile.disabled = false;
    nameOfFile.style.backgroundColor = 'white';
    nameOfFile.value = '';
    StatusMessage("Done.");
};

export function UploadingCSS() {
    StatusMessage("Uploading");
    const body = document.querySelector('body');
    body.style.cursor = 'wait';
    const fileSelectButton = document.querySelector('#file-select-button');
    const uploadButton = document.querySelector('#upload-button');
    fileSelectButton.disabled = true;
    uploadButton.disabled = true;
    fileSelectButton.style.backgroundColor = 'gray';
    uploadButton.style.backgroundColor = 'gray';
    const nameOfFile = document.querySelector('#name-of-file'); 
    nameOfFile.style.backgroundColor = 'gray';
    nameOfFile.disabled = true;
};

export function StatusMessage(msg) {
    statusMessage = document.querySelector('#error-message');
    statusMessage.value = msg;
}