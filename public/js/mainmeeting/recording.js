/** @format */

const recordScreen = document.getElementById("recordScreen");
let isRecording = false;

var options = {
  disableLogs: true,
  frameInterval: 1,
  mimeType: "video/mp4",
};

var recorder = new MultiStreamRecorder(allStreams, options);

recordScreen.addEventListener("click", () => {
  if (isRecording === true) {
    recorder.stop(function (blob) {
      // video.src = URL.createObjectURL(blob);
      invokeSaveAsDialog(blob, "*.mp4");
    });

    isRecording = false;
  } else {
    recorder.record();
    isRecording = true;
  }
});
