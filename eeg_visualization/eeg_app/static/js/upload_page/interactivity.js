function RemoveCharacters() {
    const regExp = new RegExp('[^0-9a-zA-Z_]')
    var res = nameOfFile.value.replace(regExp, '');
    nameOfFile.value = res;
};