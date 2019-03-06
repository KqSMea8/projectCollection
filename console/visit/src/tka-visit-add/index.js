import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { page as wrapper } from '@alipay/page-wrapper';
import { List } from '@alipay/qingtai';
import TouchScroll from 'rmc-touchscroll';
import VisitTimeItem from './form/visit-time-item';
import VisitWayItem from './form/visit-way-item';
import VisitMerchantItem from './form/visit-merchant-item';
import VisitSubCompanyItem from './form/visit-sub-company-item';
import VisitWithPeopleItem from './form/visit-with-people-item';
import VisitObjectItem from './form/visit-object-item';
import VisitResultItem from './form/visit-result-item';
import DigitalFeedbackItem from './form/digital-feedback-item'; // 数字化程度反馈
import NextPlanItem from './form/next-plan-item';
import OtherNoteItem from './form/other-note-item';
import SubmitResult from './component/submit-result';
import BackButtonConfirm from '../common/component/back-button-confirm';
import { formatTimeEndDD } from '../common/util';

import store from './store';
import spmConfig from './spm.config';
import './style.less';

/* eslint-disable */
@wrapper({ store, spmConfig })
class Index extends PureComponent {
  static propTypes = {
    initData: PropTypes.object,
  };

  componentDidMount() {
    kBridge.call('setOptionButton', {
      items: [{ title: '提交' }],
      onClick: () => {
        this.props.dispatch({ type: 'doSubmit' });
      },
    });
  }

  render() {
    const props = this.props;
    if (props.submitSucResult) {
      // 提交成功
      return (
        <TouchScroll fullScreen>
          <SubmitResult
            recordId={props.submitSucResult && props.submitSucResult.recordId}
            userName={props.submitSucResult && props.submitSucResult.userName}
            merchantName={props.visitMerchant && props.visitMerchant.name}
            visitTime={formatTimeEndDD(props.visitTime)}
          />
        </TouchScroll>
      );
    }

    const merchantId = props.visitMerchant && props.visitMerchant.id;
    return (
      <TouchScroll id="add-visit" fullScreen>
        <BackButtonConfirm shouldConfirm={this.props.fieldChange} />
        <List>
          <VisitTimeItem value={props.visitTime} />
          <VisitWayItem
            value={props.visitWay}
            onChange={v => props.dispatch({ type: 'setVisitWay', payload: v })}
          />
          <VisitMerchantItem
            value={props.visitMerchant}
            onChange={v =>
              props.dispatch({ type: 'setVisitMerchant', payload: v })
            }
          />
          <VisitSubCompanyItem
            merchantId={merchantId}
            value={props.visitSubCompany}
            onChange={v =>
              props.dispatch({ type: 'setVisitSubCompany', payload: v })
            }
          />
          <VisitWithPeopleItem
            value={props.visitWithPeople}
            onChange={v =>
              props.dispatch({ type: 'setVisitWithPeople', payload: v })
            }
          />
        </List>
        <List className="part2">
          <VisitObjectItem
            merchantId={merchantId}
            value={props.visitObject}
            onChange={v =>
              props.dispatch({ type: 'setVisitObject', payload: v })
            }
          />
          <DigitalFeedbackItem
            dispatch={props.dispatch}
            merchantId={merchantId}
            value={props.digitalFeedBack}
            onChange={v =>
              props.dispatch({ type: 'setDigitalFeedBack', payload: v })
            }
          />
          <VisitResultItem
            value={props.visitResult}
            onChange={v =>
              props.dispatch({ type: 'setVisitResult', payload: v })
            }
          />
          <NextPlanItem
            value={props.nextPlan}
            onChange={v => props.dispatch({ type: 'setNextPlan', payload: v })}
          />
          <OtherNoteItem
            value={props.otherNote}
            onChange={v => props.dispatch({ type: 'setOtherNote', payload: v })}
          />
        </List>
      </TouchScroll>
    );
  }
}

kBridge.ready(() => {
  ReactDOM.render(<Index />, document.querySelector('main'));
});
