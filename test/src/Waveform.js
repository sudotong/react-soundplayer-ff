import React, { Component } from "react";
import WaveSurfer from "wavesurfer.js";
import "./waveform.css";

class WaveForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      playing: false,
    };
  }

  componentDidMount() {
    this.waveform = WaveSurfer.create({
      barWidth: 1,
      height: 50,
      container: "#waveform",
      progressColor: "#fff",
      responsive: true,
      waveColor: "#006",
      interact: true,
      backend: "MediaElement",
      fillParent: true,
    });

    this.waveform.load(
      "https://parse-server-ff.s3.amazonaws.com/ae5992f0f5bb1f259bafa41b3771e3bb_call12565815456dwwwwww795896232www-01b59bd3.mp3"
    );

    // this.waveform.on("ready", () => {
    //   this.waveform.play();
    // });

    this.waveform.on("error", (err) => {
      alert(err);
    });
  }

  render() {
    return (
      <section className="container">
        <div className="sepctrum">
          <div id="waveform"></div>
        </div>

        <div className="timestamp">
          <p>00:00 / 7:42</p>
        </div>

        <div className="controls">
          <button>play</button>
          <button>pause</button>
        </div>
      </section>
    );
  }
}

export default WaveForm;
