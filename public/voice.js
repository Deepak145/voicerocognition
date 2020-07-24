const ACCOUNT_NUMBER = "What is your account number";
const PHONE_NUMBER = "What is your registered phone number";
const LAST_NAME = "What's your last name";
const CREDIT_DETAIL = "What's your last four digit of you credit card";
const ARRAY_OF_INFORMATION = ["phonenumber" , "accountnumber", "lastname", "creditcard", "createaccount"];
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

function voiceController(){ 
    console.log("voice controller clicked....")
    var requestForName = getUtterance(ACCOUNT_NUMBER);
    speechSynthesis.speak(requestForName);
    requestForName.onend = () => {
        var recog = getSpeechRecogniser('accountnumber');
        recog.start();
        
        recog.onresult  = () => {
            var requestForPhoneNumber = getUtterance(PHONE_NUMBER)
            speechSynthesis.speak(requestForPhoneNumber)
            requestForPhoneNumber.onend = () =>{
                var recog = getSpeechRecogniser('phonenumber');
                recog.start();
                recog.onresult  = () => {
                    
                    var requestForLastNumber = getUtterance(LAST_NAME)
                    speechSynthesis.speak(requestForLastNumber)
                    requestForLastNumber.onend = () =>{
                        var recog = getSpeechRecogniser('lastname');
                        recog.start();
                        recog.onresult  = () => {
                    
                            var requestForLast4Digit = getUtterance(CREDIT_DETAIL)
                            speechSynthesis.speak(requestForLast4Digit)
                            requestForLast4Digit.onend = () =>{
                                var recog = getSpeechRecogniser('creditcard');
                                recog.start();
                                recog.onresult = () => verifyAndSubmit(); 
                            }
                        }
                    }
                }
            }
        }
        
    }
}


const verifyAndSubmit = () => {
    var requestForConfirmation = getUtterance("If everything is alright say create account or name the field");
    speechSynthesis.speak(requestForConfirmation);
    requestForConfirmation.onend = () => {
            const recog = new webkitSpeechRecognition();
            recog.interimResults = true;
            recog.addEventListener('result', e => {
            const transcript = Array.from(e.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join();

            recog.onspeechend = () => {
                var correctedSpeech = removeSpaceComma(transcript).toLowerCase();
                console.log(correctedSpeech);
                if(!ARRAY_OF_INFORMATION.includes(correctedSpeech)) verifyAndSubmit();
                else if(correctedSpeech === 'createaccount') document.querySelector('.submit').click();
                else if(correctedSpeech === ''){speechSynthesis.speak(getUtterance("Nothing found. Please try again")); verifyAndSubmit();} 
                else { 
                    switch(correctedSpeech){
                        case "accountnumber" : validateDetails("accountnumber", ACCOUNT_NUMBER); break;
                        case "phonenumber" : validateDetails("phonenumber", PHONE_NUMBER); break;
                        case "lastname" : validateDetails("lastname", LAST_NAME); break;
                        case "creditcard" : validateDetails("creditcard", CREDIT_DETAIL); break;
                        default : speechSynthesis.speak(getUtterance("Nothing is found to update "+ correctedSpeech)); verifyAndSubmit();
                    }
                }
            }
        });
        recog.start();
    }

}

const validateDetails = (detailsType, message) => {
    var requestForName = getUtterance(message);
    speechSynthesis.speak(requestForName);
    requestForName.onend = () => {
        var recog = getSpeechRecogniser(detailsType);
        recog.start();
        recog.onresult = () => verifyAndSubmit();
    }
}

const getSpeechRecogniser = (elementId)=>{      
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join();

        this.setUpTranscriptToUI(elementId, transcript);
    });
    return recognition;
}

function setUpTranscriptToUI(elementId, transcript) {
    switch(elementId) {
        case "accountnumber" : document.querySelector('.account').value = removeSpaceComma(transcript); break;
        case "phonenumber" : document.querySelector('.phone').value = removeSpaceComma(transcript); break;
        case "lastname" :document.querySelector('.lastname').value = removeSpaceComma(transcript); break;
        case "creditcard" : document.querySelector('.creditcard').value = removeSpaceComma(transcript); break;
        default : console.log("No matching transcript is found"); 
    }
}

const removeSpaceComma = (transcript) => {
    return transcript.replace(/\s/g,'').replace(/\s/g,',');
}

function getUtterance(comment) {
    const speaker = new SpeechSynthesisUtterance(comment);
    speaker.volume=1;
    speaker.rate=.5;
    speaker.pitch=1;
    return speaker;        
}