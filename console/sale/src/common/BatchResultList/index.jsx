import React, { PropTypes } from 'react';
import ajax from 'Utility/ajax';
import DetailList from './DetailList';

function fetchFactory(bizType, url, component) {
  return (pageIndex = 1, pageSize = 10) => {
    return ajax({
      url,
      data: {
        pageNum: pageIndex,
        pageSize,
        batchType: bizType,
      },
    }).then((res) => {
      if (res.status === 'succeed') {
        component.setState({
          data: res.data.batchTasks && res.data.batchTasks.length > 0 ? res.data.batchTasks.map((d, key) => ({
            key,
            ...d,
          })) : null,
          loading: false,
          total: res.data.totalItems,
          pageNum: res.data.pageNo,
        });
      }
    });
  };
}

class BatchResultList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
      pageSize: 10,
      data: null,
      total: 0,
      loading: true,
    };
    const url = window.APP.crmhomeUrl + '/shop/koubei/shopBatchOptQuery.json';
    (this.fetch = fetchFactory(props.bizType, url, this))();
    this.switchPage = this.switchPage.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state || nextProps !== this.props;
  }

  switchPage(pageIndex) {
    this.setState({ loading: true });
    this.fetch(pageIndex, this.state.pageSize);
  }

  render() {
    return (
      <div style={this.props.style}>
        {this.props.children}
        <DetailList {...this.state} switchPage={this.switchPage} />
      </div>
    );
  }
}

BatchResultList.propTypes = {
  bizType: PropTypes.string.isRequired,
  children: PropTypes.any,
  style: PropTypes.object,
};


export default BatchResultList;
