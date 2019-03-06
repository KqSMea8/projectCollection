<template>
    <div class="payment">
        <div class="head">
            <img src="../../assets/images/logo-color.svg" alt="">
            <span class="href">Merchant Website：<a href="http://pay.ipaylinks.com/rtyuiopghjkl">http://pay.ipaylinks.com/rtyuiopghjkl</a></span>
        </div>
        <p class="info">Payment Information</p>
        <el-table
                class="tableData"
                :data="tableData"
                style="width: 100%"
                :default-sort="{prop: 'date', order: 'descending'}"
                empty-text=""
        >
            <el-table-column
                    prop="name"
                    label="Item"
                    sortable
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="specifications"
                    label="Model"
                    sortable
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="number"
                    label="Quantity"
                    sortable
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="price"
                    label="Unit Price"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="currency"
                    label="Currency"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="website"
                    label="URL"
                    align="center">
                <template slot-scope="scope">
                    <router-link to="/home/paymentChain/paymentChainDetail">{{scope.row.website}}</router-link>
                </template>
            </el-table-column>
        </el-table>
        <div class="commodityAmount">
            <span>Item Amount：</span>
            <span>1000.00 USD</span>
            <span>Fee：</span>
            <span>20 USD</span>
        </div>
        <div class="totalAmount">
            <span>Total Amount：</span>
            <span>1020.00 USD</span>
        </div>
        <!--表单提交-->
        <p class="info">Billing Information</p>
        <el-form :model="formInline" :rules="rules" ref="formInline" class="demo-form-inline" label-width="50%">
            <el-form-item label="Billing Name：" prop="name">
                <el-input v-model="formInline.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="Billing Country：" prop="country">
                <el-input v-model="formInline.country" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="Billing State：" prop="state">
                <el-input v-model="formInline.state" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="Billing City：" prop="city">
                <el-input v-model="formInline.city" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="Billing Address：" prop="address">
                <el-input v-model="formInline.address" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="Billing Postal Code：" prop="code">
                <el-input v-model="formInline.code" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="Billing Phone Number：" prop="phone">
                <el-input v-model="formInline.phone" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="Billing Email：" prop="email">
                <el-input v-model="formInline.email" placeholder="请输入"></el-input>
            </el-form-item>
        </el-form>

        <div class="center">
            <el-button type="primary" @click="submitForm('formInline',success,error)">Submit</el-button>
            <p>Accept The Licent <a href="">《购物条款》</a></p>
        </div>
    </div>
</template>

<script>
    import {submitForm, getSubmitJson,reset} from '../../assets/js/submitForm'

    export default {
        data() {
            return {
                tableData: [
                    {
                        name: "iphone6s",
                        specifications: "64G",
                        number: "300",
                        price: '31,000.00',
                        currency: "USD",
                        website: 'www.testsite.com/goo'
                    },
                    {
                        name: "iphone6s",
                        specifications: "64G",
                        number: "300",
                        price: '31,000.00',
                        currency: "USD",
                        website: 'www.testsite.com/goo'
                    },
                    {
                        name: "iphone6s",
                        specifications: "64G",
                        number: "300",
                        price: '31,000.00',
                        currency: "USD",
                        website: 'www.testsite.com/goo'
                    },
                ],
                formInline: {
                    name: '',
                    country: '',
                    state: '',
                    city: '',
                    address: '',
                    code: '',
                    phone: '',
                    email: '',
                },
                rules: {
                    name: [
                        {required: true, trigger: 'blur'}
                    ],
                    country: [
                        {required: true, trigger: 'blur'}
                    ],
                    state: [
                        {required: true, trigger: 'blur'}
                    ],
                    city: [
                        {required: true, trigger: 'blur'}
                    ],
                    address: [
                        {required: true, trigger: 'blur'}
                    ],
                    code: [
                        {required: true, trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, trigger: 'blur'}
                    ],
                    email: [
                        {required: true, trigger: 'blur'}
                    ],
                },
            }
        },
        methods: {
            submitForm,
            getSubmitJson,
            success(children) {
                let submitJson = this.getSubmitJson(children);
                console.log(submitJson);
                alert('验证通过')
            },
            error() {
                console.log('验证失败');
            }
        }
    }

</script>

<style>
    .payment {
        padding: 36px 32px 90px;
    }

    .payment .el-table th.is-leaf {
        background: rgba(24, 144, 255, 0.1);
        color: #000;
    }

    .commodityAmount, .totalAmount {
        width: 100%;
        height: 53px;
        line-height: 53px;
        border-bottom: 1px solid #ebeef5;
        padding: 0 67px;
    }

    .commodityAmount span:nth-child(3) {
        margin-left: 15%;
    }

    .totalAmount span:nth-child(2) {
        color: #FF6D33;
    }

    .payment .head {
        margin-bottom: 40px;
        height: 30px;
    }

    .payment .head img {
        width: 122px;
        float: left;
        margin-right: 44px;
    }

    .payment .head .href {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 30px;
    }

    .payment .head .href a {
        font-size: 14px;
        color: rgba(24, 144, 255, 1);
        line-height: 22px;
        text-decoration: none;
    }

    .payment .info {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 24px;
        margin-bottom: 30px;
        margin-top: 44px;
        font-weight: bolder;
    }

    .payment .center {
        text-align: center;
        margin-top: 57px;
    }

    .payment .center p {
        font-size: 14px;
        color: rgba(153, 153, 153, 1);
        line-height: 20px;
        margin-top: 17px;
    }

    .payment .center p a {
        color: #1890FF;
    }

    .payment .el-form-item {
        margin-right: 0;
        width: 49%;
        float: left;
    }

    .payment .el-form {
        width: 90%;
        overflow: hidden;
    }
</style>
