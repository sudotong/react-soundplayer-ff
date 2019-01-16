import React, { Component } from "react";
import ReactHowler from "react-howler";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";

import Peaks from "peaks.js";

import { PlayButton, Timer } from "react-soundplayer/components";

const audioContext = new AudioContext();

const DEFAULT_DURATION = 456.1495; // have to use this become modifying the audio file breaks 2x speed
const DEFAULT_MP3 =
  "https://parse-server-ff.s3.amazonaws.com/ae5992f0f5bb1f259bafa41b3771e3bb_call12565815456dwwwwww795896232www-01b59bd3.mp3";

class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      currentTime: 0,
      speedup: false,
      loadErr: false
    };
  }

  initializePeaks = () => {
    const p = Peaks.init({
      container: ReactDOM.findDOMNode(this.peaksWrapper),
      mediaElement: ReactDOM.findDOMNode(this.audioElement),
      audioContext,
      overviewWaveformColor: "#888",
      overviewHighlightRectangleColor: "white",
      height: 40
    });
    return p;
  };

  handlePressDown = e => {
    const time = this.calculateTime(e);
    this.peaks.player.seek(time);
    this.setState({
      currentTime: time
    });
  };

  calculateTime = e => {
    const width = ReactDOM.findDOMNode(this.peaksWrapper).clientWidth;
    const percentageOffsetX = e.nativeEvent.offsetX / width;
    return Math.round(percentageOffsetX * this.peaks.player.getDuration());
  };

  toggleRate() {
    let { speedup } = this.state;
    speedup = !speedup;
    this.setState({ speedup });
    this.player._howler.rate(speedup ? 2.0 : 1.0);
  }

  getState() {
    let { playing, currentTime } = this.state;
    return { playing, currentTime };
  }

  componentWillUnmount() {
    if (this.playerInterval) clearTimeout(this.playerInterval);
  }

  componentDidMount() {
    this.peaks = this.initializePeaks();
  }

  isObject(obj) {
    return obj instanceof Object || (typeof obj === "object" && obj !== null);
  }

  togglePlay = () => {
    const peaks = this.peaks;
    const { playing } = this.state;
    if (playing) {
      peaks.player.pause();
    } else {
      peaks.player.play();
    }

    this.setState({
      playing: !playing
    });
  };

  handleDragEnter = e => {
    this.peaks.segments.removeById("selected-segment");
    const time = this.calculateTime(e);
    this.setState({
      segmentStartTime: time
    });
  };

  handleDragStop = e => {
    const time = this.calculateTime(e);
    const { segmentStartTime } = this.state;
    const start = segmentStartTime > time ? time : segmentStartTime;
    const end = segmentStartTime <= time ? time : segmentStartTime;
    if (start < end) {
      this.peaks.segments.add({
        startTime: start,
        endTime: end,
        id: "selected-segment"
      });
    }
  };

  render() {
    const { mp3url } = this.props;
    let { playing, currentTime, duration, speedup, loadErr } = this.state;
    if (this.isObject(currentTime)) currentTime = 0;
    if (mp3url == DEFAULT_MP3) duration = DEFAULT_DURATION;
    return (
      <div className="ff-audio">
        {duration != null ? (
          <div className="flex flex-center px2 relative z1">
            <PlayButton
              playing={playing}
              onTogglePlay={this.togglePlay}
              className="flex-none h2 mr2 button button-transparent button-grow rounded"
            />
            {/* seeking={Boolean}
                        seekingIcon={ReactElement} */}

            <div className="sb-soundplayer-volume mr2 flex flex-center">
              <button
                onClick={() => this.toggleRate()}
                className="sb-soundplayer-btn sb-soundplayer-volume-btn flex-none h2 button button-transparent button-grow rounded"
              >
                <img
                  className={speedup ? "audio-speedup" : ""}
                  src="/pane/speedup.svg"
                  height={35}
                />
              </button>
            </div>

            <div
              style={{ flex: 1, overflow: "hidden" }}
              onClick={this.handlePressDown}
              onMouseDown={this.handleDragEnter}
              onMouseUp={this.handleDragStop}
              ref={instance => {
                this.peaksWrapper = instance;
              }}
            >
              <audio
                src={this.props.mp3url}
                ref={instance => {
                  this.audioElement = instance;
                }}
              />
            </div>

            <Timer
              className={"timer"}
              duration={duration} // in seconds
              currentTime={currentTime != null ? currentTime : 0}
            />
          </div>
        ) : loadErr ? (
          <div style={{ padding: "5 20px" }}>
            Unable to load audio: {loadErr}
          </div>
        ) : (
          <div className="progress">
            <div className="indeterminate" />
          </div>
        )}
      </div>
    );
  }
}

AudioPlayer.propTypes = {
  mp3url: PropTypes.string.isRequired
};

export default AudioPlayer;
