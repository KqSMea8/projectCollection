import React from 'react';
import { Button, Input } from 'antd';
// 选择分数的组件
export default class CountSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInput: false,
      errTips: false,
      inputValue: props.minimum,
    };
  }
  componentDidMount() {
    // this.setState({
    //   inputValue: this.props.minimum
    // });
  }
  handlerPlus() {
    let current = parseInt(this.state.inputValue, 10);
    if (current < this.props.maximum) {
      current++;
      this.setState({
        inputValue: current,
      });
      this.props.onHandlerSelecterChange(current);
    }
  }
  handlerMinus() {
    let current = parseInt(this.state.inputValue, 10);
    if (current > 1) {
      current--;
      this.setState({
        inputValue: current,
      });
      this.props.onHandlerSelecterChange(current);
    }
  }
  inputBlurHandler() {
    // 光标从输入框中移出事件
    console.log(this.state.inputValue, this.props.maximum);
    if (this.state.inputValue > this.props.maximum) {
      this.setState(() => {
        return {
          errTips: true,
        };
      });
    } else {
      this.props.onHandlerSelecterChange(this.state.inputValue);
      this.setState({
        showInput: false,
        errTips: false,
      });
    }
  }
  inputChangeHandler(e) {
    let targetValue = parseInt(e.target.value, 10);
    if (targetValue < 1) {
      targetValue = 1;
    }
    // 实时更新inputValue的值
    this.setState(() => {
      return {
        inputValue: targetValue,
      };
    });
  }
  render() {
    return (
      <div>
        <div>
          <Button shape="circle" size="small" icon="minus" onClick={() => this.handlerMinus()} />
          {this.state.showInput ? (
            <Input
              ref="userInput"
              value={this.state.inputValue}
              className={this.state.errTips ? 'errTipsStyle' : ''}
              style={{ display: 'inline-block', width: '50px' }}
              onBlur={() => {
                this.inputBlurHandler();
              }}
              onChange={event => {
                this.inputChangeHandler(event);
              }}
            />
          ) : (
            <span
              onClick={() => {
                this.setState(
                  {
                    showInput: true,
                  },
                  () => {
                    this.refs.userInput.refs.input.focus();
                  }
                );
              }}
            >
              &nbsp;{this.state.inputValue} / {this.props.maximum}&nbsp;
            </span>
          )}
          <Button
            type="primary"
            shape="circle"
            size="small"
            icon="plus"
            onClick={() => this.handlerPlus()}
          />
        </div>
        {this.state.errTips && <div style={{ color: 'red' }}>超过最大核销份数</div>}
      </div>
    );
  }
}
