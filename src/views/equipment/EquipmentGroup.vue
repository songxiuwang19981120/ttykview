<template>
    <div>
        <div style="background-color:white; margin-bottom:10px; padding:10px">
            <el-button type="primary" @click="dialogVisible = true"><i class="el-icon-plus"></i>添加分组</el-button>
        </div>



        <el-dialog title="添加分组" :visible.sync="dialogVisible" width="40%" :before-close="addhandleClose">
            <el-form ref="form" :rules="addRules" :model="addform" label-width="140px">
                <el-form-item label="分组名称:" prop="grouping_name">
                    <el-input v-model="addform.grouping_name" placeholder="请输入分组名称" style="width:60%"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addhandleClose">取 消</el-button>
                <el-button type="primary" :loading="submitting" @click="addSubmitForm">{{ submitting ? '提交中 ...' : '确 定'
                }}</el-button>
            </span>
        </el-dialog>



        <el-dialog title="编辑分组名称" :visible.sync="exitDialogVisible" width="40%" :before-close="exithandleClose">
            <el-form ref="form" :rules="exitRules" :model="exitform" label-width="140px">
                <el-form-item label="分组名称:" prop="grouping_name">
                    <el-input v-model="exitform.grouping_name" placeholder="请输入分组名称" style="width:60%"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="exithandleClose">取 消</el-button>
                <el-button type="primary" :loading="submitting" @click="exitSubmitForm">{{ submitting ? '提交中 ...' : '确 定'
                }}</el-button>
            </span>
        </el-dialog>



        <table-custom style="width:100%" :tableData="tableData" :columns="columns"></table-custom>
        <pagination :total="total" :page="current_page" :size="current_limit" @pagination="handlePagination">
        </pagination>
    </div>
</template>
<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import pagination from '@/components/myComponent/table/pagination.vue';
export default {
    name: 'EquipmentGroup',
    components: {
        tableCustom,
        pagination,
    },
    data() {
        return {
            submitting:false,
            exitDialogVisible:false,
            addform:{
                grouping_name:''
            },
            exitform:{
                grouping_name:'',
                grouping_id:'',
            },
            dialogVisible: false,
            tableData: [],//表格数据
            columns: [
                {
                    prop: 'grouping_name',
                    label: '分组名称',
                    fiexd: true,
                    align: 'center',
                    // render: (h, { row }) => {
                    //     return (
                    //         <div>
                    //             <el-button type="primary" plain size="mini">{row.grouping_name}</el-button>
                    //         </div>
                    //     );
                    // },
                },
                {
                    prop: 'add_time',
                    label: '时间',
                    fiexd: true,
                    align: 'center',
                },
                {
                    prop: 'ch',
                    label: '操作',
                    fiexd: true,
                    align: 'center',
                    render: (h, { row }) => {
                        return (
                            <div>
                                <span style="color:#409EFF;cursor:pointer;margin-right:20px;margin-left:20px" onClick={this.examine.bind(this, row)}>编辑</span>
                                <el-popconfirm
                                    confirm-button-text='删除'
                                    cancel-button-text='取消'
                                    title="确认确认删除此分组？"
                                    onConfirm={this.deleteData.bind(this, row)}
                                >
                                    <el-button slot="reference" type="danger" size="mini">删除</el-button>
                                </el-popconfirm>

                            </div>
                        );
                    },
                },


            ],  //表格
            total: 0,  //数据总量
            current_page: 1, //当前页
            current_limit: 10, //每页条数
            addRules:{
                grouping_name:[{ required: true, message: '请输入分组名称', trigger: 'blur' }],
            },
            exitRules:{
                grouping_name:[{ required: true, message: '请输入分组名称', trigger: 'blur' }],
            },

        };
    },

    mounted() {
        this.getGrouping()
    },

    methods: {
        //新增
        async addSubmitForm(){
            try {
                let result = await this.$api({
                    type: "addGrouping",
                    data: {
                        grouping_name:this.addform.grouping_name
                    }
                });
                if (result.status == 200) {
                   this.getGrouping()
                   this.dialogVisible=false
                   this.addform.grouping_name=''
                   
                } else {
                    this.$message.error({ message: result.msg })
                }
            } catch (error) {
            }
      
        },
        //编辑        
        async exitSubmitForm(){
            try {
                let result = await this.$api({
                    type: "updateGrouping",
                    data: {
                        grouping_id:this.exitform.grouping_id,
                        grouping_name:this.exitform.grouping_name
                    }
                });
                if (result.status == 200) {
                   this.getGrouping()
                   this.exitDialogVisible=false
               
                } else {
                    this.$message.error({ message: result.msg })
                }
            } catch (error) {
            }
        },
        addhandleClose(){
            this.dialogVisible=false
            this.addform.grouping_name=''
        },
        exithandleClose(){
            this.exitDialogVisible=false
            this.exitform.input=''
        },
        //index
        async getGrouping() {
           
            try {
                this.submitting=true;
                let result = await this.$api({
                    type: "getGrouping",
                    data: {
                        limit: this.current_limit,
                        page: this.current_page
                    }
                });
                if (result.status == 200) {
                  
                    this.total = result.data.count
                    this.tableData = result.data.list;
                    this.submitting=false;
                } else {
                    this.$message.error({ message: result.msg })
                }
            } catch (error) {
            }
        },
        //编辑
        examine(row) {
            this.exitDialogVisible = true;
            this.exitform = JSON.parse(JSON.stringify(row));
        },
        //删除
        async deleteData(row) {
            console.log(row)
            try {
                let result = await this.$api({
                    type: "deletaGrouping",
                    data: {
                        grouping_ids:row.grouping_id
                    }
                });
                if (result.status == 200) {
                    this.getGrouping()
                } else {
                    this.$message.error({ message: result.msg })
                }
            } catch (error) {
            }
        },
        /**
              * 翻页回调
              */
        handlePagination(val) {
            this.current_page = val.page;  //页数
            this.current_limit = val.limit  //条数
        },
    },
};
</script>

<style lang="stylus" scoped>

</style>