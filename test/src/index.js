import React from "react";
import ReactDOM from "react-dom";

import AudioPlayer from "./AudioPlayer";

ReactDOM.render(
  <div>
    <div className="audio-section">
      <AudioPlayer url="https://parse-server-ff.s3.amazonaws.com/ae5992f0f5bb1f259bafa41b3771e3bb_call12565815456dwwwwww795896232www-01b59bd3.mp3" />
    </div>
  </div>,
  document.getElementById("root")
);
