"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffle = void 0;
function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        const tmp = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tmp;
    }
    return array;
}
exports.shuffle = shuffle;