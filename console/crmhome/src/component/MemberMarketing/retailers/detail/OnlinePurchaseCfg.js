import { blockInvalidLetter } from '../../../OneClickMove/common/commonValidate';
import React from 'react';
export default [
  {
    key: 'VerifyFrequency',
    component: 'Input',
    field: 'verifyFrequency',
    label: '商品类型',
    required: true,
    rules: [],
  },
  {
    key: 'PromoItemName',
    component: 'Input',
    field: 'title',
    label: '商品名称',
    extra: '请勿输入"储值卡,会员卡,vip卡,充值卡,打折卡,年卡,美容卡,健身卡"等敏感词',
    secondCardExtra: '输入格式：数量＋商品名称。如：30份吮指鸡块',
    placeholder: '请输入商品名称，限1-60个字',
    required: true,
    rules: [{
      max: 60, message: '最多 60 个字符',
    }, {
      pattern: /^(?!.*(储值卡|会员卡|vip卡|充值卡|打折卡|年卡|美容卡|健身卡))/,
      message: '请勿输入敏感词',
    }, blockInvalidLetter],
  },
  {
    key: 'InputShare',
    component: 'InputShare',
    field: 'verifyEnableTimes',
    label: '商品包含',
    required: true,
    max: 50,
    placeholder: '2~50',
    extra: '顾客购买商品,等于一次性购买设置好的份数,且可分多次核销,每次核销至少1份。',
    rules: [],
  },
  {
    key: 'ReduceToPrice',
    component: 'ReduceTo',
    isShow: true,
    field: {
      origin: 'originPrice',
      changed: 'price',
    },
    label: '商品价格',
    // extra: '优惠价即为用户需付款金额，例：原价10元，优惠价2元，用户仅需付2元',
    required: true,
    // discountRate: 0.95, // 限制折扣率
    rules: {
      origin: [{
        required: true,
        message: '请填写原价',
      }],
      changed: [{
        required: true,
        message: '请填写优惠价',
      }],
    },
  },
  {
    key: 'SelectShopsAsync',
    component: 'SelectShopsAsync',
    field: 'shopIds',
    required: true,
    rules: [{
      required: true, message: '请选择适用门店',
      type: 'array',
    }],
    canReduce: true,
    needCheckShop: true,
  },
  {
    key: 'GoodsFirstImage',
    component: 'GoodsFirstImageV2',
    field: `firstImage`,
    label: '商品首图',
    extra: (
      <span>
        必须上传1张4:3商品封面首图，两张商品首图请务必保持内容一致
        <br />
        1:1图片将在<span style={{ color: '#ff9900' }}>淘抢购、聚划算、大牌快抢</span>等频道展示（入淘商品必须上传此项）
        <br />
        图片大小不超过5M，图片格式：bmp，png，jpeg，gif。
        <br />
        建议尺寸：2000*1500px以上。
      </span>
    ),
    required: true,
  },
  {
    key: '商品图片',
    field: 'itemDetailImages',
  },
  {
    key: 'CommodityDetail',
    component: 'CommodityDetail',
    field: 'commodityDetail',
    tabPanes: [{
      name: '商品内容',
      config: {
        field: 'contents',
        fieldOuter: 'commodityDetail',
        key: 'CommodityContent',
        component: 'CommodityContent',
        label: '商品内容',
        required: true,
        wrapperCol: { span: 21 },
        labelCol: { span: 3 },
        maxRow: 500,
        maxCol: 500,
        maxColTotal: 500,
        rules: [],
        extra: '标题、商品名称40字以内，一共可新增500条',
        supplementary: {
          key: 'supplementary',
          component: 'AddableInput',
          field: 'remarks',
          label: '补充说明',
          extra: '最多可新增10条，每条50字以内',
          placeholder: '',
          wrapperCol: { span: 21 },
          labelCol: { span: 3 },
          maxRow: 10,
          rules: [{
            max: 50, message: '每条50字以内',
          }],
          inputCol: 22,
          btnCol: 2,
        },
        title: {
          name: '标题',
          key: 'title',
          field: 'title',
          required: true,
          rules: [{ required: true, type: 'string', message: '请填写商品标题' }, {
            max: 15, message: '15个字以内',
          }],
          placeholder: '请输入标题，15个字以内',
        },
        group: {
          name: '',
          key: 'itemUnits',
          field: 'itemUnits',
          rules: [{
            validator: (rule, value, callback) => {
              if (value.length > 50) {
                callback('每组最多添加50条商品信息');
                return;
              }
              callback();
            },
          }],
          placeholder: '',
        },
        col1: {
          name: '商品名称',
          key: 'name',
          field: 'name',
          required: true,
          placeholder: '例：辣子鸡丁，限40字',
          rules: [{ required: true, type: 'string', message: '请填写名称' }, {
            max: 40, message: '名称限40字',
          }],
        },
        col2: {
          name: '单价（元）',
          key: 'price',
          field: 'price',
          rules: [{ required: true, type: 'string', message: '请填写单价' }, (r, v, cb) => {
            if (v === '' || v === null || v === undefined) return cb();
            if (isNaN(v)) {
              return cb('请填写数字');
            }
            cb();
          }],
          placeholder: '18',
        },
        col3: {
          name: '数量',
          key: 'amount',
          field: 'amount',
          rules: [{ required: true, message: '请填写数量' }, (r, v, cb) => {
            if (v === '' || v === null || v === undefined) return cb();
            if (isNaN(v)) {
              return cb('请填写数字');
            }
            if (parseInt(v, 10).toString() !== v.toString()) {
              return cb('请输入整数');
            }
            cb();
          }],
          placeholder: '1',
        },
        col4: {
          name: '单位',
          key: 'unit',
          field: 'unit',
          rules: [{ required: true, type: 'string', message: '请填写单位' }],
          placeholder: '份',
        },
        col5: {
          name: '规格（选填）',
          key: 'spec',
          field: 'spec',
          rules: [],
          placeholder: '大份',
        },
      },
      namedConfig: [{
        field: 'contents',
        rules: [],
        key: 'contents',
      }, {
        field: 'remarks',
        key: 'remarks',
        rules: [{
          max: 50, message: '每条50个字以内',
        }],
      },
      ],
    },
    {
      name: '详情图片',
      config: {
        field: 'dishes',
        fieldOuter: 'commodityDetail',
        key: 'Dishes',
        component: 'Dishes',
        label: '菜品图片',
        labelCol: { span: 3 },
        wrapperCol: { span: 19 },
        required: true,
        rules: [
          {
            validator: (rule, value, callback) => {
              if (value && value.length > 10) {
                callback('最多可添加10组图片');
                return;
              }
              callback();
            },
          }],
        title: {
          placeholder: '标题，限40字',
          required: true,
          field: 'title',
          label: '',
          key: 'dishtitle',
          rules: [{ required: true, type: 'string', message: '请填写菜品图片标题' },
          {
            max: 40, message: '限40字',
          }, blockInvalidLetter],
        },
        desc: {
          placeholder: '选填，描述内容，限50个字',
          required: false,
          field: 'desc',
          key: 'desc',
          label: '',
          rules: [{
            max: 50, message: '限50个字',
          }, blockInvalidLetter],
        },
        images: {
          key: 'dishImage',
          field: 'imageUrls',
          label: '',
          extra: '',
          max: 3,
          placeholder: '',
          required: false,
          rules: [{ required: true, type: 'array', message: '请上传菜品图片' },
          {
            validator: (rule, value, callback) => {
              if (value && value.length > 3) {
                callback(new Error('最多可添加3张图片'));
                return;
              }
              callback();
            },
          }],
        },
      },
    },
    {
      name: '商家介绍',
      config: {
        field: 'introductions',
        key: 'BusinessIntroduction',
        label: '商家介绍',
        component: 'BusinessIntroduction',
        rules: [],
        extra: '最多可添加10张图片<br/>图片尺寸2000x1500px，支持jpg、png、gif格式',
        introductionText: {
          key: 'introductionText',
          component: 'Input',
          field: 'introductionText',
          label: '',
          placeholder: '选填，限500字',
          required: false,
          rules: [{
            max: 500, message: '限500字',
          }, blockInvalidLetter],
        },
        introductionImage: {
          label: '',
          selected: [],
          field: 'introductionImage',
          key: 'introductionImage',
          placeholder: '',
          max: 10,
          rules: [{
            validator: (rule, value, callback) => {
              if (value && value.length > 10) {
                callback(new Error('最多可添加10张图片'));
                return;
              }
              callback();
            },
          }],
        },
      },
      namedConfig: [{
        field: 'introductionText',
        rules: [{
          max: 500, message: '限500字',
        }],
        key: 'introductionText',
      }, {
        field: 'introductionImage',
        key: 'introductionImage',
        rules: [{
          validator: (rule, value, callback) => {
            if (value && value.length > 10) {
              callback(new Error('最多可添加10张图片'));
              return;
            }
            callback();
          },
        }],
      }],
    }],
  },
  {
    key: '所属类目',
    component: 'CateringCategory',
    field: 'categoryPath',
    required: true,
  },
];

