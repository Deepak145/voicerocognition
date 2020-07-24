const USER_ID = "What is your User ID";
const PASSWORD = "What is your Password";
const keywords = ["password", "userid", "login"];
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition

function voiceController(){
    var requestForName = getUtterance(USER_ID);
    speechSynthesis.speak(requestForName);
    requestForName.onend = () => {
        var recog = getSpeechRecogniser('userid');
        recog.start();
        
        recog.onresult  = () => {
            var requestForPhoneNumber = getUtterance(PASSWORD)
            speechSynthesis.speak(requestForPhoneNumber)
            requestForPhoneNumber.onend = () =>{
                var recog = getSpeechRecogniser('password');
                recog.start();
                recog.onresult = () => verifyAndSubmit();
            }
        }
        
    }
}


const verifyAndSubmit = () => {
    var requestForConfirmation = getUtterance("If everything is alright say login or name the field");
    speechSynthesis.speak(requestForConfirmation);
    requestForConfirmation.onend = () => {
            const recog = new webkitSpeechRecognition();
            recog.interimResults = true;
            recog.addEventListener('result', e => {
            const transcript = Array.from(e.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join();

            console.log(transcript);
            recog.onspeechend = () => {
                var correctedSpeech = removeSpaceComma(transcript).toLowerCase();
                if(!keywords.includes(correctedSpeech)) verifyAndSubmit();
                else if(transcript === 'login') document.querySelector('.submit').click();
                else { 
                    switch(correctedSpeech){
                        case "userid" : validateDetails("userid", USER_ID); break;
                        case "password" : validateDetails("password",   PASSWORD); break;
                        default : speechSynthesis.speak(getUtterance("Nothing is found to update "+ correctedSpeech + " for this keyword")); verifyAndSubmit();
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
    recognition.continuous = true;
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
        case "userid" : document.querySelector('.userid').value = removeSpaceComma(transcript); break;
        case "password" : document.querySelector('.password').value = removeSpaceComma(transcript); break;
        default : console.log("No matching transcript is found"); 
    }
}

const removeSpaceComma = (transcript) => {
    return transcript.replace(/\s/g,'').replace(/\s/g,',');
}

function getUtterance(comment) {
    const speaker = new SpeechSynthesisUtterance(comment);
    speaker.volume=1;
    speaker.rate=.4;
    speaker.pitch=1;
    return speaker;        
}
