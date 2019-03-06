import React from 'react';
import ReactDOM from 'react-dom';
import { List, TextareaItem, Tag } from '@alipay/qingtai';
import { page as wrapper } from '@alipay/page-wrapper';
import { getParam, popPage } from '@alipay/kb-m-biz-util';
import BackButtonConfirm from '../../../common/component/back-button-confirm';
import { VISIT_PURPOSE_TKA_MAP, VISIT_PURPOSE_TKA_VALUE } from '../../../common/constants';
import showVoiceInputAlertOnce from '../common/show-voice-input-alert-once';
import './style.less';

@wrapper({ store: {}, spmConfig: [] })
class Index extends React.Component {
  constructor(props) {
    super(props);

    const chooseTag = {};
    const tagInput = {};
    const param = getParam();
    const data = param.data && JSON.parse(param.data);
    if (data) {
      data.forEach(item => {
        chooseTag[item.id] = true;
        tagInput[item.id] = item.value;
      });
    }
    this.state = {
      chooseTag,
      tagInput,
      fieldChange: false,
    };
  }

  componentDidMount() {
    kBridge.call('setOptionButton', {
      items: [{ title: '完成' }],
      onClick: () => {
        this.onClickFinish();
      },
    });
    showVoiceInputAlertOnce();
  }

  onTagChange(tag, select) {
    const { chooseTag } = this.state;
    if (select) {
      chooseTag[tag] = true;
    } else {
      delete chooseTag[tag];
    }
    this.setState({
      chooseTag,
      fieldChange: true,
    });
  }

  onInputChange(tag, input) {
    const { tagInput } = this.state;
    tagInput[tag] = input;
    this.setState({
      tagInput,
      fieldChange: true,
    });
  }

  onClickFinish() {
    const { chooseTag, tagInput } = this.state;
    const popResult = [];
    for (const tag of Object.keys(chooseTag)) {
      if (!tagInput[tag] || tagInput[tag].length < 50) {
        kBridge.call('showToast', `请输入'${VISIT_PURPOSE_TKA_MAP[tag]}-沟通结果'，至少50字`);
        return;
      }
      popResult.push({ name: VISIT_PURPOSE_TKA_MAP[tag], value: tagInput[tag], id: tag });
    }
    if (popResult.length === 0) {
      kBridge.call('showToast', '请选择至少一个沟通结果');
      return;
    }
    popPage(popResult);
  }

  render() {
    const { chooseTag, tagInput, fieldChange } = this.state;

    return (<div className="visit-result-page">
      <BackButtonConfirm shouldConfirm={fieldChange} />
      <div className="part">
        <div className="part-title">拜访目的 (必选)</div>
        <div className="tag-content">
          {Object.keys(VISIT_PURPOSE_TKA_VALUE).map(tag =>
            (<Tag className="tag"
              key={tag}
              selected={!!chooseTag[tag]}
              onChange={this.onTagChange.bind(this, tag)}>
              {VISIT_PURPOSE_TKA_MAP[tag]}
             </Tag>))}
        </div>
      </div>
      {Object.keys(VISIT_PURPOSE_TKA_VALUE).map(item =>
        chooseTag[item] && <List className="part" key={item}>
          <div className="part-title">{VISIT_PURPOSE_TKA_MAP[item]}-沟通结果</div>
          <TextareaItem className="textarea"
            placeholder="必填，请输入拜访的沟通结果，至少50字"
            rows={5}
            count={1000}
            onChange={this.onInputChange.bind(this, item)}
            value={tagInput[item]} />
                           </List>)}
            </div>);
  }
}

kBridge.ready(() => {
  ReactDOM.render(
    <Index />,
    document.querySelector('main'),
  );
});
