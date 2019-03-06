import React, {PropTypes} from 'react';
import {Form, Button, Input, Modal, message, TreeSelect, Checkbox} from 'antd';
import ajax from 'Utility/ajax';
import './create.less';
import UploadPictures from './UploadPictures';
import classnames from 'classnames';
import lodash from 'lodash';
// import { Link } from 'react-router';
const TreeNode = TreeSelect.TreeNode;

const FormItem = Form.Item;
const LeavePage = () => {
  return '确定离开页面吗？';
};

/*
 品牌管理 > 超大牌
 */

class CreateSuperStar extends React.Component {

  static propTypes = {
    form: PropTypes.object,
    pid: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      visible: false,
      initData: [],
      cityList: [],
      CheckState: null,
      bannerChecked: false,
      orderChecked: false,
    };
  }

  componentDidMount() {
    window.onbeforeunload = LeavePage;
    this.getData();
    this.getCityUrl();
  }

  componentWillUnmount() {
    window.onbeforeunload = null;
  }

  getData = () => {
    const {pid} = this.props.params;
    if (pid) {
      ajax({
        url: '/manage/superbrand/findSuperBrandById.json',
        method: 'get',
        data: {
          id: this.props.params.pid
        },
        type: 'json',
        success: (res) => {
          if (res.status === 'succeed') {
            const data = res.data;
            this.setState({
              initData: data.data,
              bannerChecked: (data.data.bannerUrl || data.data.hyperLink) ? true : false,
              orderChecked: data.data.order ? true : false,
            });
          }
        },
        error: () => {
          this.setState({
            loading: false,
            data: [],
          });
        },
      });
    }
  }

  getCityUrl = () => {
    ajax({
      url: '/manage/superbrand/initCity.json?id=1',
      method: 'get',
      data: {},
      type: 'json',
      success: (res) => {
        this.setState({cityList: res.data});
      },
      error: () => {
      },
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!!err) {
        return;
      }
      const data = {...values};
      if (values.logo[0].url) {
        data.logo = values.logo[0].url;
      } else {
        data.logo = values.logo && values.logo[0].response.url;
      }
      if (values.brandImage[0].url) {
        data.brandImage = values.brandImage[0].url;
      } else {
        data.brandImage = values.brandImage[0] && values.brandImage[0].response.url;
      }
      if (values.bannerImage) {
        if (values.bannerImage[0] && values.bannerImage[0].url) {
          data.bannerImage = values.bannerImage[0].url;
        } else {
          data.bannerImage = values.bannerImage[0] && values.bannerImage[0].response.url;
        }
      }

      if (values.backgroundImage) {
        if (values.backgroundImage[0] && values.backgroundImage[0].url) {
          data.backgroundImage = values.backgroundImage[0].url;
        } else {
          data.backgroundImage = values.backgroundImage[0] && values.backgroundImage[0].response.url;
        }
      }
      data.cityIds = lodash.unionWith(values.cityIds, [], lodash.isEqual);
      // data.cityIds = [...new Set(values.cityIds)];
      data.order = this.state.orderChecked;

      for (const key in data) {
        if (data.hasOwnProperty(key) && !data[key]) {
          delete data[key];
        }
      }

      let url = '/manage/superbrand/addSuperBrand.json';
      if (this.props.params.pid) {
        const {initData} = this.state;
        url = '/manage/superbrand/updateSuperBrand.json';
        data.id = initData.id;
      }

      if (!values.hyperlink && values.bannerImage) {
        const pid = this.props.params.pid;
        Modal.confirm({
          title: '营销配置，确定仅投放banner图片？',
          okText: '仅投图片',
          cancelText: '取消',
          onOk() {
            ajax({
              url: url,
              method: 'post',
              type: 'json',
              data: data,
              success: (res) => {
                if (res.status === 'succeed') {
                  if (pid) {
                    message.success('修改成功');
                  } else {
                    message.success('添加成功');
                  }
                  window.location.hash = '#/superstar';
                } else {
                  message.error('修改失败');
                }
              },
            });
          },
          onCancel() {
          },
        });
      } else {
        ajax({
          url: url,
          method: 'post',
          type: 'json',
          data: data,
          success: (res) => {
            if (res.status === 'succeed') {
              if (this.props.params.pid) {
                message.success('修改成功');
              } else {
                message.success('添加成功');
              }
              window.location.hash = '#/superstar';
            } else {
              if (this.props.params.pid) {
                message.error('修改失败');
              } else {
                message.error('添加失败');
              }
            }
          },
        });
      }
    });
  }

  checkPID = (value) => {
    ajax({
      url: '/manage/superbrand/pageQuerySuperBrandByCondition.json',
      method: 'get',
      data: {
        partnerID: value,
        pageNum: 1,
        pageSize: 10,
      },
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          const data = res.data.data.superBrandList;
          if (data.length > 0) {
            this.setState({CheckState: 'error'});
          } else {
            this.setState({CheckState: 'success'});
          }
        }
      },
    });
  }

  hyperlink = (rule, value, callback) => {
    if (value) {
      const reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\\/])+$/;
      if (!reg.test(value)) {
        callback([new Error('请输入正确的url')]);
      } else {
        callback();
      }
    }
    callback();
  }

  bannerChecked = (e) => {
    this.setState({bannerChecked: e.target.checked});
  }

  orderChecked = (e) => {
    this.setState({orderChecked: e.target.checked});
  }
  render() {
    const {getFieldProps, getFieldError} = this.props.form;
    const {initData, CheckState, cityList, bannerChecked, orderChecked} = this.state;
    const {pid} = this.props.params;
    const layout = {
      labelCol: {span: 6},
      wrapperCol: {span: 16, offset: 1},
    };

    const cityOption = cityList.map((item, key) => {
      return (
        <TreeNode value={item.value} title={item.label} key={`select${key}`}>
          {item.children.length > 0 && item.children.map((j) => (
            <TreeNode value={j.value} title={j.label} key={j.value}/>
          ))}
        </TreeNode>
      );
    });
    const brandCoverPicProps = {
      throwCoverImgList: initData && initData.brandImage ? [{url: initData && initData.brandImage}] : [],
      label: '品牌头图',
      introduce: '将用于展示在品牌详情页头部。',
      FileId: 'brandImage',
      throwCoverProps: {
        action: window.APP.crmhomeUrl + '/shop/koubei/imageUpload4Pc.json',
        maxPicW: 1080,
        maxPicH: 1080,
        minPicW: 540,
        minPicH: 540,
        initWidth: 0.5,
        rate: 1 / 1,
      },
      size: ['750', '350'],
    };

    const logoCoverPicProps = {
      throwCoverImgList: initData && initData.logoUrl ? [{url: initData && initData.logoUrl}] : [],
      label: '品牌logo',
      introduce: '',
      FileId: 'logo',
      throwCoverProps: {
        action: window.APP.crmhomeUrl + '/shop/koubei/imageUpload4Pc.json',
        maxPicW: 1080,
        maxPicH: 1080,
        minPicW: 540,
        minPicH: 540,
        initWidth: 0.5,
        rate: 1 / 1,
      },
      size: ['120', '120'],
    };

    const bannerCoverPicProps = {
      throwCoverImgList: initData && initData.bannerUrl ? [{url: initData && initData.bannerUrl}] : [],
      label: 'banner图片',
      introduce: '将用于品牌详情页内的运营banner图片展示。',
      FileId: 'bannerImage',
      throwCoverProps: {
        action: window.APP.crmhomeUrl + '/shop/koubei/imageUpload4Pc.json',
        maxPicW: 1080,
        maxPicH: 1080,
        minPicW: 540,
        minPicH: 540,
        initWidth: 0.5,
        rate: 1 / 1,
      },
      size: ['1242', '290'],
    };

    const orderCoverPicProps = {
      throwCoverImgList: initData && initData.backgroundImage ? [{url: initData && initData.backgroundImage}] : [],
      label: '品牌图片',
      introduce: '将用于大牌点餐区域品牌图片展示。',
      FileId: 'backgroundImage',
      throwCoverProps: {
        action: window.APP.crmhomeUrl + '/shop/koubei/imageUpload4Pc.json',
        maxPicW: 1080,
        maxPicH: 1080,
        minPicW: 540,
        minPicH: 540,
        initWidth: 0.5,
        rate: 1 / 1,
      },
      size: ['130', '343'],
    };
    return (
      <div className="superstart-create">
        <div className="title">
          <p onClick={() => {window.location.hash = '/superstar';}} style={{width: 150}}><span>品牌管理</span> > 超大牌</p>
        </div>
        <div className="form-wrap">
          <Form horizontal>
            <div className="title-split">
              <p>基本信息</p>
            </div>
            <FormItem
              {...layout}
              help={getFieldError('name')}
              required
              validateStatus={
                classnames({
                  error: !!(getFieldError('name')),
                })
              }
              label="品牌名称：">
              <Input
                {...getFieldProps('name', {
                  rules: [
                    {required: true, message: '请输入品牌名称'},
                  ],
                  initialValue: initData && initData.name
                })}
                placeholder="请输入"
                style={{width: 350}}
              />
            </FormItem>
            <FormItem
              {...layout}
              help={getFieldError('brandId')}
              required
              validateStatus={
                classnames({
                  error: !!(getFieldError('brandId')),
                })
              }
              label="品牌ID：">
              <Input
                disabled={(initData && initData.brandId) ? !!this.props.params.pid : false}
                {...getFieldProps('brandId', {
                  rules: [
                    {required: true, message: '请输入品牌名称'},
                  ],
                  initialValue: initData && initData.brandId
                })}
                placeholder="请输入"
                style={{width: 350}}
              />
            </FormItem>
            <FormItem
              {...layout}
              help={getFieldError('partnerID')}
              required
              hasFeedback
              validateStatus={CheckState}
              label="商户PID：">
              <Input
                disabled={!!this.props.params.pid}
                {...getFieldProps('partnerID', {
                  rules: [
                    {required: true, message: '请输入商户PID'},
                  ],

                  initialValue: initData && initData.partnerId,
                  onChange: (e) => this.checkPID(e.target.value),
                })}
                placeholder="请输入"
                style={{width: 350}}
              />
            </FormItem>
            <FormItem
              help={getFieldError('cityIds')}
              required
              validateStatus={
                classnames({
                  error: !!(getFieldError('cityIds')),
                })
              }
              {...layout}
              label="覆盖城市：">
              <TreeSelect
                {...getFieldProps('cityIds', {
                  rules: [
                    {required: true, message: '请选择城市'},
                  ],
                  initialValue: initData && initData.cityList,
                })}
                style={{width: '100%'}}
                treeCheckable
                allowClear
                multiple
                treeNodeFilterProp="label"
                dropdownStyle={{
                  width: '100%',
                  maxHeight: 350,
                  maxWidth: 300,
                  overflow: 'auto',
                }}
              >
                {cityOption}
              </TreeSelect>

            </FormItem>

            <UploadPictures pid={pid} throwCoverPicProps={brandCoverPicProps} form={this.props.form}/>

            <UploadPictures pid={pid} throwCoverPicProps={logoCoverPicProps} form={this.props.form}/>

            <FormItem
              help={getFieldError('jumpUrl')}
              validateStatus={
                classnames({
                  error: !!(getFieldError('jumpUrl')),
                })
              }
              {...layout}
              label="品牌跳转链接">
              <Input
                {...getFieldProps('jumpUrl', {
                  initialValue: initData && initData.jumpUrl,
                })}
                placeholder="请输入品牌跳转链接"
                style={{width: 350}}
              />
            </FormItem>
            <div className="title-split">
              <p>营销配置</p>
            </div>
            <FormItem
              {...layout}
              label="">
              <Checkbox checked={this.state.bannerChecked} onChange={this.bannerChecked}>配置banner位</Checkbox>
            </FormItem>
            {bannerChecked && <div className="superStarBox">
              <UploadPictures required={'bannerUrl'} pid={pid} throwCoverPicProps={bannerCoverPicProps} form={this.props.form}/>
              <FormItem
                help={getFieldError('hyperlink')}
                validateStatus={
                  classnames({
                    error: !!(getFieldError('hyperlink')),
                  })
                }
                {...layout}
                label="跳转页面链接：">
                <Input
                  {...getFieldProps('hyperlink', {
                    initialValue: initData && initData.hyperLink,
                  })}
                  placeholder="请输入跳转页面URL"
                  style={{width: 350}}
                />
              </FormItem>
            </div>}

            <FormItem
              {...layout}
              label="">
              <Checkbox checked={this.state.orderChecked} onChange={this.orderChecked}>大牌点餐<span style={{color: '#999'}}>(配置后，门店开启点餐业务会展示该营销模块)</span></Checkbox>
            </FormItem>

            {orderChecked && <div className="superStarBox">
              <UploadPictures pid={pid} throwCoverPicProps={orderCoverPicProps} form={this.props.form}/>
              <FormItem
                help={getFieldError('benefit') || '最多不超过8字'}
                validateStatus={
                  classnames({
                    error: !!(getFieldError('benefit')),
                  })
                }
                {...layout}
                label="文案：">
                <Input
                  {...getFieldProps('benefit', {
                    initialValue: initData && initData.benefit,
                    rules: [
                      {required: true, message: '请输入文案'},
                      {required: true, max: 8, message: '最多不超过 8 字' },
                    ],
                  })}
                  placeholder="请输入文案"
                  style={{width: 350}}
                />
              </FormItem>
            </div>}

            <div className="title-split">
              <p>投放配置</p>
            </div>
            <FormItem
              {...layout}
              help={getFieldError('interestAbstract')}
              validateStatus={
                classnames({
                  error: !!(getFieldError('interestAbstract')),
                })
              }
              label="利益点摘要：">
              <Input
                {...getFieldProps('interestAbstract', {
                  initialValue: initData && initData.interestAbstract,
                })}
                placeholder="请输入利益点摘要"
                style={{width: 350}}
              />
            </FormItem>

            <div className="line-split"></div>

            <FormItem wrapperCol={{span: 16, offset: 7}} style={{marginTop: 24}}>
              <Button type="primary" htmlType="submit" onClick={this.handleSubmit} style={{marginRight: 10}}>提交</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(CreateSuperStar);
