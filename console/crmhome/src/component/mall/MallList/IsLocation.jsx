import React, {PropTypes} from 'react';
import ajax from '../../../common/ajax';

const IsLocation = React.createClass({
  propTypes: {
    data: PropTypes.object,
    showModal: PropTypes.func,
  },

  getInitialState() {
    return {
      data: [],
      isLocation: false,
    };
  },

  componentDidMount() {
    const data = this.props.data;
    ajax({
      url: window.APP.kbretailprod + '/gaodeMap.json?action=/shopRelation/query',
      method: 'get',
      data: { 'data': JSON.stringify({shopId: data.shopId}) },
      type: 'json',
      withCredentials: true,
      success: (res) => {
        if (res.shopMapRelationList) {
          this.setState({
            data: res.shopMapRelationList,
            isLocation: true,
          });
        }
      },
    });
  },

  render() {
    const isLocation = this.state.isLocation;
    return (
      <div>
        { isLocation ? <span>已定位</span> : <span>未定位</span> }
        { isLocation && <a onClick={this.props.showModal.bind(this, this.state.data)} style={{marginLeft: '10px'}}>查看</a>}
      </div>
    );
  },
});

export default IsLocation;
