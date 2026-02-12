let containerElement = document.querySelector(".container");
// let inputValue = document.querySelector(".container .inputs input");
let correctCount = document.querySelectorAll(".container .inputs .correct");
let incorrectCount = document.querySelectorAll(".container .inputs .incorrect");
let decisionModal = document.querySelector(".decision");
let decisionText = document.querySelector(".decision h1");
let decisionButton = document.querySelector(".decision button");



function numberOfChar(inputValue){
    let arr = [];
    let wordArr = [...inputValue.value];
    for (let i of wordArr){
        if(arr.includes(i.toLowerCase())){
            return 0;
        }
        arr.push(i);
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
        correctCount[index].textContent = 4;
        correctCount[index].style.backgroundColor = "#0FB50F";
        correctCount[index].style.border = "2px solid #0FB50F";
        return 1;
    }
}

function clear(index){
    correctCount[index].textContent = 0;
    correctCount[index].style.backgroundColor = "#A4A3A3";
    incorrectCount[index].textContent = 0;
    incorrectCount[index].style.backgroundColor = "#A4A3A3";
    incorrectCount[index].style.color = "white";
}


function newElement(){
    let divElement = document.createElement("div");
    let inputElement = document.createElement("input");
    let correctElement = document.createElement("div");
    let incorrectElement = document.createElement("div");

    divElement.className = "inputs";
    inputElement.type = "text";
    inputElement.maxLength = 4;
    inputElement.className = "uppercase";
    correctElement.className = "correct";
    correctElement.textContent = 0;
    incorrectElement.className = "incorrect";
    incorrectElement.textContent = 0;

    divElement.appendChild(inputElement);
    divElement.appendChild(correctElement);
    divElement.appendChild(incorrectElement);
    containerElement.appendChild(divElement);
    
}

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
    setTimeout(function(){
        elem.classList.remove("wrongInput");
    }, 2000);
}

async function fetchNewWord() {
  const res = await fetch("/api/new-word", { cache: "no-store" });
  const data = await res.json();
  return data.word;
}



function setupgamelisteners(){
    let allDivs = document.querySelectorAll(".container .inputs");
    let allInputs = document.querySelectorAll(".container .inputs input");
    let lengthOfArray = allInputs.length;
    let count = 0;
    allInputs.forEach(function(elem, index){
        elem.addEventListener("keydown", function(e){
            if (e.key === "Enter" && elem.value.length === 4 && checkLetters(elem) && numberOfChar(elem) && checkNumbers(elem)){
                // clear(index);
                elem.value = elem.value.toUpperCase();
                isValid = check(elem, index, word);
                if (!isValid && index + 1 < lengthOfArray){
                    allDivs[index+1].classList.remove("hidden");
                    allInputs[index+1].focus();
                    elem.disabled = true;
                    decisionModal.click();
                }
                else if (count === 7  && !isValid){
                    decisionModal.classList.remove("hidden");
                    containerElement.style.filter = "blur(5px)";
                    containerElement.style.pointerEvents = "none";
                    decisionText.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;You Lost ! <br> Word is " + word;
                    decisionModal.click();
                    elem.disabled = true;
                }
                else{
                    elem.disabled=true;
                    decisionModal.classList.remove("hidden");
                    containerElement.style.filter = "blur(5px)";
                    containerElement.style.pointerEvents = "none";
                    decisionModal.style.borderColor = "green";
                }
                count++;
                
                
            }
            else if (e.key === "Enter"){
                console.log("warning");
                showWarning();
                wrongInputWarning(elem);
            }
        });
    });
}

let refreshButton = document.querySelector(".refresh");

refreshButton.addEventListener("click", function () {
  const url = new URL(window.location.href);
  url.searchParams.set("nocache", Date.now());
  window.location.href = url.toString();
});

// window.addEventListener("load", function () {
//   const cleanUrl = window.location.pathname; // keeps current file/page
//   history.replaceState(null, "", cleanUrl);
// });


let word = ""; 

window.addEventListener("load", async function () {
  try {
    word = await fetchNewWord();

    setupgamelisteners();
    
    const cleanUrl = window.location.pathname;
    history.replaceState(null, "", cleanUrl);
  } catch (err) {
    console.error(err);
  }
});
