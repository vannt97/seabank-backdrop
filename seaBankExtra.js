function RequestScreenShot(){
    if (window.unityInstance) { window.unityInstance.SendMessage('Control', 'ScreenShot'); }
    else { console.log("window.unityInstance has not created yet"); }
}
function getTimestamp() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  return now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds());
}
function sendImageBlobToNative(blob){    
    if (typeof window.receiveImageBlob !== "undefined") {
      window.receiveImageBlob(blob);
    }
}
//__________________________________________________________________________________________________________________
var mediaRecorder = null;
var mediaStream = null;
var containerType = "video/webm";

function isIOS() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipod|ipad/.test(userAgent);
}
function createMediaRecorder() {// Create MediaRecorder for video only
  if(mediaStream == null) { mediaStream = document.querySelector("#unity-canvas").captureStream(30); }// getMediaStream(); }
  if (isIOS()){
    if (MediaRecorder.isTypeSupported('video/mp4')) {//Safari 14.0.2 has an EXPERIMENTAL version of MediaRecorder enabled by default
      containerType = "video/mp4";
      var options = {mimeType: 'video/mp4'};
    }
  }
  else{
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) { var options = {mimeType: 'video/webm;codecs=vp9'}; }
    else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) { var options = {mimeType: 'video/webm;codecs=h264'}; }
    else if (MediaRecorder.isTypeSupported('video/webm')) { var options = {mimeType: 'video/webm'}; }
    else if (MediaRecorder.isTypeSupported('video/mp4')) {//Safari 14.0.2 has an EXPERIMENTAL version of MediaRecorder enabled by default    
      containerType = "video/mp4";
      var options = {mimeType: 'video/mp4'};
    }
  }
  mediaRecorder = new MediaRecorder(mediaStream, options);
}
function mediaStart() {//console.log("!!!!!!!!!!!!!!start recording is called");
  if (!mediaRecorder) createMediaRecorder();
  const chunks = [];
  mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: mediaRecorder.mimeType });        
    if (typeof window.receiveVideoBlob !== "undefined") { window.receiveVideoBlob(blob, containerType); }
  };
  mediaRecorder.start();
}
function mediaStop() {// Stop recording
  if (mediaRecorder && mediaRecorder.state === "recording") {//console.log("Recording stopped");
    mediaRecorder.stop();        
  }    
}
//__________________________________________________________________________________________________________________
function downloadBlob(blob, fileName){
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');                        
  a.download = fileName;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
