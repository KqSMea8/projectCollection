import React from 'react';
const ActivitiesBill = React.createClass({
  render() {
    // const merchantIdInput = document.getElementById('J_crmhome_merchantId');
    // const merchantId = merchantIdInput ? merchantIdInput.value : '';
    // const url = window.APP.kbretailprodUrl + merchantId + '/settlement/setting';
    const url = window.APP.kbretailprodUrl + '/main.htm#/settlement/saletable';
    return (
      <iframe src={url} style={{frameborder: 0, border: '0', width: 1446, height: 1579}}/>
    );
  }
});

export default ActivitiesBill;

