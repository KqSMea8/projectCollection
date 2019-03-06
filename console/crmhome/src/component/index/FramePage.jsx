import React, {PropTypes} from 'react';
import AutoFrame from './AutoFrame';
import ErrorPage from './common/ErrorPage';
import ajax from '../../common/ajax';

const FramePage = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      target: '',
      errorInfo: false,
    };
  },

  componentDidMount() {
    const {params} = this.props;
    ajax({
      url: '/activity/memberpromo.json',
      type: 'json',
      data: params,
      success: (res) => {
        const {redirectUrl, target, status} = res;
        if (status !== 'succeed') {
          // 未登录跳转
          window.location.href = target;  // eslint-disable-line no-location-assign
        } else {
          this.setState({target: redirectUrl});
        }
      }, error: (result) => {
        this.setState({errorInfo: result && result.resultMsg || '系统错误，请刷新重试'});
      },
    });
  },

  render() {
    const {target, errorInfo} = this.state;

    if (errorInfo) {
      return <ErrorPage desc={errorInfo} />;
    }
    return (<div>
      <AutoFrame target={target} />
    </div>);
  },
});

export default FramePage;
