import React, {PropTypes} from 'react';

const LazyImg = React.createClass({
  propTypes: {
    containerId: PropTypes.any,
    src: PropTypes.string,
    offset: PropTypes.number,
    container: PropTypes.object,
  },
  getDefaultProps() {
    return {
      src: null,
      offset: 0,
    };
  },
  getInitialState() {
    return {
      visible: false,
    };
  },
  componentDidMount() {
    const {container} = this.props;
    this.container = container;
    this.bind();
    this.scrollHandler(); // 动画导致计算错误
  },
  componentWillUnMount() {
    this.unbind();
  },
  bind() {
    this.container.addEventListener('scroll', this.scrollHandler);
  },
  unbind() {
    this.container.removeEventListener('scroll', this.scrollHandler);
  },
  scrollHandler() {
    const {offset} = this.props;
    const img = this.refs.img;
    const containerRect = this.container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    if (imgRect.top - containerRect.top < containerRect.height + offset && containerRect.bottom - imgRect.bottom < containerRect.height + offset) {
      this.setState({
        visible: true,
      });
      this.unbind();
    }
  },
  render() {
    const {src} = this.props;
    const {visible} = this.state;
    return (<img {...this.props} ref="img" src={visible ? src : null} />);
  },
});

export default LazyImg;
