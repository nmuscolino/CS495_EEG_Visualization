

const fileSelector = document.querySelector('#file-input');

const fileSelectButton = document.querySelector("#file-select-button");

const fileNameLabel = document.querySelector("#file-name-label");
fileNameLabel.textContent = 'No file chosen';

fileSelectButton.addEventListener('click', function() {
    fileSelector.click();
});

fileSelector.addEventListener('change', function() {
    fileNameLabel.textContent = fileSelector.files[0].name;
});
