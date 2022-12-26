<template>
    <div>
        <div class="tt-accsituation">
            <div class="tt-accsituation--operation ">
                <span>任务状态：</span>
                <el-select v-model="CreationState" placeholder="请选择" >
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

                <span style="margin-left:20px">任务时间：</span>
                <el-date-picker
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
            <table-custom :stripe="stripe" :loading="loading" :tableData="tableData" :columns="columns"></table-custom>
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
            dialogCreation:false,//弹窗
            tableData:[
                {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9},
                {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9},
                {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9},
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
                                <el-button style="margin-right:10px" size="mini"  type="primary" plain onClick={this.dialogCreationbtn.bind(this, row)} >查看详情</el-button>
                                <el-button style="margin-right:10px" size="mini" type="danger" onClick={this.deleteCreation.bind(this, row)}  >删除</el-button>
                                <el-button style="margin-right:10px" size="mini" type="warning" plain onClick={this.pauseCreation.bind(this, row)}>暂停</el-button>
                            </div>
                        );
                    },
                },

            ]
        };
    },

    mounted() {
        
    },

    methods: {
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
        },
        //删除
        deleteCreation(row){
            console.log(row,"删除")
        },
        //暂停
        pauseCreation(row){
            console.log(row,"暂停");
        },
        //查看详情
        dialogCreationbtn(row){
            this.dialogCreation=true
            console.log(row,"查看详情")
        }
    },
};
</script>

<style lang="scss" scoped>
@import '@/assets/base/base.scss';
.tt-accsituation {

    min-height: 70px;
    border-radius: 10px;
    margin-bottom: 10px;
}

.tt-accsituation--operation {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px;
}
.videosize {
    width: 100px;
    height: 30px;
   
}
.seachbut {
	background-color: $button-back-color;
    border-color: $button-bord-color;
}
</style>