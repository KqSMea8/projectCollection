import React, { PropTypes } from 'react';
import { KbSalesUserSelect } from '@alipay/kb-framework-components/lib/biz';

class VisitWithUserSelect extends React.Component {

  static propTypes = {
    onChange: PropTypes.func, // (idArray) => {}
  };

  onChange(v) {
    if (this.props.onChange) {
      this.props.onChange(v && v.map(item => item.id));
    }
  }

  render() {
    return (<KbSalesUserSelect
      placeholder="可多选"
      notFoundContent=""
      multiple
      kbsalesUrl={window.APP.kbsalesUrl}
      getVirtualObject={() => undefined}
      type="BD"
      onChange={this.onChange.bind(this)}
      style={this.props.style}
    />);
  }
}

export default VisitWithUserSelect;
