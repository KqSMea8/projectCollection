/**
 * 营销账单下载
 */
import React, {PropTypes} from 'react';
import { Calendar, message, Popover, Alert} from 'antd';
import ajax from '../../../common/ajax';
import { dateLaterThanToday } from '../../../common/dateUtils';

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

const BillDownload = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    // 当前日期
    const newDate = new Date();
    const month = newDate.getMonth() + 1;
    return {
      data: [],
      yearData: [],
      calendarInfo: month,
    };
  },

  componentDidMount() {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (date.getMonth() + 1 < 10) {month = '0' + (date.getMonth() + 1);}
    const totalDays = daysInMonth(month, year);

    this.dateInfo = {
      startTime: `${year}${month}01`,
      endTime: `${year}${month}${totalDays}`,
    };
    this.fetch('month');
    document.getElementsByClassName('bill-manage')[0].getElementsByTagName('label')[0].getElementsByTagName('span')[2].innerHTML = '日账单';
    document.getElementsByClassName('bill-manage')[0].getElementsByTagName('label')[1].getElementsByTagName('span')[2].innerHTML = '月账单';
  },

  onPanelChange(date, mode) {
    const year = date.getYear();
    let month = date.getMonth() + 1;
    if (date.getMonth() + 1 < 10) {month = '0' + (date.getMonth() + 1);}
    const totalDays = daysInMonth(month, year);

    if (mode === 'year') {
      // 当前日期
      const jdate = new Date();
      const yearD = jdate.getFullYear();
      let monthD = jdate.getMonth() + 1;

      if (year === yearD) {
        if (jdate.getMonth() + 1 < 10) {monthD = '0' + (jdate.getMonth());}
        this.dateInfo = {
          startTime: `${year}01`,
          endTime: `${year}${monthD}`,
        };

        if (jdate.getMonth() + 1 < 10) {monthD = '0' + (jdate.getMonth() + 1);}
        this.yearInfo = {
          startTime: `${year}${monthD}01`,
          endTime: `${year}${monthD}01`,
          curmonth: 0,
        };
      } else {
        this.dateInfo = {
          startTime: `${year}01`,
          endTime: `${year}12`,
        };
      }
    } else {
      this.dateInfo = {
        startTime: `${year}${month}01`,
        endTime: `${year}${month}${totalDays}`,
      };
    }

    this.setState({
      calendarInfo: date.getMonth() + 1,
    });

    this.fetch(mode, date);
  },

  fetch(mode, date) {
    const self = this;
    ajax({
      url: '/promo/brand/checkDownloadBill.json',
      method: 'get',
      data: Object.assign(this.dateInfo),
      type: 'json',
      success: ({data}) => {
        self.setState({
          data: data || [],
        });
      },
      error: (res) => {
        message.error(res.resultMsg || '获取账单失败！');
      },
    });
    const jdate = new Date();
    if (mode === 'year' && (date.getYear() === jdate.getFullYear())) {
      ajax({
        url: '/promo/brand/checkDownloadBill.json',
        method: 'get',
        data: Object.assign(this.yearInfo),
        type: 'json',
        success: (res) => {
          self.setState({
            yearData: res.data,
          });
        },
        error: (res) => {
          message.error(res.resultMsg || '获取账单失败！');
        },
      });
    }
  },

  dateCellRender(value) {
    let htm = (
      <div style={{marginTop: '55px'}}>
        <Popover placement="topLeft" content={<p style={{textAlign: 'center'}}>当天未进行过活动</p>}>
          <p style={{color: '#ccc', display: 'inline-block'}}>无账单</p>
        </Popover>
      </div>
    );
    const noHtml = (
      <div style={{marginTop: '55px'}}>
        <p style={{color: '#ccc', display: 'inline-block'}}>账单未生成</p>
      </div>
    );
    let getMonth = value.getMonth() + 1;
    let getDate = value.getDayOfMonth();
    if (value.getMonth() + 1 < 10) {getMonth = '0' + (value.getMonth() + 1);}
    if (value.getDayOfMonth() + 1 <= 10) {getDate = '0' + value.getDayOfMonth();}
    const date = `${value.getYear()}` + getMonth + getDate;

    // 当前日期
    const jdate = new Date();
    const yearD = jdate.getFullYear();
    const monthD = jdate.getMonth() + 1;
    const dateD = jdate.getDate();
    if ( value.getMonth() + 1 === this.state.calendarInfo) {
      const monthData = this.state.data;
      monthData.map((item) => {
        const calendarDate = new Date(item);
        const aDate = `${calendarDate.getFullYear()}` + `${calendarDate.getMonth() + 1}` + `${calendarDate.getDate()}`;
        const bDate = `${value.getYear()}` + `${value.getMonth() + 1}` + `${value.getDayOfMonth()}`;
        if (aDate === bDate) {
          let url = '/promo/brand/downloadDayOrMonthBill.htm?dateTime=' + date;
          if (this.props.params.type === 'retailers') {
            url = '/promo/brand/downloadDayOrMonthMerchantBill.htm?dateTime=' + date;
          }
          htm = (
              <div style={{marginTop: '55px'}}>
                <a target="_blank" href={url} >下载账单</a>
              </div>
            );
        }
        if (`${value.getYear()}` >= yearD &&
          value.getMonth() + 1 === monthD && `${value.getDayOfMonth()}` >= dateD ) {
          htm = noHtml;
        }
      });

      if ( `${value.getYear()}` > yearD ) {
        htm = noHtml;
      } else if ( `${value.getYear()}` === yearD && `${value.getMonth() + 1}` > monthD ) {
        htm = noHtml;
      }
      return htm;
    }
  },

  monthCellRender(value) {
    let htm = (
      <div style={{marginTop: '47px'}}>
        <Popover placement="topLeft" content={<p style={{textAlign: 'center'}}>当月未进行过活动</p>}>
          <p style={{color: '#ccc', display: 'inline-block'}}>无账单</p>
        </Popover>
      </div>
    );
    const noHtml = (
      <div style={{marginTop: '55px'}}>
        <p style={{color: '#ccc', display: 'inline-block'}}>账单未生成</p>
      </div>
    );
    let getMonth = value.getMonth() + 1;
    if (value.getMonth() + 1 < 10) {getMonth = '0' + (value.getMonth() + 1);}
    const date = `${value.getYear()}` + getMonth;

    const dataList = [];
    const monthData = this.state.data;
    const yearData = this.state.yearData;

    // 当前日期
    const jdate = new Date();
    const year = jdate.getFullYear();
    const month = jdate.getMonth() + 1;
    const cDate = `${year}` + `${month}`;

    monthData.map((p) => {
      dataList.push(p);
    });
    dataList.push(yearData[0]);
    dataList.map((item) => {
      const calendarDate = new Date(item);
      const aDate = `${calendarDate.getFullYear()}` + `${calendarDate.getMonth() + 1}`;
      const bDate = `${value.getYear()}` + `${value.getMonth() + 1}`;
      let yearBool = true;

      if (aDate === bDate) {
        let text = '下载账单';
        let url = '/promo/brand/downloadDayOrMonthBill.htm?dateTime=' + date;
        if (this.props.params.type === 'retailers') {
          url = '/promo/brand/downloadDayOrMonthMerchantBill.htm?dateTime=' + date;
        }

        if (aDate === cDate) {
          text = <div><p>下载账单</p><p>(截止昨日)</p></div>;
          url = '/promo/brand/downloadDayOrMonthBill.htm?dateTime=' + `${value.getYear()}` + getMonth + '01&curmonth=0';
          if (this.props.params.type === 'retailers') {
            url = '/promo/brand/downloadDayOrMonthMerchantBill.htm?dateTime=' + `${value.getYear()}` + getMonth + '01&curmonth=0';
          }
          if (jdate.getDate() === 1) {
            yearBool = false;
          }
        }

        htm = yearBool === false ? noHtml : (
          <div style={{marginTop: '47px'}}>
            <a target="_blank" href={url} >{text}</a>
          </div>
        );
      }

      if ( `${value.getMonth() + 1}` > month && `${value.getYear()}` >= year ) {
        htm = noHtml;
      }
    });

    if ( `${value.getYear()}` > year ) {
      htm = noHtml;
    }

    return htm;
  },

  render() {
    const type = this.props.params.type;
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let alertBool = null;
    if (year === 2017 && month === 6 && day <= 26) {
      alertBool = <Alert message={<span style={{color: 'red'}}>账单还在准备中，请6月26号后下载查看</span>} type="error" />;
    }
    return (<div style={{position: 'relative'}}>
      <div className="app-detail-header" style={{padding: '30px 16px 30px'}}>
        营销账单下载
      </div>

      <div className="app-detail-content-padding bill-manage">
        {alertBool}
        <Calendar
          dateCellRender={this.dateCellRender}
          monthCellRender={this.monthCellRender}
          onPanelChange={this.onPanelChange}
          disabledDate={dateLaterThanToday}
        />
        {type === 'retailers' ? <span style={{fontSize: '12px'}}>
          说明：<br/>
          1.营销账单是以签约账号维度出具的营销活动汇总账单，适合有多家门店的连锁商户使用；<br/>
          2.营销账单分为日账单和月账单两种形式供下载，其中：<br/>
          &nbsp;&nbsp;1).日账单包括了按优惠核销汇总、优惠按核销门店汇总、优惠核销明细、商品核销汇总、商品核销门店汇总、商品核销明细共6份账单；<br/>
          &nbsp;&nbsp;2).月账单仅包含优惠按核销门店汇总和商品核销门店汇总；<br/>
          3.月账单既支持历史月份账单下载，也支持当月（本月1号到昨天）下载，方便跨天即时查看；<br/>
          4.特别说明：营销账单仅提供2017年及以后的账单；<br/>
        </span> :
        <span style={{fontSize: '12px'}}>
          说明：<br/>
          1.营销账单分为日账单和月账单两种形式供下载，其中：<br/>
          &nbsp;&nbsp;1).日账单包括了按核销商户汇总、按核销门店汇总、核销明细、商品按核销商户汇总、商品按核销门店汇总、商品核销明细共6份账单；<br/>
          &nbsp;&nbsp;2).月账单仅包含按核销门店汇总和商品按核销门店汇总；<br/>
          2.月账单既支持历史月份账单下载，也支持当月（本月1号到昨天）下载，方便跨天即时查看；<br/>
          3.特别说明：营销账单仅提供2017年及以后的账单；<br/>
        </span>
      }
      </div>

    </div>);
  },
});

export default BillDownload;
