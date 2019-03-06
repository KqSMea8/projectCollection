import React, { PropTypes } from 'react';
import { Checkbox, Button, Modal } from 'antd';

const Agree = React.createClass({
  propTypes: {
    checked: PropTypes.bool,
    onConfirm: PropTypes.func,
    disabled: PropTypes.bool,
    onReject: PropTypes.func,
    rejectTitle: PropTypes.string,
    rejectDisabled: PropTypes.bool,
    contractName: PropTypes.string,
    contractLink: PropTypes.string,
    okText: PropTypes.string.isRequired,
  },

  getDefaultProps() {
    return {
      checked: false,
      onConfirm: function noop() { },
    };
  },

  getInitialState() {
    return {
      checked: this.props.checked,
      dealVisible: false,
    };
  },

  changeHandle(e) {
    const v = e.target.checked;
    this.setState({ checked: v });
  },

  showDeal(event) {
    event.preventDefault();

    this.setState({
      dealVisible: true,
    });
  },

  closeDeal() {
    this.setState({
      dealVisible: false,
    });
  },

  render() {
    let modalTop = 100;
    if (window.top !== window) {
      modalTop = window.top.scrollY - 100;
    }
    return (
      <div>
        {
          this.props.contractName ? (
            <span>
              <Checkbox onChange={this.changeHandle}>同意</Checkbox>
              <a style={{ fontSize: 12 }} href="#" onClick={this.showDeal}>{this.props.contractName}</a><br />
            </span>
          ) : null
        }
        <Button style={{ marginTop: 10 }} onClick={this.props.onConfirm}
          disabled={(!this.state.checked || this.props.disabled) && this.props.contractName}
          size="large"
          type="primary">
          {this.props.okText}
        </Button>
        <Modal title={this.props.contractName}
          style={{ top: modalTop }}
          visible={this.state.dealVisible}
          onCancel={this.closeDeal}
          footer={[]}
          width={700}
          >
          {
            this.props.contractLink ? (
              <iframe src={this.props.contractLink} width="700" height="400" scrolling="no" style={{ border: 'none' }}></iframe>)
              : null
          }
        </Modal>
        {
          typeof this.props.onReject === 'function' ?

            <Button style={{ marginTop: 10, marginLeft: 10 }} onClick={this.props.onReject}
              size="large"
              disabled={this.props.rejectDisabled}
              type="ghost"
              >
              {this.props.rejectTitle}
            </Button>
            : null
        }
      </div>
    );
  },
});

export default Agree;
