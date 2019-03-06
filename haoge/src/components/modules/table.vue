<template>
    <div>
        <el-table
            class="data-table"
            :data="dataList">
            <el-table-column v-for="(item, index) in data"
                v-if="item.prop !== 'operation'"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :key="index">
            </el-table-column>
            <el-table-column v-else
                :prop="item.prop"
                :label="item.label"
                :key="index"
                :width="item.width">
                <template slot-scope="scope">
                    <div class="operation" :key="index">
                      自定义内容
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageData.curPage"
            :page-sizes="pageSizes"
            :page-size="pageData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageData.totalRow">
        </el-pagination>
    </div>
</template>
<script>
export default {
    data () {
        return {

        }
    },
    props:['pageData','pageSizes','dataList','data'],
    methods:{
        handleSizeChange (pageSize) {
            console.log(pageSize)
        },
        handleCurrentChange (page) {
            console.log(page)
        }
    }
}
</script>
<style>

</style>
