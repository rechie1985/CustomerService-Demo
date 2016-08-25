import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import iScroll from 'iscroll'
import ReactIScroll from 'react-iscroll'

import MessageInputView from '../components/MessageInputView';
import MessageSpeechView from '../components/MessageSpeechView';
import PluginBoardView from '../components/PluginBoardView';
import FaceBoardView from '../components/FaceBoardView';

import * as ActionType from '../constants/ActionType';

import { sendTextMessage, sendImageMessage} from '../actions/messageAction'


const iScrollOptions = {
    mouseWheel: true,
    scrollbars: true,
    scrollX: true
}


let CustomerServiceMainUI = React.createClass({

    getInitialState: function() {
        return {
            inputText:'',
            showPluginView: false,
            showFaceView: false,
            showSpeechView: false
        };
    },

    onFocus: function() {
        console.log('onFocus');

        this.setState({showPluginView: false, showFaceView: false});

        //https://segmentfault.com/q/1010000002914610
        var SCROLLY = 100;
        var TIMER_NAME = 200; // focus事件中200ms后进行判断
        var MAX_SCROLL = 99999; // 越大越好
        setTimeout(function() {
            if (window.scrollY < SCROLLY) {
                window.scrollTo(0, MAX_SCROLL);
            }

        }, TIMER_NAME);
    },
    inputTextChange: function(e) {
        this.setState({
            inputText: e.target.value
        });
    },
    sendButtonClick: function(text) {
        this.props.sendTextMessage(text);
    },
    plusButtonClick: function() {
        var up = !this.state.showPluginView;
        this.setState({showPluginView: up, showFaceView: false});
    },
    faceButtonClick: function() {
        var up = !this.state.showFaceView;
        this.setState({showPluginView: false, showFaceView: up});
    },
    switchBtnClick: function() {
        console.log('switchBtnClick');
        this.setState({showSpeechView: !this.state.showSpeechView, showPluginView: false, showFaceView: false});
    },
    contentViewClick: function() {
        // this.setState({showPluginView: false, showFaceView: false});
    },

    onScrollStart: function() {
        console.log('onScrollStart');
    },

    onScrollEnd: function(iScrollInstance) {
        console.log('onScrollEnd');
    },
    onScrollRefresh: function(iScrollInstance) {
        console.log('onScrollRefresh');
        iScrollInstance.scrollTo(0,iScrollInstance.maxScrollY);
        // this.refs.iScroll.withIScroll(function(iScroll) {
        //     iScroll.scrollTop(0,9999);
        // });
    },


    pluginItemClick: function(index) {
        console.log('pluginItemClick');
        var self = this;
        window.SiLinJSBridge.chooseImageWithTypeCallback(index, {
            chooseImageSuccess: function(url) {
                console.log(url);
                self.props.sendImageMessage(url);
            }
        });
    },

    componentDidUpdate: function(prevProps, prevState) {
        // if (this.state.showPluginView || this.state.showFaceView ) {
        //     console.log('componentDidUpdate');
        //     var SCROLLY = 100;
        //     var TIMER_NAME = 500;
        //     var MAX_SCROLL = 99999; // 越大越好
        //     setTimeout(function() {
        //         if (window.scrollY < SCROLLY) {
        //             window.scrollTo(0, MAX_SCROLL);
        //         }
        //     }, TIMER_NAME);
        // }

        if (this.state.showPluginView != prevState.showPluginView || this.state.showFaceView != prevState.showFaceView ) {
            this.refs.iScroll.withIScroll(function(iScroll) {
                iScroll.refresh();
                console.log('iScroll.refresh');
            });
        }
    },

    render: function() {

        var pluginView = null;
        if (this.state.showPluginView) {
            pluginView = <PluginBoardView itemClick={this.pluginItemClick}/>;
        } else {
            pluginView = <div/>
        }

        var faceView = null;
        if (this.state.showFaceView) {
            faceView = <FaceBoardView />;
        } else {
            faceView = <div/>
        }

        var contentStyle = {};
        if (this.state.showPluginView || this.state.showFaceView ) {
            contentStyle = {'bottom': '332'};
        }

        var inputView = null;
        if (this.state.showSpeechView) {
            inputView = (<MessageSpeechView switchBtnClick={this.switchBtnClick}/>);
        } else {
            inputView = (<MessageInputView inputOnFocus={this.onFocus}  sendButtonClick={this.sendButtonClick} plusButtonClick={this.plusButtonClick} faceButtonClick={this.faceButtonClick} switchBtnClick={this.switchBtnClick}/>);
        }

        var messagesView = this.props.messages.map(function(item, index) {
            if (item.type === ActionType.TEXT_MESSAGE) {
                return (
                    <li className="text-message-session" key={index}>{item.messageID} :{item.text} </li>
                );
            }
            if (item.type === ActionType.IMAGE_MESSAGE) {
                return (
                    <li className="text-message-session" key={index}>
                        <p>{item.messageID}</p>
                        <img src={item.imageSrc}></img>
                    </li>
                );
            }

            return null;

        });

        console.log('messagesView: ' + messagesView);
        return (
            <div className="out-wrap">
                <section className="main">
                    <section className="content" id="content" style={contentStyle}>
                        <ReactIScroll ref="iScroll" iScroll={iScroll} options={iScrollOptions} onRefresh={this.onScrollRefresh} onScrollStart={this.onScrollStart} onScrollEnd={this.onScrollEnd}>
                            <div>
                                <div className="history-msg J-history-msg visibility">
                                    下拉加载历史记录
                                </div>
                                <ul id="chat-wrap" className="chat-wrap">
                                    {messagesView}
                                </ul>
                            </div>

                        </ReactIScroll>

                    </section>
                    {inputView}
                </section>
                {pluginView}
                {faceView}
            </div>
        );
    }
});


CustomerServiceMainUI.contextTypes = {
    history: PropTypes.object.isRequired
}



function mapStateToProps(state) {
	return {
        messages: state.messageReducer.messages ,
		count: state.messageReducer.count
	};
}

module.exports = connect(mapStateToProps, {
	sendTextMessage,
    sendImageMessage
})(CustomerServiceMainUI);
