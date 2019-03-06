import React, { PropTypes } from 'react';
import { Table, Button } from 'antd';
import { debounce } from 'lodash';
import ajax from '../../../common/ajax';
import CountSelector from './countSelector';

const COUPON_TYPES = {
  ticket: '商品券',
  conpon: '兑换券',
};

const rowKeyGen = (_, i) => `${_.conponId}${i}`;

export default class ExchangeVouchersTable extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    shopId: PropTypes.string,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.refreshColumns(props.data[0].coponType || 'conpon');
    this.state = {
      verifyLoading: false, // 阻止反复点击用
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data[0].coponType !== this.props.data[0].coponType) {
      this.refreshColumns(nextProps.data[0].coponType || 'conpon');
    }
    if (nextProps.data[0].conponId !== this.props.data[0].conponId) {
      this.setState({
        verifyLoading: false,
      });
    }
  }

  refreshColumns = type => {
    /* 此处用到的查询接口英语拼写错误，无奈只能跟着写错误的单词了 */
    this.columns = [
      {
        title: '券名称',
        dataIndex: 'coponName',
        width: 200,
      },
      // 券码在2018-04-16新需求中已经被隐藏掉
      // {
      //   title: "券码",
      //   dataIndex: "conponId"
      // },
      {
        title: '券类型',
        dataIndex: 'coponType',
        render(t) {
          return COUPON_TYPES[t];
        },
      },
    ];
    if (type === 'ticket') {
      this.columns.push({
        title: '券有效期',
        render(_, data) {
          // return `${data.gmtStart} <br/>至 ${data.gmtEnd}`;
          return (
            <span>
              {data.gmtStart}
              <br />
              至 &nbsp;{data.gmtEnd}
            </span>
          );
        },
      });
    }
    this.columns.push({
      title: '顾客信息',
      dataIndex: 'ownerInfo',
    });
    if (type === 'ticket') {
      this.columns.push({
        title: '售价',
        dataIndex: 'price',
        render(price) {
          return price + '元';
        },
      });
    }
    this.columns.push({
      title: '份数',
      render: (_, data, index) => {
        const maximun = data.timeCards === 'true' ? data.availableTimes : data.availableCount;
        return (
          <CountSelector
            minimum={data.ticketCount}
            maximum={maximun}
            onHandlerSelecterChange={count => {
              this.props.onUserChangeCount(index, count);
            }}
          />
        );
      },
    });
    this.columns.push({
      title: '操作',
      render: (_, data) => {
        if (data._verified) {
          return '已核销成功';
        }
        return (
          <Button
            loading={this.state.verifyLoading}
            onClick={() => {
              this.verifyCode(data);
            }}
            type="primary"
          >
            确认核销
          </Button>
        );
      },
    });
  };

  verifyCode = debounce(
    ({ coponType, conponId, itemId, orderNo, timeCards, ticketCount }) => {
      const data = {
        shopId: this.props.shopId,
        conponId,
        itemId,
        orderNo,
        timeCard: timeCards,
        ticketCount,
        version: '1.86.0',
      };
      const url =
        coponType === 'conpon'
          ? '/promo/conponsVerify/conponsVerify.json'
          : '/promo/ticket/useTicket.json';
      this.setState({
        verifyLoading: true,
      });
      ajax({
        method: data.coponType === 'conpon' ? 'GET' : 'POST',
        url,
        data: data,
        success: (res = {}) => {
          const state = { verifyLoading: false };
          if (res.errorMsg) {
            this.props.onChange(res.errorMsg);
          } else {
            this.props.onChange();
          }
          this.setState(state);
        },
        error: (res = {}) => {
          this.setState({
            verifyLoading: false,
          });
          this.props.onChange(res.errorMsg);
        },
      });
    },
    300,
    { leading: true }
  );

  render() {
    return (
      <Table
        rowKey={rowKeyGen}
        pagination={false}
        columns={this.columns}
        dataSource={this.props.data}
      />
    );
  }
}
