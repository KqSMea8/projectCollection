import React from 'react';
import { Button } from 'antd';
import { Page } from '@alipay/kb-framework-components/lib/layout';
// import permission from '@alipay/kb-framework/framework/permission';
import ListForm from './ListForm';
import ListTable from './ListTable';

/**
 * TKA 拜访小记列表管理页
 *
 * @class List
 * @extends {React.Component}
 */
class List extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.initQuery = props.location.query;
    if (Object.keys(this.initQuery).length === 0) {
      this.initQuery = undefined;
    }
  }

  componentDidMount() {
  }

  onSearch(params) {
    this.setState({ params });
  }

  gotoNewVisit = () => {
    window.open('#/tka-record/add');
  };

  render() {
    const { params } = this.state;
    return (
      <Page
        title="拜访小记"
        header={
          <div style={{ overflow: 'hidden', float: 'right' }}>
            <Button
              type="primary"
              onClick={this.gotoNewVisit}
            >添加拜访
            </Button>
          </div>
        }
      >
        <ListForm initQuery={this.initQuery} onSearch={this.onSearch.bind(this)} />
        <ListTable params={params} style={{ marginTop: 12 }} />
      </Page>
    );
  }
}

export default List;
