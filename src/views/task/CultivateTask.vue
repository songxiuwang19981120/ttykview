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

                <el-button  type="primary"  class="seachbut" :loading="btnloading" @click="searchTasks" style="margin-left: 30px">{{
							btnloading ? '加载中...' : '查看'
					}}</el-button>
				<el-button type="primary" class="seachbut" @click="btnReset"><i class="el-icon-refresh-right"></i>重置</el-button>
				<el-button type="primary" class="seachbut" @click="dialogConfig">配置养号</el-button>
            </div>
        
        </div>
        <table-custom :stripe="stripe" :mutiSelect="true" @handleSelectionChange="selectionChange"  :loading="loading" :tableData="tableData" :columns="columns"></table-custom>


        <el-dialog title="配置养号" center width="30%" :visible.sync="dialogCultivate" :before-close="dialogCultivate_unbtn">
            
                <el-select v-model="cult_equipment" placeholder="请选择设备分组" size="mini"  style="margin:0 20px 0 40px" >
                    <el-option
                    v-for="item in options_equipment"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                    </el-option>
                </el-select>


                <el-select v-model="cult_classify" placeholder="请选择账号分类" size="mini" >
                    <el-option
                    v-for="item in options_classify"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                    </el-option>
                </el-select>
                <div class="size_color">当前已选择账号<span class="num_color">{{Task_num}}</span>个</div>

                <span style="margin-left:15px" >养号时间段:</span>
                <el-date-picker
                style="margin-left:12px"
                v-model="DialogCreationDate"
                type="daterange"
                range-separator="——"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="timestamp"
                @change="consleDate">
                </el-date-picker>

                <el-form :model="rule_act" :rules="rules_act" ref="rule_act" label-width="100px" style="margin-top:30px">
                    <el-form-item label="养号时长:" prop="name">
                        <el-input style="width: 35%;" v-model.number="rule_act.name"  placeholder="请输入养号天数"></el-input>
                        <el-button style="margin-left:45px" type="primary" class="seachbut_whi" @click="dialogCultivate_btnconfig" >点击配置养号参数</el-button>
                    </el-form-item>
               
                </el-form>

                <span slot="footer" >
                    <el-button  type="primary" plain @click="dialogCultivate_unbtn">取消</el-button>
                    <el-button style="margin-left:45px" type="primary" class="seachbut" @click="dialogCultivate_starbtn" >开始养号</el-button>
                </span>
                
        </el-dialog>



        <!-- 配置参数抽屉 -->
        <el-drawer
                size="40%"
                :visible.sync="drawer_task"
                direction="rtl"
                style="font-size:x-small"
                >
                <!-- :before-close="handleClose" -->
                <!-- 基础养号配置 -->
                <div>
                    <div class="drawer_title">基础养号配置</div>
                    <el-row type="flex">
                        <el-col :span="1"></el-col>
                    <el-col  :span="12">
                        <div ><i class="el-icon-star-off"></i>单号每日最长养号时间：<el-input v-model="day_time" style="width:60px;margin-right: 10px;" size="mini"></el-input>分钟</div>
                        <div class="all_margin_top"><i class="el-icon-star-off"></i>其他ID单视频播放时间：<el-input v-model="start_time" style="width:60px;margin-right: 5px;" size="mini"></el-input>——<el-input v-model="end_time" class="all_class_margin"  size="mini"></el-input>秒</div></el-col>
                    <el-col :span="1"></el-col>
                    <el-col :span="10">
                        <div><i class="el-icon-star-off"></i>其他ID随机关注后取关：<el-input v-model="id_att" style="width:60px;margin-right: 10px;" size="mini"></el-input>%</div>
                        <div class="all_margin_top"><i class="el-icon-star-off"></i>其他ID随机关注：<el-input  v-model="random_att" style="width:60px;margin-right: 10px;" size="mini"></el-input>%</div></el-col>
                    </el-row>
                    <el-divider></el-divider>
                </div>
                <div>
                    <div class="drawer_title">进阶垂直号配置</div>
                    <el-row type="flex">
                        <el-col :span="1"></el-col>
                    <el-col  :span="11">
                        <div >选择垂直方向:
                            <el-select v-model="vertical_direction" placeholder="垂直方向" size="mini">
                                <el-option
                                v-for="item in options_vertical_direction"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>

                        <div class="all_margin_top"><el-checkbox  v-model="sp.comment_pro"></el-checkbox>进入评论区比例<el-input v-model="sp_content.comment_pro" class="all_class_margin" size="mini"></el-input>%</div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.comment_like_pro"></el-checkbox>评论区点赞比例<el-input v-model="sp_content.comment_like_pro" class="all_class_margin" size="mini"></el-input>%</div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.comment_word_pro"></el-checkbox>评论区留言比例<el-input v-model="sp_content.comment_word_pro" class="all_class_margin" size="mini"></el-input>%</div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.home_check_pro"></el-checkbox>进入主页查看比例<el-input v-model="sp_content.home_check_pro" class="all_class_margin" size="mini"></el-input>%</div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.video_collect_pro"></el-checkbox>视频收藏比例<el-input v-model="sp_content.video_collect_pro" class="all_class_margin" size="mini"></el-input>%</div>
                        <div class="all_margin_top">
                            <el-checkbox  v-model="sp.search_label_pro"></el-checkbox>
                            选择要搜索的标签
                            <el-select v-model="search_label" placeholder="被搜索标签" size="mini">
                                <el-option
                                v-for="item in options_search_label"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select></div>

                    </el-col>
                    <el-col :span="1"></el-col>
                    <el-col :span="11">
                        <div>
                            <span><el-checkbox  v-model="sp.video_live_pro"></el-checkbox>视频点赞比例<el-input v-model="id_att" style="width:60px;margin-right: 10px;margin-left: 20px;" size="mini"></el-input>%</span>
                            <span style="margin-left:20px"><el-checkbox  v-model="sp.video_end"></el-checkbox>视频完播</span>
                        </div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.comment_stay_time"></el-checkbox>评论区停留时间<el-input v-model="start_time" class="all_class_margin"  size="mini"></el-input>——<el-input v-model="end_time" class="all_class_margin"  size="mini"></el-input>秒</div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.comment_like_num"></el-checkbox>评论区点赞数量<el-input v-model="start_time" class="all_class_margin"  size="mini"></el-input>——<el-input v-model="end_time" class="all_class_margin"  size="mini"></el-input>个</div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.brush_num"></el-checkbox>被刷到次数<el-input v-model="start_time" class="all_class_margin"  size="mini"></el-input>——<el-input v-model="end_time" class="all_class_margin"  size="mini"></el-input>次关注该账号</div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.home_look_time"></el-checkbox>进入主页查看时间<el-input v-model="start_time" class="all_class_margin"  size="mini"></el-input>——<el-input v-model="end_time" class="all_class_margin"  size="mini"></el-input></div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.open_label_search"></el-checkbox><el-input v-model="start_time" class="all_class_margin"  size="mini"></el-input>天未刷到垂直号开启标签搜索</div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.message_board"></el-checkbox>
                            选择留言内容
                            <el-select v-model="search_label" placeholder="留言内容" size="mini">
                                <el-option
                                v-for="item in options_search_label"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select></div>
                    </el-col>
                    </el-row>
                    <el-divider></el-divider>
                </div>

                <div>
                    <div class="drawer_title">养大号配置</div>
                    <el-row type="flex">
                        <el-col :span="1"></el-col>
                    <el-col  :span="11">
                        <div >选择垂直方向:
                            <el-select v-model="vertical_direction_big" placeholder="垂直方向" size="mini">
                                <el-option
                                v-for="item in options_vertical_direction_big"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>

                        <div class="all_margin_top"><el-checkbox  v-model="sp.comment_pro_t"></el-checkbox>进入评论区比例<el-input v-model="id_att" class="all_class_margin" size="mini"></el-input>%</div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.comment_like_pro_t"></el-checkbox>评论区点赞比例<el-input v-model="id_att" class="all_class_margin" size="mini"></el-input>%</div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.comment_word_pro_t"></el-checkbox>评论区留言比例<el-input v-model="id_att" class="all_class_margin" size="mini"></el-input>%</div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.home_check_pro_t"></el-checkbox>进入主页查看比例<el-input v-model="id_att" class="all_class_margin" size="mini"></el-input>%</div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.video_collect_pro_t"></el-checkbox>视频收藏比例<el-input v-model="id_att" class="all_class_margin" size="mini"></el-input>%</div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.search_label_pro_t"></el-checkbox>选择要搜索的标签
                            <el-select v-model="search_label" placeholder="被搜索标签" size="mini">
                                <el-option
                                v-for="item in options_search_label"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select></div>
                            <div class="all_margin_top"><el-checkbox  v-model="sp.video__transmit_pro_t"></el-checkbox>视频转发比例<el-input v-model="id_att" class="all_class_margin" size="mini"></el-input>%</div>

                    </el-col>
                    <el-col :span="1"></el-col>
                    <el-col :span="11">
                        <div> 
                            <span><el-checkbox  v-model="sp.video_live_pro_t"></el-checkbox>视频点赞比例<el-input v-model="id_att" class="all_class_margin" size="mini"></el-input>%</span>
                            <span style="margin-left:20px"><el-checkbox  v-model="sp.video_end_t"></el-checkbox>视频完播</span>
                        </div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.comment_stay_time_t"></el-checkbox>评论区停留时间<el-input v-model="start_time" class="all_class_margin"  size="mini"></el-input>——<el-input v-model="end_time" class="all_class_margin"  size="mini"></el-input>秒</div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.comment_like_num_t"></el-checkbox>评论区点赞数量<el-input v-model="start_time" class="all_class_margin"  size="mini"></el-input>——<el-input v-model="end_time" class="all_class_margin"  size="mini"></el-input>个</div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.brush_num_t"></el-checkbox>被刷到次数<el-input v-model="start_time" class="all_class_margin"  size="mini"></el-input>——<el-input v-model="end_time" class="all_class_margin"  size="mini"></el-input>次关注该账号</div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.home_look_time_t"></el-checkbox>进入主页查看时间<el-input v-model="start_time" class="all_class_margin"  size="mini"></el-input>——<el-input v-model="end_time" class="all_class_margin"  size="mini"></el-input></div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.open_label_search_t"></el-checkbox><el-input v-model="start_time" class="all_class_margin"  size="mini"></el-input>天未刷到垂直号开启标签搜索</div>
                        <div class="all_margin_top"><el-checkbox  v-model="sp.message_board_t"></el-checkbox>选择留言内容
                            <el-select v-model="search_label" placeholder="留言内容" size="mini">
                                <el-option
                                v-for="item in options_search_label"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select></div>
                            <div class="all_margin_top"><el-checkbox  v-model="sp.random_transmit_num"></el-checkbox>随机转发人数<el-input v-model="id_att" class="all_class_margin" size="mini"></el-input></div>

                    </el-col>
                    </el-row>
                </div>
                <div style="margin-left:45%;margin-top:20px"><el-button type="primary" size="mini">重置</el-button></div>
                <div style="margin-left:38%;margin-top:20px; margin-bottom: 20px;"><el-button plain style="margin-right: 20px;">取消</el-button>
                <el-button type="primary"  class="seachbut" @click="submit_drawer" >确定</el-button></div>
                </el-drawer>

    </div>
</template>

<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';

export default {
    name: 'CultivateTask',
    components: {
		tableCustom,
	},
    data() {
        return {
            //选择框的选中状态
            sp:{
                comment_pro:true,
                comment_like_pro:true,
                comment_word_pro:true,
                home_check_pro:true,
                video_collect_pro:true,
                search_label_pro:true,
                video_live_pro:true,
                video_end:true,
                comment_stay_time:true,
                comment_like_num:true,
                brush_num:true,
                home_look_time:true,
                open_label_search:true,
                message_board:true,
                //下一行
                comment_pro_t:true,
                comment_like_pro_t:true,
                comment_word_pro_t:true,
                home_check_pro_t:true,
                video_collect_pro_t:true,
                search_label_pro_t:true,
                video__transmit_pro_t:true,
                
                video_live_pro_t:true,
                video_end_t:true,
                comment_stay_time_t:true,
                comment_like_num_t:true,
                brush_num_t:true,
                home_look_time_t:true,
                open_label_search_t:true,
                message_board_t:true,
                random_transmit_num:true,
            },
            day_time:5,//每日养号时间
            id_att:0.1,//关注取关
            Task_num:0,//已选择账号数量
            start_time:0.5,//其他ID视频播放时间
            end_time:15,
            random_att:1,//其他id随机关注

            sp_content:{
                comment_pro:"15",
                comment_like_pro:"1",
                comment_word_pro:"1",
                home_check_pro:"1",
                video_collect_pro:"1",
                search_label_pro:"1",
            },

            //搜索标签
            options_search_label:[
                {value: '1',
                label: '垂直'},
                {value: '2',
                label: '水平'},
            ],
            search_label:'',

            //垂直方向数据
            options_vertical_direction:[
                {value: '1',
                label: '垂直'},
                {value: '2',
                label: '水平'},
            ],
            vertical_direction:"",
            //大号垂直方向
            options_vertical_direction_big:[   
                {value: '1',
                label: '垂直'},
                {value: '2',
                label: '水平'},],
                vertical_direction_big:"",
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

            CreationDate:'',   //日期范围
            btnloading:false, //按钮loading
            loading:false,
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
                label: '账号分类',
                minWidth:100,
                align: 'center',
            },
            {
                prop: 'c',
                label: '状态',
                minWidth:150,
                align: 'center',
            },
            {
                prop: 'd',
                label: '账号数量',
                minWidth:150,
                align: 'center',
            },
            {
                prop: 'e',
                label: '开始养号时间',
                minWidth:150,
                align: 'center',
            },
            {
                prop: 'f',
                label: '结束养号时间',
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
                                <el-button style="margin-right:10px" size="mini"  type="danger" onClick={this.dialogCreationbtn.bind(this, row)} >修改养号配置</el-button>
                                <el-button style="margin-right:10px" size="mini"  type="primary" plain onClick={this.pauseCreation.bind(this, row)}>暂停养号</el-button>
                            </div>
                        );
                    },
                },

            ],
            dialogCultivate:false,//弹窗
            Cul_date:"",//养号时长
              //设备分组
              options_equipment:[  {
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
                }],
            cult_equipment:"",
            //账号分类
            options_classify:[  {
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
                }],
            cult_classify:"",
            //养号时间段
            DialogCreationDate:"",
            //养号时长
            rule_act:{
                name:"",
            },
            rules_act: {
                name: [{ required: true, message: '请输入养号天数', trigger: 'blur' },
                        { type: 'number', message: '必须为数字值',trigger: 'blur'}
            ]},

            //配置参数
            drawer_task:false,
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
            this.CreationState="";
            this.CreationDate=""
        },
        //选择框
        selectionChange(val) {
        //val选中数据
        this.Task_num=0;
        val.forEach(item => {
            this.Task_num=this.Task_num+item.d//当前已选择账号
        });
        console.log(this.Task_num)
        },
        //暂停养号
        pauseCreation(row){
            console.log(row,"暂停养号");
        },
        //修改养号配置
        dialogCreationbtn(row){
            this.dialogCultivate=true
            console.log(row,"修改养号配置")
        },
        //重新创建
        New_dialogCreationbtn(row){
            console.log(row,"重新创建")
        },
        //删除
        delete_CreationDialog(row){
            console.log(row,"弹窗内删除");
        },
        //配置养号按钮
        dialogConfig(){
        this.dialogCultivate=true
        },
        //取消按钮
        dialogCultivate_unbtn(){
            this.dialogCultivate=false;
            this.cult_equipment="";
            this.cult_classify="";
            this.rule_act.name="";
            this.DialogCreationDate="";
            console.log("取消按钮")
        },
        //开始养号
        dialogCultivate_starbtn(){
            this.dialogCultivate=false;
            console.log("开始养号")
        },
        //打开配置弹窗
        dialogCultivate_btnconfig(){
            
            this.drawer_task=true

        },
        //提交表单数据
        submit_drawer(){

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
.num_color{
    color: rgba(255,62,30,1);
    font-weight: 700;
}
.size_color{
    margin-left: 260px;
    margin-bottom: 20px;
    color:rgba(108,108,108,0.8)
}
.seachbut_whi{
    background: rgb(255, 118, 95);
    border: 0;
}
.drawer_title{
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 20px 10px;

}
.el-icon-star-off{
    color: rgb(255, 62, 30);;
}
.all_class_margin{
   width:60px;
   margin-right: 10px;
   margin-left: 10px;
}
.all_margin_top{
    margin-top:10px
}

</style>