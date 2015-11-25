/*
 * Intel WebRTC SDK version 2.5.0
 * Copyright (c) 2015 Intel <http://webrtc.intel.com>
 * Homepage: http://webrtc.intel.com
 */


(function(window) {


var Woogeen = (function() {
  'use strict';

  var Woogeen = {};

  Object.defineProperties(Woogeen, {
    version: {
      get: function() { return '2.5.0'; }
    },
    name: {
      get: function() { return 'Intel WebRTC SDK'; }
    }
  });

  return Woogeen;
})();

var L = {};
var Erizo = {};



/*global unescape*/
L.Base64 = (function () {
    "use strict";
    var END_OF_INPUT, base64Chars, reverseBase64Chars, base64Str, base64Count, i, setBase64Str, readBase64, encodeBase64, readReverseBase64, ntos, decodeBase64;

    END_OF_INPUT = -1;

    base64Chars = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
        'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
        'w', 'x', 'y', 'z', '0', '1', '2', '3',
        '4', '5', '6', '7', '8', '9', '+', '/'
    ];

    reverseBase64Chars = [];

    for (i = 0; i < base64Chars.length; i = i + 1) {
        reverseBase64Chars[base64Chars[i]] = i;
    }

    setBase64Str = function (str) {
        base64Str = str;
        base64Count = 0;
    };

    readBase64 = function () {
        var c;
        if (!base64Str) {
            return END_OF_INPUT;
        }
        if (base64Count >= base64Str.length) {
            return END_OF_INPUT;
        }
        c = base64Str.charCodeAt(base64Count) & 0xff;
        base64Count = base64Count + 1;
        return c;
    };

    encodeBase64 = function (str) {
        var result, inBuffer, done;
        setBase64Str(str);
        result = '';
        inBuffer = new Array(3);
        done = false;
        while (!done && (inBuffer[0] = readBase64()) !== END_OF_INPUT) {
            inBuffer[1] = readBase64();
            inBuffer[2] = readBase64();
            result = result + (base64Chars[inBuffer[0] >> 2]);
            if (inBuffer[1] !== END_OF_INPUT) {
                result = result + (base64Chars [((inBuffer[0] << 4) & 0x30) | (inBuffer[1] >> 4)]);
                if (inBuffer[2] !== END_OF_INPUT) {
                    result = result + (base64Chars [((inBuffer[1] << 2) & 0x3c) | (inBuffer[2] >> 6)]);
                    result = result + (base64Chars[inBuffer[2] & 0x3F]);
                } else {
                    result = result + (base64Chars[((inBuffer[1] << 2) & 0x3c)]);
                    result = result + ('=');
                    done = true;
                }
            } else {
                result = result + (base64Chars[((inBuffer[0] << 4) & 0x30)]);
                result = result + ('=');
                result = result + ('=');
                done = true;
            }
        }
        return result;
    };

    readReverseBase64 = function () {
        if (!base64Str) {
            return END_OF_INPUT;
        }
        while (true) {
            if (base64Count >= base64Str.length) {
                return END_OF_INPUT;
            }
            var nextCharacter = base64Str.charAt(base64Count);
            base64Count = base64Count + 1;
            if (reverseBase64Chars[nextCharacter]) {
                return reverseBase64Chars[nextCharacter];
            }
            if (nextCharacter === 'A') {
                return 0;
            }
        }
    };

    ntos = function (n) {
        n = n.toString(16);
        if (n.length === 1) {
            n = "0" + n;
        }
        n = "%" + n;
        return unescape(n);
    };

    decodeBase64 = function (str) {
        var result, inBuffer, done;
        setBase64Str(str);
        result = "";
        inBuffer = new Array(4);
        done = false;
        while (!done && (inBuffer[0] = readReverseBase64()) !== END_OF_INPUT && (inBuffer[1] = readReverseBase64()) !== END_OF_INPUT) {
            inBuffer[2] = readReverseBase64();
            inBuffer[3] = readReverseBase64();
            result = result + ntos((((inBuffer[0] << 2) & 0xff)| inBuffer[1] >> 4));
            if (inBuffer[2] !== END_OF_INPUT) {
                result +=  ntos((((inBuffer[1] << 4) & 0xff) | inBuffer[2] >> 2));
                if (inBuffer[3] !== END_OF_INPUT) {
                    result = result +  ntos((((inBuffer[2] << 6)  & 0xff) | inBuffer[3]));
                } else {
                    done = true;
                }
            } else {
                done = true;
            }
        }
        return result;
    };

    return {
        encodeBase64: encodeBase64,
        decodeBase64: decodeBase64
    };
}());


/*global console*/

/*
 * API to write logs based on traditional logging mechanisms: debug, trace, info, warning, error
 */
L.Logger = (function () {
  "use strict";
  var DEBUG = 0, TRACE = 1, INFO = 2, WARNING = 3, ERROR = 4, NONE = 5, logLevel = DEBUG, setLogLevel, log, debug, trace, info, warning, error;

  // It sets the new log level. We can set it to NONE if we do not want to print logs
  setLogLevel = function (level) {
    if (level > NONE) {
      level = NONE;
    } else if (level < DEBUG) {
      level = DEBUG;
    }
    logLevel = level;
  };

  // Generic function to print logs for a given level: [DEBUG, TRACE, INFO, WARNING, ERROR]
  log = function () {
    var level = arguments[0];
    var args = arguments;
    if (level < logLevel) {
      return;
    }
    switch (level) {
    case DEBUG:
      args[0] = 'DEBUG:';
      break;
    case TRACE:
      args[0] = 'TRACE:';
      break;
    case INFO:
      args[0] = 'INFO:';
      break;
    case WARNING:
      args[0] = 'WARNING:';
      break;
    case ERROR:
      args[0] = 'ERROR:';
      break;
    default:
      return;
    }
    console.log.apply(console, args);
  };

  // It prints debug logs
  debug = function () {
    var args = [DEBUG];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    log.apply(this, args);
  };

  // It prints trace logs
  trace = function () {
    var args = [TRACE];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    log.apply(this, args);
  };

  // It prints info logs
  info = function () {
    var args = [INFO];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    log.apply(this, args);
  };

  // It prints warning logs
  warning = function () {
    var args = [WARNING];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    log.apply(this, args);
  };

  // It prints error logs
  error = function () {
    var args = [ERROR];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    log.apply(this, args);
  };

  return {
    DEBUG: DEBUG,
    TRACE: TRACE,
    INFO: INFO,
    WARNING: WARNING,
    ERROR: ERROR,
    NONE: NONE,
    setLogLevel: setLogLevel,
    log: log,
    debug: debug,
    trace: trace,
    info: info,
    warning: warning,
    error: error
  };
}());


/* global webkitURL, chrome */
(function () {
  'use strict';
/**
    *@namespace Woogeen
    *@desc TODO:Description of namespace Woogeen.
    */
/**
 * @class Woogeen.Stream
 * @classDesc Handles the WebRTC (audio, video) stream, identifies the stream, and identifies the location where the stream should be displayed. There are two stream classes: LocalStream and RemoteStream.
 */
  function WoogeenStream (spec) {
    // if (!(this instanceof WoogeenStream)) {
    //   return new WoogeenStream();
    // }
    this.mediaStream = spec.mediaStream;
    spec.attributes = spec.attributes || {};
    this.url = function () {
      if(typeof spec.url === 'string' && spec.url !== '') {
        return spec.url;
      }
      return undefined;
    };
/**
   * @function hasVideo
   * @desc This function returns true when stream has video track otherwise false.
   * @memberOf Woogeen.Stream
   * @instance
   * @return true The stream has video.<br>false The stream does not have video.
   * @example
<script type="text/JavaScript">
L.Logger.info('stream hasVideo:', stream.hasVideo());
</script>
   */
    this.hasVideo = function () {
      return !!spec.video;
    };
/**
   * @function hasAudio
   * @desc This function returns true when stream has audio track otherwise false.
   * @memberOf Woogeen.Stream
   * @instance
   * @return true The stream has audio.<br>false The stream does not have audio.
   * @example
<script type="text/JavaScript">
L.Logger.info('stream hasAudio:', stream.hasAudio());
</script>
   */
    this.hasAudio = function () {
      return !!spec.audio;
    };
/**
   * @function attributes
   * @desc This function returns all user-defined attributes in stream.
   * @memberOf Woogeen.Stream
   * @instance
   * @return All the user-defined attributes.
   * @example
<script type="text/JavaScript">
L.Logger.info('stream attibutes:', stream.attributes());
</script>
   */
    this.attributes = function () {
      return spec.attributes;
    };
/**
   * @function attr
   * @desc This function sets user-defined value in attributes when value is provided; otherwise returns corresponding attribute.
   * @memberOf Woogeen.Stream
   * @instance
   * @param {string} key attribute key.
   * @param {string} value attribute value.
   * @return Existing attribute value if it's not specified in parameter
   * @example
<script type="text/JavaScript">
stream.attr("custom_key", "custom_value");
</script>
   */
    this.attr = function (key, value) {
      if (arguments.length > 1) {
        spec.attributes[key] = value;
      }
      return spec.attributes[key];
    };
/**
   * @function id
   * @desc This function returns stream Id assigned by server.
<br><b>Remarks:</b><br>
For local stream, it returns null if the stream has not been published; once published, stream Id should be updated by server.
   * @memberOf Woogeen.Stream
   * @instance
   * @return {string} Stream Id assigned by server.
   * @example
<script type="text/JavaScript">
L.Logger.info('stream added:', stream.id());
</script>
   */
    this.id = function () {
      return spec.id || null;
    };
/**
   * @function isScreen
   * @desc This function returns true when stream's video track is from screen sharing otherwise false.
   * @memberOf Woogeen.Stream
   * @instance
   * @return {boolean} true The stream is from screen;<br>otherwise false.
   * @example
<script type="text/JavaScript">
L.Logger.info('stream is from screen?', stream.isScreen());
</script>
   */
    this.isScreen = function () {
      return (!!spec.video) && (spec.video.device === 'screen'); // device: 'camera', 'screen'
    };
    this.bitRate = {
      maxVideoBW: undefined,
      maxAudioBW: undefined
    }; // mutable;
    this.toJson = function () {
      return {
        id: this.id(),
        audio: spec.audio,
        video: spec.video,
        attributes: spec.attributes
      };
    };
  }
/**
   * @function close
   * @desc This function closes the stream.
<br><b>Remarks:</b><br>
If the stream has audio and/or video, it also stops capturing camera/microphone. If the stream is published to a conference, the function also un-publishes it. If the stream is published to a P2P session, the function does NOT un-publish it. If the stream is showing in an HTML element, the stream would be hidden. Once a LocalStream is closed, it is no longer usable.
   * @memberOf Woogeen.Stream
   * @instance
   * @example
<script type="text/JavaScript">
var stream = Woogeen.Stream({audio:true, video:true, data: false, attributes:
{name:'WoogeenStream'}});
stream.close();
</script>
   */
  WoogeenStream.prototype.close = function() {
    if (typeof this.hide === 'function') {this.hide();}
    if (this.mediaStream) {
      this.mediaStream.getTracks().map(function(track) {
        if (typeof track.stop === 'function') {
          track.stop();
        }
      });
    }
    this.mediaStream = null;
    if (typeof this.unpublish === 'function') {
      this.unpublish();
    }
    // close peer connection if necessary
    if (this.channel && typeof this.channel.close === 'function') {
      this.channel.close();
    }
  };

  WoogeenStream.prototype.createObjectURL = function() {
    if (!this.mediaStream) {return '';}
    return (window.URL || webkitURL).createObjectURL(this.mediaStream);
  };
/**
   * @function disableAudio
   * @desc This function disables underlying audio track in the stream if it has audio capacity; otherwise it does nothing.
<br><b>Remarks:</b><br>
For remote stream, it stops decoding audio; for local stream, it also stops capturing audio.
   * @memberOf Woogeen.Stream
   * @instance
   * @return {boolean} true The stream has audio and the audio track is enabled previously; <br> otherwise false.
   * @example
<script type="text/JavaScript">
stream.disableAudio();
</script>
   */
  WoogeenStream.prototype.disableAudio = function(tracknum) {
    var self = this;
    if (self.hasAudio() && self.mediaStream) {
      if (tracknum === undefined) {
        tracknum = 0;
      }
      if (tracknum === -1) {
        return self.mediaStream.getAudioTracks().map(function (track) {
          if (track.enabled) {
            track.enabled = false;
            return true;
          }
          return false;
        });
      }
      var tracks = self.mediaStream.getAudioTracks();
      if (tracks && tracks[tracknum] && tracks[tracknum].enabled) {
        tracks[tracknum].enabled = false;
        return true;
      }
    }
    return false;
  };
/**
   * @function enableAudio
   * @desc This function enables underlying audio track in the stream if it has audio capacity.
<br><b>Remarks:</b><br>
For remote stream, it continues decoding audio; for local stream, it also continues capturing audio.
   * @memberOf Woogeen.Stream
   * @instance
   * @return {boolean} true The stream has audio and the audio track is disabled previously; <br> otherwise false.
   * @example
<script type="text/JavaScript">
stream.enableAudio();
</script>
   */
  WoogeenStream.prototype.enableAudio = function(tracknum) {
    var self = this;
    if (self.hasAudio() && self.mediaStream) {
      if (tracknum === undefined) {
        tracknum = 0;
      }
      if (tracknum === -1) {
        return self.mediaStream.getAudioTracks().map(function (track) {
          if (track.enabled !== true) {
            track.enabled = true;
            return true;
          }
          return false;
        });
      }
      var tracks = self.mediaStream.getAudioTracks();
      if (tracks && tracks[tracknum] && tracks[tracknum].enabled !== true) {
        tracks[tracknum].enabled = true;
        return true;
      }
    }
    return false;
  };

/**
   * @function disableVideo
   * @desc This function disables underlying video track in the stream if it has video capacity; otherwise it does nothing.
<br><b>Remarks:</b><br>
For remote stream, it stops decoding video; for local stream, it also stops capturing video.
   * @memberOf Woogeen.Stream
   * @instance
   * @return {boolean} true The stream has video and the video track is enabled previously; <br> otherwise false.
   * @example
<script type="text/JavaScript">
stream.disableVideo();
</script>
   */
  WoogeenStream.prototype.disableVideo = function(tracknum) {
    var self = this;
    if (self.hasVideo() && self.mediaStream) {
      if (tracknum === undefined) {
        tracknum = 0;
      }
      if (tracknum === -1) {
        return self.mediaStream.getVideoTracks().map(function (track) {
          if (track.enabled) {
            track.enabled = false;
            return true;
          }
          return false;
        });
      }
      var tracks = self.mediaStream.getVideoTracks();
      if (tracks && tracks[tracknum] && tracks[tracknum].enabled) {
        tracks[tracknum].enabled = false;
        return true;
      }
    }
    return false;
  };

/**
   * @function enableVideo
   * @desc This function enables underlying video track in the stream if it has video capacity.
<br><b>Remarks:</b><br>
For remote stream, it continues decoding video; for local stream, it also continues capturing video.
   * @memberOf Woogeen.Stream
   * @instance
   * @return {boolean} true The stream has video and the video track is disabled previously; <br> otherwise false.
   * @example
<script type="text/JavaScript">
stream.enableVideo();
</script>
   */
  WoogeenStream.prototype.enableVideo = function(tracknum) {
    var self = this;
    if (self.hasVideo() && self.mediaStream) {
      if (tracknum === undefined) {
        tracknum = 0;
      }
      if (tracknum === -1) {
        return self.mediaStream.getVideoTracks().map(function (track) {
          if (track.enabled !== true) {
            track.enabled = true;
            return true;
          }
          return false;
        });
      }
      var tracks = self.mediaStream.getVideoTracks();
      if (tracks && tracks[tracknum] && tracks[tracknum].enabled !== true) {
        tracks[tracknum].enabled = true;
        return true;
      }
    }
    return false;
  };

  function WoogeenLocalStream (spec) {
    WoogeenStream.call(this, spec);
  }

  function WoogeenRemoteStream (spec) {
    WoogeenStream.call(this, spec);
/**
   * @function isMixed
   * @desc This function returns true when stream's video track is mixed by server otherwise false.
<br><b>Remarks:</b><br>
Deprecated, use <code>instanceof Woogeen.MixedStream</code> instead.
   * @memberOf Woogeen.RemoteStream
   * @instance
   * @return {boolean} true The stream is mixed stream.<br>false The stream is not mixed stream
   * @example
<script type="text/JavaScript">
L.Logger.info('stream isMixed:', stream.isMixed());
</script>
   */
    this.isMixed = function () {
      return false;
    };

    this.from = spec.from;
    var listeners = {};
    var self = this;
    Object.defineProperties(this, {
/**
   * @function on
   * @desc This function registers a listener for a specified event, which would be called when the event occurred.
<br><b>Remarks:</b><br>
Reserved events from MCU:<br>
<table class="params table table-striped">
<thead>
  <tr><th align="center">Event Name</th><th align="center">Description</th><th align="center">Status</th></tr>
</thead>
<tbody>
  <tr><td align="center"><code>VideoLayoutChanged</code></td><td align="center">Video layout of a mix (remote) stream changed</td><td align="center">stable</td></tr>
  <tr><td align="center"><code>VideoEnabled</code></td><td align="center">Video track of a remote stream enabled</td><td align="center">reserved</td></tr>
  <tr><td align="center"><code>VideoDisabled</code></td><td align="center">Video track of a remote stream disabled</td><td align="center">reserved</td></tr>
  <tr><td align="center"><code>AudioEnabled</code></td><td align="center">Audio track of a remote stream enabled</td><td align="center">reserved</td></tr>
  <tr><td align="center"><code>AudioDisabled</code></td><td align="center">Audio track of a remote stream disabled</td><td align="center">reserved</td></tr>
</tbody>
</table>
User-defined events and listeners are also supported, See {@link Woogeen.RemoteStream#emit|stream.emit(event, data)} method.
   * @memberOf Woogeen.RemoteStream
   * @param {string} event Event name.
   * @param {function} listener(data) Callback function.
   * @instance
   * @example
<script type="text/JavaScript">
if (stream.isMixed()) {
  stream.on('VideoLayoutChanged', function () {
    L.Logger.info('stream', stream.id(), 'video layout changed');
  });
}
</script>
   */
      on: {
        get: function () {
          return function (event, listener) {
            listeners[event] = listeners[event] || [];
            listeners[event].push(listener);
            return self;
          };
        }
      },
/**
   * @function emit
   * @desc This function triggers a specified event, which would invoke corresponding event listener(s).
   * @memberOf Woogeen.RemoteStream
   * @param {string} event Event name.
   * @param {user-defined} data Data fed to listener function.
   * @instance
   */
      emit: {
        get: function () {
          return function (event) {
            if (listeners[event]) {
              var args = [].slice.call(arguments, 1);
              listeners[event].map(function (fn) {
                fn.apply(self, args);
              });
            }
            return self;
          };
        }
      },
/**
   * @function removeListener
   * @desc This function removes listener(s) for a specified event. If listener is unspecified, all the listener(s) of the event would be removed; or if the listener is in the event listener list, it would be removed; otherwise this function does nothing.
   * @memberOf Woogeen.RemoteStream
   * @param {string} event Event name.
   * @param {function} listener Corresponding callback function (optional).
   * @instance
   */
      removeListener: {
        get: function () {
          return function (event, cb) {
            if (cb === undefined) {
              listeners[event] = [];
            } else {
              if (listeners[event]) {
                listeners[event].map(function (fn, index) {
                  if (fn === cb) {
                    listeners[event].splice(index, 1);
                  }
                });
              }
            }
            return self;
          };
        }
      },
/**
   * @function clearListeners
   * @desc This function removes all registered listener(s) for all events on the stream.
   * @memberOf Woogeen.RemoteStream
   * @instance
   */
      clearListeners: {
        get: function () {
          return function () {
            listeners = {};
            return self;
          };
        }
      }
    });
  }

  function WoogeenMixedStream (spec) {
    WoogeenRemoteStream.call(this, spec);
/**
   * @function resolutions
   * @desc This function returns an array of supported resolutions for mixed stream.
   * @memberOf Woogeen.MixedStream
   * @instance
   * @return {Array}
   */
    this.resolutions = function () {
      if (spec.video.resolutions instanceof Array) {
        return spec.video.resolutions.map(function (resolution) {
          return resolution;
        });
      }
      return [];
    };

    this.isMixed = function () {
      return true;
    };
  }

  WoogeenLocalStream.prototype = Object.create(WoogeenStream.prototype);
  WoogeenRemoteStream.prototype = Object.create(WoogeenStream.prototype);
  WoogeenMixedStream.prototype = Object.create(WoogeenRemoteStream.prototype);
  WoogeenLocalStream.prototype.constructor = WoogeenLocalStream;
  WoogeenRemoteStream.prototype.constructor = WoogeenRemoteStream;
  WoogeenMixedStream.prototype.constructor = WoogeenMixedStream;


  function isLegacyChrome () {
    return window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./) !== null &&
      window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./)[1] <= 35;
  }

  function isLegacyIE () {
    return window.navigator.appVersion.indexOf('Trident') > -1 &&
      window.navigator.appVersion.indexOf('rv') > -1;
  }

  function getReso(w, h) {
    return {
      mandatory: {
        minWidth: w,
        minHeight: h,
        maxWidth: w,
        maxHeight: h
      },
      optional: []
    };
  }

  var supportedVideoList = {
    'true': {mandatory: {}},
    'unspecified': {mandatory: {}},
    'sif': getReso(320, 240),
    'vga': getReso(640, 480),
    'hd720p': getReso(1280, 720),
    'hd1080p': getReso(1920, 1080)
  };

  var getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
                     navigator.mozGetUserMedia || navigator.msGetUserMedia);


  /*
  createLocalStream({
    video: {
      device: 'camera',
      resolution: '720p',
      frameRate: [200, 500]
    },
    audio: true,
    attribtues: null
  }, function () {});
  */
  function createLocalStream (option, callback) {
    if (typeof option === 'object' && option !== null && option.url !== undefined) {
      var localStream = new Woogeen.LocalStream(option);
      if (typeof callback === 'function') {
        callback(null, localStream);
      }
      return;
    }
    if (typeof getMedia !== 'function' && !isLegacyIE()) {
      if (typeof callback === 'function') {
        callback({
          code: 1100,
          msg: 'webrtc support not available'
        });
      }
      return;
    }
    var init_retry = arguments[3];
    if (init_retry === undefined) {
      init_retry = 2;
    }
    var mediaOption = {};

    if (typeof option === 'object' && option !== null) {
      if (option.video) {
        if (option.video.device === 'screen') {
          if (window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./)[1] < 34) {
            if (typeof callback === 'function') {
              callback({
                code: 1103,
                msg: 'browser screen sharing not supported'
              });
              return;
            }
          }
        }

        mediaOption.video = JSON.parse(JSON.stringify(supportedVideoList[option.video.resolution] || supportedVideoList.unspecified));
        if(!isLegacyIE()){
          if (!isLegacyChrome() && option.video.frameRate instanceof Array && option.video.frameRate.length >= 2) {
            mediaOption.video.mandatory.minFrameRate = option.video.frameRate[0];
            mediaOption.video.mandatory.maxFrameRate = option.video.frameRate[1];
          }
        }
      }
      if (option.audio) {
        mediaOption.audio = true;
      }
    } else {
      if (typeof callback === 'function') {
        callback({
          code: 1107,
          msg: 'USER_INPUT_INVALID'
        });
        return;
      }
    }

    var onSuccess = function (mediaStream) {
      option.mediaStream = mediaStream;
      var localStream = new Woogeen.LocalStream(option);
      if (option.video && option.video.device === 'screen') {
        // when <Stop sharing> button in Browser was pressed, `onended' would
        // be triggered; then we need to close the screen sharing stream.
        // `onended' is a EventHandler containing the action
        // to perform when an ended event is fired on the object,
        // that is when the streaming is terminating.
        mediaStream.onended = function () {
          localStream.close();
        };
      }
      if (mediaOption.video) {
        // set default bit rate
        switch (mediaOption.video.mandatory.maxWidth) {
        case 320:
          localStream.bitRate.maxVideoBW = 512;
          break;
        case 640:
          localStream.bitRate.maxVideoBW = 1024;
          break;
        case 1280:
          localStream.bitRate.maxVideoBW = 2048;
          break;
        default:
          // localStream.bitRate.maxVideoBW = undefined;
          break;
        }
      }
      if (typeof callback === 'function') {
        callback(null, localStream);
      }
    };

    var onFailure = function (error) {
      var err = {code: 1100, msg: error.name || error};
      switch (err.msg) {
      // below - internally handled
      case 'Starting video failed':       // firefox: camera possessed by other process?
      case 'TrackStartError':             // chrome: probably resolution not supported
        option.video = {
          device: option.video.device,
          extensionId: option.video.extensionId
        };
        if (init_retry > 0) {
          setTimeout(function () {
            createLocalStream(option, callback, init_retry-1);
          }, 1);
          return;
        } else {
          err.msg = 'MEDIA_OPTION_INVALID';
          err.code = 1104;
        }
        break;
      // below - exposed
      case 'DevicesNotFoundError':        // chrome
        err.msg = 'DEVICES_NOT_FOUND';
        err.code = 1102;
        break;
      case 'NotSupportedError':           // chrome
        err.msg = 'NOT_SUPPORTED';
        err.code = 1105;
        break;
      case 'PermissionDeniedError':       // chrome
        err.msg = 'PERMISSION_DENIED';
        err.code = 1101;
        break;
      case 'PERMISSION_DENIED':           // firefox
        err.code = 1101;
        break;
      case 'ConstraintNotSatisfiedError': // chrome
        err.msg = 'CONSTRAINT_NOT_SATISFIED';
        err.code = 1106;
        break;
      default:
        if (!err.msg) {
          err.msg = 'UNDEFINED';
        }
      }
      if (typeof callback === 'function') {
        callback(err);
      }
    };

    if (option.video && option.video.device === 'screen') {
      var extensionId = option.video.extensionId || 'pndohhifhheefbpeljcmnhnkphepimhe';
      mediaOption.audio = false;
      try {
        chrome.runtime.sendMessage(extensionId, {getStream: true}, function (response) {
          if (response === undefined) {
            if (typeof callback === 'function') {
              callback({
                code: 1103,
                msg: 'screen sharing plugin inaccessible'
              });
            }
            return;
          }
          mediaOption.video.mandatory.chromeMediaSource = 'desktop';
          mediaOption.video.mandatory.chromeMediaSourceId = response.streamId;
          getMedia.apply(navigator, [mediaOption, onSuccess, onFailure]);
        });
      } catch (err) {
        if (typeof callback === 'function') {
          callback({
            code: 1103,
            msg: 'screen sharing plugin inaccessible',
            err: err
          });
        }
      }
      return;
    }
    if(!isLegacyIE()){
      getMedia.apply(navigator, [mediaOption, onSuccess, onFailure]);
    }else{
      navigator.getUserMedia(mediaOption, onSuccess, onFailure);
    }
  }
/**
   * @function create
   * @desc This factory returns a Woogeen.LocalStream instance with user defined options.<br>
<br><b>Remarks:</b><br>
When the video/audio parameters are not supported by the browser, a fallback parameter set will be used; if the fallback also fails, the callback (if specified) is invoked with an error. See details in callback description.
<br><b>options:</b>
<ul>
    <li>audio: true/false.</li>
    <li>video: device, resolution, frameRate, extensionId.</li>
        <ul>
            <li>Valid device list:</li>
                <ul>
                    <li>'camera' for stream from camera;</li>
                    <li>'screen' for stream from screen;<br>
                    Screen stream creating can be done only when your web-app is in HTTPS/SSL environment.
                    </li>
                </ul>
            <li>Valid resolution list:</li>
                <ul>
                    <li>'unspecified'</li>
                    <li>'sif'</li>
                    <li>'vga'</li>
                    <li>'hd720p'</li>
                    <li>'hd1080p'</li>
                </ul>
            <li>frameRate should be an array as [min_frame_rate, max_frame_rate], in which each element should be a proper number, e.g., [20, 30].</li>
            <li>extensionId is id of Chrome Extension for screen sharing. If not provided, the id of <a href="https://chrome.google.com/webstore/detail/webrtc-desktop-sharing-ex/pndohhifhheefbpeljcmnhnkphepimhe">WebRTC Desktop Sharing Extension</a> would be used.</li>
            <li><b>Note</b>: Firefox currently does not fully support resolution or frameRate setting.</li>
        </ul>
    <li>url: RTSP stream URL</li>
</ul>
<br><b>callback:</b>
<br>Upon success, err is null, and localStream is an instance of Woogeen.LocalStream; upon failure localStream is undefined and err is one of the following:<br>
<ul>
  <li><b>{code: 1100, msg: xxx}</b> - general stream creation error, e.g., no WebRTC support in browser, uncategorized error, etc.</li>
  <li><b>{code: 1101, msg: 'PERMISSION_DENIED'}</b> – access media (camera, microphone, etc) denied.</li>
  <li><b>{code: 1102, msg: 'DEVICES_NOT_FOUND'}</b> – no camera or microphone available.</li>
  <li><b>{code: 1103, msg: xxx}</b> - error in accessing screen sharing plugin: not supported, not installed or disabled.</li>
  <li><b>{code: 1104, msg: 'MEDIA_OPTION_INVALID'}</b> – video/audio parameters are invalid on browser and fallback fails.</li>
  <li><b>{code: 1105, msg: 'NOT_SUPPORTED'}</b> - media option not supported by the browser.</li>
  <li><b>{code: 1106, msg: 'CONSTRAINT_NOT_SATISFIED'}</b> – one of the mandatory constraints could not be satisfied.</li>
  <li><b>{code: 1107, msg: 'USER_INPUT_INVALID'}</b> – user input media option is invalid.</li>
</ul>
   * @memberOf Woogeen.LocalStream
   * @static
   * @param {json} options Stream creation options.
   * @param {function} callback callback(err, localStream) will be invoked when LocalStream creation is done.
   * @example
<script type="text/javascript">
// LocalStream
var localStream;
Woogeen.LocalStream.create({
  video: {
    device: 'camera',
    resolution: 'vga',
  },
  audio: true
}, function (err, stream) {
  if (err) {
    return console.log('create LocalStream failed:', err);
  }
  localStream = stream;
});
</script>
   */
  WoogeenLocalStream.create = function() {
    createLocalStream.apply(this, arguments);
  };

  Woogeen.Stream = WoogeenStream;

/**
 * @class Woogeen.LocalStream
 * @extends Woogeen.Stream
 * @classDesc Stream from browser constructed from camera, screen, external input(e.g. rtsp)... Use create(options, callback) factory to create an instance.
 */
  Woogeen.LocalStream = WoogeenLocalStream;
/**
 * @class Woogeen.RemoteStream
 * @extends Woogeen.Stream
 * @classDesc Stream from server retrieved by 'stream-added' event. RemoteStreams are automatically constructed upon the occurrence of the event.
<br><b>Example:</b>
```
<script type="text/javascript">
conference.on('stream-added', function (event) {
  var remoteStream = event.stream;
console.log('stream added:', stream.id());
});
</script>
```
 */
  Woogeen.RemoteStream = WoogeenRemoteStream;
/**
 * @class Woogeen.MixedStream
 * @extends Woogeen.RemoteStream
 * @classDesc A RemoteStream whose video track is mixed by server.
 */
  Woogeen.MixedStream = WoogeenMixedStream;

}());



/*
 * Class EventDispatcher provides event handling to sub-classes.
 * It is inherited from Publisher, Room, etc.
 */
Woogeen.EventDispatcher = function (spec) {
  'use strict';
  var that = {};
  // Private vars
  spec.dispatcher = {};
  spec.dispatcher.eventListeners = {};

  // Public functions

/**
   * @function addEventListener
   * @desc This function registers a callback function as a handler for the corresponding event. See <a href="index.html#Events">eventType</a> description.
   * @memberOf Woogeen.ConferenceClient
   * @instance
   * @param {string} eventType Event string.
   * @param {function} listener Callback function.
   * @example
<script type="text/JavaScript">
var conference = Woogeen.ConferenceClient.create();
conference.addEventListener("server-disconnected", function (evt) {...});
conference.leave();
</script>
   */
  that.addEventListener = function (eventType, listener) {
    if (spec.dispatcher.eventListeners[eventType] === undefined) {
      spec.dispatcher.eventListeners[eventType] = [];
    }
    spec.dispatcher.eventListeners[eventType].push(listener);
  };

/**
   * @function on
   * @desc This function equals to {@link Woogeen.ConferenceClient#addEventListener|addEventListener}.See <a href="index.html#Events">eventType</a> description.
   * @memberOf Woogeen.ConferenceClient
   * @instance
   * @param {string} eventType Event string.
   * @param {function} listener Callback function.
*/
  that.on = that.addEventListener;

/**
   * @function removeEventListener
   * @desc This function removes a registered event listener.
   * @memberOf Woogeen.ConferenceClient
   * @instance
   * @param {string} eventType Event string.
   * @param {function} listener Callback function.
   */
  that.removeEventListener = function (eventType, listener) {
    if (!spec.dispatcher.eventListeners[eventType]) {return;}
    var index = spec.dispatcher.eventListeners[eventType].indexOf(listener);
    if (index !== -1) {
      spec.dispatcher.eventListeners[eventType].splice(index, 1);
    }
  };

/**
   * @function clearEventListener
   * @desc This function removes all event listeners for one type.
   * @memberOf Woogeen.ConferenceClient
   * @instance
   * @param {string} eventType Event string.
   */
  that.clearEventListener = function (eventType) {
    spec.dispatcher.eventListeners[eventType] = [];
  };

  // It dispatch a new event to the event listeners, based on the type
  // of event. All events are intended to be LicodeEvents.
  that.dispatchEvent = function (event) {
    if (!spec.dispatcher.eventListeners[event.type]) {return;}
    spec.dispatcher.eventListeners[event.type].map(function (listener) {
      listener(event);
    });
  };

  return that;
};

// **** EVENTS ****

function WoogeenEvent (spec) { // base event class
  'use strict';
  this.type = spec.type;
  this.attributes = spec.attributes;
}

/*
 * Class StreamEvent represents an event related to a stream.
 * It is usually initialized this way:
 * var streamEvent = StreamEvent({type:'stream-added', stream:stream1});
 * Event types:
 * 'stream-added' - indicates that there is a new stream available in the room.
 * 'stream-removed' - shows that a previous available stream has been removed from the room.
 */
Woogeen.StreamEvent = function WoogeenStreamEvent (spec) {
  'use strict';
  WoogeenEvent.call(this, spec);
  this.stream = spec.stream;
  this.msg = spec.msg;
};

/*
 * Class ClientEvent represents an event related to a client.
 * It is usually initialized this way:
 * var clientEvent = ClientEvent({type:'peer-left', user: user1, attr: attributes});
 * Event types:
 * 'client-disconnected' - shows that the user has been already disconnected.
 * 'peer-joined' - indicates that there is a new peer joined.
 * 'peer-left' - indicates that a peer has left.
 */
Woogeen.ClientEvent = function WoogeenClientEvent (spec) {
  'use strict';
  WoogeenEvent.call(this, spec);
  this.user = spec.user;
};

/*
 * Class MessageEvent represents an event related to a custom message.
 */
Woogeen.MessageEvent = function WoogeenMessageEvent (spec) {
  'use strict';
  WoogeenEvent.call(this, spec);
  this.msg = spec.msg;
};

/*
 * Class ChatEvent represents an event related to P2P chat.
 */
Woogeen.ChatEvent = function WoogeenChatEvent (spec) {
  'use strict';
  WoogeenEvent.call(this, spec);
  this.type = spec.type;
  this.senderId = spec.senderId;
  this.peerId = spec.peerId;
};

/*
 * Class DataEvent represents an event related to data channel.
 */
Woogeen.DataEvent = function WoogeenDataEvent (spec) {
  'use strict';
  WoogeenEvent.call(this, spec);
  this.type = spec.type;
  this.senderId = spec.senderId;
  this.data = spec.data;
};

// inheritance
Woogeen.StreamEvent.prototype = Object.create(WoogeenEvent.prototype);
Woogeen.StreamEvent.prototype.constructor = Woogeen.StreamEvent;
Woogeen.ClientEvent.prototype = Object.create(WoogeenEvent.prototype);
Woogeen.ClientEvent.prototype.constructor = Woogeen.ClientEvent;
Woogeen.MessageEvent.prototype = Object.create(WoogeenEvent.prototype);
Woogeen.MessageEvent.prototype.constructor = Woogeen.MessageEvent;
Woogeen.ChatEvent.prototype = Object.create(WoogeenEvent.prototype);
Woogeen.ChatEvent.prototype.constructor = Woogeen.ChatEvent;
Woogeen.DataEvent.prototype = Object.create(WoogeenEvent.prototype);
Woogeen.DataEvent.prototype.constructor = Woogeen.DataEvent;



/* global io */

/**
 * @class Woogeen.ConferenceClient
 * @classDesc Provides connection, local stream publication, and remote stream subscription for a video conference. The conference client is created by the server side API. The conference client is retrieved by the client API with the access token for the connection.
 */

Woogeen.ConferenceClient = (function () {
  'use strict';

  function safeCall () {
    var callback = arguments[0];
    if (typeof callback === 'function') {
      var args = Array.prototype.slice.call(arguments, 1);
      callback.apply(null, args);
    }
  }

  Woogeen.sessionId = 103;

  function createChannel (spec) {
    spec.session_id = (Woogeen.sessionId += 1);
    var that;
    if (window.navigator.userAgent.match('Firefox') !== null) {
      // Firefox
      that = Erizo.FirefoxStack(spec);
      that.browser = 'mozilla';
    } else if (window.navigator.appVersion.indexOf('Trident') > -1) {
      that = Erizo.IEStableStack(spec);
      that.browser = 'internet-explorer';
    } else if (window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./)[1] >= 26) {
      // Google Chrome Stable.
      that = Erizo.ChromeStableStack(spec);
      that.browser = 'chrome-stable';
    } else {
      // None.
      throw 'WebRTC stack not available';
    }
    return that;
  }

  function createRemoteStream (spec) {
    if (!spec.video) {
      return new Woogeen.RemoteStream(spec);
    }
    switch (spec.video.device) {
    case 'mcu':
      return new Woogeen.MixedStream(spec);
    default:
      return new Woogeen.RemoteStream(spec);
    }
  }

  var DISCONNECTED = 0, CONNECTING = 1, CONNECTED = 2;
  var internalDispatcher = Woogeen.EventDispatcher({});

  function WoogeenConference (spec) {
    var that = spec || {};
    this.remoteStreams = {};
    this.localStreams = {};
    that.state = DISCONNECTED;
/**
   * @function setIceServers
   * @desc This function establishes a connection to server and joins a certain conference.
<br><b>Remarks:</b><br>
This method accepts string, object, or array (multiple ones) type of ice server item as argument. Typical description of each valid value should be as below:<br>
<ul>
<li>For turn: {url: "url", username: "username", credential: "password"}.</li>
<li>For stun: {url: "url"}, or simply "url" string.</li>
</ul>
Each time this method is called, previous saved value would be discarded. Specifically, if parameter servers is not provided, the result would be an empty array, meaning any predefined servers are discarded.
   * @instance
   * @memberOf Woogeen.ConferenceClient
   * @param {string/object/array} servers turn or stun server configuration.
   * @return {array} Result of the user-set of ice servers.
   * @example
<script type="text/JavaScript">
var conference = Woogeen.ConferenceClient.create();
conference.setIceServers([{
    url: "turn:61.152.239.60:4478?transport=udp",
    username: "woogeen",
    credential: "master"
  }, {
    url: "turn:61.152.239.60:443?transport=tcp",
    username: "woogeen",
    credential: "master"
  }]);
</script>
   */
    this.setIceServers = function () {
      that.userSetIceServers = [];
      Array.prototype.slice.call(arguments, 0).map(function (arg) {
        if (arg instanceof Array) {
          arg.map(function (server) {
            if (typeof server === 'object' && server !== null && typeof server.url === 'string' && server.url !== '') {
              that.userSetIceServers.push(server);
            } else if (typeof server === 'string' && server !== '') {
              that.userSetIceServers.push({url: server});
            }
          });
        } else if (typeof arg === 'object' && arg !== null && typeof arg.url === 'string' && arg.url !== '') {
          that.userSetIceServers.push(arg);
        } else if (typeof arg === 'string' && arg !== '') {
          that.userSetIceServers.push({url: arg});
        }
      });
      return that.userSetIceServers;
    };

    this.getIceServers = function () {
      return that.userSetIceServers;
    };

    Object.defineProperties(this, {
      state: {
        get: function () {
          return that.state;
        }
      }
    });

/**
   * @function join
   * @instance
   * @desc This function establishes a connection to server and joins a certain　conference.
<br><b>Remarks:</b><br>
On success, successCallback is called (if provided); otherwise, failureCallback is called (if provided).
<br><b>resp:</b><br>
{<br>
 streams:, an array of remote streams that have been published in the conference.<br>
 users:, an array of users that have joined in the conference.<br>
}
   * @memberOf Woogeen.ConferenceClient
   * @param {string} token Token used to join conference room.
   * @param {function} onSuccess(resp) (optional) Success callback function.
   * @param {function} onFailure(err) (optional) Failure callback function.
   * @example
<script type="text/JavaScript">
conference.join(token, function(response) {...}, function(error) {...});
</script>
   */
    this.join = function (token, onSuccess, onFailure) {
      var self = this;
      try {
        token = JSON.parse(L.Base64.decodeBase64(token));
      } catch (err) {
        return safeCall(onFailure, 'invalid token');
      }

      var isSecured = (token.secure === true);
      var host = token.host;
      if (typeof host !== 'string') {
        return safeCall(onFailure, 'invalid host');
      }
      if (host.indexOf('http') === -1) {
        host = isSecured ? ('https://' + host) : ('http://' + host);
      }
      // check connection>host< state
      if (self.state !== DISCONNECTED) {
        return safeCall(onFailure, 'connection state invalid');
      }

      self.on('server-disconnected', function () { // onConnectionClose handler
        that.state = DISCONNECTED;
        self.myId = null;
        var i, stream;
        // remove all remote streams
        for (i in self.remoteStreams) {
          if (self.remoteStreams.hasOwnProperty(i)) {
            stream = self.remoteStreams[i];
            stream.close();
            delete self.remoteStreams[i];
            var evt = new Woogeen.StreamEvent({type: 'stream-removed', stream: stream});
            self.dispatchEvent(evt);
          }
        }

        // close all channel
        for (i in self.localStreams) {
          if (self.localStreams.hasOwnProperty(i)) {
            stream = self.localStreams[i];
            if (stream.channel && typeof stream.channel.close === 'function') {
              stream.channel.close();
            }
            delete self.localStreams[i];
          }
        }

        // close socket.io
        try {
          self.socket.disconnect();
        } catch (err) {}
      });

      that.state = CONNECTING;

      if (self.socket !== undefined) { // whether reconnect
        self.socket.connect();
      } else {
        var dispatchEventAfterSubscribed = function (event) {
          var remoteStream = event.stream;
          if (remoteStream.channel && typeof remoteStream.signalOnPlayAudio === 'function') {
            self.dispatchEvent(event);
          } else if (remoteStream.channel && remoteStream.channel.state !== 'closed') {
            setTimeout(function () {
              dispatchEventAfterSubscribed(event);
            }, 20);
          } else {
            L.Logger.warning('event missed:', event.type);
          }
        };

        self.socket = io.connect(host, {
          reconnect: false,
          secure: isSecured,
          'force new connection': true
        });

        self.socket.on('onAddStream', function (spec) {
          if (self.remoteStreams[spec.id] !== undefined) {
            L.Logger.warning('stream already added:', spec.id);
            return;
          }
          var stream = createRemoteStream({
            video: spec.video,
            audio: spec.audio,
            id: spec.id,
            from: spec.from,
            attributes: spec.attributes
          });
          var evt = new Woogeen.StreamEvent({type: 'stream-added', stream: stream});
          self.remoteStreams[spec.id] = stream;
          self.dispatchEvent(evt);
        });

        self.socket.on('onRemoveStream', function (spec) {
          var stream = self.remoteStreams[spec.id];
          if (stream) {
            stream.close(); // >removeStream<
            delete self.remoteStreams[spec.id];
            var evt = new Woogeen.StreamEvent({type: 'stream-removed', stream: stream});
            self.dispatchEvent(evt);
          }
        });

        self.socket.on('onSubscribeP2P', function (spec) { // p2p conference call
          var myStream = self.localStreams[spec.streamId];
          if (myStream.channel === undefined) {
            myStream.channel = {};
          }

          myStream.channel[spec.subsSocket] = createChannel({
            callback: function (offer) {
              sendSdp(self.socket, 'publish', {
                state: 'p2pSignaling',
                streamId: spec.streamId,
                subsSocket: spec.subsSocket
              }, offer, function (answer) {
                if (answer === 'error' || answer === 'timeout') {
                  L.Logger.warning('invalid answer');
                  return;
                }
                myStream.channel[spec.subsSocket].onsignalingmessage = function () {
                  myStream.channel[spec.subsSocket].onsignalingmessage = function () {};
                };
                myStream.channel[spec.subsSocket].processSignalingMessage(answer);
              });
            },
            audio: myStream.hasAudio(),
            video: myStream.hasVideo(),
            stunServerUrl: self.connSettings.stun,
            turnServer: self.connSettings.turn
          });

          myStream.channel[spec.subsSocket].addStream(myStream.mediaStream);
          myStream.channel[spec.subsSocket].oniceconnectionstatechange = function (state) {
            if (state === 'disconnected') {
              myStream.channel[spec.subsSocket].close();
              delete myStream.channel[spec.subsSocket];
            }
          };
        });

        self.socket.on('onPublishP2P', function (spec, callback) {
          var myStream = self.remoteStreams[spec.streamId];

          myStream.channel = createChannel({
            callback: function () {},
            stunServerUrl: self.connSettings.stun,
            turnServer: self.connSettings.turn,
            maxAudioBW: self.connSettings.maxAudioBW,
            maxVideoBW: self.connSettings.maxVideoBW
          });

          myStream.channel.onsignalingmessage = function (answer) {
            myStream.channel.onsignalingmessage = function () {};
            safeCall(callback, answer);
          };

          myStream.channel.processSignalingMessage(spec.sdp);

          myStream.channel.onaddstream = function (evt) {
            myStream.mediaStream = evt.stream;
            internalDispatcher.dispatchEvent(new Woogeen.StreamEvent({type: 'p2p-stream-subscribed', stream: myStream}));
          };
        });

        // We receive an event of remote video stream paused
        self.socket.on('onVideoHold', function (spec) {
          var stream = self.remoteStreams[spec.id];
          if (stream) {
            var evt = new Woogeen.StreamEvent({type: 'video-hold', stream: stream});
            dispatchEventAfterSubscribed(evt);
          }
        });

        // We receive an event of remote video stream resumed
        self.socket.on('onVideoReady', function (spec) {
          var stream = self.remoteStreams[spec.id];
          if (stream) {
            var evt = new Woogeen.StreamEvent({type: 'video-ready', stream: stream});
            dispatchEventAfterSubscribed(evt);
          }
        });

        // We receive an event of remote audio stream paused
        self.socket.on('onAudioHold', function (spec) {
          var stream = self.remoteStreams[spec.id];
          if (stream) {
            var evt = new Woogeen.StreamEvent({type: 'audio-hold', stream: stream});
            dispatchEventAfterSubscribed(evt);
          }
        });

        // We receive an event of remote audio stream resumed
        self.socket.on('onAudioReady', function (spec) {
          var stream = self.remoteStreams[spec.id];
          if (stream) {
            var evt = new Woogeen.StreamEvent({type: 'audio-ready', stream: stream});
            dispatchEventAfterSubscribed(evt);
          }
        });

        // We receive an event of all the remote audio streams paused
        self.socket.on('onAllAudioHold', function () {
          for (var index in self.remoteStreams) {
            if (self.remoteStreams.hasOwnProperty(index)) {
              var stream = self.remoteStreams[index];
              var evt = new Woogeen.StreamEvent({type: 'audio-hold', stream: stream});
              dispatchEventAfterSubscribed(evt);
            }
          }
        });

        // We receive an event of all the remote audio streams resumed
        self.socket.on('onAllAudioReady', function () {
          for (var index in self.remoteStreams) {
            if (self.remoteStreams.hasOwnProperty(index)) {
              var stream = self.remoteStreams[index];
              var evt = new Woogeen.StreamEvent({type: 'audio-ready', stream: stream});
              dispatchEventAfterSubscribed(evt);
            }
          }
        });

        self.socket.on('onUpdateStream', function (spec) {
          // Handle: 'VideoEnabled', 'VideoDisabled', 'AudioEnabled', 'AudioDisabled', 'VideoLayoutChanged', [etc]
          var stream = self.remoteStreams[spec.id];
          if (stream) {
            stream.emit(spec.event, spec.data);
          }
        });

        self.socket.on('disconnect', function () {
          if (that.state !== DISCONNECTED) {
            var evt = new Woogeen.ClientEvent({type: 'server-disconnected'});
            self.dispatchEvent(evt);
          }
        });

        self.socket.on('onUserJoin', function (spec) {
          var evt = new Woogeen.ClientEvent({type: 'user-joined', user: spec.user});
          self.dispatchEvent(evt);
        });

        self.socket.on('onUserLeave', function (spec) {
          var evt = new Woogeen.ClientEvent({type: 'user-left', user: spec.user});
          self.dispatchEvent(evt);
        });

        self.socket.on('onCustomMessage', function (spec) {
          var evt = new Woogeen.MessageEvent({type: 'message-received', msg: spec});
          self.dispatchEvent(evt);
        });

        self.socket.on('connect_failed', function (err) {
          safeCall(onFailure, err || 'connection_failed');
        });

        self.socket.on('error', function (err) {
          safeCall(onFailure, err || 'connection_error');
        });
      }

      try {
        self.socket.emit('token', token, function (status, resp) {
          if (status === 'success') {
            self.connSettings = {
              turn: resp.turnServer,
              stun: resp.stunServerUrl,
              defaultVideoBW: resp.defaultVideoBW,
              maxVideoBW: resp.maxVideoBW
            };
            self.myId = resp.clientId;
            self.conferenceId = resp.id;
            self.p2p = resp.p2p;
            that.state = CONNECTED;
            var streams = resp.streams.map(function (st) {
              self.remoteStreams[st.id] = createRemoteStream(st);
              return self.remoteStreams[st.id];
            });
            return safeCall(onSuccess, {streams: streams, users: resp.users});
          }
          return safeCall(onFailure, resp||'response error');
        });
      } catch (e) {
        safeCall(onFailure, 'socket emit error');
      }
    };

  }

  function sendMsg(socket, type, message, callback) {
    if (!socket || !socket.connected) {
      return callback('socket not ready');
    }
    try {
      socket.emit(type, message, function (resp, mesg) {
        if (resp === 'success') {
          return callback(null, mesg);
        }
        return callback(mesg||'response error');
      });
    } catch (err) {
      callback('socket emit error');
    }
  }

  function sendSdp(socket, type, option, sdp, callback) {
    if (!socket || !socket.connected) {
      return callback('error', 'socket not ready');
    }
    try {
      socket.emit(type, option, sdp, function (status, resp) {
        callback(status, resp);
      });
    } catch (err) {
      callback('error', 'socket emit error');
    }
  }

  function sendCtrlPayload(socket, action, streamId, onSuccess, onFailure) {
    var payload = {
      type: 'control',
      payload: {
        action: action,
        streamId: streamId
      }
    };
    sendMsg(socket, 'customMessage', payload, function(err, resp) {
      if (err) {
        return safeCall(onFailure, err);
      }
      safeCall(onSuccess, resp);
    });
  }

  WoogeenConference.prototype = Woogeen.EventDispatcher({}); // make WoogeenConference a eventDispatcher
/**
   * @function leave
   * @instance
   * @desc This function leaves conference and disconnects from server. Once it is done, 'server-disconnected' event would be triggered.
   * @memberOf Woogeen.ConferenceClient
   * @example
<script type="text/JavaScript">
var conference = Woogeen.ConferenceClient.create();
// ......
conference.leave();
</script>
   */
  WoogeenConference.prototype.leave = function () {
    var evt = new Woogeen.ClientEvent({type: 'server-disconnected'});
    this.dispatchEvent(evt);
  };
/**
   * @function send
   * @instance
   * @desc This function send message to conference room. The receiver should be a valid clientId, which is carried by 'user-joined' event; or default 0, which means send to all participants in the conference (broadcast) except himself.
   * @memberOf Woogeen.ConferenceClient
   * @param {string/function} data Message/object to send.
   * @param {string/function} receiver Receiver, optional, with default value 0.
   * @param {function} onSuccess() (optional) Success callback.
   * @param {function} onFailure(err) (optional) Failure callback.
   * @example
<script type="text/JavaScript">
var conference = Woogeen.ConferenceClient.create();
// ……
conference.send(message, receiver, function (obj) {
    L.Logger.info('object sent:', obj.id());
  }, function (err) {
    L.Logger.error('send failed:', err);
  }
);
</script>
   */
  WoogeenConference.prototype.send = function (data, receiver, onSuccess, onFailure) {
    if (data === undefined || data === null || typeof data === 'function') {
      return safeCall(onFailure, 'nothing to send');
    }
    if (typeof receiver === 'undefined') {
      receiver = 'all';
    } else if (typeof receiver === 'string') {
      // supposed to be a valid receiverId.
      // pass.
    } else if (typeof receiver === 'function') {
      onFailure = onSuccess;
      onSuccess = receiver;
      receiver = 'all';
    } else {
      return safeCall(onFailure, 'invalid receiver');
    }
    sendMsg(this.socket, 'customMessage', {
      type: 'data',
      data: data,
      receiver: receiver
    }, function (err, resp) {
      if (err) {
        return safeCall(onFailure, err);
      }
      safeCall(onSuccess, resp);
    });
  };

/**
   * @function publish
   * @instance
   * @desc This function publishes the local stream to the server. The stream should be a valid LocalStream instance. 'stream-added' event would be triggered when the stream is published successfully.
   <br><b>options:</b><br>
   {<br>
maxVideoBW: xxx,<br>
unmix: false/true, // if true, this stream would not be included in mix stream<br>
videoCodec: 'h264'/'vp8' // not applicable for p2p room<br>
transport: 'udp'/'tcp' // rtsp connection transport type, default 'udp'; only for rtsp input<br>
bufferSize: integer number in bytes // udp receiving buffer size, default 2 MB; only for rtsp input (udp transport)<br>
}
   * @memberOf Woogeen.ConferenceClient
   * @param {stream} stream Stream to publish.
   * @param {json} options Publish options.
   * @param {function} onSuccess(stream) (optional) Success callback.
   * @param {function} onFailure(err) (optional) Failure callback.
   * @example
<script type="text/JavaScript">
var conference = Woogeen.ConferenceClient.create();
// ……
conference.publish(localStream, {maxVideoBW: 300}, function (st) {
    L.Logger.info('stream published:', st.id());
  }, function (err) {
    L.Logger.error('publish failed:', err);
  }
);
</script>
   */
  WoogeenConference.prototype.publish = function (stream, options, onSuccess, onFailure) {
    var self = this;
    stream = stream || {};
    if (typeof options === 'function') {
      onFailure = onSuccess;
      onSuccess = options;
      options = stream.bitRate;
    } else if (typeof options !== 'object' || options === null) {
      options = stream.bitRate;
    }
    if (!(stream instanceof Woogeen.LocalStream) ||
          ((typeof stream.mediaStream !== 'object' || stream.mediaStream === null) &&
             stream.url() === undefined)) {
      return safeCall(onFailure, 'invalid stream');
    }

    if (self.localStreams[stream.id()] === undefined) { // not pulished
      var opt = stream.toJson();
      if (options.unmix === true) {
        opt.unmix = true;
      }
      if (stream.url() !== undefined) {
        opt.state = 'url';
        opt.transport = options.transport;
        opt.bufferSize = options.bufferSize;
        sendSdp(self.socket, 'publish', opt, stream.url(), function (answer, id) {
          if (answer !== 'success') {
            return safeCall(onFailure, answer);
          }
          stream.id = function () {
            return id;
          };
          stream.unpublish = function (onSuccess, onFailure) {
            self.unpublish(stream, onSuccess, onFailure);
          };
          self.localStreams[id] = stream;
          safeCall(onSuccess, stream);
        });
        return;
      } else if (self.p2p) {
        self.connSettings.maxVideoBW = options.maxVideoBW;
        self.connSettings.maxAudioBW = options.maxAudioBW;
        opt.state = 'p2p';
        sendSdp(self.socket, 'publish', opt, null, function (answer, id) {
            if (answer === 'error') {
              return safeCall(onFailure, answer);
            }
            stream.id = function () {
              return id;
            };
            stream.unpublish = function (onSuccess, onFailure) {
              self.unpublish(stream, onSuccess, onFailure);
            };
            self.localStreams[id] = stream;
            safeCall(onSuccess, stream);
        });
        return;
      }
      options.maxVideoBW = options.maxVideoBW || self.connSettings.defaultVideoBW;
      if (options.maxVideoBW > self.connSettings.maxVideoBW) {
        options.maxVideoBW = self.connSettings.maxVideoBW;
      }
      stream.channel = createChannel({
        callback: function (offer) {
          opt.state = 'offer';
          sendSdp(self.socket, 'publish', opt, offer, function (answer, id) {
            if (answer === 'error') {
              return safeCall(onFailure, id);
            }
            if (answer === 'timeout') {
              return safeCall(onFailure, answer);
            }
            stream.channel.onsignalingmessage = function () {};
            var onChannelReady = function () {
              stream.id = function () {
                return id;
              };
              self.localStreams[id] = stream;
              stream.signalOnPlayAudio = function (onSuccess, onFailure) {
                sendCtrlPayload(self.socket, 'audio-out-on', id, onSuccess, onFailure);
              };
              stream.signalOnPauseAudio = function (onSuccess, onFailure) {
                sendCtrlPayload(self.socket, 'audio-out-off', id, onSuccess, onFailure);
              };
              stream.signalOnPlayVideo = function (onSuccess, onFailure) {
                sendCtrlPayload(self.socket, 'video-out-on', id, onSuccess, onFailure);
              };
              stream.signalOnPauseVideo = function (onSuccess, onFailure) {
                sendCtrlPayload(self.socket, 'video-out-off', id, onSuccess, onFailure);
              };
              stream.unpublish = function (onSuccess, onFailure) {
                self.unpublish(stream, onSuccess, onFailure);
              };
              safeCall(onSuccess, stream);
              onChannelReady = function () {};
              onChannelFailed = function () {};
            };
            var onChannelFailed = function () {
              sendMsg(self.socket, 'unpublish', id, function () {}, function () {}); // FIXME: still need this?
              stream.channel.close();
              stream.channel = undefined;
              safeCall(onFailure, 'peer connection failed');
              onChannelReady = function () {};
              onChannelFailed = function () {};
            };
            stream.channel.oniceconnectionstatechange = function (state) {
              switch (state) {
              case 'completed': // chrome
              case 'connected': // firefox
                onChannelReady();
                break;
              case 'checking':
              case 'closed':
                break;
              case 'failed':
                onChannelFailed();
                break;
              default:
                L.Logger.warning('unknown ice connection state:', state);
              }
            };
            stream.channel.processSignalingMessage(answer);
          });
        },
        video: stream.hasVideo(),
        audio: stream.hasAudio(),
        iceServers: self.getIceServers(),
        stunServerUrl: self.connSettings.stun,
        turnServer: self.connSettings.turn,
        maxAudioBW: options.maxAudioBW,
        maxVideoBW: options.maxVideoBW,
        videoCodec: options.videoCodec
      });
      stream.channel.addStream(stream.mediaStream);
    } else {
      return safeCall(onFailure, 'already published');
    }
  };

/**
   * @function mix
   * @instance
   * @desc This function tells server to add published LocalStream to mix stream.
   * @memberOf Woogeen.ConferenceClient
   * @param {LocalStream} stream LocalStream instance; it should be published before this call.
   * @param {function} onSuccess() (optional) Success callback.
   * @param {function} onFailure(err) (optional) Failure callback.
   * @example
<script type="text/JavaScript">
var conference = Woogeen.ConferenceClient.create();
// ……
conference.mix(localStream, function () {
    L.Logger.info('success');
  }, function (err) {
    L.Logger.error('failed:', err);
  }
);
</script>
   */
  WoogeenConference.prototype.mix = function(stream, onSuccess, onFailure) {
    if (!(stream instanceof Woogeen.LocalStream)) {
      return safeCall(onFailure, 'invalid stream');
    }
    sendMsg(this.socket, 'addToMixer', stream.id(), function (err) {
      if (err) { return safeCall(onFailure, err); }
      safeCall(onSuccess, null);
    });
  };

/**
   * @function unmix
   * @instance
   * @desc This function tells server to remove published LocalStream from mix stream.
   * @memberOf Woogeen.ConferenceClient
   * @param {stream} stream LocalStream instance; it should be published before this call.
   * @param {function} onSuccess() (optional) Success callback.
   * @param {function} onFailure(err) (optional) Failure callback.
   * @example
<script type="text/JavaScript">
var conference = Woogeen.ConferenceClient.create();
// ……
conference.unmix(localStream, function () {
    L.Logger.info('success');
  }, function (err) {
    L.Logger.error('failed:', err);
  }
);
</script>
   */
  WoogeenConference.prototype.unmix = function(stream, onSuccess, onFailure) {
    if (!(stream instanceof Woogeen.LocalStream)) {
      return safeCall(onFailure, 'invalid stream');
    }
    sendMsg(this.socket, 'removeFromMixer', stream.id(), function (err) {
      if (err) { return safeCall(onFailure, err); }
      safeCall(onSuccess, null);
    });
  };

/**
   * @function unpublish
   * @instance
   * @desc This function unpublishes the local stream. 'stream-removed' event would be triggered when the stream is removed from server.
   * @memberOf Woogeen.ConferenceClient
   * @param {stream} stream Stream to un-publish.
   * @param {function} onSuccess() (optional) Success callback.
   * @param {function} onFailure(err) (optional) Failure callback.
   * @example
<script type="text/JavaScript">
var conference = Woogeen.ConferenceClient.create();
// ……
conference.unpublish(localStream, function (st) {
    L.Logger.info('stream unpublished:', st.id());
  }, function (err) {
    L.Logger.error('unpublish failed:', err);
  }
);
</script>
   */
  WoogeenConference.prototype.unpublish = function (stream, onSuccess, onFailure) {
    var self = this;
    if (!(stream instanceof Woogeen.LocalStream)) {
      return safeCall(onFailure, 'invalid stream');
    }
    sendMsg(self.socket, 'unpublish', stream.id(), function (err) {
      if (err) {return safeCall(onFailure, err);}
      if (stream.channel && typeof stream.channel.close === 'function') {
        stream.channel.close();
        stream.channel = null;
      }
      delete self.localStreams[stream.id()];
      stream.id = function () {return null;};
      stream.signalOnPlayAudio = undefined;
      stream.signalOnPauseAudio = undefined;
      stream.signalOnPlayVideo = undefined;
      stream.signalOnPauseVideo = undefined;
      delete stream.unpublish;
      safeCall(onSuccess, null);
    });
  };

/**
   * @function subscribe
   * @instance
   * @desc This function subscribes to a remote stream. The stream should be a RemoteStream instance.
   <br><b>options:</b><br>
{<br>
video: true/false, {resolution: {width:xxx, height:xxx}},<br>
audio: true/false,<br>
videoCodec: 'h264'/'vp8' // not for p2p room<br>
}
   * @memberOf Woogeen.ConferenceClient
   * @param {stream} stream Stream to subscribe.
   * @param {json} options (optional) Subscribe options.
   * @param {function} onSuccess(stream) (optional) Success callback.
   * @param {function} onFailure(err) (optional) Failure callback.
   * @example
<script type="text/JavaScript">
var conference = Woogeen.ConferenceClient.create();
// ……
conference.subscribe(remoteStream, function (st) {
    L.Logger.info('stream subscribed:', st.id());
  }, function (err) {
    L.Logger.error('subscribe failed:', err);
  }
);
</script>
   */
  WoogeenConference.prototype.subscribe = function (stream, options, onSuccess, onFailure) {
    var self = this;
    if (typeof options === 'function') {
      onFailure = onSuccess;
      onSuccess = options;
      options = {};
    } else if (typeof options !== 'object' || options === null) {
      options = {};
    }
    if (!(stream instanceof Woogeen.RemoteStream)) {
      return safeCall(onFailure, 'invalid stream');
    }
    if (self.p2p) {
      internalDispatcher.on('p2p-stream-subscribed', function p2pStreamHandler (evt) {
        internalDispatcher.removeEventListener('p2p-stream-subscribed', p2pStreamHandler);
        safeCall(onSuccess, evt.stream);
      });
      sendSdp(self.socket, 'subscribe', {streamId: stream.id()}, null, function () {});
      return;
    }

    if (options.audio === false && options.video === false) {
      return safeCall(onFailure, 'no audio or video to subscribe.');
    }

    stream.channel = createChannel({
      callback: function (offer) {
        if (JSON.parse(offer).messageType !== 'OFFER') {return;} // filter out 'sendOK'
        sendSdp(self.socket, 'subscribe', {
          streamId: stream.id(),
          audio: stream.hasAudio() && (options.audio !== false),
          video: stream.hasVideo() && options.video
        }, offer, function (answer, errText) {
          if (answer === 'error' || answer === 'timeout') {
            return safeCall(onFailure, errText || answer);
          }
          stream.channel.processSignalingMessage(answer);
        });
      },
      audio: stream.hasAudio() && (options.audio !== false),
      video: stream.hasVideo() && (options.video !== false),
      iceServers: self.getIceServers(),
      stunServerUrl: self.connSettings.stun,
      turnServer: self.connSettings.turn,
      videoCodec: options.videoCodec
    });

    stream.channel.onaddstream = function (evt) {
      stream.mediaStream = evt.stream;
      if (navigator.appVersion.indexOf('Trident') > -1) {
        stream.pcid = evt.pcid;
      }
    };
    var onChannelReady = function () {
      stream.signalOnPlayAudio = function (onSuccess, onFailure) {
        sendCtrlPayload(self.socket, 'audio-in-on', stream.id(), onSuccess, onFailure);
      };
      stream.signalOnPauseAudio = function (onSuccess, onFailure) {
        sendCtrlPayload(self.socket, 'audio-in-off', stream.id(), onSuccess, onFailure);
      };
      stream.signalOnPlayVideo = function (onSuccess, onFailure) {
        sendCtrlPayload(self.socket, 'video-in-on', stream.id(), onSuccess, onFailure);
      };
      stream.signalOnPauseVideo = function (onSuccess, onFailure) {
        sendCtrlPayload(self.socket, 'video-in-off', stream.id(), onSuccess, onFailure);
      };
      safeCall(onSuccess, stream);
      onChannelReady = function () {};
      onChannelFailed = function () {};
    };
    var onChannelFailed = function () {
      sendMsg(self.socket, 'unsubscribe', stream.id(), function () {}, function () {});
      stream.close();
      stream.signalOnPlayAudio = undefined;
      stream.signalOnPauseAudio = undefined;
      stream.signalOnPlayVideo = undefined;
      stream.signalOnPauseVideo = undefined;
      safeCall(onFailure, 'peer connection failed');
      onChannelReady = function () {};
      onChannelFailed = function () {};
    };
    stream.channel.oniceconnectionstatechange = function (state) {
      switch (state) {
      case 'completed': // chrome
      case 'connected': // firefox
        onChannelReady();
        break;
      case 'checking':
      case 'closed':
        break;
      case 'failed':
        onChannelFailed();
        break;
      default:
        L.Logger.warning('unknown ice connection state:', state);
      }
    };
  };

/**
   * @function unsubscribe
   * @instance
   * @desc This function unsubscribes the remote stream.
   * @memberOf Woogeen.ConferenceClient
   * @param {stream} stream Stream to unsubscribe.
   * @param {function} onSuccess() (optional) Success callback.
   * @param {function} onFailure(err) (optional) Failure callback.
   * @example
<script type="text/JavaScript">
var conference = Woogeen.ConferenceClient.create();
// ……
conference.unsubscribe(remoteStream, function (st) {
    L.Logger.info('stream unsubscribed:', st.id());
  }, function (err) {
    L.Logger.error('unsubscribe failed:', err);
  }
);
</script>
   */
  WoogeenConference.prototype.unsubscribe = function (stream, onSuccess, onFailure) {
    var self = this;
    if (!(stream instanceof Woogeen.RemoteStream)) {
      return safeCall(onFailure, 'invalid stream');
    }
    sendMsg(self.socket, 'unsubscribe', stream.id(), function (err, resp) {
      if (err) {return safeCall(onFailure, err);}
      stream.close();
      stream.signalOnPlayAudio = undefined;
      stream.signalOnPauseAudio = undefined;
      stream.signalOnPlayVideo = undefined;
      stream.signalOnPauseVideo = undefined;
      safeCall(onSuccess, resp);
    });
  };

/**
   * @function onMessage
   * @instance
   * @desc This function is the shortcut of on('message-received', callback).
<br><b>Remarks:</b><br>Once the message is received, the callback is invoked.
   * @memberOf Woogeen.ConferenceClient
   * @param {function} callback callback function to the message.
   * @example
<script type="text/JavaScript">
  var conference = Woogeen.ConferenceClient.create();
// ……
  conference.onMessage(function (event) {
    L.Logger.info('Message Received:', event.msg);
  });
</script>
   */
  WoogeenConference.prototype.onMessage = function (callback) {
    if (typeof callback === 'function') {
      this.on('message-received', callback);
    }
  };

/**
   * @function shareScreen
   * @instance
   * @desc This function creates a LocalStream from screen and publishes it to the　server.
   * @memberOf Woogeen.ConferenceClient
   * @param {string} options (optional) Share screen options, similar to video option that used to create a LocalStream.
   * @param {function} onSuccess(stream) (optional) Success callback.
   * @param {function} onFailure(err) (optional) Failure callback. See details about error definition in {@link Woogeen.LocalStream.create|LocalStream.create}.
   * @example
<script type="text/JavaScript">
var conference = Woogeen.ConferenceClient.create();
// ……
conference.shareScreen({resolution: 'hd720p'}, function (st) {
    L.Logger.info('screen shared:', st.id());
  }, function (err) {
    L.Logger.error('sharing failed:', err);
  }
);
</script>
   */
  WoogeenConference.prototype.shareScreen = function (option, onSuccess, onFailure) {
    var self = this;
    if (typeof option === 'function') {
      onFailure = onSuccess;
      onSuccess = option;
      option = {};
    }
    option = option || {};
    Woogeen.LocalStream.create({
      video: {
        device: 'screen',
        extensionId: option.extensionId,
        resolution: option.resolution,
        frameRate: option.frameRate
      },
      audio: false
    }, function (err, stream) {
      if (err) {
        return safeCall(onFailure, err);
      }
      self.publish(stream, function (st) {
        safeCall(onSuccess, st);
      }, function (err) {
        safeCall(onFailure, err);
      });
    });
  };


/**
   * @function playAudio
   * @desc This function tells server to continue sending/receiving audio data of the RemoteStream/LocalStream.
<br><b>Remarks:</b><br>
The audio track of the stream should be enabled to be played correctly. For RemoteStream, it should be subscribed; for LocalStream, it should be published.
   * @memberOf Woogeen.ConferenceClient
   * @param {WoogeenStream} stream instance.
   * @param {function} onSuccess() (optional) Success callback.
   * @param {function} onFailure(err) (optional) Failure callback.
   * @instance
   */
  WoogeenConference.prototype.playAudio = function(stream, onSuccess, onFailure) {
    if ((stream instanceof Woogeen.Stream) && stream.hasAudio() && typeof stream.signalOnPlayAudio === 'function') {
      return stream.signalOnPlayAudio(onSuccess, onFailure);
    }
    if (typeof onFailure === 'function') {
      onFailure('unable to call playAudio');
    }
  };

/**
   * @function pauseAudio
   * @desc This function tells server to stop sending/receiving audio data of the subscribed RemoteStream/LocalStream.
<br><b>Remarks:</b><br>
Upon success, the audio of the stream would be hold, and you can call disableAudio() method to disable the audio track locally to stop playing. For RemoteStream, it should be subscribed; for LocalStream, it should be published.
   * @memberOf Woogeen.ConferenceClient
   * @param {WoogeenStream} stream instance.
   * @param {function} onSuccess() (optional) Success callback.
   * @param {function} onFailure(err) (optional) Failure callback.
   * @instance
   */
  WoogeenConference.prototype.pauseAudio = function(stream, onSuccess, onFailure) {
    if ((stream instanceof Woogeen.Stream) && stream.hasAudio() && typeof stream.signalOnPauseAudio === 'function') {
      return stream.signalOnPauseAudio(onSuccess, onFailure);
    }
    if (typeof onFailure === 'function') {
      onFailure('unable to call pauseAudio');
    }
  };

/**
   * @function playVideo
   * @desc This function tells server to continue sending/receiving video data of the subscribed RemoteStream/LocalStream.
<br><b>Remarks:</b><br>
The video track of the stream should be enabled to be played correctly. For RemoteStream, it should be subscribed; for LocalStream, it should be published.
   * @memberOf Woogeen.ConferenceClient
   * @param {WoogeenStream} stream instance.
   * @param {function} onSuccess() (optional) Success callback.
   * @param {function} onFailure(err) (optional) Failure callback.
   * @instance
   */
  WoogeenConference.prototype.playVideo = function(stream, onSuccess, onFailure) {
    if ((stream instanceof Woogeen.Stream) && stream.hasVideo() && typeof stream.signalOnPlayVideo === 'function') {
      return stream.signalOnPlayVideo(onSuccess, onFailure);
    }
    if (typeof onFailure === 'function') {
      onFailure('unable to call playVideo');
    }
  };

/**
   * @function pauseVideo
   * @desc This function tells server to stop sending/receiving video data of the subscribed RemoteStream/LocalStream.
<br><b>Remarks:</b><br>
Upon success, the video of the stream would be hold, and you can call disableVideo() method to disable the video track locally to stop playing. For RemoteStream, it should be subscribed; for LocalStream, it should be published.
   * @memberOf Woogeen.ConferenceClient
   * @param {WoogeenStream} stream instance.
   * @param {function} onSuccess() (optional) Success callback.
   * @param {function} onFailure(err) (optional) Failure callback.
   * @instance
   */
  WoogeenConference.prototype.pauseVideo = function(stream, onSuccess, onFailure) {
    if ((stream instanceof Woogeen.Stream) && stream.hasVideo() && typeof stream.signalOnPauseVideo === 'function') {
      return stream.signalOnPauseVideo(onSuccess, onFailure);
    }
    if (typeof onFailure === 'function') {
      onFailure('unable to call pauseVideo');
    }
  };

/**
   * @function startRecorder
   * @instance
   * @desc This function starts the mixed audio stream and video stream recording on the conference room and saves it to a .mkv file on the server, according to the configurable "config.erizoController.recording_path". The options are reserved currently for future usage.
   <br><b>options:</b><br>
   {<br>
  streamId: xxxxxx,<br>
  recorderId: yyyyyy<br>
  }
   * @memberOf Woogeen.ConferenceClient
   * @param {string} options (optional)Media recorder options. If unspecified, the mixed stream will be recorded as default.<br>
    <ul>
   <li>streamId: stream id to be recorded.</li>
   <li>recorderId: recorder id to be reused.</li>
   </ul>
   Important Note: In the case of continuous media recording among different streams, the recorderId is the key to make sure each the switched stream go to the same recording url. Do not stop the recorder when you want the continuous media recording, unless all the required media content has been recorded successfully.<br>
The recommendation is to invoke another startRecorder with new streamId (default to mixed stream) right after the previous call of startRecorder with old streamId, but the same recorderId should be kept.
   * @param {function} onSuccess(resp) (optional) Success callback. The following information will be
 returned as well:<br>
    <ul>
   <li>recorderId: recorder id.</li>
   <li>host: Host server address.</li>
   <li>path: Recorded file path </li>
   </ul>
   * @param {function} onFailure(err) (optional) Failure callback.
   * @example
<script type="text/JavaScript">
var conference = Woogeen.ConferenceClient.create();
// ……
conference.startRecorder({streamId: streamIdToRec}, function (file) {
    L.Logger.info('Stream recording with recorder ID: ', file.recorderId);
  }, function (err) {
    L.Logger.error('Media recorder failed:', err);
  }
);
</script>
   */
  WoogeenConference.prototype.startRecorder = function (options, onSuccess, onFailure) {
    var self = this;
    if (typeof options === 'function') {
      onFailure = onSuccess;
      onSuccess = options;
      options = {};
    } else if (typeof options !== 'object' || options === null) {
      options = {};
    }

    sendMsg(self.socket, 'startRecorder', options, function (err, resp) {
      if (err) {return safeCall(onFailure, err);}
      safeCall(onSuccess, resp);
    });
  };

/**
   * @function stopRecorder
   * @instance
   * @desc This function stops the mixed audio stream and video stream recording on the conference room and saves it to a .mkv file on the server, according to the configurable "config.erizoController.recording_path".
   <br><b>options:</b><br>
{<br>
  recorderId: xxxxxx<br>
}
   * @memberOf Woogeen.ConferenceClient
   * @param {string} options (optional) Media recording options. RecorderId: recorder id to be stopped.
   * @param {function} onSuccess(resp) (optional) Success callback. The following information will be returned as well:
   <ul>
   <li>recorderId: recorder id.</li>
   <li>host: Host server address.</li>
   </ul>
   * @param {function} onFailure(error) (optional) Failure callback.
   * @example
<script type="text/JavaScript">
var conference = Woogeen.ConferenceClient.create();
// ……
conference.stopRecorder({recorderId: recorderIdToStop}, function (file) {
    L.Logger.info('Stream recorded with recorder ID: ', file.recorderId);
  }, function (err) {
    L.Logger.error('Media recorder cannot stop with failure: ', err);
  }
);
</script>
 */
  WoogeenConference.prototype.stopRecorder = function (options, onSuccess, onFailure) {
    var self = this;
    if (typeof options === 'function') {
      onFailure = onSuccess;
      onSuccess = options;
      options = {};
    } else if (typeof options !== 'object' || options === null) {
      options = {};
    }

    sendMsg(self.socket, 'stopRecorder', options, function (err, resp) {
      if (err) {return safeCall(onFailure, err);}
      safeCall(onSuccess, resp);
    });
  };

/**
   * @function getRegion
   * @instance
   * @desc This function gets the region ID of the given participant in the mixed stream.
   <br><b>options:</b><br>
{<br>
  id: 'the participant id'<br>
}
   * @memberOf Woogeen.ConferenceClient
   * @param {json} options getRegion options.
   * @param {function} onSuccess(resp) (optional) Success callback.
   * @param {function} onFailure(error) (optional) Failure callback.
   * @example
<script type="text/JavaScript">
var conference = Woogeen.ConferenceClient.create();
// ......
conference.getRegion({id: 'participantId'}, function (resp) {
    L.Logger.info('Region for participantId: ', resp.region);
  }, function (err) {
    L.Logger.error('getRegion failed:', err);
  }
);
</script>
 */
  WoogeenConference.prototype.getRegion = function (options, onSuccess, onFailure) {
    var self = this;
    if (typeof options !== 'object' || options === null ||
        typeof options.id !== 'string' || options.id === '') {
      return safeCall(onFailure, 'invalid options');
    }

    sendMsg(self.socket, 'getRegion', {id: options.id}, function (err, resp) {
      if (err) {return safeCall(onFailure, err);}
      safeCall(onSuccess, resp);
    });
  };

/**
   * @function setRegion
   * @instance
   * @desc This function sets the region for the given participant in the mixed stream with the given region id.
   <br><b>options:</b><br>
{<br>
  id: 'the participant id'<br>
  region: 'the region id'<br>
}
   * @memberOf Woogeen.ConferenceClient
   * @param {json} options setRegion options.
   * @param {function} onSuccess() (optional) Success callback.
   * @param {function} onFailure(error) (optional) Failure callback.
   * @example
<script type="text/JavaScript">
var conference = Woogeen.ConferenceClient.create();
// ......
conference.setRegion({id: 'participantId', region: 'regionId'}, function () {
    L.Logger.info('setRegion succeeded');
  }, function (err) {
    L.Logger.error('setRegion failed:', err);
  }
);
</script>
 */
  WoogeenConference.prototype.setRegion = function (options, onSuccess, onFailure) {
    var self = this;
    if (typeof options !== 'object' || options === null ||
        typeof options.id !== 'string' || options.id === '' ||
        typeof options.region !== 'string' || options.region === '') {
      return safeCall(onFailure, 'invalid options');
    }

    sendMsg(self.socket, 'setRegion', {id: options.id, region: options.region}, function (err, resp) {
      if (err) {return safeCall(onFailure, err);}
      safeCall(onSuccess, resp);
    });
  };

/**
   * @function setVideoBitrate
   * @instance
   * @desc This function sets the video bitrate (kbps) for the given participant. Currently it works only if the participant's video stream is being mixed in the conference.
   <br><b>options:</b><br>
{<br>
  id: 'the participant id'<br>
  bitrate: an integer value with the unit in kbps, e.g., 300<br>
}
   * @memberOf Woogeen.ConferenceClient
   * @param {json} options setVideoBitrate options.
   * @param {function} onSuccess(resp) (optional) Success callback.
   * @param {function} onFailure(error) (optional) Failure callback.
   * @example
<script type="text/JavaScript">
var conference = Woogeen.ConferenceClient.create();
// ......
conference.setVideoBitrate({id: 'participantId', bitrate: 300}, function (resp) {
    L.Logger.info('setVideoBitrate succeeds for participantId: ', resp);
  }, function (err) {
    L.Logger.error('setVideoBitrate failed:', err);
  }
);
</script>
 */
  WoogeenConference.prototype.setVideoBitrate = function (options, onSuccess, onFailure) {
    var self = this;
    if (typeof options === 'function') {
      onFailure = onSuccess;
      onSuccess = options;
      options = {};
    } else if (typeof options !== 'object' || options === null) {
      options = {};
    }

    sendMsg(self.socket, 'setVideoBitrate', options, function (err, resp) {
      if (err) {return safeCall(onFailure, err);}
      safeCall(onSuccess, resp);
    });
  };

/**
   * @function create
   * @desc This factory returns a Woogeen.ConferenceClient instance.
   * @memberOf Woogeen.ConferenceClient
   * @static
   * @return {Woogeen.ConferenceClient} An instance of Woogeen.ConferenceClient.
   * @example
<script type="text/JavaScript">
var conference = Woogeen.ConferenceClient.create();
</script>
   */
  WoogeenConference.create = function factory (spec) { // factory, not in prototype
    return new WoogeenConference(spec);
  };

  return WoogeenConference;
}());



/* global window, RTCSessionDescription, webkitRTCPeerConnection */

Erizo.ChromeStableStack = function (spec) {
    'use strict';
    webkitRTCPeerConnection.prototype.getPeerStats = window.getStats;
    
    var that = {},
        WebkitRTCPeerConnection = webkitRTCPeerConnection;

    that.pc_config = {
        iceServers: []
    };

    that.con = {'optional': [{'DtlsSrtpKeyAgreement': true}]};

    if (spec.iceServers instanceof Array) {
        that.pc_config.iceServers = spec.iceServers;
    } else {
        if (spec.stunServerUrl) {
            if (spec.stunServerUrl instanceof Array) {
                spec.stunServerUrl.map(function (url) {
                    if (typeof url === 'string' && url !== '') {
                        that.pc_config.iceServers.push({url: url});
                    }
                });
            } else if (typeof spec.stunServerUrl === 'string' && spec.stunServerUrl !== '') {
                that.pc_config.iceServers.push({url: spec.stunServerUrl});
            }
        }

        if (spec.turnServer) {
            if (spec.turnServer instanceof Array) {
                spec.turnServer.map(function (turn) {
                    if (typeof turn.url === 'string' && turn.url !== '') {
                        that.pc_config.iceServers.push({
                            username: turn.username,
                            credential: turn.password,
                            url: turn.url
                        });
                    }
                });
            } else if (typeof spec.turnServer.url === 'string' && spec.turnServer.url !== '') {
                that.pc_config.iceServers.push({
                    username: spec.turnServer.username,
                    credential: spec.turnServer.password,
                    url: spec.turnServer.url
                });
            }
        }
    }

    if (spec.audio === undefined) {
        spec.audio = true;
    }

    if (spec.video === undefined) {
        spec.video = true;
    }

    that.mediaConstraints = {
        'mandatory': {
            'OfferToReceiveVideo': spec.video,
            'OfferToReceiveAudio': spec.audio
        }
    };

    that.roapSessionId = 103;

    that.peerConnection = new WebkitRTCPeerConnection(that.pc_config, that.con);
    L.Logger.debug("Created webkitRTCPeerConnnection with config \"" + JSON.stringify(that.pc_config) + "\".");

    var showResult = function(result) {
      console.log(result);
    };

    var repeatInterval = 2000; // 2000 ms == 2 seconds
    that.peerConnection.getPeerStats(function(result) {
        result.connectionType.local.ipAddress;
        result.connectionType.local.candidateType;
        result.connectionType.transport;

        result.audio.availableBandwidth;
        result.audio.packetsSent;
        result.audio.packetsLost;
        result.audio.rtt;

        // to access native "results" array
        result.results.forEach(function(r) {
            console.log(r);
        });
    }, showResult, repeatInterval);

    that.peerConnection.onicecandidate = function (event) {
        L.Logger.debug('PeerConnection: ', spec.session_id);
        if (!event.candidate) {
            // At the moment, we do not renegotiate when new candidates
            // show up after the more flag has been false once.
            L.Logger.debug('State: ' + that.peerConnection.iceGatheringState);

            if (that.ices === undefined) {
                that.ices = 0;
            }
            that.ices = that.ices + 1;
            if (that.ices >= 1 && that.moreIceComing) {
                that.moreIceComing = false;
                that.markActionNeeded();
            }
        } else {
            that.iceCandidateCount += 1;
        }
    };


    var setMaxBW = function (sdp) {
        var a, r;
        if (spec.video && spec.maxVideoBW) {
            a = sdp.match(/m=video.*\r\n/);
            r = a[0] + 'b=AS:' + spec.maxVideoBW + '\r\n';
            sdp = sdp.replace(a[0], r);
        }

        if (spec.audio && spec.maxAudioBW) {
            a = sdp.match(/m=audio.*\r\n/);
            r = a[0] + 'b=AS:' + spec.maxAudioBW + '\r\n';
            sdp = sdp.replace(a[0], r);
        }

        return sdp;
    };

    /**
     * This function processes signalling messages from the other side.
     * @param {string} msgstring JSON-formatted string containing a ROAP message.
     */
    that.processSignalingMessage = function (msgstring) {
        // Offer: Check for glare and resolve.
        // Answer/OK: Remove retransmit for the msg this is an answer to.
        // Send back "OK" if this was an Answer.
        L.Logger.debug('Activity on conn ' + that.sessionId);
        var msg = JSON.parse(msgstring), sd;
        that.incomingMessage = msg;

        if (that.state === 'new') {
            if (msg.messageType === 'OFFER') {
                // Initial offer.
                sd = {
                    sdp: msg.sdp,
                    type: 'offer'
                };
                that.peerConnection.setRemoteDescription(new RTCSessionDescription(sd));

                that.state = 'offer-received';
                // Allow other stuff to happen, then reply.
                that.markActionNeeded();
            } else {
                that.error('Illegal message for this state: ' + msg.messageType + ' in state ' + that.state);
            }

        } else if (that.state === 'offer-sent') {
            if (msg.messageType === 'ANSWER') {

                sd = {
                    sdp: msg.sdp,
                    type: 'answer'
                };
                L.Logger.debug('Received ANSWER: ', sd.sdp);

                sd.sdp = setMaxBW(sd.sdp);

                that.peerConnection.setRemoteDescription(new RTCSessionDescription(sd));
                that.sendOK();
                that.state = 'established';

            } else if (msg.messageType === 'pr-answer') {
                sd = {
                    sdp: msg.sdp,
                    type: 'pr-answer'
                };
                that.peerConnection.setRemoteDescription(new RTCSessionDescription(sd));

                // No change to state, and no response.
            } else if (msg.messageType === 'offer') {
                // Glare processing.
                that.error('Not written yet');
            } else {
                that.error('Illegal message for this state: ' + msg.messageType + ' in state ' + that.state);
            }

        } else if (that.state === 'established') {
            if (msg.messageType === 'OFFER') {
                // Subsequent offer.
                sd = {
                    sdp: msg.sdp,
                    type: 'offer'
                };
                that.peerConnection.setRemoteDescription(new RTCSessionDescription(sd));

                that.state = 'offer-received';
                // Allow other stuff to happen, then reply.
                that.markActionNeeded();
            } else {
                that.error('Illegal message for this state: ' + msg.messageType + ' in state ' + that.state);
            }
        }
    };

    /**
     * Adds a stream - this causes signalling to happen, if needed.
     * @param {MediaStream} stream The outgoing MediaStream to add.
     */
    that.addStream = function (stream) {
        that.peerConnection.addStream(stream);
        that.markActionNeeded();
    };

    /**
     * Removes a stream.
     * @param {MediaStream} stream The MediaStream to remove.
     */
    that.removeStream = function () {
//        var i;
//        for (i = 0; i < that.peerConnection.localStreams.length; ++i) {
//            if (that.localStreams[i] === stream) {
//                that.localStreams[i] = null;
//            }
//        }
        that.markActionNeeded();
    };

    /**
     * Closes the connection.
     */
    that.close = function () {
        that.state = 'closed';
        if (that.peerConnection.signalingState !== 'closed') {
            that.peerConnection.close();
        }
    };

    /**
     * Internal function: Mark that something happened.
     */
    that.markActionNeeded = function () {
        that.actionNeeded = true;
        that.doLater(function () {
            that.onstablestate();
        });
    };

    /**
     * Internal function: Do something later (not on this stack).
     * @param {function} what Callback to be executed later.
     */
    that.doLater = function (what) {
        // Post an event to myself so that I get called a while later.
        // (needs more JS/DOM info. Just call the processing function on a delay
        // for now.)
        window.setTimeout(what, 1);
    };

    /**
     * Internal function called when a stable state
     * is entered by the browser (to allow for multiple AddStream calls or
     * other interesting actions).
     * This function will generate an offer or answer, as needed, and send
     * to the remote party using our onsignalingmessage function.
     */
    that.onstablestate = function () {
        var mySDP;
        if (that.actionNeeded) {
            if (that.state === 'new' || that.state === 'established') {
                // See if the current offer is the same as what we already sent.
                // If not, no change is needed.

                that.peerConnection.createOffer(function (sessionDescription) {

                    //sessionDescription.sdp = newOffer.replace(/a=ice-options:google-ice\r\n/g, "");
                    //sessionDescription.sdp = newOffer.replace(/a=crypto:0 AES_CM_128_HMAC_SHA1_80 inline:.*\r\n/g, "a=crypto:0 AES_CM_128_HMAC_SHA1_80 inline:eUMxlV2Ib6U8qeZot/wEKHw9iMzfKUYpOPJrNnu3\r\n");
                    //sessionDescription.sdp = newOffer.replace(/a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:.*\r\n/g, "a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:eUMxlV2Ib6U8qeZot/wEKHw9iMzfKUYpOPJrNnu3\r\n");

                    sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
                    L.Logger.debug('Changed', sessionDescription.sdp);

                    var newOffer = sessionDescription.sdp;

                    if (newOffer !== that.prevOffer) {

                        that.peerConnection.setLocalDescription(sessionDescription);

                        that.state = 'preparing-offer';
                        that.markActionNeeded();
                        return;
                    } else {
                        L.Logger.debug('Not sending a new offer');
                    }

                }, null, that.mediaConstraints);


            } else if (that.state === 'preparing-offer') {
                // Don't do anything until we have the ICE candidates.
                if (that.moreIceComing) {
                    return;
                }


                // Now able to send the offer we've already prepared.
                that.prevOffer = that.peerConnection.localDescription.sdp;
                L.Logger.debug('Sending OFFER: ' + that.prevOffer);
                //L.Logger.debug('Sent SDP is ' + that.prevOffer);
                that.sendMessage('OFFER', that.prevOffer);
                // Not done: Retransmission on non-response.
                that.state = 'offer-sent';

            } else if (that.state === 'offer-received') {

                that.peerConnection.createAnswer(function (sessionDescription) {
                    that.peerConnection.setLocalDescription(sessionDescription);
                    that.state = 'offer-received-preparing-answer';

                    if (!that.iceStarted) {
                        var now = new Date();
                        L.Logger.debug(now.getTime() + ': Starting ICE in responder');
                        that.iceStarted = true;
                    } else {
                        that.markActionNeeded();
                        return;
                    }

                }, null, that.mediaConstraints);

            } else if (that.state === 'offer-received-preparing-answer') {
                if (that.moreIceComing) {
                    return;
                }

                mySDP = that.peerConnection.localDescription.sdp;

                that.sendMessage('ANSWER', mySDP);
                that.state = 'established';
            } else {
                that.error('Dazed and confused in state ' + that.state + ', stopping here');
            }
            that.actionNeeded = false;
        }
    };

    /**
     * Internal function to send an "OK" message.
     */
    that.sendOK = function () {
        that.sendMessage('OK');
    };

    /**
     * Internal function to send a signalling message.
     * @param {string} operation What operation to signal.
     * @param {string} sdp SDP message body.
     */
    that.sendMessage = function (operation, sdp) {
        var roapMessage = {};
        roapMessage.messageType = operation;
        roapMessage.sdp = sdp; // may be null or undefined
        if (operation === 'OFFER') {
            roapMessage.offererSessionId = that.sessionId;
            roapMessage.answererSessionId = that.otherSessionId; // may be null
            roapMessage.seq = (that.sequenceNumber += 1);
            // The tiebreaker needs to be neither 0 nor 429496725.
            roapMessage.tiebreaker = Math.floor(Math.random() * 429496723 + 1);
        } else {
            roapMessage.offererSessionId = that.incomingMessage.offererSessionId;
            roapMessage.answererSessionId = that.sessionId;
            roapMessage.seq = that.incomingMessage.seq;
        }
        that.onsignalingmessage(JSON.stringify(roapMessage));
    };

    /**
     * Internal something-bad-happened function.
     * @param {string} text What happened - suitable for logging.
     */
    that.error = function (text) {
        throw 'Error in RoapOnJsep: ' + text;
    };

    that.sessionId = (that.roapSessionId += 1);
    that.sequenceNumber = 0; // Number of last ROAP message sent. Starts at 1.
    that.actionNeeded = false;
    that.iceStarted = false;
    that.moreIceComing = true;
    that.iceCandidateCount = 0;
    that.onsignalingmessage = spec.callback;

    that.peerConnection.onopen = function () {
        if (that.onopen) {
            that.onopen();
        }
    };

    that.peerConnection.onaddstream = function (stream) {
        if (that.onaddstream) {
            that.onaddstream(stream);
        }
    };

    that.peerConnection.onremovestream = function (stream) {
        if (that.onremovestream) {
            that.onremovestream(stream);
        }
    };

    that.peerConnection.oniceconnectionstatechange = function (e) {
        if (that.oniceconnectionstatechange) {
            that.oniceconnectionstatechange(e.currentTarget.iceConnectionState);
        }
    };

    // Variables that are part of the public interface of PeerConnection
    // in the 28 January 2012 version of the webrtc specification.
    that.onaddstream = null;
    that.onremovestream = null;
    that.state = 'new';
    // Auto-fire next events.
    that.markActionNeeded();
    return that;
};



/* global window, mozRTCSessionDescription, mozRTCPeerConnection */

Erizo.FirefoxStack = function (spec) {
    'use strict';

    var that = {},
        WebkitRTCPeerConnection = mozRTCPeerConnection,
        RTCSessionDescription = mozRTCSessionDescription;

    var hasStream = false;

    that.pc_config = {
        iceServers: []
    };

    // currently firefox does not support turn
    if (spec.iceServers instanceof Array) {
        spec.iceServers.map(function (server) {
            if (server.url.indexOf('stun:') === 0) {
                that.pc_config.iceServers.push({url: server.url});
            }
        });
    } else {
        if (spec.stunServerUrl) {
            if (spec.stunServerUrl instanceof Array) {
                spec.stunServerUrl.map(function (url) {
                    if (typeof url === 'string' && url !== '') {
                        that.pc_config.iceServers.push({url: url});
                    }
                });
            } else if (typeof spec.stunServerUrl === 'string' && spec.stunServerUrl !== '') {
                that.pc_config.iceServers.push({url: spec.stunServerUrl});
            }
        }
    }

    if (spec.audio === undefined) {
        spec.audio = true;
    }

    if (spec.video === undefined) {
        spec.video = true;
    }

    that.mediaConstraints = {
        offerToReceiveAudio: spec.audio,
        offerToReceiveVideo: spec.video,
        mozDontOfferDataChannel: true
    };

    that.roapSessionId = 103;

    that.peerConnection = new WebkitRTCPeerConnection(that.pc_config);

    that.peerConnection.onicecandidate = function (event) {
        L.Logger.debug('PeerConnection: ', spec.session_id);
        if (!event.candidate) {
            // At the moment, we do not renegotiate when new candidates
            // show up after the more flag has been false once.
            L.Logger.debug('State: ' + that.peerConnection.iceGatheringState);

            if (that.ices === undefined) {
                that.ices = 0;
            }
            that.ices = that.ices + 1;
            L.Logger.debug(that.ices);
            if (that.ices >= 1 && that.moreIceComing) {
                that.moreIceComing = false;
                that.markActionNeeded();
            }
        } else {
            that.iceCandidateCount += 1;
        }
    };

    L.Logger.debug('Created webkitRTCPeerConnnection with config "' + JSON.stringify(that.pc_config) + '".');

    var setVideoCodec = function(sdp){
        if (spec.videoCodec !== 'H264' && spec.videoCodec !== 'h264') {
            return sdp;
        }
        // Put H264 in front of VP8(120)
        try {
            var mLine = sdp.match(/m=video.*\r\n/g)[0];
            var newMLine = mLine.replace(/\s120/, '').replace('\r\n','') + ' 120\r\n';
            return sdp.replace(mLine, newMLine);
        } catch (e) {
            return sdp;
        }
    };

    var updateSdp = function(sdp) {
        var newSdp = setVideoCodec(sdp);
        // Add other operations here, e.g. set bandwidth.
        return newSdp;
    };

    /**
     * This function processes signalling messages from the other side.
     * @param {string} msgstring JSON-formatted string containing a ROAP message.
     */
    that.processSignalingMessage = function (msgstring) {
        // Offer: Check for glare and resolve.
        // Answer/OK: Remove retransmit for the msg this is an answer to.
        // Send back "OK" if this was an Answer.
        L.Logger.debug('Activity on conn ' + that.sessionId);
        var msg = JSON.parse(msgstring), sd;
        that.incomingMessage = msg;

        if (that.state === 'new') {
            if (msg.messageType === 'OFFER') {
                // Initial offer.
                sd = {
                    sdp: msg.sdp,
                    type: 'offer'
                };
                that.peerConnection.setRemoteDescription(new RTCSessionDescription(sd), function() {
                        L.Logger.debug('setRemoteDescription succeeded');
                    }, function(error) {
                        L.Logger.info('setRemoteDescription failed: ' + error.name);
                    });

                that.state = 'offer-received';
                // Allow other stuff to happen, then reply.
                that.markActionNeeded();
            } else {
                that.error('Illegal message for this state: ' + msg.messageType + ' in state ' + that.state);
            }

        } else if (that.state === 'offer-sent') {
            if (msg.messageType === 'ANSWER') {

                msg.sdp = msg.sdp.replace(/ generation 0/g, '');
                msg.sdp = msg.sdp.replace(/ udp /g, ' UDP ');

                sd = {
                    sdp: msg.sdp,
                    type: 'answer'
                };
                L.Logger.debug('Received ANSWER: ', sd.sdp);

                sd.sdp = updateSdp(sd.sdp);

                that.peerConnection.setRemoteDescription(new RTCSessionDescription(sd), function() {
                        L.Logger.debug('setRemoteDescription succeeded');
                    }, function(error) {
                        L.Logger.info('setRemoteDescription failed: ' + error.name);
                    });
                that.sendOK();
                that.state = 'established';

            } else if (msg.messageType === 'pr-answer') {
                sd = {
                    sdp: msg.sdp,
                    type: 'pr-answer'
                };
                that.peerConnection.setRemoteDescription(new RTCSessionDescription(sd), function() {
                        L.Logger.debug('setRemoteDescription succeeded');
                    }, function(error) {
                        L.Logger.info('setRemoteDescription failed: ' + error.name);
                    });

                // No change to state, and no response.
            } else if (msg.messageType === 'offer') {
                // Glare processing.
                that.error('Not written yet');
            } else {
                that.error('Illegal message for this state: ' + msg.messageType + ' in state ' + that.state);
            }

        } else if (that.state === 'established') {
            if (msg.messageType === 'OFFER') {
                // Subsequent offer.
                sd = {
                    sdp: msg.sdp,
                    type: 'offer'
                };
                that.peerConnection.setRemoteDescription(new RTCSessionDescription(sd), function() {
                        L.Logger.debug('setRemoteDescription succeeded');
                    }, function(error) {
                        L.Logger.info('setRemoteDescription failed: ' + error.name);
                    });

                that.state = 'offer-received';
                // Allow other stuff to happen, then reply.
                that.markActionNeeded();
            } else {
                that.error('Illegal message for this state: ' + msg.messageType + ' in state ' + that.state);
            }
        }
    };

    /**
     * Adds a stream - this causes signalling to happen, if needed.
     * @param {MediaStream} stream The outgoing MediaStream to add.
     */
    that.addStream = function (stream) {
        hasStream = true;
        that.peerConnection.addStream(stream);
        that.markActionNeeded();
    };

    /**
     * Removes a stream.
     * @param {MediaStream} stream The MediaStream to remove.
     */
    that.removeStream = function () {
//        var i;
//        for (i = 0; i < that.peerConnection.localStreams.length; ++i) {
//            if (that.localStreams[i] === stream) {
//                that.localStreams[i] = null;
//            }
//        }
        that.markActionNeeded();
    };

    /**
     * Closes the connection.
     */
    that.close = function () {
        that.state = 'closed';
        if (that.peerConnection.signalingState !== 'closed') {
            that.peerConnection.close();
        }
    };

    /**
     * Internal function: Mark that something happened.
     */
    that.markActionNeeded = function () {
        that.actionNeeded = true;
        that.doLater(function () {
            that.onstablestate();
        });
    };

    /**
     * Internal function: Do something later (not on this stack).
     * @param {function} what Callback to be executed later.
     */
    that.doLater = function (what) {
        // Post an event to myself so that I get called a while later.
        // (needs more JS/DOM info. Just call the processing function on a delay
        // for now.)
        window.setTimeout(what, 1);
    };

    /**
     * Internal function called when a stable state
     * is entered by the browser (to allow for multiple AddStream calls or
     * other interesting actions).
     * This function will generate an offer or answer, as needed, and send
     * to the remote party using our onsignalingmessage function.
     */
    that.onstablestate = function () {
        var mySDP;
        if (that.actionNeeded) {
            if (that.state === 'new' || that.state === 'established') {
                // See if the current offer is the same as what we already sent.
                // If not, no change is needed.   
                L.Logger.debug('Creating offer');
                var onSuccess = function() {
                    that.peerConnection.createOffer(function (sessionDescription) {

                        sessionDescription.sdp = updateSdp(sessionDescription.sdp);

                        var newOffer = sessionDescription.sdp;

                        L.Logger.debug('Changed', sessionDescription.sdp);

                        if (newOffer !== that.prevOffer) {

                            that.peerConnection.setLocalDescription(sessionDescription);

                            that.state = 'preparing-offer';
                            that.markActionNeeded();
                            return;
                        } else {
                            L.Logger.debug('Not sending a new offer');
                        }

                    }, function(error) {
                        // Callback on error
                        L.Logger.debug('Ups! Something went wrong ', error);

                    }, that.mediaConstraints);
                };
                if (hasStream) {
                    that.mediaConstraints = undefined;

                }
                onSuccess();

            } else if (that.state === 'preparing-offer') {
                // Don't do anything until we have the ICE candidates.
                if (that.moreIceComing) {
                    return;
                }


                // Now able to send the offer we've already prepared.
                that.prevOffer = updateSdp(that.peerConnection.localDescription.sdp);
                L.Logger.debug('Sending OFFER: ', that.prevOffer);
                //L.Logger.debug('Sent SDP is ' + that.prevOffer);
                that.sendMessage('OFFER', that.prevOffer);
                // Not done: Retransmission on non-response.
                that.state = 'offer-sent';

            } else if (that.state === 'offer-received') {

                that.peerConnection.createAnswer(function (sessionDescription) {
                    that.peerConnection.setLocalDescription(sessionDescription);
                    that.state = 'offer-received-preparing-answer';

                    if (!that.iceStarted) {
                        var now = new Date();
                        L.Logger.debug(now.getTime() + ': Starting ICE in responder');
                        that.iceStarted = true;
                    } else {
                        that.markActionNeeded();
                        return;
                    }

                }, function() {
                    // Callback on error
                    L.Logger.debug('Ups! Something went wrong');

                });

            } else if (that.state === 'offer-received-preparing-answer') {
                if (that.moreIceComing) {
                    return;
                }

                mySDP = that.peerConnection.localDescription.sdp;

                that.sendMessage('ANSWER', mySDP);
                that.state = 'established';
            } else {
                that.error('Dazed and confused in state ' + that.state + ', stopping here');
            }
            that.actionNeeded = false;
        }
    };

    /**
     * Internal function to send an "OK" message.
     */
    that.sendOK = function () {
        that.sendMessage('OK');
    };

    /**
     * Internal function to send a signalling message.
     * @param {string} operation What operation to signal.
     * @param {string} sdp SDP message body.
     */
    that.sendMessage = function (operation, sdp) {
        var roapMessage = {};
        roapMessage.messageType = operation;
        roapMessage.sdp = sdp; // may be null or undefined
        if (operation === 'OFFER') {
            roapMessage.offererSessionId = that.sessionId;
            roapMessage.answererSessionId = that.otherSessionId; // may be null
            roapMessage.seq = (that.sequenceNumber += 1);
            // The tiebreaker needs to be neither 0 nor 429496725.
            roapMessage.tiebreaker = Math.floor(Math.random() * 429496723 + 1);
        } else {
            roapMessage.offererSessionId = that.incomingMessage.offererSessionId;
            roapMessage.answererSessionId = that.sessionId;
            roapMessage.seq = that.incomingMessage.seq;
        }
        that.onsignalingmessage(JSON.stringify(roapMessage));
    };

    /**
     * Internal something-bad-happened function.
     * @param {string} text What happened - suitable for logging.
     */
    that.error = function (text) {
        throw 'Error in RoapOnJsep: ' + text;
    };

    that.sessionId = (that.roapSessionId += 1);
    that.sequenceNumber = 0; // Number of last ROAP message sent. Starts at 1.
    that.actionNeeded = false;
    that.iceStarted = false;
    that.moreIceComing = true;
    that.iceCandidateCount = 0;
    that.onsignalingmessage = spec.callback;

    that.peerConnection.onopen = function () {
        if (that.onopen) {
            that.onopen();
        }
    };

    that.peerConnection.onaddstream = function (stream) {
        if (that.onaddstream) {
            that.onaddstream(stream);
        }
    };

    that.peerConnection.onremovestream = function (stream) {
        if (that.onremovestream) {
            that.onremovestream(stream);
        }
    };

    that.peerConnection.oniceconnectionstatechange = function (e) {
        if (that.oniceconnectionstatechange) {
            that.oniceconnectionstatechange(e.currentTarget.iceConnectionState);
        }
    };

    // Variables that are part of the public interface of PeerConnection
    // in the 28 January 2012 version of the webrtc specification.
    that.onaddstream = null;
    that.onremovestream = null;
    that.state = 'new';
    // Auto-fire next events.
    that.markActionNeeded();
    return that;
};



/*global window, console, RTCSessionDescription, webkitRTCPeerConnection*/

Erizo.IEStableStack = function (spec) {
  var that = {}, 
        WebkitRTCPeerConnection = webkitRTCPeerConnection;

  that.pc_config = {
        iceServers: []
  };

  if (spec.iceServers instanceof Array) {
        that.pc_config.iceServers = spec.iceServers;
    } else {
      if (spec.stunServerUrl) {
          if (spec.stunServerUrl instanceof Array) {
              spec.stunServerUrl.map(function (url) {
                  if (typeof url === 'string' && url !== '') {
                      that.pc_config.iceServers.push({url: url});
                  }
              });
          } else if (typeof spec.stunServerUrl === 'string' && spec.stunServerUrl !== '') {
              that.pc_config.iceServers.push({url: spec.stunServerUrl});
          }
      }

      if (spec.turnServer) {
          if (spec.turnServer instanceof Array) {
              spec.turnServer.map(function (turn) {
                  if (typeof turn.url === 'string' && turn.url !== '') {
                      that.pc_config.iceServers.push({
                          username: turn.username,
                          credential: turn.password,
                          url: turn.url
                      });
                  }
              });
          } else if (typeof spec.turnServer.url === 'string' && spec.turnServer.url !== '') {
              that.pc_config.iceServers.push({
                  username: spec.turnServer.username,
                  credential: spec.turnServer.password,
                  url: spec.turnServer.url
              });
          }
      }
  }

  if (spec.audio === undefined) {
      spec.audio = true;
  }

  if (spec.video === undefined) {
      spec.video = true;
  }

  that.mediaConstraints = {
      'mandatory': {
          'OfferToReceiveVideo': spec.video,
          'OfferToReceiveAudio': spec.audio
      }
  };
  that.peerConnection = new WebkitRTCPeerConnection(that.pc_config);

  that.peerConnection.onicegatheringstatechange = function (state) {
        L.Logger.debug('PeerConnection: ', spec.session_id);
        if (state === "2") {
          // At the moment, we do not renegotiate when new candidates
          // show up after the more flag has been false once.
          // L.Logger.debug('State: ' + that.peerConnection.iceGatheringState);

          if (that.ices === undefined) {
              that.ices = 0;
          }
          that.ices = that.ices + 1;
          if (that.ices >= 1 && that.moreIceComing) {
              that.moreIceComing = false;
              that.markActionNeeded();
          }
        } else {
          that.iceCandidateCount += 1;
          // if (that.iceCandidateCount > 5) {
          //     that.moreIceComing = false;
          //     that.markActionNeeded();
          // }
        }
    };

    //L.Logger.debug("Created webkitRTCPeerConnnection with config \"" + JSON.stringify(that.pc_config) + "\".");

    var setMaxBW = function (sdp) {
        var a, r;
        if (spec.video && spec.maxVideoBW) {
            a = sdp.match(/m=video.*\r\n/);
            r = a[0] + 'b=AS:' + spec.maxVideoBW + '\r\n';
            sdp = sdp.replace(a[0], r);
        }

        if (spec.audio && spec.maxAudioBW) {
            a = sdp.match(/m=audio.*\r\n/);
            r = a[0] + 'b=AS:' + spec.maxAudioBW + '\r\n';
            sdp = sdp.replace(a[0], r);
        }

        return sdp;
    };

    /**
     * This function processes signalling messages from the other side.
     * @param {string} msgstring JSON-formatted string containing a ROAP message.
     */
    that.processSignalingMessage = function (msgstring) {
        // Offer: Check for glare and resolve.
        // Answer/OK: Remove retransmit for the msg this is an answer to.
        // Send back "OK" if this was an Answer.
        L.Logger.debug('Activity on conn ' + that.sessionId);
        var msg = JSON.parse(msgstring), sd;
        that.incomingMessage = msg;

        if (that.state === 'new') {
            if (msg.messageType === 'OFFER') {
                // Initial offer.
                sd = {
                    sdp: msg.sdp,
                    type: 'offer'
                };
                that.peerConnection.setRemoteDescription(new RTCSessionDescription(sd), function () {
                  console.log("set sdp offer success");
                }, function () {
                  console.log("set sdp offer fialed");
                });

                that.state = 'offer-received';
                // Allow other stuff to happen, then reply.
                that.markActionNeeded();
            } else {
                that.error('Illegal message for this state: ' + msg.messageType + ' in state ' + that.state);
            }

        } else if (that.state === 'offer-sent') {
            if (msg.messageType === 'ANSWER') {

                sd = {
                    sdp: msg.sdp,
                    type: 'answer'
                };
                L.Logger.debug('Received ANSWER: ', sd.sdp);

                sd.sdp = setMaxBW(sd.sdp);


                that.peerConnection.setRemoteDescription(new RTCSessionDescription(sd), function () {
                  console.log("set sdp answer success");
                }, function () {
                  console.log("set sdp answer failed");
                });
                that.sendOK();
                that.state = 'established';

            } else if (msg.messageType === 'pr-answer') {
                sd = {
                    sdp: msg.sdp,
                    type: 'pr-answer'
                };
                that.peerConnection.setRemoteDescription(new RTCSessionDescription(sd), function () {
                  console.log("set sdp pr-answer success");
                }, function () {
                  console.log("set sdp pr-answer failed");
                });

                // No change to state, and no response.
            } else if (msg.messageType === 'offer') {
                // Glare processing.
                that.error('Not written yet');
            } else {
                that.error('Illegal message for this state: ' + msg.messageType + ' in state ' + that.state);
            }

        } else if (that.state === 'established') {
            if (msg.messageType === 'OFFER') {
                // Subsequent offer.
                sd = {
                    sdp: msg.sdp,
                    type: 'offer'
                };
                that.peerConnection.setRemoteDescription(new RTCSessionDescription(sd), function () {
                  console.log("set sdp established success");
                }, function () {
                  console.log("set sdp established failed");
                });

                that.state = 'offer-received';
                // Allow other stuff to happen, then reply.
                that.markActionNeeded();
            } else {
                that.error('Illegal message for this state: ' + msg.messageType + ' in state ' + that.state);
            }
        }
    };

  /**
     * Adds a stream - this causes signalling to happen, if needed.
     * @param {MediaStream} stream The outgoing MediaStream to add.
     */
    that.addStream = function (stream) {
        that.peerConnection.addStream(stream);
        that.markActionNeeded();
    };

    /**
     * Removes a stream.
     * @param {MediaStream} stream The MediaStream to remove.
     */
    that.removeStream = function () {
//        var i;
//        for (i = 0; i < that.peerConnection.localStreams.length; ++i) {
//            if (that.localStreams[i] === stream) {
//                that.localStreams[i] = null;
//            }
//        }
        that.markActionNeeded();
    };

    /**
     * Closes the connection.
     */
    that.close = function () {
        that.state = 'closed';
        if (that.peerConnection.signalingState !== 'closed') {
            that.peerConnection.close();
        }
    };

    /**
     * Internal function: Mark that something happened.
     */
    that.markActionNeeded = function () {
        that.actionNeeded = true;
        that.doLater(function () {
            that.onstablestate();
        });
    };

    /**
     * Internal function: Do something later (not on this stack).
     * @param {function} what Callback to be executed later.
     */
    that.doLater = function (what) {
        // Post an event to myself so that I get called a while later.
        // (needs more JS/DOM info. Just call the processing function on a delay
        // for now.)
        window.setTimeout(what, 1);
    };

    /**
     * Internal function called when a stable state
     * is entered by the browser (to allow for multiple AddStream calls or
     * other interesting actions).
     * This function will generate an offer or answer, as needed, and send
     * to the remote party using our onsignalingmessage function.
     */
    that.onstablestate = function () {
        var mySDP;
        if (that.actionNeeded) {
            if (that.state === 'new' || that.state === 'established') {
                // See if the current offer is the same as what we already sent.
                // If not, no change is needed.

                //Johny: for IE we need to add stream before creating offer.
                that.peerConnection.createOffer(function (sessionDescription) {

                    //sessionDescription.sdp = newOffer.replace(/a=ice-options:google-ice\r\n/g, "");
                    //sessionDescription.sdp = newOffer.replace(/a=crypto:0 AES_CM_128_HMAC_SHA1_80 inline:.*\r\n/g, "a=crypto:0 AES_CM_128_HMAC_SHA1_80 inline:eUMxlV2Ib6U8qeZot/wEKHw9iMzfKUYpOPJrNnu3\r\n");
                    //sessionDescription.sdp = newOffer.replace(/a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:.*\r\n/g, "a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:eUMxlV2Ib6U8qeZot/wEKHw9iMzfKUYpOPJrNnu3\r\n");

                    sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
                    L.Logger.debug('Changed', sessionDescription.sdp);

                    var newOffer = sessionDescription.sdp;

                    if (newOffer !== that.prevOffer) {

                        that.peerConnection.setLocalDescription(sessionDescription, function () {
                          console.log("createOffer success");
                        }, function () {
                          console.log("createOffer failed");
                        });

                        that.state = 'preparing-offer';
                        that.markActionNeeded();
                        return;
                    } else {
                        L.Logger.debug('Not sending a new offer');
                    }

                }, function (error) {
                  console.log('Failed to create session description: ' + error.toString());
                }, that.mediaConstraints);


            } else if (that.state === 'preparing-offer') {
                // Don't do anything until we have the ICE candidates.
                if (that.moreIceComing) {
                    return;
                }


                // Now able to send the offer we've already prepared.
                that.peerConnection.getLocalDescription(function (sdp) {
                  that.prevOffer = sdp;
                  L.Logger.debug('Sending OFFER: ' + that.prevOffer);
                  //L.Logger.debug('Sent SDP is ' + that.prevOffer);
                  that.sendMessage('OFFER', that.prevOffer);
                  // Not done: Retransmission on non-response.
                  that.state = 'offer-sent';
                });
            } else if (that.state === 'offer-received') {

                that.peerConnection.createAnswer(function (sessionDescription) {
                    that.peerConnection.setLocalDescription(sessionDescription, function () {
                      console.log("createAnswer success");
                    }, function () {
                      console.log("createAnswer failed");
                    });
                    that.state = 'offer-received-preparing-answer';

                    if (!that.iceStarted) {
                        var now = new Date();
                        L.Logger.debug(now.getTime() + ': Starting ICE in responder');
                        that.iceStarted = true;
                    } else {
                        that.markActionNeeded();
                        return;
                    }

                }, function (error) {
                  console.log('Failed to create session description: ' + error.toString());
                }, that.mediaConstraints);

            } else if (that.state === 'offer-received-preparing-answer') {
                if (that.moreIceComing) {
                    return;
                }

                that.peerConnection.getLocalDescription(function (sdp) {
                  mySDP = sdp;
                  that.sendMessage('ANSWER', mySDP);
                  that.state = 'established';
                });

            } else {
                that.error('Dazed and confused in state ' + that.state + ', stopping here');
            }
            that.actionNeeded = false;
        }
    };

    // that.waitSend = function () {
    //   console.log("run wait send: --" + that.iceConnectionState);
    //   if(that.iceConnectionState !== "completed"){
    //     setTimeout(that.waitSend, 500);
    //   }else{
    //     //L.Logger.debug('Sent SDP is ' + that.prevOffer);
    //     that.sendMessage('OFFER', that.prevOffer);
    //     // Not done: Retransmission on non-response.
    //     that.state = 'offer-sent';
    //   }
    // }

    /**
     * Internal function to send an "OK" message.
     */
    that.sendOK = function () {
        that.sendMessage('OK');
    };

    /**
     * Internal function to send a signalling message.
     * @param {string} operation What operation to signal.
     * @param {string} sdp SDP message body.
     */
    that.sendMessage = function (operation, sdp) {
        var roapMessage = {};
        roapMessage.messageType = operation;
        roapMessage.sdp = sdp; // may be null or undefined
        if (operation === 'OFFER') {
            roapMessage.offererSessionId = that.sessionId;
            roapMessage.answererSessionId = that.otherSessionId; // may be null
            roapMessage.seq = (that.sequenceNumber += 1);
            // The tiebreaker needs to be neither 0 nor 429496725.
            roapMessage.tiebreaker = Math.floor(Math.random() * 429496723 + 1);
        } else {
            roapMessage.offererSessionId = that.incomingMessage.offererSessionId;
            roapMessage.answererSessionId = that.sessionId;
            roapMessage.seq = that.incomingMessage.seq;
        }
        that.onsignalingmessage(JSON.stringify(roapMessage));
    };

    /**
     * Internal something-bad-happened function.
     * @param {string} text What happened - suitable for logging.
     */
    that.error = function (text) {
        throw 'Error in RoapOnJsep: ' + text;
    };

    that.sessionId = (that.roapSessionId += 1);
    that.sequenceNumber = 0; // Number of last ROAP message sent. Starts at 1.
    that.actionNeeded = false;
    that.iceStarted = false;
    that.moreIceComing = true;
    that.iceCandidateCount = 0;
    that.onsignalingmessage = spec.callback;
    that.state = 'new';

    that.peerConnection.onopen = function () {
        if (that.onopen) {
            that.onopen();
        }
    };

    that.peerConnection.onaddstream = function (stream) {
        if (that.onaddstream) {
            that.onaddstream(stream);
        }
    };

    that.peerConnection.onremovestream = function (stream) {
        if (that.onremovestream) {
            that.onremovestream(stream);
        }
    };

    that.peerConnection.oniceconnectionstatechange = function (e) {
      if (that.oniceconnectionstatechange) {
        that.oniceconnectionstatechange(e);
      }
    };

    that.markActionNeeded();

    return that;
};



window.Erizo = Erizo;
window.Woogeen = Woogeen;
window.L = L;
}(window));



!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.io=e()}}(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(_dereq_,module,exports){module.exports=_dereq_("./lib/")},{"./lib/":2}],2:[function(_dereq_,module,exports){var url=_dereq_("./url");var parser=_dereq_("socket.io-parser");var Manager=_dereq_("./manager");var debug=_dereq_("debug")("socket.io-client");module.exports=exports=lookup;var cache=exports.managers={};function lookup(uri,opts){if(typeof uri=="object"){opts=uri;uri=undefined}opts=opts||{};var parsed=url(uri);var source=parsed.source;var id=parsed.id;var io;if(opts.forceNew||opts["force new connection"]||false===opts.multiplex){debug("ignoring socket cache for %s",source);io=Manager(source,opts)}else{if(!cache[id]){debug("new io instance for %s",source);cache[id]=Manager(source,opts)}io=cache[id]}return io.socket(parsed.path)}exports.protocol=parser.protocol;exports.connect=lookup;exports.Manager=_dereq_("./manager");exports.Socket=_dereq_("./socket")},{"./manager":3,"./socket":5,"./url":6,debug:10,"socket.io-parser":46}],3:[function(_dereq_,module,exports){var url=_dereq_("./url");var eio=_dereq_("engine.io-client");var Socket=_dereq_("./socket");var Emitter=_dereq_("component-emitter");var parser=_dereq_("socket.io-parser");var on=_dereq_("./on");var bind=_dereq_("component-bind");var object=_dereq_("object-component");var debug=_dereq_("debug")("socket.io-client:manager");var indexOf=_dereq_("indexof");var Backoff=_dereq_("backo2");module.exports=Manager;function Manager(uri,opts){if(!(this instanceof Manager))return new Manager(uri,opts);if(uri&&"object"==typeof uri){opts=uri;uri=undefined}opts=opts||{};opts.path=opts.path||"/socket.io";this.nsps={};this.subs=[];this.opts=opts;this.reconnection(opts.reconnection!==false);this.reconnectionAttempts(opts.reconnectionAttempts||Infinity);this.reconnectionDelay(opts.reconnectionDelay||1e3);this.reconnectionDelayMax(opts.reconnectionDelayMax||5e3);this.randomizationFactor(opts.randomizationFactor||.5);this.backoff=new Backoff({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()});this.timeout(null==opts.timeout?2e4:opts.timeout);this.readyState="closed";this.uri=uri;this.connected=[];this.encoding=false;this.packetBuffer=[];this.encoder=new parser.Encoder;this.decoder=new parser.Decoder;this.autoConnect=opts.autoConnect!==false;if(this.autoConnect)this.open()}Manager.prototype.emitAll=function(){this.emit.apply(this,arguments);for(var nsp in this.nsps){this.nsps[nsp].emit.apply(this.nsps[nsp],arguments)}};Manager.prototype.updateSocketIds=function(){for(var nsp in this.nsps){this.nsps[nsp].id=this.engine.id}};Emitter(Manager.prototype);Manager.prototype.reconnection=function(v){if(!arguments.length)return this._reconnection;this._reconnection=!!v;return this};Manager.prototype.reconnectionAttempts=function(v){if(!arguments.length)return this._reconnectionAttempts;this._reconnectionAttempts=v;return this};Manager.prototype.reconnectionDelay=function(v){if(!arguments.length)return this._reconnectionDelay;this._reconnectionDelay=v;this.backoff&&this.backoff.setMin(v);return this};Manager.prototype.randomizationFactor=function(v){if(!arguments.length)return this._randomizationFactor;this._randomizationFactor=v;this.backoff&&this.backoff.setJitter(v);return this};Manager.prototype.reconnectionDelayMax=function(v){if(!arguments.length)return this._reconnectionDelayMax;this._reconnectionDelayMax=v;this.backoff&&this.backoff.setMax(v);return this};Manager.prototype.timeout=function(v){if(!arguments.length)return this._timeout;this._timeout=v;return this};Manager.prototype.maybeReconnectOnOpen=function(){if(!this.reconnecting&&this._reconnection&&this.backoff.attempts===0){this.reconnect()}};Manager.prototype.open=Manager.prototype.connect=function(fn){debug("readyState %s",this.readyState);if(~this.readyState.indexOf("open"))return this;debug("opening %s",this.uri);this.engine=eio(this.uri,this.opts);var socket=this.engine;var self=this;this.readyState="opening";this.skipReconnect=false;var openSub=on(socket,"open",function(){self.onopen();fn&&fn()});var errorSub=on(socket,"error",function(data){debug("connect_error");self.cleanup();self.readyState="closed";self.emitAll("connect_error",data);if(fn){var err=new Error("Connection error");err.data=data;fn(err)}else{self.maybeReconnectOnOpen()}});if(false!==this._timeout){var timeout=this._timeout;debug("connect attempt will timeout after %d",timeout);var timer=setTimeout(function(){debug("connect attempt timed out after %d",timeout);openSub.destroy();socket.close();socket.emit("error","timeout");self.emitAll("connect_timeout",timeout)},timeout);this.subs.push({destroy:function(){clearTimeout(timer)}})}this.subs.push(openSub);this.subs.push(errorSub);return this};Manager.prototype.onopen=function(){debug("open");this.cleanup();this.readyState="open";this.emit("open");var socket=this.engine;this.subs.push(on(socket,"data",bind(this,"ondata")));this.subs.push(on(this.decoder,"decoded",bind(this,"ondecoded")));this.subs.push(on(socket,"error",bind(this,"onerror")));this.subs.push(on(socket,"close",bind(this,"onclose")))};Manager.prototype.ondata=function(data){this.decoder.add(data)};Manager.prototype.ondecoded=function(packet){this.emit("packet",packet)};Manager.prototype.onerror=function(err){debug("error",err);this.emitAll("error",err)};Manager.prototype.socket=function(nsp){var socket=this.nsps[nsp];if(!socket){socket=new Socket(this,nsp);this.nsps[nsp]=socket;var self=this;socket.on("connect",function(){socket.id=self.engine.id;if(!~indexOf(self.connected,socket)){self.connected.push(socket)}})}return socket};Manager.prototype.destroy=function(socket){var index=indexOf(this.connected,socket);if(~index)this.connected.splice(index,1);if(this.connected.length)return;this.close()};Manager.prototype.packet=function(packet){debug("writing packet %j",packet);var self=this;if(!self.encoding){self.encoding=true;this.encoder.encode(packet,function(encodedPackets){for(var i=0;i<encodedPackets.length;i++){self.engine.write(encodedPackets[i])}self.encoding=false;self.processPacketQueue()})}else{self.packetBuffer.push(packet)}};Manager.prototype.processPacketQueue=function(){if(this.packetBuffer.length>0&&!this.encoding){var pack=this.packetBuffer.shift();this.packet(pack)}};Manager.prototype.cleanup=function(){var sub;while(sub=this.subs.shift())sub.destroy();this.packetBuffer=[];this.encoding=false;this.decoder.destroy()};Manager.prototype.close=Manager.prototype.disconnect=function(){this.skipReconnect=true;this.backoff.reset();this.readyState="closed";this.engine&&this.engine.close()};Manager.prototype.onclose=function(reason){debug("close");this.cleanup();this.backoff.reset();this.readyState="closed";this.emit("close",reason);if(this._reconnection&&!this.skipReconnect){this.reconnect()}};Manager.prototype.reconnect=function(){if(this.reconnecting||this.skipReconnect)return this;var self=this;if(this.backoff.attempts>=this._reconnectionAttempts){debug("reconnect failed");this.backoff.reset();this.emitAll("reconnect_failed");this.reconnecting=false}else{var delay=this.backoff.duration();debug("will wait %dms before reconnect attempt",delay);this.reconnecting=true;var timer=setTimeout(function(){if(self.skipReconnect)return;debug("attempting reconnect");self.emitAll("reconnect_attempt",self.backoff.attempts);self.emitAll("reconnecting",self.backoff.attempts);if(self.skipReconnect)return;self.open(function(err){if(err){debug("reconnect attempt error");self.reconnecting=false;self.reconnect();self.emitAll("reconnect_error",err.data)}else{debug("reconnect success");self.onreconnect()}})},delay);this.subs.push({destroy:function(){clearTimeout(timer)}})}};Manager.prototype.onreconnect=function(){var attempt=this.backoff.attempts;this.reconnecting=false;this.backoff.reset();this.updateSocketIds();this.emitAll("reconnect",attempt)}},{"./on":4,"./socket":5,"./url":6,backo2:7,"component-bind":8,"component-emitter":9,debug:10,"engine.io-client":11,indexof:42,"object-component":43,"socket.io-parser":46}],4:[function(_dereq_,module,exports){module.exports=on;function on(obj,ev,fn){obj.on(ev,fn);return{destroy:function(){obj.removeListener(ev,fn)}}}},{}],5:[function(_dereq_,module,exports){var parser=_dereq_("socket.io-parser");var Emitter=_dereq_("component-emitter");var toArray=_dereq_("to-array");var on=_dereq_("./on");var bind=_dereq_("component-bind");var debug=_dereq_("debug")("socket.io-client:socket");var hasBin=_dereq_("has-binary");module.exports=exports=Socket;var events={connect:1,connect_error:1,connect_timeout:1,disconnect:1,error:1,reconnect:1,reconnect_attempt:1,reconnect_failed:1,reconnect_error:1,reconnecting:1};var emit=Emitter.prototype.emit;function Socket(io,nsp){this.io=io;this.nsp=nsp;this.json=this;this.ids=0;this.acks={};if(this.io.autoConnect)this.open();this.receiveBuffer=[];this.sendBuffer=[];this.connected=false;this.disconnected=true}Emitter(Socket.prototype);Socket.prototype.subEvents=function(){if(this.subs)return;var io=this.io;this.subs=[on(io,"open",bind(this,"onopen")),on(io,"packet",bind(this,"onpacket")),on(io,"close",bind(this,"onclose"))]};Socket.prototype.open=Socket.prototype.connect=function(){if(this.connected)return this;this.subEvents();this.io.open();if("open"==this.io.readyState)this.onopen();return this};Socket.prototype.send=function(){var args=toArray(arguments);args.unshift("message");this.emit.apply(this,args);return this};Socket.prototype.emit=function(ev){if(events.hasOwnProperty(ev)){emit.apply(this,arguments);return this}var args=toArray(arguments);var parserType=parser.EVENT;if(hasBin(args)){parserType=parser.BINARY_EVENT}var packet={type:parserType,data:args};if("function"==typeof args[args.length-1]){debug("emitting packet with ack id %d",this.ids);this.acks[this.ids]=args.pop();packet.id=this.ids++}if(this.connected){this.packet(packet)}else{this.sendBuffer.push(packet)}return this};Socket.prototype.packet=function(packet){packet.nsp=this.nsp;this.io.packet(packet)};Socket.prototype.onopen=function(){debug("transport is open - connecting");if("/"!=this.nsp){this.packet({type:parser.CONNECT})}};Socket.prototype.onclose=function(reason){debug("close (%s)",reason);this.connected=false;this.disconnected=true;delete this.id;this.emit("disconnect",reason)};Socket.prototype.onpacket=function(packet){if(packet.nsp!=this.nsp)return;switch(packet.type){case parser.CONNECT:this.onconnect();break;case parser.EVENT:this.onevent(packet);break;case parser.BINARY_EVENT:this.onevent(packet);break;case parser.ACK:this.onack(packet);break;case parser.BINARY_ACK:this.onack(packet);break;case parser.DISCONNECT:this.ondisconnect();break;case parser.ERROR:this.emit("error",packet.data);break}};Socket.prototype.onevent=function(packet){var args=packet.data||[];debug("emitting event %j",args);if(null!=packet.id){debug("attaching ack callback to event");args.push(this.ack(packet.id))}if(this.connected){emit.apply(this,args)}else{this.receiveBuffer.push(args)}};Socket.prototype.ack=function(id){var self=this;var sent=false;return function(){if(sent)return;sent=true;var args=toArray(arguments);debug("sending ack %j",args);var type=hasBin(args)?parser.BINARY_ACK:parser.ACK;self.packet({type:type,id:id,data:args})}};Socket.prototype.onack=function(packet){debug("calling ack %s with %j",packet.id,packet.data);var fn=this.acks[packet.id];fn.apply(this,packet.data);delete this.acks[packet.id]};Socket.prototype.onconnect=function(){this.connected=true;this.disconnected=false;this.emit("connect");this.emitBuffered()};Socket.prototype.emitBuffered=function(){var i;for(i=0;i<this.receiveBuffer.length;i++){emit.apply(this,this.receiveBuffer[i])}this.receiveBuffer=[];for(i=0;i<this.sendBuffer.length;i++){this.packet(this.sendBuffer[i])}this.sendBuffer=[]};Socket.prototype.ondisconnect=function(){debug("server disconnect (%s)",this.nsp);this.destroy();this.onclose("io server disconnect")};Socket.prototype.destroy=function(){if(this.subs){for(var i=0;i<this.subs.length;i++){this.subs[i].destroy()}this.subs=null}this.io.destroy(this)};Socket.prototype.close=Socket.prototype.disconnect=function(){if(this.connected){debug("performing disconnect (%s)",this.nsp);this.packet({type:parser.DISCONNECT})}this.destroy();if(this.connected){this.onclose("io client disconnect")}return this}},{"./on":4,"component-bind":8,"component-emitter":9,debug:10,"has-binary":38,"socket.io-parser":46,"to-array":50}],6:[function(_dereq_,module,exports){(function(global){var parseuri=_dereq_("parseuri");var debug=_dereq_("debug")("socket.io-client:url");module.exports=url;function url(uri,loc){var obj=uri;var loc=loc||global.location;if(null==uri)uri=loc.protocol+"//"+loc.host;if("string"==typeof uri){if("/"==uri.charAt(0)){if("/"==uri.charAt(1)){uri=loc.protocol+uri}else{uri=loc.hostname+uri}}if(!/^(https?|wss?):\/\//.test(uri)){debug("protocol-less url %s",uri);if("undefined"!=typeof loc){uri=loc.protocol+"//"+uri}else{uri="https://"+uri}}debug("parse %s",uri);obj=parseuri(uri)}if(!obj.port){if(/^(http|ws)$/.test(obj.protocol)){obj.port="80"}else if(/^(http|ws)s$/.test(obj.protocol)){obj.port="443"}}obj.path=obj.path||"/";obj.id=obj.protocol+"://"+obj.host+":"+obj.port;obj.href=obj.protocol+"://"+obj.host+(loc&&loc.port==obj.port?"":":"+obj.port);return obj}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{debug:10,parseuri:44}],7:[function(_dereq_,module,exports){module.exports=Backoff;function Backoff(opts){opts=opts||{};this.ms=opts.min||100;this.max=opts.max||1e4;this.factor=opts.factor||2;this.jitter=opts.jitter>0&&opts.jitter<=1?opts.jitter:0;this.attempts=0}Backoff.prototype.duration=function(){var ms=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var rand=Math.random();var deviation=Math.floor(rand*this.jitter*ms);ms=(Math.floor(rand*10)&1)==0?ms-deviation:ms+deviation}return Math.min(ms,this.max)|0};Backoff.prototype.reset=function(){this.attempts=0};Backoff.prototype.setMin=function(min){this.ms=min};Backoff.prototype.setMax=function(max){this.max=max};Backoff.prototype.setJitter=function(jitter){this.jitter=jitter}},{}],8:[function(_dereq_,module,exports){var slice=[].slice;module.exports=function(obj,fn){if("string"==typeof fn)fn=obj[fn];if("function"!=typeof fn)throw new Error("bind() requires a function");var args=slice.call(arguments,2);return function(){return fn.apply(obj,args.concat(slice.call(arguments)))}}},{}],9:[function(_dereq_,module,exports){module.exports=Emitter;function Emitter(obj){if(obj)return mixin(obj)}function mixin(obj){for(var key in Emitter.prototype){obj[key]=Emitter.prototype[key]}return obj}Emitter.prototype.on=Emitter.prototype.addEventListener=function(event,fn){this._callbacks=this._callbacks||{};(this._callbacks[event]=this._callbacks[event]||[]).push(fn);return this};Emitter.prototype.once=function(event,fn){var self=this;this._callbacks=this._callbacks||{};function on(){self.off(event,on);fn.apply(this,arguments)}on.fn=fn;this.on(event,on);return this};Emitter.prototype.off=Emitter.prototype.removeListener=Emitter.prototype.removeAllListeners=Emitter.prototype.removeEventListener=function(event,fn){this._callbacks=this._callbacks||{};if(0==arguments.length){this._callbacks={};return this}var callbacks=this._callbacks[event];if(!callbacks)return this;if(1==arguments.length){delete this._callbacks[event];return this}var cb;for(var i=0;i<callbacks.length;i++){cb=callbacks[i];if(cb===fn||cb.fn===fn){callbacks.splice(i,1);break}}return this};Emitter.prototype.emit=function(event){this._callbacks=this._callbacks||{};var args=[].slice.call(arguments,1),callbacks=this._callbacks[event];if(callbacks){callbacks=callbacks.slice(0);for(var i=0,len=callbacks.length;i<len;++i){callbacks[i].apply(this,args)}}return this};Emitter.prototype.listeners=function(event){this._callbacks=this._callbacks||{};return this._callbacks[event]||[]};Emitter.prototype.hasListeners=function(event){return!!this.listeners(event).length}},{}],10:[function(_dereq_,module,exports){module.exports=debug;function debug(name){if(!debug.enabled(name))return function(){};return function(fmt){fmt=coerce(fmt);var curr=new Date;var ms=curr-(debug[name]||curr);debug[name]=curr;fmt=name+" "+fmt+" +"+debug.humanize(ms);window.console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}}debug.names=[];debug.skips=[];debug.enable=function(name){try{localStorage.debug=name}catch(e){}var split=(name||"").split(/[\s,]+/),len=split.length;for(var i=0;i<len;i++){name=split[i].replace("*",".*?");if(name[0]==="-"){debug.skips.push(new RegExp("^"+name.substr(1)+"$"))}else{debug.names.push(new RegExp("^"+name+"$"))}}};debug.disable=function(){debug.enable("")};debug.humanize=function(ms){var sec=1e3,min=60*1e3,hour=60*min;if(ms>=hour)return(ms/hour).toFixed(1)+"h";if(ms>=min)return(ms/min).toFixed(1)+"m";if(ms>=sec)return(ms/sec|0)+"s";return ms+"ms"};debug.enabled=function(name){for(var i=0,len=debug.skips.length;i<len;i++){if(debug.skips[i].test(name)){return false}}for(var i=0,len=debug.names.length;i<len;i++){if(debug.names[i].test(name)){return true}}return false};function coerce(val){if(val instanceof Error)return val.stack||val.message;return val}try{if(window.localStorage)debug.enable(localStorage.debug)}catch(e){}},{}],11:[function(_dereq_,module,exports){module.exports=_dereq_("./lib/")},{"./lib/":12}],12:[function(_dereq_,module,exports){module.exports=_dereq_("./socket");module.exports.parser=_dereq_("engine.io-parser")},{"./socket":13,"engine.io-parser":25}],13:[function(_dereq_,module,exports){(function(global){var transports=_dereq_("./transports");var Emitter=_dereq_("component-emitter");var debug=_dereq_("debug")("engine.io-client:socket");var index=_dereq_("indexof");var parser=_dereq_("engine.io-parser");var parseuri=_dereq_("parseuri");var parsejson=_dereq_("parsejson");var parseqs=_dereq_("parseqs");module.exports=Socket;function noop(){}function Socket(uri,opts){if(!(this instanceof Socket))return new Socket(uri,opts);opts=opts||{};if(uri&&"object"==typeof uri){opts=uri;uri=null}if(uri){uri=parseuri(uri);opts.host=uri.host;opts.secure=uri.protocol=="https"||uri.protocol=="wss";opts.port=uri.port;if(uri.query)opts.query=uri.query}this.secure=null!=opts.secure?opts.secure:global.location&&"https:"==location.protocol;if(opts.host){var pieces=opts.host.split(":");opts.hostname=pieces.shift();if(pieces.length){opts.port=pieces.pop()}else if(!opts.port){opts.port=this.secure?"443":"80"}}this.agent=opts.agent||false;this.hostname=opts.hostname||(global.location?location.hostname:"localhost");this.port=opts.port||(global.location&&location.port?location.port:this.secure?443:80);this.query=opts.query||{};if("string"==typeof this.query)this.query=parseqs.decode(this.query);this.upgrade=false!==opts.upgrade;this.path=(opts.path||"/engine.io").replace(/\/$/,"")+"/";this.forceJSONP=!!opts.forceJSONP;this.jsonp=false!==opts.jsonp;this.forceBase64=!!opts.forceBase64;this.enablesXDR=!!opts.enablesXDR;this.timestampParam=opts.timestampParam||"t";this.timestampRequests=opts.timestampRequests;this.transports=opts.transports||["polling","websocket"];this.readyState="";this.writeBuffer=[];this.callbackBuffer=[];this.policyPort=opts.policyPort||843;this.rememberUpgrade=opts.rememberUpgrade||false;this.binaryType=null;this.onlyBinaryUpgrades=opts.onlyBinaryUpgrades;this.pfx=opts.pfx||null;this.key=opts.key||null;this.passphrase=opts.passphrase||null;this.cert=opts.cert||null;this.ca=opts.ca||null;this.ciphers=opts.ciphers||null;this.rejectUnauthorized=opts.rejectUnauthorized||null;this.open()}Socket.priorWebsocketSuccess=false;Emitter(Socket.prototype);Socket.protocol=parser.protocol;Socket.Socket=Socket;Socket.Transport=_dereq_("./transport");Socket.transports=_dereq_("./transports");Socket.parser=_dereq_("engine.io-parser");Socket.prototype.createTransport=function(name){debug('creating transport "%s"',name);var query=clone(this.query);query.EIO=parser.protocol;query.transport=name;if(this.id)query.sid=this.id;var transport=new transports[name]({agent:this.agent,hostname:this.hostname,port:this.port,secure:this.secure,path:this.path,query:query,forceJSONP:this.forceJSONP,jsonp:this.jsonp,forceBase64:this.forceBase64,enablesXDR:this.enablesXDR,timestampRequests:this.timestampRequests,timestampParam:this.timestampParam,policyPort:this.policyPort,socket:this,pfx:this.pfx,key:this.key,passphrase:this.passphrase,cert:this.cert,ca:this.ca,ciphers:this.ciphers,rejectUnauthorized:this.rejectUnauthorized});return transport};function clone(obj){var o={};for(var i in obj){if(obj.hasOwnProperty(i)){o[i]=obj[i]}}return o}Socket.prototype.open=function(){var transport;if(this.rememberUpgrade&&Socket.priorWebsocketSuccess&&this.transports.indexOf("websocket")!=-1){transport="websocket"}else if(0==this.transports.length){var self=this;setTimeout(function(){self.emit("error","No transports available")},0);return}else{transport=this.transports[0]}this.readyState="opening";var transport;try{transport=this.createTransport(transport)}catch(e){this.transports.shift();this.open();return}transport.open();this.setTransport(transport)};Socket.prototype.setTransport=function(transport){debug("setting transport %s",transport.name);var self=this;if(this.transport){debug("clearing existing transport %s",this.transport.name);this.transport.removeAllListeners()}this.transport=transport;transport.on("drain",function(){self.onDrain()}).on("packet",function(packet){self.onPacket(packet)}).on("error",function(e){self.onError(e)}).on("close",function(){self.onClose("transport close")})};Socket.prototype.probe=function(name){debug('probing transport "%s"',name);var transport=this.createTransport(name,{probe:1}),failed=false,self=this;Socket.priorWebsocketSuccess=false;function onTransportOpen(){if(self.onlyBinaryUpgrades){var upgradeLosesBinary=!this.supportsBinary&&self.transport.supportsBinary;failed=failed||upgradeLosesBinary}if(failed)return;debug('probe transport "%s" opened',name);transport.send([{type:"ping",data:"probe"}]);transport.once("packet",function(msg){if(failed)return;if("pong"==msg.type&&"probe"==msg.data){debug('probe transport "%s" pong',name);self.upgrading=true;self.emit("upgrading",transport);if(!transport)return;Socket.priorWebsocketSuccess="websocket"==transport.name;debug('pausing current transport "%s"',self.transport.name);self.transport.pause(function(){if(failed)return;if("closed"==self.readyState)return;debug("changing transport and sending upgrade packet");cleanup();self.setTransport(transport);transport.send([{type:"upgrade"}]);self.emit("upgrade",transport);transport=null;self.upgrading=false;self.flush()})}else{debug('probe transport "%s" failed',name);var err=new Error("probe error");err.transport=transport.name;self.emit("upgradeError",err)}})}function freezeTransport(){if(failed)return;failed=true;cleanup();transport.close();transport=null}function onerror(err){var error=new Error("probe error: "+err);error.transport=transport.name;freezeTransport();debug('probe transport "%s" failed because of error: %s',name,err);self.emit("upgradeError",error)}function onTransportClose(){onerror("transport closed")}function onclose(){onerror("socket closed")}function onupgrade(to){if(transport&&to.name!=transport.name){debug('"%s" works - aborting "%s"',to.name,transport.name);freezeTransport()}}function cleanup(){transport.removeListener("open",onTransportOpen);transport.removeListener("error",onerror);transport.removeListener("close",onTransportClose);self.removeListener("close",onclose);self.removeListener("upgrading",onupgrade)}transport.once("open",onTransportOpen);transport.once("error",onerror);transport.once("close",onTransportClose);this.once("close",onclose);this.once("upgrading",onupgrade);transport.open()};Socket.prototype.onOpen=function(){debug("socket open");this.readyState="open";Socket.priorWebsocketSuccess="websocket"==this.transport.name;this.emit("open");this.flush();if("open"==this.readyState&&this.upgrade&&this.transport.pause){debug("starting upgrade probes");for(var i=0,l=this.upgrades.length;i<l;i++){this.probe(this.upgrades[i])}}};Socket.prototype.onPacket=function(packet){if("opening"==this.readyState||"open"==this.readyState){debug('socket receive: type "%s", data "%s"',packet.type,packet.data);this.emit("packet",packet);this.emit("heartbeat");switch(packet.type){case"open":this.onHandshake(parsejson(packet.data));break;case"pong":this.setPing();break;case"error":var err=new Error("server error");err.code=packet.data;this.emit("error",err);break;case"message":this.emit("data",packet.data);this.emit("message",packet.data);break}}else{debug('packet received with socket readyState "%s"',this.readyState)}};Socket.prototype.onHandshake=function(data){this.emit("handshake",data);this.id=data.sid;this.transport.query.sid=data.sid;this.upgrades=this.filterUpgrades(data.upgrades);this.pingInterval=data.pingInterval;this.pingTimeout=data.pingTimeout;this.onOpen();if("closed"==this.readyState)return;this.setPing();this.removeListener("heartbeat",this.onHeartbeat);this.on("heartbeat",this.onHeartbeat)};Socket.prototype.onHeartbeat=function(timeout){clearTimeout(this.pingTimeoutTimer);var self=this;self.pingTimeoutTimer=setTimeout(function(){if("closed"==self.readyState)return;self.onClose("ping timeout")},timeout||self.pingInterval+self.pingTimeout)};Socket.prototype.setPing=function(){var self=this;clearTimeout(self.pingIntervalTimer);self.pingIntervalTimer=setTimeout(function(){debug("writing ping packet - expecting pong within %sms",self.pingTimeout);self.ping();self.onHeartbeat(self.pingTimeout)},self.pingInterval)};Socket.prototype.ping=function(){this.sendPacket("ping")};Socket.prototype.onDrain=function(){for(var i=0;i<this.prevBufferLen;i++){if(this.callbackBuffer[i]){this.callbackBuffer[i]()}}this.writeBuffer.splice(0,this.prevBufferLen);this.callbackBuffer.splice(0,this.prevBufferLen);this.prevBufferLen=0;if(this.writeBuffer.length==0){this.emit("drain")}else{this.flush()}};Socket.prototype.flush=function(){if("closed"!=this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){debug("flushing %d packets in socket",this.writeBuffer.length);this.transport.send(this.writeBuffer);this.prevBufferLen=this.writeBuffer.length;this.emit("flush")}};Socket.prototype.write=Socket.prototype.send=function(msg,fn){this.sendPacket("message",msg,fn);return this};Socket.prototype.sendPacket=function(type,data,fn){if("closing"==this.readyState||"closed"==this.readyState){return}var packet={type:type,data:data};this.emit("packetCreate",packet);this.writeBuffer.push(packet);this.callbackBuffer.push(fn);this.flush()};Socket.prototype.close=function(){if("opening"==this.readyState||"open"==this.readyState){this.readyState="closing";var self=this;function close(){self.onClose("forced close");debug("socket closing - telling transport to close");self.transport.close()}function cleanupAndClose(){self.removeListener("upgrade",cleanupAndClose);self.removeListener("upgradeError",cleanupAndClose);close()}function waitForUpgrade(){self.once("upgrade",cleanupAndClose);self.once("upgradeError",cleanupAndClose)}if(this.writeBuffer.length){this.once("drain",function(){if(this.upgrading){waitForUpgrade()}else{close()}})}else if(this.upgrading){waitForUpgrade()}else{close()}}return this};Socket.prototype.onError=function(err){debug("socket error %j",err);Socket.priorWebsocketSuccess=false;this.emit("error",err);this.onClose("transport error",err)};Socket.prototype.onClose=function(reason,desc){if("opening"==this.readyState||"open"==this.readyState||"closing"==this.readyState){debug('socket close with reason: "%s"',reason);var self=this;clearTimeout(this.pingIntervalTimer);clearTimeout(this.pingTimeoutTimer);setTimeout(function(){self.writeBuffer=[];self.callbackBuffer=[];self.prevBufferLen=0},0);this.transport.removeAllListeners("close");this.transport.close();this.transport.removeAllListeners();this.readyState="closed";this.id=null;this.emit("close",reason,desc)}};Socket.prototype.filterUpgrades=function(upgrades){var filteredUpgrades=[];for(var i=0,j=upgrades.length;i<j;i++){if(~index(this.transports,upgrades[i]))filteredUpgrades.push(upgrades[i])}return filteredUpgrades}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./transport":14,"./transports":15,"component-emitter":9,debug:22,"engine.io-parser":25,indexof:42,parsejson:34,parseqs:35,parseuri:36}],14:[function(_dereq_,module,exports){var parser=_dereq_("engine.io-parser");var Emitter=_dereq_("component-emitter");module.exports=Transport;function Transport(opts){this.path=opts.path;this.hostname=opts.hostname;this.port=opts.port;this.secure=opts.secure;this.query=opts.query;this.timestampParam=opts.timestampParam;this.timestampRequests=opts.timestampRequests;this.readyState="";this.agent=opts.agent||false;this.socket=opts.socket;this.enablesXDR=opts.enablesXDR;this.pfx=opts.pfx;this.key=opts.key;this.passphrase=opts.passphrase;this.cert=opts.cert;this.ca=opts.ca;this.ciphers=opts.ciphers;this.rejectUnauthorized=opts.rejectUnauthorized}Emitter(Transport.prototype);Transport.timestamps=0;Transport.prototype.onError=function(msg,desc){var err=new Error(msg);err.type="TransportError";err.description=desc;this.emit("error",err);return this};Transport.prototype.open=function(){if("closed"==this.readyState||""==this.readyState){this.readyState="opening";this.doOpen()}return this};Transport.prototype.close=function(){if("opening"==this.readyState||"open"==this.readyState){this.doClose();this.onClose()}return this};Transport.prototype.send=function(packets){if("open"==this.readyState){this.write(packets)}else{throw new Error("Transport not open")}};Transport.prototype.onOpen=function(){this.readyState="open";this.writable=true;this.emit("open")};Transport.prototype.onData=function(data){var packet=parser.decodePacket(data,this.socket.binaryType);this.onPacket(packet)};Transport.prototype.onPacket=function(packet){this.emit("packet",packet)};Transport.prototype.onClose=function(){this.readyState="closed";this.emit("close")}},{"component-emitter":9,"engine.io-parser":25}],15:[function(_dereq_,module,exports){(function(global){var XMLHttpRequest=_dereq_("xmlhttprequest");var XHR=_dereq_("./polling-xhr");var JSONP=_dereq_("./polling-jsonp");var websocket=_dereq_("./websocket");exports.polling=polling;exports.websocket=websocket;function polling(opts){var xhr;var xd=false;var xs=false;var jsonp=false!==opts.jsonp;if(global.location){var isSSL="https:"==location.protocol;var port=location.port;if(!port){port=isSSL?443:80}xd=opts.hostname!=location.hostname||port!=opts.port;xs=opts.secure!=isSSL}opts.xdomain=xd;opts.xscheme=xs;xhr=new XMLHttpRequest(opts);if("open"in xhr&&!opts.forceJSONP){return new XHR(opts)}else{if(!jsonp)throw new Error("JSONP disabled");return new JSONP(opts)}}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./polling-jsonp":16,"./polling-xhr":17,"./websocket":19,xmlhttprequest:20}],16:[function(_dereq_,module,exports){(function(global){var Polling=_dereq_("./polling");var inherit=_dereq_("component-inherit");module.exports=JSONPPolling;var rNewline=/\n/g;var rEscapedNewline=/\\n/g;var callbacks;var index=0;function empty(){}function JSONPPolling(opts){Polling.call(this,opts);
this.query=this.query||{};if(!callbacks){if(!global.___eio)global.___eio=[];callbacks=global.___eio}this.index=callbacks.length;var self=this;callbacks.push(function(msg){self.onData(msg)});this.query.j=this.index;if(global.document&&global.addEventListener){global.addEventListener("beforeunload",function(){if(self.script)self.script.onerror=empty},false)}}inherit(JSONPPolling,Polling);JSONPPolling.prototype.supportsBinary=false;JSONPPolling.prototype.doClose=function(){if(this.script){this.script.parentNode.removeChild(this.script);this.script=null}if(this.form){this.form.parentNode.removeChild(this.form);this.form=null;this.iframe=null}Polling.prototype.doClose.call(this)};JSONPPolling.prototype.doPoll=function(){var self=this;var script=document.createElement("script");if(this.script){this.script.parentNode.removeChild(this.script);this.script=null}script.async=true;script.src=this.uri();script.onerror=function(e){self.onError("jsonp poll error",e)};var insertAt=document.getElementsByTagName("script")[0];insertAt.parentNode.insertBefore(script,insertAt);this.script=script;var isUAgecko="undefined"!=typeof navigator&&/gecko/i.test(navigator.userAgent);if(isUAgecko){setTimeout(function(){var iframe=document.createElement("iframe");document.body.appendChild(iframe);document.body.removeChild(iframe)},100)}};JSONPPolling.prototype.doWrite=function(data,fn){var self=this;if(!this.form){var form=document.createElement("form");var area=document.createElement("textarea");var id=this.iframeId="eio_iframe_"+this.index;var iframe;form.className="socketio";form.style.position="absolute";form.style.top="-1000px";form.style.left="-1000px";form.target=id;form.method="POST";form.setAttribute("accept-charset","utf-8");area.name="d";form.appendChild(area);document.body.appendChild(form);this.form=form;this.area=area}this.form.action=this.uri();function complete(){initIframe();fn()}function initIframe(){if(self.iframe){try{self.form.removeChild(self.iframe)}catch(e){self.onError("jsonp polling iframe removal error",e)}}try{var html='<iframe src="javascript:0" name="'+self.iframeId+'">';iframe=document.createElement(html)}catch(e){iframe=document.createElement("iframe");iframe.name=self.iframeId;iframe.src="javascript:0"}iframe.id=self.iframeId;self.form.appendChild(iframe);self.iframe=iframe}initIframe();data=data.replace(rEscapedNewline,"\\\n");this.area.value=data.replace(rNewline,"\\n");try{this.form.submit()}catch(e){}if(this.iframe.attachEvent){this.iframe.onreadystatechange=function(){if(self.iframe.readyState=="complete"){complete()}}}else{this.iframe.onload=complete}}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./polling":18,"component-inherit":21}],17:[function(_dereq_,module,exports){(function(global){var XMLHttpRequest=_dereq_("xmlhttprequest");var Polling=_dereq_("./polling");var Emitter=_dereq_("component-emitter");var inherit=_dereq_("component-inherit");var debug=_dereq_("debug")("engine.io-client:polling-xhr");module.exports=XHR;module.exports.Request=Request;function empty(){}function XHR(opts){Polling.call(this,opts);if(global.location){var isSSL="https:"==location.protocol;var port=location.port;if(!port){port=isSSL?443:80}this.xd=opts.hostname!=global.location.hostname||port!=opts.port;this.xs=opts.secure!=isSSL}}inherit(XHR,Polling);XHR.prototype.supportsBinary=true;XHR.prototype.request=function(opts){opts=opts||{};opts.uri=this.uri();opts.xd=this.xd;opts.xs=this.xs;opts.agent=this.agent||false;opts.supportsBinary=this.supportsBinary;opts.enablesXDR=this.enablesXDR;opts.pfx=this.pfx;opts.key=this.key;opts.passphrase=this.passphrase;opts.cert=this.cert;opts.ca=this.ca;opts.ciphers=this.ciphers;opts.rejectUnauthorized=this.rejectUnauthorized;return new Request(opts)};XHR.prototype.doWrite=function(data,fn){var isBinary=typeof data!=="string"&&data!==undefined;var req=this.request({method:"POST",data:data,isBinary:isBinary});var self=this;req.on("success",fn);req.on("error",function(err){self.onError("xhr post error",err)});this.sendXhr=req};XHR.prototype.doPoll=function(){debug("xhr poll");var req=this.request();var self=this;req.on("data",function(data){self.onData(data)});req.on("error",function(err){self.onError("xhr poll error",err)});this.pollXhr=req};function Request(opts){this.method=opts.method||"GET";this.uri=opts.uri;this.xd=!!opts.xd;this.xs=!!opts.xs;this.async=false!==opts.async;this.data=undefined!=opts.data?opts.data:null;this.agent=opts.agent;this.isBinary=opts.isBinary;this.supportsBinary=opts.supportsBinary;this.enablesXDR=opts.enablesXDR;this.pfx=opts.pfx;this.key=opts.key;this.passphrase=opts.passphrase;this.cert=opts.cert;this.ca=opts.ca;this.ciphers=opts.ciphers;this.rejectUnauthorized=opts.rejectUnauthorized;this.create()}Emitter(Request.prototype);Request.prototype.create=function(){var opts={agent:this.agent,xdomain:this.xd,xscheme:this.xs,enablesXDR:this.enablesXDR};opts.pfx=this.pfx;opts.key=this.key;opts.passphrase=this.passphrase;opts.cert=this.cert;opts.ca=this.ca;opts.ciphers=this.ciphers;opts.rejectUnauthorized=this.rejectUnauthorized;var xhr=this.xhr=new XMLHttpRequest(opts);var self=this;try{debug("xhr open %s: %s",this.method,this.uri);xhr.open(this.method,this.uri,this.async);if(this.supportsBinary){xhr.responseType="arraybuffer"}if("POST"==this.method){try{if(this.isBinary){xhr.setRequestHeader("Content-type","application/octet-stream")}else{xhr.setRequestHeader("Content-type","text/plain;charset=UTF-8")}}catch(e){}}if("withCredentials"in xhr){xhr.withCredentials=true}if(this.hasXDR()){xhr.onload=function(){self.onLoad()};xhr.onerror=function(){self.onError(xhr.responseText)}}else{xhr.onreadystatechange=function(){if(4!=xhr.readyState)return;if(200==xhr.status||1223==xhr.status){self.onLoad()}else{setTimeout(function(){self.onError(xhr.status)},0)}}}debug("xhr data %s",this.data);xhr.send(this.data)}catch(e){setTimeout(function(){self.onError(e)},0);return}if(global.document){this.index=Request.requestsCount++;Request.requests[this.index]=this}};Request.prototype.onSuccess=function(){this.emit("success");this.cleanup()};Request.prototype.onData=function(data){this.emit("data",data);this.onSuccess()};Request.prototype.onError=function(err){this.emit("error",err);this.cleanup(true)};Request.prototype.cleanup=function(fromError){if("undefined"==typeof this.xhr||null===this.xhr){return}if(this.hasXDR()){this.xhr.onload=this.xhr.onerror=empty}else{this.xhr.onreadystatechange=empty}if(fromError){try{this.xhr.abort()}catch(e){}}if(global.document){delete Request.requests[this.index]}this.xhr=null};Request.prototype.onLoad=function(){var data;try{var contentType;try{contentType=this.xhr.getResponseHeader("Content-Type").split(";")[0]}catch(e){}if(contentType==="application/octet-stream"){data=this.xhr.response}else{if(!this.supportsBinary){data=this.xhr.responseText}else{data="ok"}}}catch(e){this.onError(e)}if(null!=data){this.onData(data)}};Request.prototype.hasXDR=function(){return"undefined"!==typeof global.XDomainRequest&&!this.xs&&this.enablesXDR};Request.prototype.abort=function(){this.cleanup()};if(global.document){Request.requestsCount=0;Request.requests={};if(global.attachEvent){global.attachEvent("onunload",unloadHandler)}else if(global.addEventListener){global.addEventListener("beforeunload",unloadHandler,false)}}function unloadHandler(){for(var i in Request.requests){if(Request.requests.hasOwnProperty(i)){Request.requests[i].abort()}}}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./polling":18,"component-emitter":9,"component-inherit":21,debug:22,xmlhttprequest:20}],18:[function(_dereq_,module,exports){var Transport=_dereq_("../transport");var parseqs=_dereq_("parseqs");var parser=_dereq_("engine.io-parser");var inherit=_dereq_("component-inherit");var debug=_dereq_("debug")("engine.io-client:polling");module.exports=Polling;var hasXHR2=function(){var XMLHttpRequest=_dereq_("xmlhttprequest");var xhr=new XMLHttpRequest({xdomain:false});return null!=xhr.responseType}();function Polling(opts){var forceBase64=opts&&opts.forceBase64;if(!hasXHR2||forceBase64){this.supportsBinary=false}Transport.call(this,opts)}inherit(Polling,Transport);Polling.prototype.name="polling";Polling.prototype.doOpen=function(){this.poll()};Polling.prototype.pause=function(onPause){var pending=0;var self=this;this.readyState="pausing";function pause(){debug("paused");self.readyState="paused";onPause()}if(this.polling||!this.writable){var total=0;if(this.polling){debug("we are currently polling - waiting to pause");total++;this.once("pollComplete",function(){debug("pre-pause polling complete");--total||pause()})}if(!this.writable){debug("we are currently writing - waiting to pause");total++;this.once("drain",function(){debug("pre-pause writing complete");--total||pause()})}}else{pause()}};Polling.prototype.poll=function(){debug("polling");this.polling=true;this.doPoll();this.emit("poll")};Polling.prototype.onData=function(data){var self=this;debug("polling got data %s",data);var callback=function(packet,index,total){if("opening"==self.readyState){self.onOpen()}if("close"==packet.type){self.onClose();return false}self.onPacket(packet)};parser.decodePayload(data,this.socket.binaryType,callback);if("closed"!=this.readyState){this.polling=false;this.emit("pollComplete");if("open"==this.readyState){this.poll()}else{debug('ignoring poll - transport state "%s"',this.readyState)}}};Polling.prototype.doClose=function(){var self=this;function close(){debug("writing close packet");self.write([{type:"close"}])}if("open"==this.readyState){debug("transport open - closing");close()}else{debug("transport not open - deferring close");this.once("open",close)}};Polling.prototype.write=function(packets){var self=this;this.writable=false;var callbackfn=function(){self.writable=true;self.emit("drain")};var self=this;parser.encodePayload(packets,this.supportsBinary,function(data){self.doWrite(data,callbackfn)})};Polling.prototype.uri=function(){var query=this.query||{};var schema=this.secure?"https":"http";var port="";if(false!==this.timestampRequests){query[this.timestampParam]=+new Date+"-"+Transport.timestamps++}if(!this.supportsBinary&&!query.sid){query.b64=1}query=parseqs.encode(query);if(this.port&&("https"==schema&&this.port!=443||"http"==schema&&this.port!=80)){port=":"+this.port}if(query.length){query="?"+query}return schema+"://"+this.hostname+port+this.path+query}},{"../transport":14,"component-inherit":21,debug:22,"engine.io-parser":25,parseqs:35,xmlhttprequest:20}],19:[function(_dereq_,module,exports){var Transport=_dereq_("../transport");var parser=_dereq_("engine.io-parser");var parseqs=_dereq_("parseqs");var inherit=_dereq_("component-inherit");var debug=_dereq_("debug")("engine.io-client:websocket");var WebSocket=_dereq_("ws");module.exports=WS;function WS(opts){var forceBase64=opts&&opts.forceBase64;if(forceBase64){this.supportsBinary=false}Transport.call(this,opts)}inherit(WS,Transport);WS.prototype.name="websocket";WS.prototype.supportsBinary=true;WS.prototype.doOpen=function(){if(!this.check()){return}var self=this;var uri=this.uri();var protocols=void 0;var opts={agent:this.agent};opts.pfx=this.pfx;opts.key=this.key;opts.passphrase=this.passphrase;opts.cert=this.cert;opts.ca=this.ca;opts.ciphers=this.ciphers;opts.rejectUnauthorized=this.rejectUnauthorized;this.ws=new WebSocket(uri,protocols,opts);if(this.ws.binaryType===undefined){this.supportsBinary=false}this.ws.binaryType="arraybuffer";this.addEventListeners()};WS.prototype.addEventListeners=function(){var self=this;this.ws.onopen=function(){self.onOpen()};this.ws.onclose=function(){self.onClose()};this.ws.onmessage=function(ev){self.onData(ev.data)};this.ws.onerror=function(e){self.onError("websocket error",e)}};if("undefined"!=typeof navigator&&/iPad|iPhone|iPod/i.test(navigator.userAgent)){WS.prototype.onData=function(data){var self=this;setTimeout(function(){Transport.prototype.onData.call(self,data)},0)}}WS.prototype.write=function(packets){var self=this;this.writable=false;for(var i=0,l=packets.length;i<l;i++){parser.encodePacket(packets[i],this.supportsBinary,function(data){try{self.ws.send(data)}catch(e){debug("websocket closed before onclose event")}})}function ondrain(){self.writable=true;self.emit("drain")}setTimeout(ondrain,0)};WS.prototype.onClose=function(){Transport.prototype.onClose.call(this)};WS.prototype.doClose=function(){if(typeof this.ws!=="undefined"){this.ws.close()}};WS.prototype.uri=function(){var query=this.query||{};var schema=this.secure?"wss":"ws";var port="";if(this.port&&("wss"==schema&&this.port!=443||"ws"==schema&&this.port!=80)){port=":"+this.port}if(this.timestampRequests){query[this.timestampParam]=+new Date}if(!this.supportsBinary){query.b64=1}query=parseqs.encode(query);if(query.length){query="?"+query}return schema+"://"+this.hostname+port+this.path+query};WS.prototype.check=function(){return!!WebSocket&&!("__initialize"in WebSocket&&this.name===WS.prototype.name)}},{"../transport":14,"component-inherit":21,debug:22,"engine.io-parser":25,parseqs:35,ws:37}],20:[function(_dereq_,module,exports){var hasCORS=_dereq_("has-cors");module.exports=function(opts){var xdomain=opts.xdomain;var xscheme=opts.xscheme;var enablesXDR=opts.enablesXDR;try{if("undefined"!=typeof XMLHttpRequest&&(!xdomain||hasCORS)){return new XMLHttpRequest}}catch(e){}try{if("undefined"!=typeof XDomainRequest&&!xscheme&&enablesXDR){return new XDomainRequest}}catch(e){}if(!xdomain){try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}}}},{"has-cors":40}],21:[function(_dereq_,module,exports){module.exports=function(a,b){var fn=function(){};fn.prototype=b.prototype;a.prototype=new fn;a.prototype.constructor=a}},{}],22:[function(_dereq_,module,exports){exports=module.exports=_dereq_("./debug");exports.log=log;exports.formatArgs=formatArgs;exports.save=save;exports.load=load;exports.useColors=useColors;exports.colors=["lightseagreen","forestgreen","goldenrod","dodgerblue","darkorchid","crimson"];function useColors(){return"WebkitAppearance"in document.documentElement.style||window.console&&(console.firebug||console.exception&&console.table)||navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31}exports.formatters.j=function(v){return JSON.stringify(v)};function formatArgs(){var args=arguments;var useColors=this.useColors;args[0]=(useColors?"%c":"")+this.namespace+(useColors?" %c":" ")+args[0]+(useColors?"%c ":" ")+"+"+exports.humanize(this.diff);if(!useColors)return args;var c="color: "+this.color;args=[args[0],c,"color: inherit"].concat(Array.prototype.slice.call(args,1));var index=0;var lastC=0;args[0].replace(/%[a-z%]/g,function(match){if("%"===match)return;index++;if("%c"===match){lastC=index}});args.splice(lastC,0,c);return args}function log(){return"object"==typeof console&&"function"==typeof console.log&&Function.prototype.apply.call(console.log,console,arguments)}function save(namespaces){try{if(null==namespaces){localStorage.removeItem("debug")}else{localStorage.debug=namespaces}}catch(e){}}function load(){var r;try{r=localStorage.debug}catch(e){}return r}exports.enable(load())},{"./debug":23}],23:[function(_dereq_,module,exports){exports=module.exports=debug;exports.coerce=coerce;exports.disable=disable;exports.enable=enable;exports.enabled=enabled;exports.humanize=_dereq_("ms");exports.names=[];exports.skips=[];exports.formatters={};var prevColor=0;var prevTime;function selectColor(){return exports.colors[prevColor++%exports.colors.length]}function debug(namespace){function disabled(){}disabled.enabled=false;function enabled(){var self=enabled;var curr=+new Date;var ms=curr-(prevTime||curr);self.diff=ms;self.prev=prevTime;self.curr=curr;prevTime=curr;if(null==self.useColors)self.useColors=exports.useColors();if(null==self.color&&self.useColors)self.color=selectColor();var args=Array.prototype.slice.call(arguments);args[0]=exports.coerce(args[0]);if("string"!==typeof args[0]){args=["%o"].concat(args)}var index=0;args[0]=args[0].replace(/%([a-z%])/g,function(match,format){if(match==="%")return match;index++;var formatter=exports.formatters[format];if("function"===typeof formatter){var val=args[index];match=formatter.call(self,val);args.splice(index,1);index--}return match});if("function"===typeof exports.formatArgs){args=exports.formatArgs.apply(self,args)}var logFn=enabled.log||exports.log||console.log.bind(console);logFn.apply(self,args)}enabled.enabled=true;var fn=exports.enabled(namespace)?enabled:disabled;fn.namespace=namespace;return fn}function enable(namespaces){exports.save(namespaces);var split=(namespaces||"").split(/[\s,]+/);var len=split.length;for(var i=0;i<len;i++){if(!split[i])continue;namespaces=split[i].replace(/\*/g,".*?");if(namespaces[0]==="-"){exports.skips.push(new RegExp("^"+namespaces.substr(1)+"$"))}else{exports.names.push(new RegExp("^"+namespaces+"$"))}}}function disable(){exports.enable("")}function enabled(name){var i,len;for(i=0,len=exports.skips.length;i<len;i++){if(exports.skips[i].test(name)){return false}}for(i=0,len=exports.names.length;i<len;i++){if(exports.names[i].test(name)){return true}}return false}function coerce(val){if(val instanceof Error)return val.stack||val.message;return val}},{ms:24}],24:[function(_dereq_,module,exports){var s=1e3;var m=s*60;var h=m*60;var d=h*24;var y=d*365.25;module.exports=function(val,options){options=options||{};if("string"==typeof val)return parse(val);return options.long?long(val):short(val)};function parse(str){var match=/^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);if(!match)return;var n=parseFloat(match[1]);var type=(match[2]||"ms").toLowerCase();switch(type){case"years":case"year":case"y":return n*y;case"days":case"day":case"d":return n*d;case"hours":case"hour":case"h":return n*h;case"minutes":case"minute":case"m":return n*m;case"seconds":case"second":case"s":return n*s;case"ms":return n}}function short(ms){if(ms>=d)return Math.round(ms/d)+"d";if(ms>=h)return Math.round(ms/h)+"h";if(ms>=m)return Math.round(ms/m)+"m";if(ms>=s)return Math.round(ms/s)+"s";return ms+"ms"}function long(ms){return plural(ms,d,"day")||plural(ms,h,"hour")||plural(ms,m,"minute")||plural(ms,s,"second")||ms+" ms"}function plural(ms,n,name){if(ms<n)return;if(ms<n*1.5)return Math.floor(ms/n)+" "+name;return Math.ceil(ms/n)+" "+name+"s"}},{}],25:[function(_dereq_,module,exports){(function(global){var keys=_dereq_("./keys");var hasBinary=_dereq_("has-binary");var sliceBuffer=_dereq_("arraybuffer.slice");var base64encoder=_dereq_("base64-arraybuffer");var after=_dereq_("after");var utf8=_dereq_("utf8");var isAndroid=navigator.userAgent.match(/Android/i);var isPhantomJS=/PhantomJS/i.test(navigator.userAgent);var dontSendBlobs=isAndroid||isPhantomJS;exports.protocol=3;var packets=exports.packets={open:0,close:1,ping:2,pong:3,message:4,upgrade:5,noop:6};var packetslist=keys(packets);var err={type:"error",data:"parser error"};var Blob=_dereq_("blob");exports.encodePacket=function(packet,supportsBinary,utf8encode,callback){if("function"==typeof supportsBinary){callback=supportsBinary;supportsBinary=false}if("function"==typeof utf8encode){callback=utf8encode;utf8encode=null}var data=packet.data===undefined?undefined:packet.data.buffer||packet.data;if(global.ArrayBuffer&&data instanceof ArrayBuffer){return encodeArrayBuffer(packet,supportsBinary,callback)}else if(Blob&&data instanceof global.Blob){return encodeBlob(packet,supportsBinary,callback)}if(data&&data.base64){return encodeBase64Object(packet,callback)}var encoded=packets[packet.type];if(undefined!==packet.data){encoded+=utf8encode?utf8.encode(String(packet.data)):String(packet.data)}return callback(""+encoded)};function encodeBase64Object(packet,callback){var message="b"+exports.packets[packet.type]+packet.data.data;return callback(message)}function encodeArrayBuffer(packet,supportsBinary,callback){if(!supportsBinary){return exports.encodeBase64Packet(packet,callback)}var data=packet.data;var contentArray=new Uint8Array(data);var resultBuffer=new Uint8Array(1+data.byteLength);resultBuffer[0]=packets[packet.type];for(var i=0;i<contentArray.length;i++){resultBuffer[i+1]=contentArray[i]}return callback(resultBuffer.buffer)}function encodeBlobAsArrayBuffer(packet,supportsBinary,callback){if(!supportsBinary){return exports.encodeBase64Packet(packet,callback)}var fr=new FileReader;fr.onload=function(){packet.data=fr.result;exports.encodePacket(packet,supportsBinary,true,callback)};return fr.readAsArrayBuffer(packet.data)}function encodeBlob(packet,supportsBinary,callback){if(!supportsBinary){return exports.encodeBase64Packet(packet,callback)}if(dontSendBlobs){return encodeBlobAsArrayBuffer(packet,supportsBinary,callback)}var length=new Uint8Array(1);length[0]=packets[packet.type];var blob=new Blob([length.buffer,packet.data]);return callback(blob)}exports.encodeBase64Packet=function(packet,callback){var message="b"+exports.packets[packet.type];if(Blob&&packet.data instanceof Blob){var fr=new FileReader;fr.onload=function(){var b64=fr.result.split(",")[1];callback(message+b64)};return fr.readAsDataURL(packet.data)}var b64data;try{b64data=String.fromCharCode.apply(null,new Uint8Array(packet.data))}catch(e){var typed=new Uint8Array(packet.data);var basic=new Array(typed.length);for(var i=0;i<typed.length;i++){basic[i]=typed[i]}b64data=String.fromCharCode.apply(null,basic)}message+=global.btoa(b64data);return callback(message)};exports.decodePacket=function(data,binaryType,utf8decode){if(typeof data=="string"||data===undefined){if(data.charAt(0)=="b"){return exports.decodeBase64Packet(data.substr(1),binaryType)}if(utf8decode){try{data=utf8.decode(data)}catch(e){return err}}var type=data.charAt(0);if(Number(type)!=type||!packetslist[type]){return err}if(data.length>1){return{type:packetslist[type],data:data.substring(1)}}else{return{type:packetslist[type]}}}var asArray=new Uint8Array(data);var type=asArray[0];var rest=sliceBuffer(data,1);if(Blob&&binaryType==="blob"){rest=new Blob([rest])}return{type:packetslist[type],data:rest}};exports.decodeBase64Packet=function(msg,binaryType){var type=packetslist[msg.charAt(0)];if(!global.ArrayBuffer){return{type:type,data:{base64:true,data:msg.substr(1)}}}var data=base64encoder.decode(msg.substr(1));if(binaryType==="blob"&&Blob){data=new Blob([data])}return{type:type,data:data}};exports.encodePayload=function(packets,supportsBinary,callback){if(typeof supportsBinary=="function"){callback=supportsBinary;supportsBinary=null}var isBinary=hasBinary(packets);if(supportsBinary&&isBinary){if(Blob&&!dontSendBlobs){return exports.encodePayloadAsBlob(packets,callback)}return exports.encodePayloadAsArrayBuffer(packets,callback)}if(!packets.length){return callback("0:")}function setLengthHeader(message){return message.length+":"+message}function encodeOne(packet,doneCallback){exports.encodePacket(packet,!isBinary?false:supportsBinary,true,function(message){doneCallback(null,setLengthHeader(message))})}map(packets,encodeOne,function(err,results){return callback(results.join(""))})};function map(ary,each,done){var result=new Array(ary.length);var next=after(ary.length,done);var eachWithIndex=function(i,el,cb){each(el,function(error,msg){result[i]=msg;cb(error,result)})};for(var i=0;i<ary.length;i++){eachWithIndex(i,ary[i],next)}}exports.decodePayload=function(data,binaryType,callback){if(typeof data!="string"){return exports.decodePayloadAsBinary(data,binaryType,callback)}if(typeof binaryType==="function"){callback=binaryType;binaryType=null}var packet;if(data==""){return callback(err,0,1)}var length="",n,msg;for(var i=0,l=data.length;i<l;i++){var chr=data.charAt(i);if(":"!=chr){length+=chr}else{if(""==length||length!=(n=Number(length))){return callback(err,0,1)}msg=data.substr(i+1,n);if(length!=msg.length){return callback(err,0,1)}if(msg.length){packet=exports.decodePacket(msg,binaryType,true);if(err.type==packet.type&&err.data==packet.data){return callback(err,0,1)}var ret=callback(packet,i+n,l);if(false===ret)return}i+=n;length=""}}if(length!=""){return callback(err,0,1)}};exports.encodePayloadAsArrayBuffer=function(packets,callback){if(!packets.length){return callback(new ArrayBuffer(0))}function encodeOne(packet,doneCallback){exports.encodePacket(packet,true,true,function(data){return doneCallback(null,data)})}map(packets,encodeOne,function(err,encodedPackets){var totalLength=encodedPackets.reduce(function(acc,p){var len;if(typeof p==="string"){len=p.length}else{len=p.byteLength}return acc+len.toString().length+len+2},0);var resultArray=new Uint8Array(totalLength);var bufferIndex=0;encodedPackets.forEach(function(p){var isString=typeof p==="string";var ab=p;if(isString){var view=new Uint8Array(p.length);for(var i=0;i<p.length;i++){view[i]=p.charCodeAt(i)}ab=view.buffer}if(isString){resultArray[bufferIndex++]=0}else{resultArray[bufferIndex++]=1}var lenStr=ab.byteLength.toString();for(var i=0;i<lenStr.length;i++){resultArray[bufferIndex++]=parseInt(lenStr[i])}resultArray[bufferIndex++]=255;var view=new Uint8Array(ab);for(var i=0;i<view.length;i++){resultArray[bufferIndex++]=view[i]}});return callback(resultArray.buffer)})};exports.encodePayloadAsBlob=function(packets,callback){function encodeOne(packet,doneCallback){exports.encodePacket(packet,true,true,function(encoded){var binaryIdentifier=new Uint8Array(1);binaryIdentifier[0]=1;if(typeof encoded==="string"){var view=new Uint8Array(encoded.length);for(var i=0;i<encoded.length;i++){view[i]=encoded.charCodeAt(i)}encoded=view.buffer;binaryIdentifier[0]=0}var len=encoded instanceof ArrayBuffer?encoded.byteLength:encoded.size;var lenStr=len.toString();var lengthAry=new Uint8Array(lenStr.length+1);for(var i=0;i<lenStr.length;i++){lengthAry[i]=parseInt(lenStr[i])}lengthAry[lenStr.length]=255;if(Blob){var blob=new Blob([binaryIdentifier.buffer,lengthAry.buffer,encoded]);doneCallback(null,blob)}})}map(packets,encodeOne,function(err,results){return callback(new Blob(results))})};exports.decodePayloadAsBinary=function(data,binaryType,callback){if(typeof binaryType==="function"){callback=binaryType;binaryType=null}var bufferTail=data;var buffers=[];var numberTooLong=false;while(bufferTail.byteLength>0){var tailArray=new Uint8Array(bufferTail);var isString=tailArray[0]===0;var msgLength="";for(var i=1;;i++){if(tailArray[i]==255)break;if(msgLength.length>310){numberTooLong=true;break}msgLength+=tailArray[i]}if(numberTooLong)return callback(err,0,1);bufferTail=sliceBuffer(bufferTail,2+msgLength.length);msgLength=parseInt(msgLength);var msg=sliceBuffer(bufferTail,0,msgLength);if(isString){try{msg=String.fromCharCode.apply(null,new Uint8Array(msg))}catch(e){var typed=new Uint8Array(msg);msg="";for(var i=0;i<typed.length;i++){msg+=String.fromCharCode(typed[i])}}}buffers.push(msg);bufferTail=sliceBuffer(bufferTail,msgLength)}var total=buffers.length;buffers.forEach(function(buffer,i){callback(exports.decodePacket(buffer,binaryType,true),i,total)})}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./keys":26,after:27,"arraybuffer.slice":28,"base64-arraybuffer":29,blob:30,"has-binary":31,utf8:33}],26:[function(_dereq_,module,exports){module.exports=Object.keys||function keys(obj){var arr=[];var has=Object.prototype.hasOwnProperty;for(var i in obj){if(has.call(obj,i)){arr.push(i)}}return arr}},{}],27:[function(_dereq_,module,exports){module.exports=after;function after(count,callback,err_cb){var bail=false;err_cb=err_cb||noop;proxy.count=count;return count===0?callback():proxy;function proxy(err,result){if(proxy.count<=0){throw new Error("after called too many times")}--proxy.count;if(err){bail=true;callback(err);callback=err_cb}else if(proxy.count===0&&!bail){callback(null,result)}}}function noop(){}},{}],28:[function(_dereq_,module,exports){module.exports=function(arraybuffer,start,end){var bytes=arraybuffer.byteLength;start=start||0;end=end||bytes;if(arraybuffer.slice){return arraybuffer.slice(start,end)}if(start<0){start+=bytes}if(end<0){end+=bytes}if(end>bytes){end=bytes}if(start>=bytes||start>=end||bytes===0){return new ArrayBuffer(0)}var abv=new Uint8Array(arraybuffer);var result=new Uint8Array(end-start);for(var i=start,ii=0;i<end;i++,ii++){result[ii]=abv[i]}return result.buffer}},{}],29:[function(_dereq_,module,exports){(function(chars){"use strict";exports.encode=function(arraybuffer){var bytes=new Uint8Array(arraybuffer),i,len=bytes.length,base64="";for(i=0;i<len;i+=3){base64+=chars[bytes[i]>>2];base64+=chars[(bytes[i]&3)<<4|bytes[i+1]>>4];base64+=chars[(bytes[i+1]&15)<<2|bytes[i+2]>>6];base64+=chars[bytes[i+2]&63]}if(len%3===2){base64=base64.substring(0,base64.length-1)+"="}else if(len%3===1){base64=base64.substring(0,base64.length-2)+"=="}return base64};exports.decode=function(base64){var bufferLength=base64.length*.75,len=base64.length,i,p=0,encoded1,encoded2,encoded3,encoded4;if(base64[base64.length-1]==="="){bufferLength--;if(base64[base64.length-2]==="="){bufferLength--}}var arraybuffer=new ArrayBuffer(bufferLength),bytes=new Uint8Array(arraybuffer);for(i=0;i<len;i+=4){encoded1=chars.indexOf(base64[i]);encoded2=chars.indexOf(base64[i+1]);encoded3=chars.indexOf(base64[i+2]);encoded4=chars.indexOf(base64[i+3]);bytes[p++]=encoded1<<2|encoded2>>4;bytes[p++]=(encoded2&15)<<4|encoded3>>2;bytes[p++]=(encoded3&3)<<6|encoded4&63}return arraybuffer}})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")},{}],30:[function(_dereq_,module,exports){(function(global){var BlobBuilder=global.BlobBuilder||global.WebKitBlobBuilder||global.MSBlobBuilder||global.MozBlobBuilder;var blobSupported=function(){try{var b=new Blob(["hi"]);return b.size==2}catch(e){return false}}();var blobBuilderSupported=BlobBuilder&&BlobBuilder.prototype.append&&BlobBuilder.prototype.getBlob;function BlobBuilderConstructor(ary,options){options=options||{};var bb=new BlobBuilder;for(var i=0;i<ary.length;i++){bb.append(ary[i])}return options.type?bb.getBlob(options.type):bb.getBlob()}module.exports=function(){if(blobSupported){return global.Blob}else if(blobBuilderSupported){return BlobBuilderConstructor}else{return undefined}}()}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{}],31:[function(_dereq_,module,exports){(function(global){var isArray=_dereq_("isarray");module.exports=hasBinary;function hasBinary(data){function _hasBinary(obj){if(!obj)return false;if(global.Buffer&&global.Buffer.isBuffer(obj)||global.ArrayBuffer&&obj instanceof ArrayBuffer||global.Blob&&obj instanceof Blob||global.File&&obj instanceof File){return true}if(isArray(obj)){for(var i=0;i<obj.length;i++){if(_hasBinary(obj[i])){return true}}}else if(obj&&"object"==typeof obj){if(obj.toJSON){obj=obj.toJSON()}for(var key in obj){if(obj.hasOwnProperty(key)&&_hasBinary(obj[key])){return true}}}return false}return _hasBinary(data)}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{isarray:32}],32:[function(_dereq_,module,exports){module.exports=Array.isArray||function(arr){return Object.prototype.toString.call(arr)=="[object Array]"}},{}],33:[function(_dereq_,module,exports){(function(global){(function(root){var freeExports=typeof exports=="object"&&exports;var freeModule=typeof module=="object"&&module&&module.exports==freeExports&&module;var freeGlobal=typeof global=="object"&&global;if(freeGlobal.global===freeGlobal||freeGlobal.window===freeGlobal){root=freeGlobal}var stringFromCharCode=String.fromCharCode;function ucs2decode(string){var output=[];var counter=0;var length=string.length;var value;var extra;while(counter<length){value=string.charCodeAt(counter++);if(value>=55296&&value<=56319&&counter<length){extra=string.charCodeAt(counter++);if((extra&64512)==56320){output.push(((value&1023)<<10)+(extra&1023)+65536)}else{output.push(value);counter--}}else{output.push(value)}}return output}function ucs2encode(array){var length=array.length;var index=-1;var value;var output="";while(++index<length){value=array[index];if(value>65535){value-=65536;
output+=stringFromCharCode(value>>>10&1023|55296);value=56320|value&1023}output+=stringFromCharCode(value)}return output}function createByte(codePoint,shift){return stringFromCharCode(codePoint>>shift&63|128)}function encodeCodePoint(codePoint){if((codePoint&4294967168)==0){return stringFromCharCode(codePoint)}var symbol="";if((codePoint&4294965248)==0){symbol=stringFromCharCode(codePoint>>6&31|192)}else if((codePoint&4294901760)==0){symbol=stringFromCharCode(codePoint>>12&15|224);symbol+=createByte(codePoint,6)}else if((codePoint&4292870144)==0){symbol=stringFromCharCode(codePoint>>18&7|240);symbol+=createByte(codePoint,12);symbol+=createByte(codePoint,6)}symbol+=stringFromCharCode(codePoint&63|128);return symbol}function utf8encode(string){var codePoints=ucs2decode(string);var length=codePoints.length;var index=-1;var codePoint;var byteString="";while(++index<length){codePoint=codePoints[index];byteString+=encodeCodePoint(codePoint)}return byteString}function readContinuationByte(){if(byteIndex>=byteCount){throw Error("Invalid byte index")}var continuationByte=byteArray[byteIndex]&255;byteIndex++;if((continuationByte&192)==128){return continuationByte&63}throw Error("Invalid continuation byte")}function decodeSymbol(){var byte1;var byte2;var byte3;var byte4;var codePoint;if(byteIndex>byteCount){throw Error("Invalid byte index")}if(byteIndex==byteCount){return false}byte1=byteArray[byteIndex]&255;byteIndex++;if((byte1&128)==0){return byte1}if((byte1&224)==192){var byte2=readContinuationByte();codePoint=(byte1&31)<<6|byte2;if(codePoint>=128){return codePoint}else{throw Error("Invalid continuation byte")}}if((byte1&240)==224){byte2=readContinuationByte();byte3=readContinuationByte();codePoint=(byte1&15)<<12|byte2<<6|byte3;if(codePoint>=2048){return codePoint}else{throw Error("Invalid continuation byte")}}if((byte1&248)==240){byte2=readContinuationByte();byte3=readContinuationByte();byte4=readContinuationByte();codePoint=(byte1&15)<<18|byte2<<12|byte3<<6|byte4;if(codePoint>=65536&&codePoint<=1114111){return codePoint}}throw Error("Invalid UTF-8 detected")}var byteArray;var byteCount;var byteIndex;function utf8decode(byteString){byteArray=ucs2decode(byteString);byteCount=byteArray.length;byteIndex=0;var codePoints=[];var tmp;while((tmp=decodeSymbol())!==false){codePoints.push(tmp)}return ucs2encode(codePoints)}var utf8={version:"2.0.0",encode:utf8encode,decode:utf8decode};if(typeof define=="function"&&typeof define.amd=="object"&&define.amd){define(function(){return utf8})}else if(freeExports&&!freeExports.nodeType){if(freeModule){freeModule.exports=utf8}else{var object={};var hasOwnProperty=object.hasOwnProperty;for(var key in utf8){hasOwnProperty.call(utf8,key)&&(freeExports[key]=utf8[key])}}}else{root.utf8=utf8}})(this)}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{}],34:[function(_dereq_,module,exports){(function(global){var rvalidchars=/^[\],:{}\s]*$/;var rvalidescape=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;var rvalidtokens=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;var rvalidbraces=/(?:^|:|,)(?:\s*\[)+/g;var rtrimLeft=/^\s+/;var rtrimRight=/\s+$/;module.exports=function parsejson(data){if("string"!=typeof data||!data){return null}data=data.replace(rtrimLeft,"").replace(rtrimRight,"");if(global.JSON&&JSON.parse){return JSON.parse(data)}if(rvalidchars.test(data.replace(rvalidescape,"@").replace(rvalidtokens,"]").replace(rvalidbraces,""))){return new Function("return "+data)()}}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{}],35:[function(_dereq_,module,exports){exports.encode=function(obj){var str="";for(var i in obj){if(obj.hasOwnProperty(i)){if(str.length)str+="&";str+=encodeURIComponent(i)+"="+encodeURIComponent(obj[i])}}return str};exports.decode=function(qs){var qry={};var pairs=qs.split("&");for(var i=0,l=pairs.length;i<l;i++){var pair=pairs[i].split("=");qry[decodeURIComponent(pair[0])]=decodeURIComponent(pair[1])}return qry}},{}],36:[function(_dereq_,module,exports){var re=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;var parts=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];module.exports=function parseuri(str){var src=str,b=str.indexOf("["),e=str.indexOf("]");if(b!=-1&&e!=-1){str=str.substring(0,b)+str.substring(b,e).replace(/:/g,";")+str.substring(e,str.length)}var m=re.exec(str||""),uri={},i=14;while(i--){uri[parts[i]]=m[i]||""}if(b!=-1&&e!=-1){uri.source=src;uri.host=uri.host.substring(1,uri.host.length-1).replace(/;/g,":");uri.authority=uri.authority.replace("[","").replace("]","").replace(/;/g,":");uri.ipv6uri=true}return uri}},{}],37:[function(_dereq_,module,exports){var global=function(){return this}();var WebSocket=global.WebSocket||global.MozWebSocket;module.exports=WebSocket?ws:null;function ws(uri,protocols,opts){var instance;if(protocols){instance=new WebSocket(uri,protocols)}else{instance=new WebSocket(uri)}return instance}if(WebSocket)ws.prototype=WebSocket.prototype},{}],38:[function(_dereq_,module,exports){(function(global){var isArray=_dereq_("isarray");module.exports=hasBinary;function hasBinary(data){function _hasBinary(obj){if(!obj)return false;if(global.Buffer&&global.Buffer.isBuffer(obj)||global.ArrayBuffer&&obj instanceof ArrayBuffer||global.Blob&&obj instanceof Blob||global.File&&obj instanceof File){return true}if(isArray(obj)){for(var i=0;i<obj.length;i++){if(_hasBinary(obj[i])){return true}}}else if(obj&&"object"==typeof obj){if(obj.toJSON){obj=obj.toJSON()}for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key)&&_hasBinary(obj[key])){return true}}}return false}return _hasBinary(data)}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{isarray:39}],39:[function(_dereq_,module,exports){module.exports=_dereq_(32)},{}],40:[function(_dereq_,module,exports){var global=_dereq_("global");try{module.exports="XMLHttpRequest"in global&&"withCredentials"in new global.XMLHttpRequest}catch(err){module.exports=false}},{global:41}],41:[function(_dereq_,module,exports){module.exports=function(){return this}()},{}],42:[function(_dereq_,module,exports){var indexOf=[].indexOf;module.exports=function(arr,obj){if(indexOf)return arr.indexOf(obj);for(var i=0;i<arr.length;++i){if(arr[i]===obj)return i}return-1}},{}],43:[function(_dereq_,module,exports){var has=Object.prototype.hasOwnProperty;exports.keys=Object.keys||function(obj){var keys=[];for(var key in obj){if(has.call(obj,key)){keys.push(key)}}return keys};exports.values=function(obj){var vals=[];for(var key in obj){if(has.call(obj,key)){vals.push(obj[key])}}return vals};exports.merge=function(a,b){for(var key in b){if(has.call(b,key)){a[key]=b[key]}}return a};exports.length=function(obj){return exports.keys(obj).length};exports.isEmpty=function(obj){return 0==exports.length(obj)}},{}],44:[function(_dereq_,module,exports){var re=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;var parts=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];module.exports=function parseuri(str){var m=re.exec(str||""),uri={},i=14;while(i--){uri[parts[i]]=m[i]||""}return uri}},{}],45:[function(_dereq_,module,exports){(function(global){var isArray=_dereq_("isarray");var isBuf=_dereq_("./is-buffer");exports.deconstructPacket=function(packet){var buffers=[];var packetData=packet.data;function _deconstructPacket(data){if(!data)return data;if(isBuf(data)){var placeholder={_placeholder:true,num:buffers.length};buffers.push(data);return placeholder}else if(isArray(data)){var newData=new Array(data.length);for(var i=0;i<data.length;i++){newData[i]=_deconstructPacket(data[i])}return newData}else if("object"==typeof data&&!(data instanceof Date)){var newData={};for(var key in data){newData[key]=_deconstructPacket(data[key])}return newData}return data}var pack=packet;pack.data=_deconstructPacket(packetData);pack.attachments=buffers.length;return{packet:pack,buffers:buffers}};exports.reconstructPacket=function(packet,buffers){var curPlaceHolder=0;function _reconstructPacket(data){if(data&&data._placeholder){var buf=buffers[data.num];return buf}else if(isArray(data)){for(var i=0;i<data.length;i++){data[i]=_reconstructPacket(data[i])}return data}else if(data&&"object"==typeof data){for(var key in data){data[key]=_reconstructPacket(data[key])}return data}return data}packet.data=_reconstructPacket(packet.data);packet.attachments=undefined;return packet};exports.removeBlobs=function(data,callback){function _removeBlobs(obj,curKey,containingObject){if(!obj)return obj;if(global.Blob&&obj instanceof Blob||global.File&&obj instanceof File){pendingBlobs++;var fileReader=new FileReader;fileReader.onload=function(){if(containingObject){containingObject[curKey]=this.result}else{bloblessData=this.result}if(!--pendingBlobs){callback(bloblessData)}};fileReader.readAsArrayBuffer(obj)}else if(isArray(obj)){for(var i=0;i<obj.length;i++){_removeBlobs(obj[i],i,obj)}}else if(obj&&"object"==typeof obj&&!isBuf(obj)){for(var key in obj){_removeBlobs(obj[key],key,obj)}}}var pendingBlobs=0;var bloblessData=data;_removeBlobs(bloblessData);if(!pendingBlobs){callback(bloblessData)}}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./is-buffer":47,isarray:48}],46:[function(_dereq_,module,exports){var debug=_dereq_("debug")("socket.io-parser");var json=_dereq_("json3");var isArray=_dereq_("isarray");var Emitter=_dereq_("component-emitter");var binary=_dereq_("./binary");var isBuf=_dereq_("./is-buffer");exports.protocol=4;exports.types=["CONNECT","DISCONNECT","EVENT","BINARY_EVENT","ACK","BINARY_ACK","ERROR"];exports.CONNECT=0;exports.DISCONNECT=1;exports.EVENT=2;exports.ACK=3;exports.ERROR=4;exports.BINARY_EVENT=5;exports.BINARY_ACK=6;exports.Encoder=Encoder;exports.Decoder=Decoder;function Encoder(){}Encoder.prototype.encode=function(obj,callback){debug("encoding packet %j",obj);if(exports.BINARY_EVENT==obj.type||exports.BINARY_ACK==obj.type){encodeAsBinary(obj,callback)}else{var encoding=encodeAsString(obj);callback([encoding])}};function encodeAsString(obj){var str="";var nsp=false;str+=obj.type;if(exports.BINARY_EVENT==obj.type||exports.BINARY_ACK==obj.type){str+=obj.attachments;str+="-"}if(obj.nsp&&"/"!=obj.nsp){nsp=true;str+=obj.nsp}if(null!=obj.id){if(nsp){str+=",";nsp=false}str+=obj.id}if(null!=obj.data){if(nsp)str+=",";str+=json.stringify(obj.data)}debug("encoded %j as %s",obj,str);return str}function encodeAsBinary(obj,callback){function writeEncoding(bloblessData){var deconstruction=binary.deconstructPacket(bloblessData);var pack=encodeAsString(deconstruction.packet);var buffers=deconstruction.buffers;buffers.unshift(pack);callback(buffers)}binary.removeBlobs(obj,writeEncoding)}function Decoder(){this.reconstructor=null}Emitter(Decoder.prototype);Decoder.prototype.add=function(obj){var packet;if("string"==typeof obj){packet=decodeString(obj);if(exports.BINARY_EVENT==packet.type||exports.BINARY_ACK==packet.type){this.reconstructor=new BinaryReconstructor(packet);if(this.reconstructor.reconPack.attachments===0){this.emit("decoded",packet)}}else{this.emit("decoded",packet)}}else if(isBuf(obj)||obj.base64){if(!this.reconstructor){throw new Error("got binary data when not reconstructing a packet")}else{packet=this.reconstructor.takeBinaryData(obj);if(packet){this.reconstructor=null;this.emit("decoded",packet)}}}else{throw new Error("Unknown type: "+obj)}};function decodeString(str){var p={};var i=0;p.type=Number(str.charAt(0));if(null==exports.types[p.type])return error();if(exports.BINARY_EVENT==p.type||exports.BINARY_ACK==p.type){var buf="";while(str.charAt(++i)!="-"){buf+=str.charAt(i);if(i==str.length)break}if(buf!=Number(buf)||str.charAt(i)!="-"){throw new Error("Illegal attachments")}p.attachments=Number(buf)}if("/"==str.charAt(i+1)){p.nsp="";while(++i){var c=str.charAt(i);if(","==c)break;p.nsp+=c;if(i==str.length)break}}else{p.nsp="/"}var next=str.charAt(i+1);if(""!==next&&Number(next)==next){p.id="";while(++i){var c=str.charAt(i);if(null==c||Number(c)!=c){--i;break}p.id+=str.charAt(i);if(i==str.length)break}p.id=Number(p.id)}if(str.charAt(++i)){try{p.data=json.parse(str.substr(i))}catch(e){return error()}}debug("decoded %s as %j",str,p);return p}Decoder.prototype.destroy=function(){if(this.reconstructor){this.reconstructor.finishedReconstruction()}};function BinaryReconstructor(packet){this.reconPack=packet;this.buffers=[]}BinaryReconstructor.prototype.takeBinaryData=function(binData){this.buffers.push(binData);if(this.buffers.length==this.reconPack.attachments){var packet=binary.reconstructPacket(this.reconPack,this.buffers);this.finishedReconstruction();return packet}return null};BinaryReconstructor.prototype.finishedReconstruction=function(){this.reconPack=null;this.buffers=[]};function error(data){return{type:exports.ERROR,data:"parser error"}}},{"./binary":45,"./is-buffer":47,"component-emitter":9,debug:10,isarray:48,json3:49}],47:[function(_dereq_,module,exports){(function(global){module.exports=isBuf;function isBuf(obj){return global.Buffer&&global.Buffer.isBuffer(obj)||global.ArrayBuffer&&obj instanceof ArrayBuffer}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{}],48:[function(_dereq_,module,exports){module.exports=_dereq_(32)},{}],49:[function(_dereq_,module,exports){(function(window){var getClass={}.toString,isProperty,forEach,undef;var isLoader=typeof define==="function"&&define.amd;var nativeJSON=typeof JSON=="object"&&JSON;var JSON3=typeof exports=="object"&&exports&&!exports.nodeType&&exports;if(JSON3&&nativeJSON){JSON3.stringify=nativeJSON.stringify;JSON3.parse=nativeJSON.parse}else{JSON3=window.JSON=nativeJSON||{}}var isExtended=new Date(-0xc782b5b800cec);try{isExtended=isExtended.getUTCFullYear()==-109252&&isExtended.getUTCMonth()===0&&isExtended.getUTCDate()===1&&isExtended.getUTCHours()==10&&isExtended.getUTCMinutes()==37&&isExtended.getUTCSeconds()==6&&isExtended.getUTCMilliseconds()==708}catch(exception){}function has(name){if(has[name]!==undef){return has[name]}var isSupported;if(name=="bug-string-char-index"){isSupported="a"[0]!="a"}else if(name=="json"){isSupported=has("json-stringify")&&has("json-parse")}else{var value,serialized='{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';if(name=="json-stringify"){var stringify=JSON3.stringify,stringifySupported=typeof stringify=="function"&&isExtended;if(stringifySupported){(value=function(){return 1}).toJSON=value;try{stringifySupported=stringify(0)==="0"&&stringify(new Number)==="0"&&stringify(new String)=='""'&&stringify(getClass)===undef&&stringify(undef)===undef&&stringify()===undef&&stringify(value)==="1"&&stringify([value])=="[1]"&&stringify([undef])=="[null]"&&stringify(null)=="null"&&stringify([undef,getClass,null])=="[null,null,null]"&&stringify({a:[value,true,false,null,"\x00\b\n\f\r	"]})==serialized&&stringify(null,value)==="1"&&stringify([1,2],null,1)=="[\n 1,\n 2\n]"&&stringify(new Date(-864e13))=='"-271821-04-20T00:00:00.000Z"'&&stringify(new Date(864e13))=='"+275760-09-13T00:00:00.000Z"'&&stringify(new Date(-621987552e5))=='"-000001-01-01T00:00:00.000Z"'&&stringify(new Date(-1))=='"1969-12-31T23:59:59.999Z"'}catch(exception){stringifySupported=false}}isSupported=stringifySupported}if(name=="json-parse"){var parse=JSON3.parse;if(typeof parse=="function"){try{if(parse("0")===0&&!parse(false)){value=parse(serialized);var parseSupported=value["a"].length==5&&value["a"][0]===1;if(parseSupported){try{parseSupported=!parse('"	"')}catch(exception){}if(parseSupported){try{parseSupported=parse("01")!==1}catch(exception){}}if(parseSupported){try{parseSupported=parse("1.")!==1}catch(exception){}}}}}catch(exception){parseSupported=false}}isSupported=parseSupported}}return has[name]=!!isSupported}if(!has("json")){var functionClass="[object Function]";var dateClass="[object Date]";var numberClass="[object Number]";var stringClass="[object String]";var arrayClass="[object Array]";var booleanClass="[object Boolean]";var charIndexBuggy=has("bug-string-char-index");if(!isExtended){var floor=Math.floor;var Months=[0,31,59,90,120,151,181,212,243,273,304,334];var getDay=function(year,month){return Months[month]+365*(year-1970)+floor((year-1969+(month=+(month>1)))/4)-floor((year-1901+month)/100)+floor((year-1601+month)/400)}}if(!(isProperty={}.hasOwnProperty)){isProperty=function(property){var members={},constructor;if((members.__proto__=null,members.__proto__={toString:1},members).toString!=getClass){isProperty=function(property){var original=this.__proto__,result=property in(this.__proto__=null,this);this.__proto__=original;return result}}else{constructor=members.constructor;isProperty=function(property){var parent=(this.constructor||constructor).prototype;return property in this&&!(property in parent&&this[property]===parent[property])}}members=null;return isProperty.call(this,property)}}var PrimitiveTypes={"boolean":1,number:1,string:1,undefined:1};var isHostType=function(object,property){var type=typeof object[property];return type=="object"?!!object[property]:!PrimitiveTypes[type]};forEach=function(object,callback){var size=0,Properties,members,property;(Properties=function(){this.valueOf=0}).prototype.valueOf=0;members=new Properties;for(property in members){if(isProperty.call(members,property)){size++}}Properties=members=null;if(!size){members=["valueOf","toString","toLocaleString","propertyIsEnumerable","isPrototypeOf","hasOwnProperty","constructor"];forEach=function(object,callback){var isFunction=getClass.call(object)==functionClass,property,length;var hasProperty=!isFunction&&typeof object.constructor!="function"&&isHostType(object,"hasOwnProperty")?object.hasOwnProperty:isProperty;for(property in object){if(!(isFunction&&property=="prototype")&&hasProperty.call(object,property)){callback(property)}}for(length=members.length;property=members[--length];hasProperty.call(object,property)&&callback(property));}}else if(size==2){forEach=function(object,callback){var members={},isFunction=getClass.call(object)==functionClass,property;for(property in object){if(!(isFunction&&property=="prototype")&&!isProperty.call(members,property)&&(members[property]=1)&&isProperty.call(object,property)){callback(property)}}}}else{forEach=function(object,callback){var isFunction=getClass.call(object)==functionClass,property,isConstructor;for(property in object){if(!(isFunction&&property=="prototype")&&isProperty.call(object,property)&&!(isConstructor=property==="constructor")){callback(property)}}if(isConstructor||isProperty.call(object,property="constructor")){callback(property)}}}return forEach(object,callback)};if(!has("json-stringify")){var Escapes={92:"\\\\",34:'\\"',8:"\\b",12:"\\f",10:"\\n",13:"\\r",9:"\\t"};var leadingZeroes="000000";var toPaddedString=function(width,value){return(leadingZeroes+(value||0)).slice(-width)};var unicodePrefix="\\u00";var quote=function(value){var result='"',index=0,length=value.length,isLarge=length>10&&charIndexBuggy,symbols;if(isLarge){symbols=value.split("")}for(;index<length;index++){var charCode=value.charCodeAt(index);switch(charCode){case 8:case 9:case 10:case 12:case 13:case 34:case 92:result+=Escapes[charCode];break;default:if(charCode<32){result+=unicodePrefix+toPaddedString(2,charCode.toString(16));break}result+=isLarge?symbols[index]:charIndexBuggy?value.charAt(index):value[index]}}return result+'"'};var serialize=function(property,object,callback,properties,whitespace,indentation,stack){var value,className,year,month,date,time,hours,minutes,seconds,milliseconds,results,element,index,length,prefix,result;try{value=object[property]}catch(exception){}if(typeof value=="object"&&value){className=getClass.call(value);if(className==dateClass&&!isProperty.call(value,"toJSON")){if(value>-1/0&&value<1/0){if(getDay){date=floor(value/864e5);for(year=floor(date/365.2425)+1970-1;getDay(year+1,0)<=date;year++);for(month=floor((date-getDay(year,0))/30.42);getDay(year,month+1)<=date;month++);date=1+date-getDay(year,month);time=(value%864e5+864e5)%864e5;hours=floor(time/36e5)%24;minutes=floor(time/6e4)%60;seconds=floor(time/1e3)%60;milliseconds=time%1e3}else{year=value.getUTCFullYear();month=value.getUTCMonth();date=value.getUTCDate();hours=value.getUTCHours();minutes=value.getUTCMinutes();seconds=value.getUTCSeconds();milliseconds=value.getUTCMilliseconds()}value=(year<=0||year>=1e4?(year<0?"-":"+")+toPaddedString(6,year<0?-year:year):toPaddedString(4,year))+"-"+toPaddedString(2,month+1)+"-"+toPaddedString(2,date)+"T"+toPaddedString(2,hours)+":"+toPaddedString(2,minutes)+":"+toPaddedString(2,seconds)+"."+toPaddedString(3,milliseconds)+"Z"}else{value=null}}else if(typeof value.toJSON=="function"&&(className!=numberClass&&className!=stringClass&&className!=arrayClass||isProperty.call(value,"toJSON"))){value=value.toJSON(property)}}if(callback){value=callback.call(object,property,value)}if(value===null){return"null"}className=getClass.call(value);if(className==booleanClass){return""+value}else if(className==numberClass){return value>-1/0&&value<1/0?""+value:"null"}else if(className==stringClass){return quote(""+value)}if(typeof value=="object"){for(length=stack.length;length--;){if(stack[length]===value){throw TypeError()}}stack.push(value);results=[];prefix=indentation;indentation+=whitespace;if(className==arrayClass){for(index=0,length=value.length;index<length;index++){element=serialize(index,value,callback,properties,whitespace,indentation,stack);results.push(element===undef?"null":element)}result=results.length?whitespace?"[\n"+indentation+results.join(",\n"+indentation)+"\n"+prefix+"]":"["+results.join(",")+"]":"[]"}else{forEach(properties||value,function(property){var element=serialize(property,value,callback,properties,whitespace,indentation,stack);if(element!==undef){results.push(quote(property)+":"+(whitespace?" ":"")+element)}});result=results.length?whitespace?"{\n"+indentation+results.join(",\n"+indentation)+"\n"+prefix+"}":"{"+results.join(",")+"}":"{}"}stack.pop();return result}};JSON3.stringify=function(source,filter,width){var whitespace,callback,properties,className;if(typeof filter=="function"||typeof filter=="object"&&filter){if((className=getClass.call(filter))==functionClass){callback=filter}else if(className==arrayClass){properties={};for(var index=0,length=filter.length,value;index<length;value=filter[index++],(className=getClass.call(value),className==stringClass||className==numberClass)&&(properties[value]=1));}}if(width){if((className=getClass.call(width))==numberClass){if((width-=width%1)>0){for(whitespace="",width>10&&(width=10);whitespace.length<width;whitespace+=" ");}}else if(className==stringClass){whitespace=width.length<=10?width:width.slice(0,10)}}return serialize("",(value={},value[""]=source,value),callback,properties,whitespace,"",[])}}if(!has("json-parse")){var fromCharCode=String.fromCharCode;var Unescapes={92:"\\",34:'"',47:"/",98:"\b",116:"	",110:"\n",102:"\f",114:"\r"};var Index,Source;var abort=function(){Index=Source=null;throw SyntaxError()};var lex=function(){var source=Source,length=source.length,value,begin,position,isSigned,charCode;while(Index<length){charCode=source.charCodeAt(Index);switch(charCode){case 9:case 10:case 13:case 32:Index++;break;case 123:case 125:case 91:case 93:case 58:case 44:value=charIndexBuggy?source.charAt(Index):source[Index];Index++;return value;case 34:for(value="@",Index++;Index<length;){charCode=source.charCodeAt(Index);if(charCode<32){abort()}else if(charCode==92){charCode=source.charCodeAt(++Index);switch(charCode){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:value+=Unescapes[charCode];Index++;break;case 117:begin=++Index;for(position=Index+4;Index<position;Index++){charCode=source.charCodeAt(Index);if(!(charCode>=48&&charCode<=57||charCode>=97&&charCode<=102||charCode>=65&&charCode<=70)){abort()}}value+=fromCharCode("0x"+source.slice(begin,Index));break;default:abort()}}else{if(charCode==34){break}charCode=source.charCodeAt(Index);begin=Index;while(charCode>=32&&charCode!=92&&charCode!=34){charCode=source.charCodeAt(++Index)}value+=source.slice(begin,Index)}}if(source.charCodeAt(Index)==34){Index++;return value}abort();default:begin=Index;if(charCode==45){isSigned=true;charCode=source.charCodeAt(++Index)}if(charCode>=48&&charCode<=57){if(charCode==48&&(charCode=source.charCodeAt(Index+1),charCode>=48&&charCode<=57)){abort()}isSigned=false;for(;Index<length&&(charCode=source.charCodeAt(Index),charCode>=48&&charCode<=57);Index++);if(source.charCodeAt(Index)==46){position=++Index;for(;position<length&&(charCode=source.charCodeAt(position),charCode>=48&&charCode<=57);position++);if(position==Index){abort()}Index=position}charCode=source.charCodeAt(Index);if(charCode==101||charCode==69){charCode=source.charCodeAt(++Index);if(charCode==43||charCode==45){Index++}for(position=Index;position<length&&(charCode=source.charCodeAt(position),charCode>=48&&charCode<=57);position++);if(position==Index){abort()}Index=position}return+source.slice(begin,Index)}if(isSigned){abort()}if(source.slice(Index,Index+4)=="true"){Index+=4;return true}else if(source.slice(Index,Index+5)=="false"){Index+=5;return false}else if(source.slice(Index,Index+4)=="null"){Index+=4;return null}abort()}}return"$"};var get=function(value){var results,hasMembers;if(value=="$"){abort()}if(typeof value=="string"){if((charIndexBuggy?value.charAt(0):value[0])=="@"){return value.slice(1)}if(value=="["){results=[];for(;;hasMembers||(hasMembers=true)){value=lex();if(value=="]"){break}if(hasMembers){if(value==","){value=lex();if(value=="]"){abort()}}else{abort()}}if(value==","){abort()}results.push(get(value))}return results}else if(value=="{"){results={};for(;;hasMembers||(hasMembers=true)){value=lex();if(value=="}"){break}if(hasMembers){if(value==","){value=lex();if(value=="}"){abort()}}else{abort()}}if(value==","||typeof value!="string"||(charIndexBuggy?value.charAt(0):value[0])!="@"||lex()!=":"){abort()}results[value.slice(1)]=get(lex())}return results}abort()}return value};var update=function(source,property,callback){var element=walk(source,property,callback);if(element===undef){delete source[property]}else{source[property]=element}};var walk=function(source,property,callback){var value=source[property],length;if(typeof value=="object"&&value){if(getClass.call(value)==arrayClass){for(length=value.length;length--;){update(value,length,callback)}}else{forEach(value,function(property){update(value,property,callback)})}}return callback.call(source,property,value)};JSON3.parse=function(source,callback){var result,value;Index=0;Source=""+source;result=get(lex());if(lex()!="$"){abort()}Index=Source=null;return callback&&getClass.call(callback)==functionClass?walk((value={},value[""]=result,value),"",callback):result}}}if(isLoader){define(function(){return JSON3})}})(this)},{}],50:[function(_dereq_,module,exports){module.exports=toArray;function toArray(list,index){var array=[];index=index||0;for(var i=index||0;i<list.length;i++){array[i-index]=list[i]}return array}},{}]},{},[1])(1)});
