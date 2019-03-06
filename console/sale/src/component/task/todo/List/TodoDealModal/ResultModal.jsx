import React from 'react';

import {Modal} from 'antd';
import {DetailTable} from 'hermes-react';
import find from 'lodash/find';

import './ResultModal.less';

import {getFeedbackReasonList} from '../../../common/api';

class TodoDealModal extends React.Component {
  constructor() {
    super();
    getFeedbackReasonList()
      .then(resp => {
        const {reasonList, resultList} = resp.data;
        this.setState({reasonList, resultList});
      });
  }

  state = {
    visible: false,
    data: null,
    reasonList: [],
    resultList: [],
  };

  open(data) {
    this.setState({
      visible: true,
      data,
    });
  }

  close() {
    this.setState({
      data: null,
      visible: false
    });
  }

  handleCancel = () => {
    this.close();
  };

  render() {
    const {visible, data, reasonList, resultList} = this.state;
    const getData = () => {
      const feedback = JSON.parse(data.feedback);
      let resultShowText;
      const reasonText = find(reasonList, r => r.id === feedback.reason).name;
      const resultText = find(resultList, r => r.id === feedback.result).name;
      resultShowText = `${resultText} - ${reasonText}`;
      if (feedback.reason === 'OTHER') {
        resultShowText = `${resultText} - ${feedback.otherReason}`;
      }
      return [
        {
          label: '处理人',
          value: data.operatorName
        },
        {
          label: '处理时间',
          value: data.finishTime
        },
        {
          label: '处理结果',
          value: resultShowText
        },
      ];
    };
    return (
      <Modal
        width={666}
        title="处理结果"
        closable
        visible={visible}
        onCancel={this.handleCancel}
        footer={null}
      >
        {data && <div className="deal-result-table"><DetailTable columnCount={2} dataSource={getData()}/></div>}
      </Modal>
    );
  }
}

export default TodoDealModal;
