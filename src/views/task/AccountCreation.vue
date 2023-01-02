<template>
    <div>
        <div class="tt-accsituation">
            <div class="tt-accsituation--operation ">
                <span>任务状态：</span>
                <el-select @change="CreationState_select($event)" v-model="CreationState" placeholder="请选择" >
                    <el-option
                    v-for="item in optionsCreationState"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                    </el-option>
                </el-select>

                <span style="margin-left:20px">上传话题：</span>
                <el-select v-model="Topic" placeholder="请选择">
                    <el-option
                    v-for="item in optionsTopic"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>

                <el-date-picker
                style="margin-left:20px"
                v-model="CreationDate"
                type="daterange"
                range-separator="——"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="timestamp"
                @change="consleDate">
                </el-date-picker>

                <el-button  type="primary"  class="seachbut" :loading="btnloading" @click="searchTasks" style="margin-right: 20px;margin-left: 30px">{{
							btnloading ? '加载中...' : '查看'
					}}</el-button>
					<el-button type="primary" class="seachbut" @click="btnReset"><i class="el-icon-refresh-right"></i>重置</el-button>
            </div>
           
        </div>
        <table-custom :stripe="stripe" :loading="loading" :tableData="tableData" :columns="columns"></table-custom>
        <el-dialog title="创建账号详情" :visible.sync="dialogCreation">
            <table-custom :stripe="stripe" :loading="loading" :tableData="dialogTableData" :columns="dialogColumns"></table-custom>
        </el-dialog>
    </div>
</template>

<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
export default {
    name: 'AccountCreation',
    components: {
		tableCustom,
	},
    data() {
        return {
            stripe:true,//斑马线
            //任务状态
            optionsCreationState: [
                {
                    value: '1',
                    label: '已完成'
                },
                {
                    value: '2',
                    label: '未完成'
                },
                {
                    value: '3',
                    label: '异常'
                },
                {
                    value: '4',
                    label: '全部'
                },],
            CreationState:"",
            CreationState_select_obj:{},//选中的任务状态数据

            //上传话题
            optionsTopic:[
                {
                    value:"1",
                    label:"话题"
                },
                {
                    value:"2",
                    label:"找话题"
                }
            ],
            Topic:"",
         
            CreationDate:'',   //日期范围
            btnloading:false, //按钮loading
            loading:false,
            tableData:[
                {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,suspend:0,},
                {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,suspend:0,},
                {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,suspend:1,},
            ],
            columns:[
            {
                prop: 'a',
                label: '所在分组',
                minWidth:150,
                align: 'center',
            },
            {
                prop: 'b',
                label: '设备数量',
                minWidth:100,
                align: 'center',
            },
            {
                prop: 'c',
                label: '任务创建时间',
                minWidth:150,
                align: 'center',
            },
            {
                prop: 'd',
                label: '创建账号类型',
                minWidth:150,
                align: 'center',
            },
            {
                prop: 'e',
                label: '任务状态',
                minWidth:150,
                align: 'center',
            },
            {
                prop: 'f',
                label: '目标创建数量',
                minWidth:150,
                align: 'center',
            },
            {
                prop: 'g',
                label: '已创建数量',
                minWidth:150,
                align: 'center',
            },
            {
                prop: 'h',
                label: '任务结束时间',
                minWidth:150,
                align: 'center',
            },
            {
                    prop: 'i',
                    label: '操作',
                    minWidth: 300,
                    align: 'center',
                    fiexd: true,
                    fixed: 'right',
                    render: (h, { row }) => {
                        return (
                            <div>
                                <el-button style="margin-right:10px" size="mini" onClick={this.dialogCreationbtn.bind(this, row)} >查看详情</el-button>
                                <el-popconfirm
                                    confirm-button-text='删除'
                                    cancel-button-text='取消'
                                    title="确认清除此设备中异常账号？"
                                    onConfirm={this.deleteCreation.bind(this, row)}
                                    >
                                    <el-button slot="reference" style="margin-right:10px" size="mini" type="danger">删除异常账号</el-button>
                                    </el-popconfirm>
                                <el-button style="margin-right:10px" size="mini" type="warning" plain onClick={this.pauseCreation.bind(this, row)}>{row.suspend ? '暂停' : '继续'}</el-button>
                            </div>
                        );
                    },
                },

            ],
            dialogCreation:false,//弹窗
            dialogTableData:[
                {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9},
                {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9},
                {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9},
            ],
            dialogColumns:[
            {
                prop: 'a',
                label: '设备编号',
                minWidth:100,
                align: 'center',
            },
            {
                prop: 'b',
                label: '目标创建数量',
                minWidth:150,
                align: 'center',
            },
            {
                prop: 'c',
                label: '已创建数量',
                minWidth:100,
                align: 'center',
            },
            {
                prop: 'd',
                label: '任务状态',
                minWidth:100,
                align: 'center',
            },
            {
                prop: 'e',
                label: '终止原因',
                minWidth:150,
                align: 'center',
            },
            {
                    prop: 'f',
                    label: '操作',
                    minWidth: 200,
                    align: 'center',
                    fiexd: true,
                    fixed: 'right',
                    render: (h, { row }) => {
                        return (
                            <div>
                                <el-button style="margin-right:10px" size="mini" onClick={this.New_dialogCreationbtn.bind(this, row)} >重新创建</el-button>
                                <el-popconfirm
                                    confirm-button-text='删除'
                                    cancel-button-text='取消'
                                    title="确认清除此设备中异常账号？"
                                    onConfirm={this.delete_CreationDialog.bind(this, row)}
                                    >
                                    <el-button slot="reference" style="margin-right:10px" size="mini" type="danger">删除异常账号</el-button>
                                    </el-popconfirm>
                               
                            </div>
                        );
                    },
                },

            ],
        };
    },

    mounted() {
        
    },

    methods: {
        //任务状态
        CreationState_select(value){
            //选中的数据
            let  CreationState_select_obj= {};
            //使用find()方法在下拉数据中根据value绑定的数据查找对象。
            CreationState_select_obj = this.optionsCreationState.find(function(item){
		    return item.value === value;
		    })
		console.log(CreationState_select_obj);
    },
        //时间选择
        consleDate(){
            console.log(this.CreationDate,"返回开始和结束时间戳")
        },
        //查看
        searchTasks(){
            console.log("查看");
        },
        //重置
        btnReset(){
            console.log("重置");
            this.CreationState="";
            this.Topic="";
            this.CreationDate=""

        },
        //删除
        deleteCreation(row){
            console.log(row,"删除")
        },
        //暂停
        pauseCreation(row){
            console.log(row,"暂停/继续");
         
            if(row.suspend===0){
                row.suspend=1
            }else{
                row.suspend=0
            }
        },
        //查看详情
        dialogCreationbtn(row){
            this.dialogCreation=true
            console.log(row,"查看详情")
        },
        //重新创建
        New_dialogCreationbtn(row){
            console.log(row,"重新创建")
        },
        //删除
        delete_CreationDialog(row){
            console.log(row,"弹窗内删除");
        }
        
    },
};
</script>

<style lang="scss" scoped>

</style>