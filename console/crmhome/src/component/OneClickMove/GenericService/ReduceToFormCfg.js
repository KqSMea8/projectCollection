import { blockInvalidLetter } from '../common/commonValidate';
import React from 'react';

export default [
  {
    key: 'PromoItemName',
    component: 'Input',
    field: 'subject',
    label: '商品名称',
    extra: '请勿输入"储值卡,会员卡,vip卡,充值卡,打折卡,年卡,美容卡,健身卡"等敏感词',
    placeholder: '请输入商品名称，限1-40个字',
    required: true,
    rules: [{
      required: true, message: '请填写商品名称',
    }, {
      max: 40, message: '最多 40 个字符',
    }, blockInvalidLetter],
  },
  {
    key: 'TypeSelect',
    component: 'TypeSelect',
    field: 'categoryId',
    rules: [{
      required: true, message: '请选择所属类目',
    }],
  },
  {
    key: 'ReduceToPrice',
    component: 'ReduceTo',
    field: {
      origin: 'oriPrice',
      changed: 'price',
    },
    label: '商品价格',
    // extra: '优惠价即为用户需付款金额，例：原价10元，优惠价2元，用户仅需付2元',
    required: true,
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
  }, {
    key: 'SelectShops',
    component: 'SelectShops',
    field: 'saleShopIds',
    label: '适用门店',
    required: true,
    className: 'one-click-move',
    rules: [{
      required: true, message: '请选择适用门店',
      type: 'array',
    }],
  },
  {
    key: 'firstImage',
    component: 'UpGoodsImage',
    field: 'coverImageId',
    label: '商品首图',
    extra: [<span style={{ display: 'inline-block', marginTop: 22 }}>图片大小：不超过2M；格式：bmp, png, jpeg, jpg, gif ； </span>, '建议尺寸：2000*1500px以上'],
    required: true,
    fileExt: ['image/bmp', 'image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
    rules: [
      { required: true, type: 'array', message: '请上传商品首图' },
    ],
    max: 1,
    uploadOption: {
      maxSize: 2048, // 上传文件最大尺寸,单位为KB
      currentViews: [
        {
          desc: '商家详情页－商品券入口－商品预览图',
          width: 200,
          height: 150,
        },
        {
          desc: '商品详情页－商品预览图',
          width: 240,
          height: 135,
        },
      ], // 裁剪框右侧的预览框的大小及描述
      rate: 4 / 3, // 裁剪的虚线框的宽/高比
      initWidth: 0.8,
      requiredSize: {width: 2000, height: 1500},// 要求的最小尺寸
    },
  },
  {
    key: 'goodsImage',
    component: 'UpGoodsImage',
    field: 'detailImageIds',
    label: '商品图片',
    extra: ['图片大小：不超过2M；格式：bmp, png, jpeg, jpg, gif ；', '建议尺寸：2000*1500px以上，最多可上传5张'],
    required: false,
    fileExt: ['image/bmp', 'image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
    max: 5,
    uploadOption: {
      maxSize: 2048, // 上传文件最大尺寸,单位为KB
      currentViews: [
        {
          desc: '商家详情页－商品券入口－商品预览图',
          width: 200,
          height: 150,
        },
        {
          desc: '商品详情页－商品预览图',
          width: 240,
          height: 135,
        },
      ], // 裁剪框右侧的预览框的大小及描述
      rate: 4 / 3, // 裁剪的虚线框的宽/高比
      initWidth: 0.8,
      requiredSize: {width: 2000, height: 1500},
    },
  },
  {
    key: 'SendAmountLimited',
    component: 'InputTotal',
    field: 'inventory',
    label: '发放总量',
    required: true,
    placeholder: '请填写发放总量',
    extra: '可输入大于0，小于100000000的整数',
    rules: [{
      required: true,
      type: 'number',
      message: '请填写发放总量',
    }, {
      validator: (rule, value, callback) => {
        if ( value <= 0 ) {
          callback('发放总量必须大于0');
          return;
        }
        callback();
      },
    }],
  },
  {
    key: 'ValidDate',
    component: 'ValidDate',
    field: 'validDays',
    label: '有效期',
    required: true,
    extra: '可输入7 - 360天范围内的整数',
    rules: [{
      required: true, message: '请填写有效期',
    }, { validator: (rule, value, callback) => {
      if (value < 7 || value > 360) {
        callback('有效期范围为7-360天');
        return;
      }
      callback();
    }}],
  },
];
