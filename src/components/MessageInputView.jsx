import React from 'react';
import ReactDOM from 'react-dom';

var MessageInputView = React.createClass({

    propTypes: {
        faceButtonClick: React.PropTypes.func.isRequired,
        inputOnFocus: React.PropTypes.func.isRequired,
        plusButtonClick: React.PropTypes.func.isRequired,
        sendButtonClick: React.PropTypes.func.isRequired,
        switchBtnClick: React.PropTypes.func.isRequired,
    },

    getInitialState: function() {
        return {showPluginView: false, showFaceView: false, showSendBtn: false, inputText: ''};
    },

    // componentWillReceiveProps: function(nextProps) {
    //     this.setState({shouldUp: nextProps.inputViewUp});
    // },

    plusButtonClick: function() {
        var up = !this.state.showPluginView;
        this.setState({showPluginView: up, showFaceView: false});
        this.props.plusButtonClick();
    },
    faceButtonClick: function() {
        var up = !this.state.showFaceView;
        this.setState({showPluginView: false, showFaceView: up});
        this.props.faceButtonClick();
    },
    switchBtnClick: function() {
        this.setState({showPluginView: false, showFaceView: false});
        this.props.switchBtnClick();
    },

    sendBtnClick: function() {
        console.log('sendButtonClick: ' + this.state.inputText);
        this.props.sendButtonClick(this.state.inputText);

        this.setState({
            inputText: '',
            showSendBtn: false
        });
        this.refs.ipt.focus();
    },

    inputViewOnFocus: function() {
        console.log('inputViewOnFocus');
        this.setState({showPluginView: false, showFaceView: false});
        this.props.inputOnFocus();
    },

    inputChange: function(e) {
        this.setState({
            showSendBtn: e.target.value.length != 0,
            inputText: e.target.value
        });
    },

    render: function() {


        var classN = {};
        if ((this.state.showPluginView || this.state.showFaceView)) {
            classN = {
                'bottom': '280px'
            }
        }

        var sendBtn = null;
        if (this.state.showSendBtn) {
            sendBtn = (
                <div className="btn-wrap-right " id="subBtn ">
                    <button onClick={this.sendBtnClick}>发送</button>
                </div>
            );
        } else {
            sendBtn = (
                <div className="btn-wrap-right-plus" id="switchBtn">
                    <button className="icon-plus" onClick={this.plusButtonClick}></button>
                </div>
            );
        }

        return (

            <footer className="footer " id="iptBox " style={classN}>
                <div id="textWrapper " className="footer ">
                    <div className="btn-wrap-left" id="switchBtn">
                        <button className="icon-speak" onClick={this.switchBtnClick}></button>
                    </div>
                    <div className="ipt-wrap ">
                        <textarea className="autoExpand" ref="ipt" name="" id="ipt" rows="1" placeholder="有问题就向我提问吧" data-min-rows="1" focusflag="NO" onFocus={this.inputViewOnFocus} onChange={this.inputChange} value={this.state.inputText}></textarea>
                    </div>
                    <div className="btn-wrap-mid" id="switchBtn">
                        <button className="icon-face" onClick={this.faceButtonClick}></button>
                    </div>
                    {sendBtn}
                </div>
            </footer>
        );
    }
});

module.exports = MessageInputView;
