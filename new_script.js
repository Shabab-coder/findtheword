let containerElement = document.querySelector(".container");
// let inputValue = document.querySelector(".container .inputs input");
let correctCount = document.querySelectorAll(".container .inputs .correct");
let incorrectCount = document.querySelectorAll(".container .inputs .incorrect");
let decisionModal = document.querySelector(".decision");
let decisionText = document.querySelector(".decision h1");
let decisionButton = document.querySelector(".decision button");
const lengthSelect = document.getElementById("wordLength");

let word_length = 4;



function getSelectedLength() {
    return parseInt(lengthSelect.value);
}

function numberOfChar(inputValue){
    let arr = [];
    let wordArr = [...inputValue.value];
    for (let i of wordArr){
        if(arr.includes(i.toLowerCase())){
            return 0;
        }
        arr.push(i.toLowerCase());
    }
    return 1;
}

function checkNumbers(inputValue){
    let numberArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let wordArr = [...inputValue.value];
    for (let i of wordArr){
        if (numberArray.includes(parseInt(i))){
            return 0;
        }
    }
    return 1;
}

function checkLetters(inputValue){
    let arr = [...inputValue.value]; // Don't trim here
    let letterArray = "abcdefghijklmnopqrstuvwxyz".split("");
    for (let i of arr){
        if (!letterArray.includes(i.toLowerCase())){
            return 0;
        }
    }
    return 1;
}



function check(inputValue, index, word){
    let correct = 0;
    let incorrect = 0;
    let unique = [];
    const lettersWord = [...word];
    inputValue.value = inputValue.value.toUpperCase();
    if (inputValue.value !== word){
        const letterInput = [...inputValue.value];
        for (let i of letterInput){
            if (!unique.includes(i)){
                if (lettersWord.includes(i)){
                    if (letterInput.indexOf(i) === lettersWord.indexOf(i)){
                        correct += 1;
                    }
                    else{
                        incorrect += 1;

                    }
                }
            }

            unique.push(i);
        }
        if (correct > 0){
            correctCount[index].textContent = correct;
            correctCount[index].style.backgroundColor = "#0FB50F";
            correctCount[index].style.border = "2px solid #0FB50F";

        }
        if (incorrect > 0){
            incorrectCount[index].textContent = incorrect;
            incorrectCount[index].style.backgroundColor = "#FFFF00";
            incorrectCount[index].style.border = "2px solid #FFFF00";
            incorrectCount[index].style.color = "black";
        }
        return 0;
    }
    else{
        correctCount[index].textContent = word.length;
        correctCount[index].style.backgroundColor = "#0FB50F";
        correctCount[index].style.border = "2px solid #0FB50F";
        return 1;
    }
}

function clear(index){
    correctCount[index].textContent = 0;
    correctCount[index].style.border = "2px solid #A4A3A3";
    correctCount[index].style.backgroundColor = "black";
    incorrectCount[index].textContent = 0;
    incorrectCount[index].style.border = "2px solid #A4A3A3";
    incorrectCount[index].style.backgroundColor = "black";
    incorrectCount[index].style.color = "white";
}


// function newElement(){
//     let divElement = document.createElement("div");
//     let inputElement = document.createElement("input");
//     let correctElement = document.createElement("div");
//     let incorrectElement = document.createElement("div");

//     divElement.className = "inputs";
//     inputElement.type = "text";
//     inputElement.maxLength = 4;
//     inputElement.className = "uppercase";
//     correctElement.className = "correct";
//     correctElement.textContent = 0;
//     incorrectElement.className = "incorrect";
//     incorrectElement.textContent = 0;

//     divElement.appendChild(inputElement);
//     divElement.appendChild(correctElement);
//     divElement.appendChild(incorrectElement);
//     containerElement.appendChild(divElement);
    
// }

decisionButton.addEventListener("click", function(){
    decisionModal.classList.add("hidden");
    containerElement.style.filter = "none";
    containerElement.style.pointerEvents = "auto";
});

document.addEventListener("keydown", function(e){
    if(e.key===" " && !decisionModal.classList.contains("hidden")){
        decisionButton.click();
    }

});


let warningModal = document.querySelector(".warning");

function showWarning(){
    warningModal.classList.add("visible");
    setTimeout(function(){
        warningModal.classList.remove("visible");
}, 4000);
}

function wrongInputWarning(elem){
    elem.classList.add("wrongInput");
    elem.classList.add("shake");
    setTimeout(function(){
        elem.classList.remove("wrongInput");
        elem.classList.remove("shake");
    }, 1000);
}

async function fetchNewWord(length) {
  const res = await fetch("/api/new-word?length=" + length, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch word");
  const data = await res.json();

  // Ensure uppercase + trimmed
  return (data.word || "").toString().trim().toUpperCase();
}

function updateInputLength(length) {
    const inputs = document.querySelectorAll(".container input");

    inputs.forEach(input => {
        input.setAttribute("maxlength", length);
        input.setAttribute("minlength", length);
        input.value = "";

        input.classList.remove("input-4", "input-5");
        input.classList.add("input-" + length);
    });
}

function setupgamelisteners(){
    let allDivs = document.querySelectorAll(".container .inputs");
    let allInputs = document.querySelectorAll(".container .inputs input");
    let lengthOfArray = allInputs.length;
    let count = 0;
    allInputs.forEach(function(elem, index){
        elem.addEventListener("keydown", function(e){
            if (e.key === "Enter" && elem.value.length === word.length && checkLetters(elem) && numberOfChar(elem)){
                // clear(index);
                const currentWord = word;
                isValid = check(elem, index, currentWord);
                
                if (!isValid && index + 1 < lengthOfArray){
                    allDivs[index+1].classList.remove("hidden");
                    allInputs[index+1].disabled = false; 
                    allInputs[index+1].focus();
                    elem.disabled = true;
                    // decisionModal.click();
                }
                // else if (count === 7  && !isValid){
                //     decisionModal.classList.remove("hidden");
                    
                //     containerElement.style.filter = "blur(5px)";
                //     containerElement.style.pointerEvents = "none";
                //     decisionText.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;You Lost ! <br> Word is " + currentWord;
                //     console.log("index: "+ index + " Validity: " + isValid);
                //     // decisionModal.click();
                //     decisionModal.style.borderColor = "red";
                //     elem.disabled = true;
                // }
                // else{
                //     elem.disabled=true;
                //     decisionModal.classList.remove("hidden");
                //     containerElement.style.filter = "blur(5px)";
                //     containerElement.style.pointerEvents = "none";
                //     decisionModal.style.borderColor = "green";
                //     console.log("index: "+ index + " Validity: " + isValid);
                // }
                else if (index === lengthOfArray - 1 && !isValid){
                    decisionModal.classList.remove("hidden");
                    containerElement.style.filter = "blur(5px)";
                    containerElement.style.pointerEvents = "none";
                    decisionText.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;You Lost ! <br> Word is " + currentWord;
                    decisionModal.style.borderColor = "red";
                    elem.disabled = true;
                }
                else if (isValid){
                elem.disabled = true;
                decisionModal.classList.remove("hidden");
                containerElement.style.filter = "blur(5px)";
                containerElement.style.pointerEvents = "none";
                decisionModal.style.borderColor = "green";
                }
                count++;
                
                
            }
            else if (e.key === "Enter"){
                showWarning();
                wrongInputWarning(elem);
            }
        });
    });
}

let refreshButton = document.querySelector(".refresh");

// refreshButton.addEventListener("click", function () {
//   const url = new URL(window.location.href);
//   url.searchParams.set("nocache", Date.now());
//   window.location.href = url.toString();
// });

refreshButton.addEventListener("click", async function () {
    const selectedLength = getSelectedLength(); 

    resetBoard();
    updateInputLength(selectedLength);

    word = await fetchNewWord(selectedLength);
    console.log("New word loaded:", word); // remove later
    const url = new URL(window.location.href);
    url.searchParams.set("length", selectedLength);
    history.replaceState(null, "", url.pathname + url.search);
});

// window.addEventListener("load", function () {
//   const cleanUrl = window.location.pathname; // keeps current file/page
//   history.replaceState(null, "", cleanUrl);
// });


let word = ""; 

window.addEventListener("load", async function () {

    try {
        const selectedLength = getSelectedLength();
        updateInputLength(selectedLength);
        word = await fetchNewWord(selectedLength);
        
        setupgamelisteners();
        
        // const cleanUrl = window.location.pathname;
        // history.replaceState(null, "", cleanUrl);
        const url = new URL(window.location.href);
        url.searchParams.delete("nocache");
        history.replaceState(null, "", url.pathname + url.search);
    } catch (err) {
        console.error(err);
        // optional: show a message on screen
        alert("Could not load a new word. Is your server running?");
    }
});

// lengthSelect.addEventListener("change", function () {
//     const selectedLength = getSelectedLength();

//     // Add nocache so browser refetches
//     const url = new URL(window.location.href);
//     url.searchParams.set("length", selectedLength);
//     url.searchParams.set("nocache", Date.now());
//     window.location.href = url.toString();
// });

lengthSelect.addEventListener("change", async function () {
    const selectedLength = parseInt(this.value, 10);

    const url = new URL(window.location.href);
    url.searchParams.set("length", selectedLength);
    history.replaceState(null, "", url.pathname + url.search);

    resetBoard();
    updateInputLength(selectedLength);
    word = await fetchNewWord(selectedLength);
});

// function resetBoard() {
//     const allDivs = document.querySelectorAll(".container .inputs");
//     const allInputs = document.querySelectorAll(".container .inputs input");

//     allDivs.forEach((row, i) => {
//         if (i === 0) row.classList.remove("hidden");
//         else row.classList.add("hidden");
//     });

//     allInputs.forEach((inp, i) => {
//         inp.value = "";
//         inp.disabled = i !== 0;
//     });

//     allInputs[0].focus();

//     for (let i = 0; i < allInputs.length; i++) clear(i);

//     decisionModal.classList.add("hidden");
//     decisionModal.style.borderColor = "red"; 
//     containerElement.style.filter = "";
//     containerElement.style.pointerEvents = "";
// }

function resetBoard() {
    const allDivs = document.querySelectorAll(".container .inputs");
    const allInputs = document.querySelectorAll(".container .inputs input");

    const selectedLength = getSelectedLength();
    const maxAttempts = (selectedLength === 5) ? 10 : 8;

    allDivs.forEach((row, i) => {

        // First remove any previous mode classes
        row.classList.remove("not-used");

        if (i >= maxAttempts) {
            // Completely remove extra rows for this mode
            row.classList.add("not-used");
        } else {
            // Rows part of this mode
            if (i === 0) {
                row.classList.remove("hidden");
            } else {
                row.classList.add("hidden");
            }
        }
    });

    allInputs.forEach((inp, i) => {
        inp.value = "";
        inp.disabled = (i !== 0) || (i >= maxAttempts);
    });

    allInputs[0].focus();

    for (let i = 0; i < maxAttempts; i++) clear(i);

    decisionModal.classList.add("hidden");
    decisionModal.style.borderColor = "red";
    containerElement.style.filter = "";
    containerElement.style.pointerEvents = "";
}