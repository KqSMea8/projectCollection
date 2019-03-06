import React from 'react';
import fetch from '@alipay/kb-fetch';
import {Page, Block} from '@alipay/kb-framework-components/lib/layout';
import {MyReportsFrame} from '@alipay/kb-framework-components/lib/frame';
import getLoginUser from '@alipay/kb-framework/framework/getLoginUser';

import {SubmitStatus} from '../../../common/enum';

import KpiCards from './KpiCards';
import TodoCards from './TodoCards';

const CSTRAINING_URL = 'https://cstraining.alipay.com/learn/trainTaskRecordsNew.htm?tntInstId=KOUBEI_SALE_TRAINING&tntInstLoginStatus=true';
const PENDING_TASK_URL = `${window.APP.antprocessUrl}/middleground/koubei.htm#/pending-task`;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: getLoginUser(),
      kpiData: {},
      kpiInfoLoadStatus: SubmitStatus.INIT,
      todoData: [],
      todoInfoLoadStatus: SubmitStatus.INIT
    };
  }

  componentDidMount() {
    fetch({
      url: 'kbservcenter.commonDataService.commonDataQuery', // required
      param: {
        uniqKey: 'DCUKEY1518156599333',
      }
    })
      .then((resp) => {
        const data = (resp.data && resp.data.length > 0) ? resp.data[0] : {};
        this.setState({
          kpiData: data,
          kpiInfoLoadStatus: SubmitStatus.DONE
        });
      })
      .catch(() => {
        this.setState({
          kpiInfoLoadStatus: SubmitStatus.FAILED
        });
      });
    fetch({
      url: 'kbservcenter.middleIndexInfoService.queryKaTodoInfo', // required
    })
      .then((resp) => {
        this.setState({
          todoData: resp.data,
          todoInfoLoadStatus: SubmitStatus.DONE
        });
      })
      .catch(() => {
        this.setState({
          todoInfoLoadStatus: SubmitStatus.FAILED
        });
      });
  }

  render() {
    const { userInfo, kpiData, kpiInfoLoadStatus, todoData, todoInfoLoadStatus } = this.state;
    const { params } = this.props;
    const KPI_URL = '#/tka/kpi';
    const kpiItems = [
      {
        title: '业绩指标',
        value: kpiData.mct_serv_percent,
        link: KPI_URL,
        status: 'active',
      },
      {
        title: '过程指标',
        value: kpiData.process_kpi,
        link: KPI_URL,
        status: 'exception',
      },
    ];
    const todoItems = [
      {
        title: '培训考试',
        value: todoData.traningAndExam,
        link: CSTRAINING_URL
      },
      /* {
        title: '日常维护',
        value: todoData.dailySafeguard
      }, */
      {
        title: '待审批',
        value: todoData.toApprove,
        link: PENDING_TASK_URL
      },
    ];
    /* if (window.APP.isBDManager) {
      todoItems.splice(2, 0, {
        title: '数据小结',
        value: todoData.dataSummary
      });
    } */
    const getMrParams = () => {
      // const mrParams = {
      //   xiaoer_id: userInfo.outUserNo,
      //   // role: window.APP.isBDManager ? 'director' : ''
      // };
      const mrParams = {};
      if (params.xiaoer_id) {
        mrParams.sub_xiaoer_id = params.xiaoer_id;
        mrParams.role = 'director';
      }
      return mrParams;
    };
    return (
      <Page title="销售工作台">
        {kpiInfoLoadStatus === SubmitStatus.DONE && <Block title="本月KPI完成度">
          {<KpiCards items={kpiItems} />}
        </Block>}
        {todoInfoLoadStatus === SubmitStatus.DONE && (
          <Block title="待办事项">
            {<TodoCards items={todoItems}/>}
          </Block>
        )}
        {userInfo && (
          <MyReportsFrame
            pageUri="pageUri1517211696107"
            params={getMrParams()}
          />
        )}
      </Page>
    );
  }
}

export default Dashboard;
