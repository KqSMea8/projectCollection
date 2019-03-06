import React, { PropTypes } from 'react';
import { Button, Form, /* Select,*/ Icon, Input } from 'antd';
import ShopChoose from './ShopChoose';
import ExchangeVouchersTable from './ExchangeVouchersTable';
import ajax from '../../../common/ajax';
import { getStorage, setStorage, keepSession, customLocation } from '../../../common/utils';
import classnames from 'classnames';
import './index.less';

const FormItem = Form.Item;

const introHelpBtn = (
  <a
    onClick={() => customLocation('https://render.alipay.com/p/f/fd-j9zb6mdt/index.html', '_blank')}
    style={{ position: 'absolute', right: 30, top: 0 }}
  >
    <Button size="large" type="ghost">
      <Icon type="question-circle" style={{ color: '#2db7f5' }} /> 商品核销教程
    </Button>
  </a>
);

class Cancel extends React.Component {
  static propTypes = {
    params: PropTypes.object,
    form: PropTypes.object,
    history: PropTypes.object,
  };

  state = {
    loading: false,
    dataList: {},
    errorInfo: '',
    voucherResult: true,
    voucherSuccess: false,
    voucherError: false,
    voucherErrorText: '',
    showInputTips: true,
  };

  componentWillMount() {
    setTimeout(() => {
      keepSession(1000 * 60 * 60 * 10, Infinity);
    }, 1000);
  }
  userChangeTickerCount(index, data) {
    const tmpData = Object.assign({}, this.state.dataList);
    tmpData.ticketCount = data;
    this.setState({
      dataList: tmpData,
    });
  }
  reset = err => {
    this.setState(() => {
      return {
        voucherSuccess: false,
        voucherError: false,
      };
    });
    if (err) {
      // this.props.form.setFieldsValue({ conponId: undefined });
      this.setState(state => {
        const newState = { ...state };
        newState.voucherError = true;
        newState.voucherErrorText = err;
        return newState;
      });
    } else {
      this.setState(
        state => {
          const rtn = { ...state };
          rtn.dataList = { ...(rtn.dataList || {}), _verified: true };
          rtn.voucherSuccess = true;
          return rtn;
        },
        () => {
          this.props.form.setFieldsValue({ conponId: undefined });
        }
      );
    }
  };

  handleSubmit = e => {
    e.preventDefault();

    if (!this.state.loading) {
      this.setState({
        loading: true,
        dataList: undefined,
        voucherSuccess: false,
        voucherError: false,
        errorInfo: '',
      });
      this.props.form.validateFields((err, values) => {
        if (!err) {
          ajax({
            // url: 'http://pickpost.alipay.net/mock/kb-crmhome/promo/conponsVerify/conponsQuery.json?shopId=2017071300077000000022026129&conponId=020601937809',
            url: '/promo/conponsVerify/conponsQuery.json',
            data: {
              shopId: values.checkShop.shopId,
              conponId: values.conponId.replace(/\s/g, ''),
            },
            success: res => {
              const data = {
                coponType: res.data.coponType,
                conponId: res.data.conponId,
                coponName: res.data.coponName,
                ownerInfo: res.data.ownerInfo,
                gmtStart: res.data.gmtStart,
                gmtEnd: res.data.gmtEnd,
                orderNo: res.data.ticketVOs[0].orderNo,
                itemId: res.data.ticketVOs[0].itemId,
                price: res.data.ticketVOs[0].price,
                timeCards: res.data.ticketVOs[0].timeCards,
                availableTimes: res.data.ticketVOs[0].availableTimes,
                availableCount: res.data.ticketVOs[0].availableCount,
                ticketCount: 1,
              };
              this.setState({
                loading: false,
                dataList: data,
                errorInfo: '',
              });
            },
            error: res => {
              if (res.errorMsg) {
                this.setState({ errorInfo: res.errorMsg || '无法识别该券', loading: false });
              }
            },
          });
        }
      });
    }
  };

  gotoCateringItemLog = () => {
    customLocation(`${window.APP.mbillexprodUrl}/crmhome/index.htm#/prevoucher`, '_blank');
  };

  gotoGenericItemLog = () => {
    customLocation(
      `${window.APP.mbillexprodUrl}/crmhome/index.htm?funcCode=060306#/itemordersearch`,
      '_blank'
    );
  };

  gotoExchangeLog = () => {
    this.props.history.push('/marketing/vouchers/checkrecord');
  };

  conponIdValidator = (r, couponId, cb) => {
    this.props.form.validateFields(['checkShop'], { force: true });
    cb();
  };

  shopValidator = (r, values, cb) => {
    const { getFieldValue } = this.props.form;
    if ((!values || !values.shopId) && getFieldValue('conponId')) {
      return cb('请先选择门店');
    }
    cb();
  };

  get logLink() {
    return (
      <a target="_blank" href={`/kbreport/kbbill//index.htm#/new-trade-query-hexiao`}>
        <Button style={{ marginRight: 10 }} size="large" type="ghost">
          商品券验券记录
        </Button>
      </a>
    );
  }

  get fieldProps() {
    return this.props.form.getFieldProps('conponId', {
      rules: [
        {
          requried: true,
        },
        this.conponIdValidator,
      ],
    });
  }

  handleInputBlur = () => {
    let currentValue = this.props.form.getFieldValue('conponId') || '';
    currentValue = currentValue
      .replace(/\D/g, '')
      .replace(/\d{4}/g, '$& ')
      .replace(/\s$/, '');
    if (currentValue.trim() === '') {
      this.setState({
        showInputTips: true,
        voucherSuccess: false,
        voucherError: false,
      });
    } else {
      this.setState({
        showInputTips: false,
      });
    }
    this.props.form.setFieldsValue({
      conponId: currentValue,
    });
  };

  handleInputFocus = () => {
    let currentValue = this.props.form.getFieldValue('conponId') || '';
    currentValue = currentValue.replace(/\D/g, '');
    this.props.form.setFieldsValue({
      conponId: currentValue,
    });
  };

  render() {
    const { getFieldProps, getFieldValue, getFieldError } = this.props.form;
    const { dataList, errorInfo, loading, showInputTips, voucherErrorText } = this.state;
    const inputProps = this.fieldProps;
    return (
      <div>
        <div className="app-detail-header">
          验券
          <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
            {this.logLink}
            <Button size="large" type="ghost" onClick={this.gotoExchangeLog}>
              兑换券验券记录
            </Button>
          </div>
        </div>
        <div className="app-detail-content-padding">
          <div className="cancel-vouchers-panel">
            <Form onSubmit={this.handleSubmit}>
              <div className="check-form-base">
                <FormItem
                  label="请选择门店"
                  labelCol={{ span: 3 }}
                  style={{ minWidth: 350 }}
                  wrapperCol={{ span: 12 }}
                  validateStatus={getFieldError('checkShop') ? 'error' : 'success'}
                  help={getFieldError('checkShop')}
                >
                  <ShopChoose
                    {...getFieldProps('checkShop', {
                      rules: [this.shopValidator],
                      initialValue: getStorage('cancelVouchersShop'),
                      onChange: values => {
                        setStorage('cancelVouchersShop', values);
                      },
                    })}
                  />
                </FormItem>
                {introHelpBtn}
              </div>
              <div className="check-panel">
                <div className="check-panel-title">请输入券码</div>
                <div className="check-panel-container">
                  <FormItem
                    help={errorInfo ? errorInfo : ''}
                    validateStatus={classnames({ error: errorInfo })}
                  >
                    <Input
                      className="check-input"
                      onBlur={this.handleInputBlur}
                      onFocus={this.handleInputFocus}
                      {...inputProps}
                    />
                    {/*
                    <Select
                      combobox
                      className="check-input"
                      onSearch={() => { if (errorInfo) { this.setState({ errorInfo: '' }); } }}
                      allowClear
                      placeholder="请输入兑换券或商品券的券码，或在口碑掌柜上扫码核销"
                      {...getFieldProps('conponId', {
                        normalize(v) {
                          if (v) {
                            return v.replace(/\D/g, '').replace(/\d{4}/g, '$& ').replace(/\s$/, '');
                          }
                        },
                        rules: [{
                          requried: true,
                        }, this.conponIdValidator],
                      }) } />
                  */}
                  </FormItem>
                </div>
                <Button
                  type="primary"
                  loading={loading}
                  htmlType="submit"
                  disabled={
                    !(
                      getFieldValue('conponId') &&
                      getFieldValue('checkShop') &&
                      getFieldValue('checkShop').shopId
                    )
                  }
                >
                  查 询
                </Button>
                {showInputTips && (
                  <div className="showInputTips">如需核销多份，只需要输入其中一个券码即可</div>
                )}

                <div
                  className="voucher-result"
                  onClick={() => {
                    this.setState({
                      voucherResult: !this.state.voucherResult,
                    });
                  }}
                >
                  {this.state.voucherSuccess && (
                    <span>
                      <Button
                        type="primary"
                        icon="check"
                        shape="circle"
                        size="small"
                        style={{ lineHeight: '22px', fontSize: '12px' }}
                      />
                      &nbsp;&nbsp;核销成功
                    </span>
                  )}
                  {this.state.voucherError && (
                    <span>
                      <Button
                        icon="exclamation"
                        shape="circle"
                        size="small"
                        style={{
                          lineHeight: '22px',
                          fontSize: '12px',
                          backgroundColor: '#f842a8',
                          color: 'white',
                        }}
                      />
                      &nbsp;&nbsp;{voucherErrorText}
                    </span>
                  )}
                </div>
              </div>
            </Form>
          </div>
          <div className="voucher-extra-table">
            {dataList && dataList.conponId ? (
              <ExchangeVouchersTable
                data={[dataList]}
                shopId={getFieldValue('checkShop').shopId}
                onChange={this.reset}
                onUserChangeCount={(index, data) => {
                  this.userChangeTickerCount(index, data);
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(Cancel);
