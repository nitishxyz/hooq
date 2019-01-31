import React, { Component } from 'react';
import './player.css';
let vidSrc = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

let playerCons = require('./scripts/playerCons');
let seekDrag = false;
let moving= true;

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            currentTime: "00 : 00",
            duration: "00 : 00",
            progress: 0,
            cursor: "pointer",
            fullscreen: false,
            buffering: false,
            volConWid: 0,
            volWid: 100,
            buffers: "",
            loaded: false,
            vidSrc: ""
        };
        this._isMounted = false;
    }

    componentDidMount() {
        playerCons.createPlayer(this.player, this.playerCon);
        let that = this;
        document.addEventListener("fullscreenchange", function (event) {
            if (document.fullscreenElement) {
                // fullscreen is activated
                that.setState({fullscreen: true});
            } else {
                // fullscreen is cancelled
                that.setState({fullscreen: false});
            }
            });
        document.addEventListener("keydown", (key) => playerCons.handleKeys(key), false);
        this._isMounted = true;
        const { match: { params } } = this.props;
    //   console.log(params.id);
      if(params.id === "bunny") {
          this.setState({vidSrc});
      }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    _onTimeUpdate = () => {
        let onTimeUpdate = playerCons.onTimeUpdate();
        let currentTime = onTimeUpdate.currentTime;
        let progress = onTimeUpdate.progress;
        this._isMounted && this.setState({currentTime, progress});
        this._onBuffer();
    }
    _onLoad = () => {
        let duration = playerCons.convertTime(this.player.duration * 1000);
        let volWid = this.player.volume * 100;
        this._isMounted && this.setState({duration, volWid, loaded: true});
    }

    _onPlay = () => {
        let duration = playerCons.convertTime(this.player.duration * 1000);
        this._isMounted && this.setState({playing: true, duration, buffering: false});
    }

    _seek = (prog) => {
        if(!this.state.loaded) {
            return false;
        }
        let duration = this.player.duration;

        let currentTime = (duration * prog) / 100;

        currentTime = playerCons.convertTime(currentTime * 1000);
        this._isMounted && this.setState({currentTime});
        
        playerCons.seek(prog);


    }

    _updateSeek = (x) => {
        if(!this.state.loaded) {
            return false;
        }
        let seekBar = this.seekBar;
        var position = x - seekBar.offsetLeft;
        let percentage = 100 * position / seekBar.offsetWidth;

    
        if (percentage > 100) {
            percentage = 100;
        }
        if (percentage < 0) {
            percentage = 0;
        }
        let duration = this.player.duration;

        let currentTime = (duration * percentage) / 100;

        currentTime = playerCons.convertTime(currentTime * 1000);

        this._isMounted && this.setState({progress: percentage, currentTime});
        playerCons.seek(percentage);
    }

    _onWaiting = () => {
        this._isMounted && this.setState({buffering: true});
        this._onBuffer();
    }

    _onPlaying = () => {
        this._isMounted && this.setState({buffering: false, loaded: true});
        this._onBuffer();
    }

    _onMouseDown = (x, e) => {
        if(e.button === 2) {
            return false;
        }
        seekDrag = true;
        if(seekDrag) {
            this._updateSeek(x);
        }
    }

    _onMouseMove = (x, e) => {
        if(e.button === 2) {
            return false;
        }
        if(seekDrag) {
            this._updateSeek(x);
        }
    }
    _onMouseUp = (x, e) => {
        if(e.button === 2) {
            return false;
        }
        seekDrag = false;
        if(seekDrag) {
            this._updateSeek(x);
        }
    }

    _showCursor = () => {
        this._isMounted && this.setState({cursor: "default"});
        moving = true;
        if(this.cursorTimer) {
            clearInterval(this.cursorTimer)
        }
        this._showControls();
        
            this.cursorTimer = setInterval(() => {
                this._isMounted && this.setState({cursor: "none"});

                this._isMounted && this.setState({volConWid: 0});
            if(this.state.playing) {
                moving = false;
                this._isMounted && this._hideControls();
            }
            }, 3300);
        
    }

    _showControls = () => {
        var fadeTarget = this.controlsCon;
        fadeTarget.style.opacity = 1;
    }

    _hideControls = () => {
        var fadeTarget = this.controlsCon;
        var fadeOutEffect = setInterval(function () {
            if (!fadeTarget.style.opacity) {
                fadeTarget.style.opacity = 1;
            }
            if (fadeTarget.style.opacity > 0 && !moving) {
                fadeTarget.style.opacity -= 0.1;
            } else {
                clearInterval(fadeOutEffect);
            }
        }, 50);
    }

    _showVolCon = (show) => {
        let that = this;
        if(show) {
            var volInEffect = setInterval(function () {
                if (that.state.volConWid < 100) {
                    that._isMounted && that.setState({volConWid: that.state.volConWid + 10})
                } else {
                    clearInterval(volInEffect);
                }
            }, 50);
        }
    }

    _updateVol = (x) => {
        let percentage = x.target.value;
    
        if (percentage > 100) {
            percentage = 100;
        }
        if (percentage < 0) {
            percentage = 0;
        }
        playerCons.seekVol(percentage);
        this._isMounted && this.setState({volWid: percentage})
    }

    _onVolChange = () => {
        this._isMounted && this.setState({volWid: this.player.volume * 100})
    }
    _onBuffer = () => {
        let player = this.player;
        let buffers = [];
        let bufferLength;
        if(player.buffered.length === 1) {
            bufferLength = player.buffered.length;
        } else {
            bufferLength = player.buffered.length - 1;
        }
        for(let i = 0; i < bufferLength; i++){
            let buffer = this._appendBuffer(i, player.buffered.start(i), player.buffered.end(i));
            buffers.push(buffer);
        }
        this._isMounted && this.setState({buffers});
    }

    _appendBuffer(i, start, end) {
        let player = this.player;
        let duration = player.duration;

        let startPer = (start/duration) * 100;
        if(i === 0) {
            return (<div className="bufferIn" key={i} style={{left: startPer + "%", width: ((end - start)/duration)*100 + "%"}}></div>)
        } else {
            return (<div className="bufferIn" key={i} style={{left: startPer + "%", width: ((end - start)/duration)*100 + "%"}}></div>)
        }
    }


    

    _goBack = () => {
        this.props.history.goBack();
    }

  render() {
    return (
      <div className="playerCon"
      ref={ref => {
          this.playerCon = ref;
      }}
      onMouseMove={this._showCursor}
      onDoubleClick={() => playerCons.goFullscreen()}
      style={{cursor: this.state.cursor}}
      align={"center"}
      >
		<video ref={ref => {
            this.player = ref;
        }} 
        id="player" 
        className="player"
        src={this.state.vidSrc}
        onLoad={this._onLoad}
        onPlay={this._onPlay}
        onPause={() => {this.setState({playing: false}); this._showControls()}}
        onTimeUpdate={this._onTimeUpdate}
        onWaiting={this._onWaiting}
        onCanPlay={this._onPlaying}
        onPlaying={this._onPlaying}
        onLoadedMetadata={this._onLoad}
        onVolumeChange={this._onVolChange}
        onProgress={this._onBuffer}
        ></video>
        <div className='uxCon'>
        {this.state.buffering ? (
                <div className="bufferIconCon">
            <i className="bufferIcon fas fa-spinner"></i>
            </div>
            ) : null}
        </div>
		<div className='controlsCon' ref={ref => {
            this.controlsCon = ref;
        }}>
			{/* <!-- topControle --> */}
			<div className="topCon">
            <div className="topButton">
            <button className="backButton" onClick={this._goBack}>
            <i className="topConIcon fas fa-arrow-circle-left"></i>
            </button>
            </div>
            </div>
			{/* <!-- topControls -->
			<!-- middleControls --> */}
			<div className="middleCon">
            <div className="controlCon">
                <button className="control">
                        <i className="conIcon fas fa-step-backward"></i>
                    </button>
                    <div className="playCon">
            {!this.state.buffering ? (
                <div className="playConIn">
                    {!this.state.playing ? (
                        <button className="control" style={{width: '100%'}} onClick={playerCons.play} type="button">
                        <i className="conIcon fas fa-play"></i>
                    </button>
                    ) : (
                        <button className="control" style={{width: '100%'}} onClick={playerCons.pause} type="button">
                        <i className="conIcon fas fa-pause"></i>
                    </button>
                    )}
                    </div>
            ) : null}
            </div>
            <button className="control">
                        <i className="conIcon fas fa-step-forward"></i>
                    </button>
            </div>
			</div>
			{/* <!-- middleControls -->
			<!-- bottomControls --> */}
			<div className="bottomCon">
            <div className="timeCon">
            <div className="time currentTime">{this.state.currentTime}</div>
            <div className="midTime"></div>
            <div className="time duration">{this.state.duration}</div>
            </div>
            <div className="sliderConDragger" onMouseDown={(e) => this._onMouseDown(e.pageX, e)}
                onMouseMove={(e) => this._onMouseMove(e.pageX, e)}
                onMouseUp={(e) => this._onMouseUp(e.pageX, e)}>
            <div className="sliderCon"
                ref={ref => {
                    this.seekBar = ref;
                }}
                >
                    <div 
                    className="slider">
                        <div className="bufferCon">
                        {this.state.buffers}
                        </div>
						<div id="sliderIn" style={{width: this.state.progress + "%"}} className="sliderIn"></div>
                        <div className="sliderInpCon">
                        <input ref={ref => {
                            this.volBar = ref
                            }} type="range" 
                            min="0" 
                            max="100"
                            step="0.1"
                            className="seekSlider" 
                            id="myRange"
                            onChange={(per) => this._seek(per.target.value)}
                            value={this.state.progress}
                            style={{
                                marginTop: this.state.fullscreen ? -1 : 0
                            }}
                            onKeyDown={() => {return false}}
                            onKeyUp={() => {return false}}
                            onKeyPress={() => {return false}}
                        ></input>
                        </div>
					</div>
                    {/* <div id="sliderThumb" className="sliderThumb" 
                    style={{
                        marginLeft: (this.state.progress - 0.3) + "%",
                        marginTop: this.state.fullscreen ? -1 : 0
                        }}></div> */}
				</div>
                </div>
                <div className="otherCons">
                <div className="leftCon">
                <button className="otherControl" onMouseOver={() => this._showVolCon(true)}>
                    <i className="onIcon fas fa-volume-up"></i>
                </button>

                <div className="volSliderCon" 
                ref={ref => {
                    this.volBar = ref
                }}
                >
                <div className="volCon" style={{width: this.state.volConWid}}>
                <input ref={ref => {
                    this.volBar = ref
                }} type="range" 
                min="1" 
                max="100"
                className="volSlider" 
                id="myRange"
                onChange={this._updateVol}
                value={this.state.volWid}
                onKeyDown={() => {return false}}
                onKeyUp={() => {return false}}
                onKeyPress={() => {return false}}
                ></input>
                </div>
                </div>
                </div>
                <div className="rightCon">

                <button className="otherControl" onClick={() => {}}>
                    <i className="onIcon fas fa-layer-group"></i>
                </button>
                
                <button className="otherControl" onClick={() => {}}>
                    <i className="onIcon fas fa-cog"></i>
                </button>

                {this.state.fullscreen ? (
                    <button className="otherControl" onClick={() => playerCons.goFullscreen()}>
                    <i className="onIcon fas fa-compress"></i>
                </button>
                ) : (
                    <button className="otherControl" onClick={() => playerCons.goFullscreen()}>
                        <i className="onIcon fas fa-expand"></i>
                    </button>
                )}
                    </div>
                </div>
			</div>
			{/* <!-- bottomControls --> */}
		</div>
      </div>
    );
  }
}

export default Player;
