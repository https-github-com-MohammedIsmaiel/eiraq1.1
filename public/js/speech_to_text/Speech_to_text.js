/** @format */

const stt = document.getElementById('speech_to_text');
const TranscriptBar = document.getElementById('stt_container');
TranscriptBar.innerText = '';
var ccFlag = 0; // CounterFlag

try {
	var SpeechRecognition =
		window.SpeechRecognition ||
		window.mozSpeechRecognition ||
		window.msSpeechRecognition ||
		window.oSpeechRecognition ||
		window.webkitSpeechRecognition;
	var recognition = new SpeechRecognition();
} catch (e) {
	console.error(e);
}
// What is being said
var noteContent = '';

recognition.continuous = true;
recognition.onresult = function (event) {
	var current = event.resultIndex;
	var transcript = event.results[current][0].transcript;
	var mobileRepeatBug = current == 1 && transcript == event.results[0][0].transcript;

	if (!mobileRepeatBug) {
		noteContent += transcript;
		TranscriptBar.innerText = noteContent;
	}
};
recognition.start();
try {
	recognition.onspeechend = function () {
		recognition.stop();
	};
} catch (error) {}
try {
	recognition.onend = function () {
		recognition.start();
	};
} catch (error) {}
TranscriptBar.innerText = noteContent;
stt.addEventListener('click', () => {
	try {
		recognition.start();
	} catch (error) {}
	console.log(ccFlag);
	ccFlag += 1;
	if (ccFlag % 2 == 1) {
		// Starting TTS
		TranscriptBar.style.display = '';
		stt.innerHTML = `<i class="fas fa-closed-captioning"></i>`;
	} else {
		// Closing TTS
		TranscriptBar.style.display = 'none';
		stt.style.backgroundColor = '';
		stt.innerHTML = `<i class="far fa-closed-captioning"></i>`;
	}
});
try {
	recognition.onerror = function (event) {
		if (event.error == 'no-speech') {
			recognition.stop();
		}
	};
} catch (error) {}
