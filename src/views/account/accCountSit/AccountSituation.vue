<template>
  <div class="tt-accsituation" ref="accsituation">
    <div class="tt-accsituation-searchbar">

      <div class="tt-accsituation-setgroup">
        <span class="mr-30">设置分组 ：</span>
        <el-select
          clearable
          v-model="group"
          placeholder="选择分组"
        >
            <el-option
            v-for="item in groupList"
            :value="item.grouping_id"
            :label="item.grouping_name"
            :key="item.grouping_id"
          ></el-option>
        </el-select>
      </div>

      <div class="ml-15 tt-accsituation-setgroup">
        <span class="mr-30">设置分类 ：</span>
        <el-cascader
          clearable
          :props="{ checkStrictly: true, value: 'value' }"
          :options="typeList"
          v-model="classiFication"
          placeholder="选择分类"
        ></el-cascader>
      </div>

      <div class="ml-15 tt-accsituation-setfans">
        <span class="mr-30">粉丝量 ：</span>
        <el-select clearable v-model="fans" placeholder="粉丝量">
          <el-option
            v-for="item in fans_option"
            :value="item.value"
            :label="item.label"
            :key="item.label"
          ></el-option>
        </el-select>
      </div>

      <div class="ml-15 tt-accsituation-setid">
        <span class="mr-30">输入ID ：</span>
        <el-input
          @keydown.native.enter="searchAccId"
          class="searchid-btn"
          placeholder="输入账号ID"
          v-model="acc_id"
          clearable
        >
        </el-input>
      </div>

      <el-button class="search-btn" @click="handlerSearch" :disabled="this.isDisabled">搜索</el-button>
    </div>

    <div class="tt-accsituation--settask">
      <span class="mr-30">设置任务 ：</span>
      <el-select
        @change="openTaskDialog"
        class="tt-accsituation--taskconig"
        v-model="taskConfig"
        placeholder="已选账号任务配置"
      >
        <el-option
          v-for="item in accConfigCloumn"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
      <el-button @click="batchEditor" class="batchedit-btn">批量编辑</el-button>
    </div>

    <table-custom
      class="tt-accsituation--tabel"
      :mutiSelect="true"
      @handleSelectionChange="handleSelectChange"
      :loading="loading"
      :tableData="memberList"
      :columns="columns"
    ></table-custom>

    <Pagination
      :total="total"
      :page="page"
      :size="limit"
      @pagination="handlePagination"
    />

    <VideoDialog
      @closeVideoTask="closeVideoTask"
      :showVideoTask="showVideoTask"
    />
    <LikeCommentDialog
      @closeLikeCommentTask="closeLikeCommentTask"
      :showLikeCommentTask="showLikeCommentTask"
    />
    <LetterDialog
      @closeLetterTask="closeLetterTask"
      :showLetterTask="showLetterTask"
    />
    <FollowDialog
      @closeFollowTask="closeFollowTask"
      :showFollowDialog="showFollowDialog"
    />
    <EditorDialog 
      @closeEditorDialog="closeEditorDialog"
      :showEditorDialog="showEditorDialog"
    />
    <BatchEditorDialog 
      @closeBatchEidialog="closeBatchEidialog"
      :showBatchEiDialog="showBatchEiDialog"
      :check_all="check_all"
    />
    <VideoTabel 
      @closeVideoTabel="closeVideoTabel"
      :shwoVideoTabel="shwoVideoTabel"
      :videoList="videoList"
    />
    <ViewerTabel
      @toogleViewerTabel="toogleViewerTabel" 
      :showVisiteTabel="showVisiteTabel"
      :vistList="vistList"
    />
  </div>
</template>

<script>
import tableCustom from "@/components/myComponent/table/tableCustom";
import Pagination from "@/components/myComponent/table/pagination";
import EditorDialog from './editoDialog/editorDialog'
import VideoDialog from "./taskDialog/videoDialog";
import LikeCommentDialog from "./taskDialog/likeCommentDialog";
import LetterDialog from "./taskDialog/letterDialog";
import FollowDialog from "./taskDialog/followDialog";
import taskStatus from "@/config/accountConfig/taskStatus.config";
import BatchEditorDialog from './batchEditorDialog/batchEditorDialog'
import VideoTabel from './videoTabel/videoTabel'
import ViewerTabel from './ViewerLabel/viewerTabel'


const { STATUS_MAP } = taskStatus;
export default {
  name: "AccountSituation",
  components: {
    VideoDialog,
    LikeCommentDialog,
    LetterDialog,
    FollowDialog,
    tableCustom,
    Pagination,
    EditorDialog,
    BatchEditorDialog,
    VideoTabel,
    ViewerTabel
  },
  computed:{
    isDisabled(){
      return !this.classiFication || !this.fans || !this.acc_id
    }
  },
  data() {
    return {
      STATUS_MAP: STATUS_MAP, //任务状态映射，详见config文件夹
      showVideoTask: false, //控制视频任务dialog显示
      showLikeCommentTask: false, //控制评论点赞任务dialog显示
      showLetterTask: false, //控制评论任务dialog显示
      showFollowDialog: false, //控制关注任务dialog显示
      classiFication: "", //设置分类
      typeList: [], //设置分类options   从接口拿的，动态渲染
      loading: false, //表格懒加载选项
      groupList:[],//分组options
      columns: [
        //表格组件options（包含模板）      用来渲染表格
        {
          prop: "phone_number",
          label: "设备信息",
          align: "center",
          fixed: true,
        },
        {
          prop: "uid",
          label: "UID",
          width: "200",
          align: "center",
        },
        {
          prop: "avatar_thumb",
          label: "头像",
          width: "100",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                <el-image
                  src={row.avatar_thumb}
                  style="width: 60px; height: 60px"
                ></el-image>
              </div>
            );
          },
        },
        {
          prop: "nickname" ?? '匿名用户',
          label: "昵称",
          width: "150",
          align: "center",
        },
        {
          prop: "type_title" ?? '暂无类型',
          label: "账号类型",
          width: "160",
          align: "center",
        },
        {
          prop: "status",
          label: "状态",
          width: "100",
          align: "center",
          render: (h, { row }) => {
            return (
              <div class={row.status === "1" ? "bgcgreen" : "bgcred"}></div>
            );
          },
        },
        {
          prop: "signature" ?? '暂无签名',
          label: "签名",
          width: "200",
          align: "center",
        },
        {
          prop: "aweme_count" ?? 0,
          label: "视频数量",
          width: "100",
          align: "center",
          render: (h, { row }) => {
            return (
              <span
                onClick={this.showVideoTabel.bind(this,row)}
                class="videonum-span"
              >
                {row.aweme_count}
              </span>
            );
          },
        },
        {
          prop: "unread_viewer_count" ?? '',
          label: "主页访问人数",
          width: "150",
          align: "center",
          render: (h, { row }) => {
            return (
              <span
                class="videonum-span"
                onClick={this.toogleViewerTabel.bind(this, row)}
              >
                {row.unread_viewer_count}
              </span>
            );
          },
        },
        {
          prop: "follower_status",
          label: "粉丝量",
          width: "100",
          align: "center",
        },
        {
          prop: "following_status,following_count,play_num" ?? '暂无数据',
          label: "关注/获赞/播放",
          width: "150",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                {row.following_count} / {row.total_favorited} / {row.play_num}
              </div>
            );
          },
        },
        {
          prop: "operation",
          label: "操作",
          width: "150",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                <el-button
                  size="mini"
                  onClick={this.handleEdit.bind(this, row)}
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  onClick={this.handleDelete.bind(this, row)}
                >
                  删除
                </el-button>
              </div>
            );
          },
        },
      ],
      acc_id: "", //查询框的账号ID
      fans_option: [
        //粉丝量下拉框options  TODO 数据可能要问后端拿，目前写死了
        { value: [1000, 2000], label: "1k-2k" },
        { value: [1000, 2000], label: "2k-9k" },
        { value: [1000, 2000], label: "9k-10k" },
      ],
      fans: "", //粉丝量查询框对应 model
      page: 1, //页码
      taskConfig: "", //对应配置任务下拉框 model
      memberList: [], //渲染表格的数据    和后端对接的  对应获取函数为getMemberList
      accConfigCloumn: [
        //任务下拉框的options
        "视频发布",
        "评论区点赞",
        "关注",
        "私信",
      ],
      check_all: "", //是否选择所有账号
      total: 0, //返回的账号总条数
      fans_total: 0, //粉丝总量
      group:'', //设置分组
      limit: 10, //每页请求数据条数
      showEditorDialog:false, //是否展示编辑按钮界面
      showBatchEiDialog:false ,//是否展示批量编辑按钮界面
      shwoVideoTabel:false,   //是否展示视频播放弹窗
      showVisiteTabel:false, //是否展示访问列表表格
      user_video_num:0, //视频数量
      videoList:[], //用户视频列表数据
      vistList:[], //访问列表数据
    };
  },

  mounted() {
    this.getMemberList();
    this.getTypeControlList();
    this.getGroupList()
  },

  //typecontrol_id 分类ID
  methods: {
    /* 
        function: toogleViewerTabel
        params: null
        desc: 切换访问列表表格显示状态
    */
    toogleViewerTabel(){
      this.showViewerTabel = !this.showViewerTabel
    },

    /* 
        function: getVisitorList
        params: member_id | 用户ID
        desc: 获取访问列表
    */
  getVisitorList(member_id){
    this.$api({type:'getVistorList',data:{member_id:member_id}})
  },

    closeVideoTabel(){
      this.shwoVideoTabel = false
    },

    /* 
        function: getGroupList
        params: null
        desc: 获取分组  异步
    */
    async getGroupList(){
      let result = await this.$api({type:'getGrouping'})
      this.groupList = result.list
    },
    /* 
        function: closeBatchEidialog
        params: null
        desc: 批量编辑弹框展示
    */
   //TODO 未完成
    closeBatchEidialog(){
      this.showBatchEiDialog = false
    },

    /* 
        function: handlerSearch
        params: null
        desc: 搜索按钮回调
    */
    async handlerSearch() {
      let data = {
        typecontrol_id: this.classiFication[this.classiFication.length - 1] ?? '',
        uid: this.acc_id ?? '',
        min: this.fans[0] ?? '',
        max: this.fans[1] ?? '',
        limit: this.limit || 10,
        page: this.page || 1,
        grouping_id:this.group
      };
      let result = await this.$api({ type: "getMember", data: data });
      this.memberList = result.list
      this.classiFication = '',
      this. acc_id = '',
      this.fans = '',
      this.group = '',
      this.$message.success('查询成功 !')
    },
    /* 
        function: handlePagination
        params: null
        desc: 打开访问人数表格
    */
    handlePagination(val) {
      this.limit = val.limit;
      this.page = val.page;
      this.getMemberList();
    },

    /* 
        function: batchEditor
        params: null
        desc: 批量编辑回调
    */
    batchEditor(){
      console.log('批量编辑')
      this.showBatchEiDialog = true
    },


    /* 
        function: closeEditorDialog
        params: null
        desc: 关闭编辑弹窗
    */
    closeEditorDialog(){
      this.showEditorDialog = false
    },

    /* 
        function: shwoVideoTabel
        params: null
        desc: 打开视频表格,并进行后续操作
    */
    async showVideoTabel(val) {
      console.log(val.member_id)
      this.shwoVideoTabel = true
      let data ={member_id:val.member_id,page:this.page,limit:6}
      let result = await this.$api({type:"getMemberList",data:data})
      this.videoList = result.list
      console.log(this.videoList,result)
    },

    /* 
        function: closeFollowTask
        params: null
        desc: 关闭关注任务配置
    */
    closeFollowTask() {
      this.showFollowDialog = false;
    },

    /* 
        function: closeLetterTask
        params: null
        desc: 关闭私信任务配置
    */
    closeLetterTask() {
      console.log(1);
      this.showLetterTask = false;
    },

    /* 
        function: closeLikeCommentTask
        params: null
        desc: 关闭点赞任务任务配置
    */
    closeLikeCommentTask() {
      this.showLikeCommentTask = false;
    },

    /* 
        function: closeVideoTask
        params: null
        desc: 关闭视频任务配置
    */
    closeVideoTask() {
      this.showVideoTask = false;
    },

    /* 
        function: handleSelectChange
        params: null
        desc: 表格多选框改变时的回调
    */
    handleSelectChange(val) {
      if(val.length === 10){
        this.check_all = true
      }
      console.log("select改变了",val);
    },

    setGroupOption() {
      console.log(111, this.group);
    },

    /*
        function: setAccConfig
        params: null
        desc: 设置账号任务配置
    */
    openTaskDialog(val) {
      let formType = STATUS_MAP[val];
      this[formType] = true;
      console.log(this[formType]);
    },

    /*
        function: getTreeData
        params: data | 需要进行递归处理的数组
        desc: 递归函数，对数组进行处理，设置dhilren长度为0的字段为undefined
        return: 处理后的数据
    */
    getTreeData(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children < 1) {
          data[i].children = undefined;
        }
        this.getTreeData(data[i].children);
      }
      return data;
    },

    /*
        function: getFansList
        params: null
        desc: 获取粉丝列表
    */
    async getFansList() {
      try {
        let result = await this.$api({ type: "getFansList" });
        this.fans_total = result;
      } catch (error) {
        console.error(error);
      }
    },

    /*
        methods: getTypeControlList
        params: null
        desc: 异步获取TypeControlList，页面渲染时调用
    */
    async getTypeControlList() {
      try {
        let result = await this.$api({ type: "getTypecontrol" });
        this.typeList = result;
      } catch (error) {
        console.error(error);
      }
    },

    /*
        methods: getMemberList
        params: null
        desc: 异步获取memberList，页面渲染时调用
    */
    async getMemberList() {
      try {
        let result = await this.$api({
          type: "getMember",
          data: { limit: this.limit, page: this.page },
        });
        this.memberList = result.list;
        this.total = result.count;
        console.log(this.memberList);
      } catch (error) {
        console.error(error);
      }
    },

    /*
        function: handleEdit
        params: row | 该行的相应数据
        desc: 编辑操作时的回调
    */
    handleEdit(row) {
      this.showEditorDialog = true;
    },

    /*
        function: handleDelete
        params: index,row | default
        desc: 删除操作时的回调
    */
    async handleDelete(row) {
      this.$message.success('删除成功')
      //TODO 目前不删 //await this.$api({type:'deleteMember',data:{member_ids:row.member_id}})
    },

    /*
        function: handlerCurrentChange
        params: val | default
        desc: 分页的回调，设置page为val，当val改变时发起请求，获取数据重新渲染页面
    */
    async handlerCurrentChange(val) {
      try {
        this.page = val;
        let result = await this.$api({
          type: "getMember",
          data: { page: this.page },
        });
        this.memberList = result.list;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style lang="stylus">
.tt-accsituation-searchbar {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 10px;
  width: 100%;
  height: 60px;
  background-color: #fff;
  border-radius: 8px;
}

.search-btn {
  position: absolute;
  right: 80px;
  width: 100px;
}

.tt-accsituation--settask {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 10px;
  width: 100%;
  height: 60px;
  background-color: #fff;
  border-radius: 8px;
}

.tt-accsituation--tabel {
  width: 100% !important;
  border-radius: 8px;
}

.batchedit-btn {
  position: absolute;
  right: 80px;
  width: 100px;
}

.videonum-span {
  cursor: pointer;
}

.ml-15 {
  margin-left: 15px;
}

.mr-30 {
  margin-right: 30px;
}

.bgcred {
  margin: 0 auto;
  height: 10px;
  width: 10px;
  background-color: red;
  border-radius: 50%;
}

.bgcgreen {
  margin: 0 auto;
  height: 10px;
  width: 10px;
  background-color: green;
  border-radius: 50%;
}
</style>