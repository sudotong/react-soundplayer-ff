import React, { useState, useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import WaveSurferAsync from "wavesurfer.js-async";
import regions from "wavesurfer.js/dist/plugin/wavesurfer.regions";
import "./waveform.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlayCircle,
  faPauseCircle,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";

export default function WaveForm({ url }) {
  // const [trackUrl, setTrackUrl] = useState("");
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(true);
  const wavesurfer = useRef(null);
  const wave = useRef();

  const defaultUrl =
    "https://parse-server-ff.s3.amazonaws.com/ae5992f0f5bb1f259bafa41b3771e3bb_call12565815456dwwwwww795896232www-01b59bd3.mp3";

  useEffect(() => {
    let interval;
    setLoading(true);
    const urlString = url ? url : defaultUrl;
    // setTrackUrl(urlString);

    wavesurfer.current = WaveSurfer.create({
      barWidth: 1,
      height: 40,
      showTime: true,
      container: "#waveform",
      progressColor: "#fff",
      responsive: true,
      waveColor: "#006",
      interact: true,
      backend: "MediaElement",
      fillParent: true,
      scrollParent: false,
      cursorWidth: 3,
      plugins: [
        regions.create({
          regionMinLength: 2,
          dragSelection: {
            slop: 5,
          },
        }),
        WaveSurferAsync.create(),
      ],
    });

    wavesurfer.current.load(urlString);

    wavesurfer.current.on("ready", () => {
      setLoading(false);
      setDuration(formatTime(wavesurfer.current.getDuration()));
      interval = setInterval(() => {
        setCurrentTime(formatTime(wavesurfer.current.getCurrentTime()));
      }, 1000);
    });

    wavesurfer.current.on("error", (err) => {
      alert(err);
    });

    return () => {
      wavesurfer.current.destroy();
      clearInterval(interval);
    };
  }, []);

  // toggle play/pause
  function playPause() {
    wavesurfer.current.playPause();
    setPlaying(!playing);
  }

  // set playback speed for track (1 is normal speed, 2 is double speed).
  function setTrackSpeed(rate) {
    wavesurfer.current.setPlaybackRate(rate);
    setSpeed(rate);
    return;
  }

  // format seconds to hours minutes ans seconds
  function formatTime(time) {
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";
    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }

  return (
    <section className="container">
      <div className="spectrum-area">
        <div className="spectrum">
          <div id="waveform" ref={wave} />
        </div>

        <div className="controls">
          {/* checks if the track is playing then renders the pause button, if not render the play button  */}
          {playing ? (
            <button onClick={playPause} className="controls-button">
              <FontAwesomeIcon icon={faPauseCircle} size="2x" />
            </button>
          ) : (
            <button onClick={playPause} className="controls-button">
              <FontAwesomeIcon icon={faPlayCircle} size="2x" />
            </button>
          )}

          {/* checks the current speed, if speed is one, send two to the finction to increase speed, if not send 1  */}
          {speed === 1 ? (
            <button
              onClick={() => setTrackSpeed(2)}
              className="controls-button"
            >
              2<FontAwesomeIcon icon={faBolt} size="1x" />
            </button>
          ) : (
            <button
              onClick={() => setTrackSpeed(1)}
              className="controls-button"
            >
              1<FontAwesomeIcon icon={faBolt} size="1x" />
            </button>
          )}
        </div>
      </div>

      {loading ? null : (
        <div className="controls-panel">
          <div className="timestamp">
            <p>
              {currentTime} / {duration}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
