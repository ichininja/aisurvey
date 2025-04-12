let recognizer;
let model;

async function loadModel() {
  const vosk = await Vosk.createModel('model');
  model = vosk;
  recognizer = model.createRecognizer();
}

async function startVoskMic() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);
  const processor = context.createScriptProcessor(4096, 1, 1);

  recognizer.setWords(true);

  processor.onaudioprocess = (e) => {
    const inputData = e.inputBuffer.getChannelData(0);
    recognizer.acceptWaveform(inputData);
    const result = recognizer.result();
    if (result?.text) {
      document.getElementById('output').innerText = result.text;
    }
  };

  source.connect(processor);
  processor.connect(context.destination);
}