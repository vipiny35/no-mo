import './App.css';
import React, { Component } from 'react';
import pathToImage from './blank.png'
// import sampleCert from './sample.jpg'
const { PDFDocument } = require('pdf-lib');
const download = require("downloadjs")

let finalFile;
let file;
async function processPdf(pdfFile) {
  const pdfDoc = await PDFDocument.load(pdfFile);
  const blankImage = await pdfDoc.embedPng(pathToImage);
  const pdfPage = pdfDoc.getPage(0);

  pdfPage.drawImage(blankImage, {
    x: 35,
    y: 140,
    width: 310,
    height: 100
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  finalFile = pdfBytes;

  // Trigger the browser to download the PDF document
}

class App extends Component {
  state = {
    value: ''
  }

  inputOpenFileRef;

  constructor() {
    super()
    this.inputOpenFileRef = React.createRef();
    document.title = 'No-Mo your ceritificate'
  }

  showOpenFileDlg = () => {
    this.inputOpenFileRef.current.click()
  }

  downloadCertificate() {
    if (!finalFile && !file) return;
    download(finalFile, `download-${file.name}`, "application/pdf");
  }

  showFile = async (event) => {
    file = event.target.files[0];
    this.setState({ value: file.name })
    const fileReader = new FileReader();

    fileReader.onload = function () {
      const typedArray = new Uint8Array(this.result);
      processPdf(typedArray)
    };
    fileReader.readAsArrayBuffer(file);
  }

  render() {
    return (
      <div className="container">
        <h1 className="title">No-Mo</h1>
        <h2 className="header">Create your own No-Mo certificate</h2>
        <input ref={this.inputOpenFileRef} type="file" style={{ display: "none" }} onChange={(e) => this.showFile(e)} accept="application/pdf" />

        <p>{this.state.value}</p>

        {!this.state.value && <button className="button" onClick={this.showOpenFileDlg}>Select certificate</button>}

        {this.state.value && <button className="button-blue" onClick={this.downloadCertificate}>Download No-Mo certificate</button>}

        {/* <p>Final result</p>
        <img src={sampleCert} alt="No-Mo certificate sample" /> */}


        <div className="footer">
          <p className="note"><span>Note</span>: No-Mo certificate is generated in your browser. No data is uploaded to the server.</p>
          <a href="https://github.com/vipiny35/no-mo" target="_blank" rel="noreferrer">Github repo link</a>
        </div>

      </div>
    )
  }
}

export default App;