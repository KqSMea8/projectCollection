import React, {PropTypes} from 'react';
import { Form, Input, message } from 'antd';
import classnames from 'classnames';
import ajax from '../../../../../common/ajax';
import TreeModal from '../../TreeModal';

const FormItem = Form.Item;

/*
  表单字段 － 选择商家
*/

class SelectBusiness extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    layout: PropTypes.object,
    actionType: PropTypes.string,
    allData: PropTypes.object,
    initData: PropTypes.object,
  }

  static defaultProps = {
    allData: {},
    initData: {},
  }

  state= {
    treeData: [],
    checkedSymbols: [],
    visible: false,
  }

  componentWillMount() {
    // 创建页面
    if (this.props.actionType === 'create') {
      ajax({
        url: '/goods/discountpromo/getRetailers.json',
        method: 'GET',
        type: 'json',
        success: (res) => {
          if (res && res.retailers) {
            const treeData = res.retailers.map(({ cardNo, name }) => ({
              name: `${name}`,
              symbol: cardNo,
            }));
            this.setState({ treeData });
          } else {
            message.error(res.resultMsg || '获取商家列表失败');
          }
        },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { allData, initData, actionType } = nextProps;

    // 编辑页面
    if (actionType === 'edit') {
      if (!this.props.initData.merchants && initData.merchants) {
        ajax({
          url: '/goods/discountpromo/getRetailers.json',
          method: 'GET',
          type: 'json',
          success: (res) => {
            if (res && res.retailers) {
              const { merchants } = initData;
              const { confirmedMerchants, unConfirmedMerchants } = allData;
              const confirmedIds = confirmedMerchants.map(item => item.cardNo);
              const unConfirmedIds = unConfirmedMerchants.map(item => item.cardNo);

              const treeData = res.retailers.map(({ cardNo, name }) => {
                let text = '';
                if (confirmedIds.indexOf(cardNo) !== -1) {
                  text = '(已确认)';
                }
                if (unConfirmedIds.indexOf(cardNo) !== -1) {
                  text = '(未确认)';
                }
                return {
                  name: name + text,
                  symbol: cardNo,
                };
              });
              this.setState({
                treeData,
                checkedSymbols: merchants || [],
              });
            } else {
              message.error(res.resultMsg || '获取商家列表失败');
            }
          },
        });
      }
    }
  }

  setMerchantValue(symbols) {
    this.setState({
      checkedSymbols: symbols,
      visible: false,
    });

    this.props.form.setFieldsValue({
      'merchants': symbols,
    });
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { layout, allData, initData, actionType } = this.props;
    const { treeData, checkedSymbols, visible } = this.state;
    const treeProps = {
      defaultTreeData: treeData,
      defaultCheckedSymbols: checkedSymbols,
      visible,
      modalProps: {
        title: '配置商家',
        onOk: symbols => this.setMerchantValue(symbols),
        onCancel: () => this.setState({ visible: false }),
      },
    };

    let label = '';

    if (actionType === 'create') {
      label = checkedSymbols.length ? `已选${checkedSymbols.length}家` : '';
    } else if (actionType === 'edit') {
      label = checkedSymbols.length ? `已选${checkedSymbols.length}家, 已确认${allData.confirmedMerchants && allData.confirmedMerchants.length}家` : '';
    }

    return (
      <FormItem
        {...layout}
        required
        label="参与商家："
        help={getFieldError('merchants')}
        validateStatus={
        classnames({
          error: !!getFieldError('merchants'),
        })}>
        <span style={{ marginRight: 5 }}>{label}</span>
        <a href="#" onClick={e => {
          e.preventDefault();
          this.setState({ visible: true });
        }}>{checkedSymbols.length ? '新增商家' : '配置商家'}</a>
        {treeData.length > 0 && <TreeModal { ...treeProps } />}
        <Input type="hidden" {...getFieldProps('merchants', {
          rules: [
            { required: true, type: 'array', message: '请选择商家' },
          ],
          initialValue: initData.merchants || [],
        })} />
      </FormItem>
    );
  }
}

export default SelectBusiness;
