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
        <div class="center">
            <el-button type="primary">Submit</el-button>
            <p>Accept The Licent <a href="">《购物条款》</a></p>
        </div>
    </div>
</template>

<script>
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
</style>
