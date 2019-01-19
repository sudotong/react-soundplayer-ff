import React, {Component} from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import Waveform from "react-audio-waveform";


class Waves extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mp3url: "",
      decodedAudioData: [],
      transformedData: []
    };
    console.log("start");
  }

  componentDidMount() {
    console.log("mounty", this.props);
    this.getWaveFormData(this.props.mp3url);
  }

  getWaveFormData(url) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    axios({url: url, responseType: "arraybuffer"})
      .then(response => audioCtx.decodeAudioData(response.data))
      .then(buffer => {
        const decodedAudioData = buffer.getChannelData(0);
        this.transformData(decodedAudioData);
      })
      .catch(reason => {
        console.log(reason);
      });
  }

  transformData(decodedAudioData) {
    const NUMBER_OF_BUCKETS = 100; // number of "bars" the waveform should have
    let bucketDataSize = Math.floor(decodedAudioData.length / NUMBER_OF_BUCKETS);
    let buckets = [];
    for (let i = 0; i < NUMBER_OF_BUCKETS; i++) {
      let startingPoint = i * bucketDataSize;
      let endingPoint = i * bucketDataSize + bucketDataSize;
      let max = 0;
      for (let j = startingPoint; j < endingPoint; j++) {
        if (decodedAudioData[j] > max) {
          max = decodedAudioData[j];
        }
      }
      let size = Math.abs(max);
      buckets.push(size / 2);
    }

    this.setState({transformedData: buckets});
  }

  render() {
    return (
      <div>
        <Waveform
          barWidth={4}
          peaks={this.state.transformedData}
          height={200}
          // pos={this.props.pos}
          duration={210}
          // onClick={this.handleClick}
          color="#676767"
          progressGradientColors={[[0, "#888"], [1, "#aaa"]]}
        />
      </div>
    );
  }
}

Waves.propTypes = {
  mp3url: PropTypes.string.isRequired
};

export default Waves;
