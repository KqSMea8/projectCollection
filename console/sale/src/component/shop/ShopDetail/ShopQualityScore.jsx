import React, {PropTypes} from 'react';

const ShopQualityScore = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },
  getInitialState() {
    return {};
  },

  render() {
    const url = window.APP.crmhomeUrl + '/shop.htm.kb?op_merchant_id=' + this.props.params.pid + '#/shop/quality-score/' + this.props.params.id;
    return (
      <div>
        <iframe src={url} id="crmhomePage" width="100%" height="998" scrolling="no" border="0" frameBorder="0"></iframe>
      </div>
    );
  },
});

export default ShopQualityScore;
