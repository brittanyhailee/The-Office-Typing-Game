const RANDOM_OFFICE_QUOTE_API_URL = 'https://officeapi.akashrajpurohit.com/quote/random'

const quoteDisplayEl = document.getElementById('quoteDisplay')
const quoteInputEl = document.getElementById('quoteInput')
const timerEl = document.getElementById('timer')
const averageWpmEl = document.getElementById('average-wpm')
const cpmEl = document.getElementById('cpm')

const caretEl = document.getElementById('caret')
var correctCount = 0

let userPos; //the index of where the user is currently typing 

let correct = true;
let leftVal = 0;
let topVal = 19;
let bottomVal = 0;
var charSumNet = 0

quoteInputEl.addEventListener('input', () => {

    const typedWords = quoteInputEl.value.split('');
   
    /* We want to compare each individual input to the characters in the span 
    based on their positions like first char of the input vs first char of the quote. */
    const arrayQuote = quoteDisplayEl.querySelectorAll('span');
    const arrayValue = quoteInputEl.value.split(''); //We want to convert our input into an array of 
                                                    //strings of each individual character
    
    let correct = true
    userPos = typedWords.length;
    // console.log(userPos);
    const lastTyped = typedWords[typedWords.length -1]
    console.log(lastTyped + " == "  + arrayQuote[typedWords.length-1].innerText)

    if (lastTyped  == arrayQuote[typedWords.length-1].innerText) {
        correctCount++
        console.log("correctCount:" + correctCount)
        charSumNet++
    } else {
        charSumNet++
    }


    moveCaret();
    arrayQuote.forEach((characterSpan, index) => {
        
        moveCaret()

        caretEl.style.left = arrayValue.indexOf(index).offsetLeft;
        caretEl.style.top = arrayValue.indexOf(index).offsetTop;
        // changed from caretEl.style.top = arrayValue[index].offsetTop;


        const character = arrayValue[index]
        if (character == null) {
           
            characterSpan.classList.remove('correct')
            characterSpan.classList.remove('incorrect')
            correct = false
        } else if (character == characterSpan.innerText) {
            characterSpan.classList.add('correct')
            characterSpan.classList.remove('incorrect')
            correct = true
            
        } else {

            characterSpan.classList.remove('correct')
            characterSpan.classList.add('incorrect')
            correct = false
        }
 
    })
    // userPos = typedWords.length;
    if (correct) {
         
        renderNewQuote()
        averageWpmEl.innerText = 0
        caretEl.style.display = none;
    } 
})  

function getRandomQuote() {
    return fetch(RANDOM_OFFICE_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data.quote) // change to .quote when doing 'the office' api
}

async function renderNewQuote() {

    const quote = await getRandomQuote();

    // Reset userPos to 0 when rendering a new quote
    userPos = 0;
    topVal = 19;

    quoteDisplayEl.innerHTML = ''

    /* We need to go thru a loop that will check each inputted character
    and see if it matches the letters in the quote itself */
    
    /* doing the split will convert our string into an array where
    each individual character in the word is an element in the array*/
    
    // console.log(quote[0]);

    let wordContainer = null; 
    
    quote.split('').forEach(character => {
        // const firstLetter = quote[0]
        // moveCaret(firstLetter.top, firstLetter.left)

        if (character == " ") {
            // console.log('the character is a space')
        }
        if (quoteDisplayEl.innerHTML === '') {
            // console.log('the innerHTML is empty')
        }

        if (character === ' ' || quoteDisplayEl.innerHTML === '') {
            // console.log('the div is created')
           
            // if (wordContainer && wordContainer.textContent.trim() !== '') {
            //     quoteDisplayEl.appendChild(wordContainer);
            // }

            wordContainer = document.createElement('div')
            wordContainer.classList.add('word')
            // quoteDisplayEl.appendChild(wordContainer)
            
        }
      
        const characterSpan = document.createElement('span')
        
        // characterSpan.classList.add('correct')
        if (character == '‘' || character == '’') {
        
            //character == "'" //change the straight single quote instead
            characterSpan.innerText = "'"
            // quoteDisplayEl.appendChild(characterSpan)
            
            wordContainer.appendChild(characterSpan)

        } else if (character == '…') {
            for (let i = 0; i < 3; i++) {
                const dotSpan = document.createElement('span')
                dotSpan.innerText = "."
                wordContainer.appendChild(dotSpan)   
            }
            
        } else {
            characterSpan.innerText = character
            wordContainer.appendChild(characterSpan)

        }
        quoteDisplayEl.appendChild(wordContainer)
    })
    quoteInputEl.value = null;
    moveCaret()
    startTimer()
    updateUI()
    refreshValues()
}   

function updateUI() {
    averageWpmEl.innerText = 0 + ' wpm'
    cpmEl.innerText = 0 + ' cpm'
    setInterval(() => {
        averageWpmEl.innerText = `${wpmNet()} wpm`
        cpmEl.innerText = `${cpmNet()} cpm`
    }, 1500) 
    
}

function wpmNet() {
    wpm = 0
    // console.log("the timer is " + getTimerTime()) 
    // console.log("wpm is " + Math.round((correctCount/5) / (getTimerTime()/60)))

    if (getTimerTime() <= 0.3 ) return 0;
  
    var  wpm = Math.round((correctCount/5) / (getTimerTime()/60))
        // peak = (wpm > peak) ? wpm: peak
        // return wpm
    
    return wpm
    // return wpm = Math.round((correctCount/5) / (getTimerTime()/60))
}

function cpmNet() {
    if (getTimerTime() < 0.3) return 0;
    return Math.round((charSumNet)/(getTimerTime()/60))
}

function refreshValues() {
    correctCount = 0
    charSumNet = 0
}

function moveCaret() {
    caretEl.style.display = "block";
    let extraSpace = 5;
    if (userPos === 0) {
        extraSpace = 1;
    }
    
    // Calculate cumulative width of characters up to userPos
    let cumulativeWidth = 0;
   
    const arrayQuote = quoteDisplayEl.querySelectorAll('span');
    
    for (let i = 0; i < userPos; i++) {
        cumulativeWidth = arrayQuote[i].offsetLeft; // Use offsetWidth to get the width of the character span
        // arrayValue.indexOf(index).offsetLeft
        topVal = arrayQuote[i].offsetTop
        // topVal = arrayQuote[i].offsetTop;
   
        // console.log(arrayQuote[i].offsetLeft);
        
    }
    if (userPos == 0) {
        cumulativeWidth = arrayQuote[0].offsetLeft;
        console.log(userPos);
    }
    
    
    // console.log(cumulativeWidth)
    caretEl.style.left = `${cumulativeWidth + extraSpace}px`; // Set left position
    caretEl.style.top = `${topVal}px`;
}


/* Compare start date and current date to get the ACTUAL time that has elapsed */

function startTimer() {
    timerEl.innerText = 0 + ' s'
    startTime = new Date()
    // setInterval takes a function and takes a second parameter which specifies
    // how often you want to run that function
    setInterval(() => {
        timerEl.innerText = getTimerTime() + ' s'
    }, 1000) // every 1000th millisecond, we will run this function
    //but this function is not exact, it might run every 1001 millisecond
}

function getTimerTime() {
    return Math.floor((new Date() - startTime)/1000)
}

renderNewQuote()

