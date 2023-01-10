<template>
  <div>
    <div style="margin-bottom:10px">
      <el-row>
        <el-button size="mini" type="success" @click="showAutomaticRegister=true">自动注册</el-button>
        <el-button size="mini" type="primary" @click="showAccountDialog=true">添加账号</el-button>
        <el-button size="mini" type="primary" @click="redactDialog=true">账号编辑</el-button>
        <el-select size="mini" style="width:120px;margin:0 10px 0 10px" v-model="grouping" placeholder="账号分组选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
         <!-- 批量删除 -->
      <el-popconfirm
      style="margin-left:10px"
        title="确定删除？"
        @confirm="deleteAccount"
      >
        <el-button  size="mini" type="danger" slot="reference">批量删除</el-button>
      </el-popconfirm>
    
      </el-row>
    </div>

    <!-- 表格 -->
    <tableCustom 
    height="600" 
    :tableData="tableData" 
    :columns="columns" 
    :mutiSelect="true" 
    @handleSelectionChange="selectionChange" 
    :loading="loading">
   </tableCustom>
    <!-- 分页 -->
    <pagination 
    :total="total" 
    :page="current_page" 
    :limit="current_limit" 
    @pagination="handlePagination">
  </pagination>

    <!-- 管理弹窗 -->
    <el-dialog
		:visible.sync="showEditorDialog"
		width="20%"
		:before-close="imgUploadClose"
		>
    <el-row>
      <el-col :span="6">
        <div style="margin-top:15px">修改头像:</div>
      </el-col>
      <el-col :span="18">
        <!-- action="上传的地址"
           :show-file-list="显示文件列表"  
           success="文件上传成功时的钩子" 	
           before-upload="上传文件之前的钩子，参数为上传的文件"-->
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-col>
    </el-row>
    
    <el-row>
      <el-col :span="6"><div style="margin-top:15px">发布视频:</div></el-col>
      <el-col :span="18">
        <el-input 
        v-model="releaseVideos" 
        size="mini" 
        style="margin-top:10px;width:200px">
        </el-input>
      </el-col>
    </el-row>

    
    <el-row>
      <el-col :span="6"><div style="margin-top:15px">修改昵称:</div></el-col>
      <el-col :span="18">
        <el-input 
        v-model="nickeName" 
        size="mini" 
        style="margin-top:10px;width:200px">
        </el-input>
      </el-col>
    </el-row>

			<span slot="footer" class="dialog-footer">
				<el-button size="mini" 
        type="primary" 
        :loading="imgSubmitting"
         @click="SubmitImgUpload">
         {{imgSubmitting ? '提交中...' : '确认执行'}}
        </el-button>
			</span>
		</el-dialog>
		
    <!-- 自动注册 -->
    <el-dialog
		:visible.sync="showAutomaticRegister"
		width="30%"
		:before-close="AutomaticRegisterClose"
		>
    <el-form :model="AutomaticRuleForm" :rules="AutomaticRules" ref="ruleForm" label-width="120px">
      <el-form-item label="解锁账户秘钥:" prop="unlocking">
        <el-input 
        v-model="AutomaticRuleForm.unlocking" 
        size="mini"
        >
        </el-input>
      </el-form-item>
      <div style="margin-top:15px">您可登录至<a style="color:blue" href="https://sms-activate.org/cn/">https://sms-activate.org/cn/</a>网站中查询您的个人账户的授权秘钥(即:API秘钥)</div>
      <el-form-item label="国家选择:" prop="country">
        <el-input 
        v-model="AutomaticRuleForm.country" 
        size="mini"
        style="width: 60%">
        </el-input>
      </el-form-item>
      <el-form-item label="注册密码:" prop="registerPassword">
        <el-input 
        v-model="AutomaticRuleForm.registerPassword" 
        size="mini"
        style="width: 60%">
        </el-input>
      </el-form-item>
      <el-form-item label="注册年龄:" prop="registerAge">
        <el-input 
        v-model="AutomaticRuleForm.registerAge" 
        size="mini"
        style="width: 60%">
        </el-input>
      </el-form-item>
      <el-form-item label="注册名字:" prop="registerName">
        <el-input
					type="textarea"
					placeholder="请输入名字(一行仅限一个)"
					rows="6"
					v-model="AutomaticRuleForm.registerName"
					style="width: 60%"
					size="medium"
				>
				</el-input>
      </el-form-item>

    </el-form>
			<span slot="footer" class="dialog-footer">
				<el-button size="mini" 
        type="primary" 
        :loading="registerSubmitting"
         @click="SubmitRegister">
         {{imgSubmitting ? '提交中...' : '确认执行'}}
        </el-button>
			</span>
		</el-dialog>
		
    <!-- 添加账号 -->
     <el-dialog
		:visible.sync="showAccountDialog"
		width="30%"
		:before-close="AccountClose"
		>
    <el-form :model="AccountRuleForm" :rules="AccountRules" ref="AutomaticRules" label-width="120px">
      <el-form-item label="添加账号Token:" prop="accountToken" >
          <el-input
            type="textarea"
            placeholder="请输入账号Token(一行仅限一个)"
            rows="6"
            v-model="AccountRuleForm.accountToken"
            style="width: 60%"
            size="medium"
          >
          </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
				<el-button size="mini" 
        type="primary" 
         @click="SubmitAccount">
         确认执行
        </el-button>
    </span>
    </el-dialog>

    <!-- 账号编辑 -->
    <el-dialog
		:visible.sync="redactDialog"
		width="20%"
		:before-close="redactClose"
		>
    <el-form :model="batchHeadRuleForm" :rules="batchHeadRules" ref="batchHeadRules" label-width="180px">
      <el-form-item label="选中批量发布视频" prop="batchVideo" >
        <el-switch v-model="batchHeadRuleForm.batchVideo"></el-switch>
      </el-form-item>
      <el-form-item label="选中批量修改头像" prop="batchHead" >
        <el-switch v-model="batchHeadRuleForm.batchHead"></el-switch>
      </el-form-item>
      <el-form-item label="选中批量修改昵称" prop="batchNikeName" >
        <el-switch v-model="batchHeadRuleForm.batchNikeName"></el-switch>
      </el-form-item>
      <el-form-item label="批量删除被封账号" prop="batchDeleteBlock" >
        <el-switch v-model="batchHeadRuleForm.batchDeleteBlock"></el-switch>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
				<el-button size="mini" 
        type="primary" 
        :loading="redactSubmitting"
         @click="SubmitRedact">
         {{redactSubmitting ? '提交中...' : '确认执行'}}
        </el-button>
			</span>
    </el-dialog>
    
  </div>
</template>

<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import pagination from '@/components/myComponent/table/pagination.vue';
export default {
  name: 'AccountSituation',
  components: { pagination, tableCustom },
  data() {
    return {
      releaseVideos:"",//发布视频
      selectionId:"",//获取唯一ID值用来删除
      selectionVal:"",//表格多选框选中的数据
      grouping:"",//账号分组选择
      options:[
      {
          value: '1',
          label: '分组1'
        },
      {
          value: '2',
          label: '分组2'
        },
      {
          value: '3',
          label: '分组3'
        },
      ],
      batchHeadRuleForm:{
        batchVideo:false,
        batchHead:false,//编辑弹窗中的按钮
        batchNikeName:false,
        batchDeleteBlock:false,
      },
      batchHeadRules:{//编辑表单验证
      },
      redactSubmitting:false,
      redactDialog:false,//账号编辑
      AccountRuleForm:{
        accountToken:""
      },
      AccountRules:{
        accountToken:[ { required: true, message: '请输入账号Token', trigger: 'blur' },],
      },
      showAccountDialog:false,//添加账号弹窗
      AutomaticRuleForm:{
        registerName:"",//注册名字
        registerAge:"",//注册年龄
        registerPassword:"",//注册密码
        country:"",//国家
        unlocking:"",//解锁账户秘钥
      },
      AutomaticRules:{
        registerName:[ { required: true, message: '请输入注册名字', trigger: 'blur' },],//注册名字
        registerAge:[ { required: true, message: '请输入注册年龄', trigger: 'blur' },],//注册年龄
        registerPassword:[ { required: true, message: '请输入注册密码', trigger: 'blur' },],//注册密码
        country:[ { required: true, message: '请选择国家', trigger: 'blur' },],//国家
        unlocking:[ { required: true, message: '请输入解锁账户秘钥', trigger: 'blur' },],//解锁账户秘钥
      },
      showAutomaticRegister:false,//自动注册弹窗
      registerSubmitting:false,
      nickeName:"",//修改昵称
      imageUrl:"",
      imgSubmitting:false,
      showEditorDialog: false,//管理弹窗
      total: 2,  //数据总量
      current_page: 1, //当前页
      current_limit: 10, //每页条数
      loading: false,
      tableData: [
        {
          a: '1',
          b: '1',
          c: '1',
          d: '1',
          e: '1',
          f: '1',
          g: '1',
          h: '正常',
        },
        {
          a: '1',
          b: '1',
          c: '1',
          d: '1',
          e: '1',
          f: '1',
          g: '1',
          h: '空白号',
        },
        {
          a: '1',
          b: '1',
          c: '1',
          d: '1',
          e: '1',
          f: '1',
          g: '1',
          h: '封号',
        },        
        {
          a: '1',
          b: '1',
          c: '1',
          d: '1',
          e: '1',
          f: '1',
          g: '1',
          h: '限制私信',
        },
        {
          a: '1',
          b: '1',
          c: '1',
          d: '1',
          e: '1',
          f: '1',
          g: '1',
          h: '异常登录',
        },
      ],
      columns: [
        {
          prop: 'a',
          label: 'ID',
          align: 'center',

        },
        {
          prop: 'b',
          label: '分组名',
          align: 'center',

        },
        {
          prop: 'c',
          label: 'UID',
          align: 'center',

        },
        {
          prop: 'd',
          label: '昵称',
          align: 'center',

        },
        {
          prop: 'e',
          label: '头像',
          align: 'center',
          render(h, { row }) {
            return (
              <div>
                <img src="https://img-blog.csdnimg.cn/20201014180756913.png?x-oss-process=image/resize,m_fixed,h_64,w_64" style="width:50px;height:50px"></img>
              </div>
            )
          }
        },
        {
          prop: 'e',
          label: '动态',
          align: 'center',

        },
        {
          prop: 'e',
          label: '关注',
          align: 'center',

        },
        {
          prop: 'f',
          label: '粉丝',
          align: 'center',

        },
        {
          prop: 'g',
          label: '创建时间',
          align: 'center',

        },
        {
          prop:"h",
          label: '账号状态',
          align: 'center',
          render: (h, { row }) => {
            let colorRed = "";
            if (row.h == "正常") {
              colorRed = ";color:#6DC953;";
            } else if(row.h == "空白号"){
              colorRed = ";color:#101010;";
            }else if(row.h == "封号"){
              colorRed = ";color:#DE5757;";
            }else if(row.h == "限制私信"){
              colorRed = ";color:#7896B8;";
            }else if(row.h == "异地登录"){
              colorRed = ";color:#9EAD71;";
            }
          return (
              <span
                style={"font-size: 12px" + colorRed}
              >
                {row.h}
              </span>
              )
          },
        },
        {
          prop: "status",
          label: '操作',
          align: 'center',
          width: 180,
          render: (h, { row }) => {
            return (
              <div>
                <el-button size="mini" type="primary" onClick={this.handleEdit.bind(this, row)}>管理</el-button>
                <el-popconfirm
                style="margin-left:10px"
										confirm-button-text="删除"
										cancel-button-text="取消"
										title="确认删除？"
										onConfirm={this.handleDelete.bind(this, row, '1')}
									>
										<el-button slot="reference" type="danger" size="mini">
											删除
										</el-button>
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

    /* 
        function: selectionChange
        params: val | 默认参数
        desc: 表格多选框
    */
    selectionChange(val) {
      console.log(val)
      this.selectionVal=val
    },

    /* 
        function: handleEdit
        params: row | 选中当前表格行的数据
        desc: 管理按钮
    */
    handleEdit(row) {
      this.nickeName=row.d
      this.showEditorDialog = true
      console.log(row)
    },    
    
    /* 
        function: handleDelete
        params: row | 选中当前表格行的数据
        desc: 删除按钮
    */
    handleDelete(row) {
      console.log(row)
    },
   
    /* 
        function: handleAvatarError
        params: null
        desc: upload失败回调
    */
    handleAvatarError() {
      this.$message.error("上传失败");
    },

    /* 
        function: imgUploadClose
        params: null
        desc: 关闭showEditorDialog弹窗
    */
    imgUploadClose(){
      this.showEditorDialog=false
    },

    /* 
        function: SubmitImgUpload
        params: null
        desc: 确认执行showEditorDialog弹窗管理弹窗
    */
    SubmitImgUpload(){
      if(this.nickeName || this.imageUrl ||  this.releaseVideos){
        this.showEditorDialog=false
        console.log(this.nickeName,this.imageUrl)
        this.$message.success('修改成功');
        this.nickeName=""
        this.imageUrl=""
        this.releaseVideos=""
       
      }else{
        this.$message.error('请选择需要执行的操作');
      }
      
    },

    /* 
        function: handleAvatarSuccess
        params: res | 默认参数，返回值
        desc: 成功上传头像的回调函数
    */
    handleAvatarSuccess(res, file) {
      console.log(res,file)
        this.imageUrl = URL.createObjectURL(file.raw);
      },

    /* 
        function: beforeAvatarUpload
        params: file | 默认参数,上传图片的属性
        desc: 上传头像之前的回调函数|验证
    */
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }else{
          this.$message.success('上传成功')
        }
        return isJPG && isLt2M;
      },

    /* 
        function: AutomaticRegisterClose
        params: null
        desc: 关闭自动注册弹窗
    */
      AutomaticRegisterClose(){
        this.$refs.ruleForm.resetFields();
        this.showAutomaticRegister=false
      },

    /* 
        function: SubmitRegister
        params: null
        desc: 确认执行自动注册弹窗
    */
      SubmitRegister(){
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            alert('submit!');
            	// 处理文本域数据
          let nickNameArr = [];
					this.AutomaticRuleForm.registerName.split('\n').forEach((item) => {
						if (item != '') {
							nickNameArr.push(item);
						}
					});
					if (nickNameArr.length && nickNameArr[0]) {
						this.AutomaticRuleForm.registerName = nickNameArr.join('\n');
					} else {
						return this.$message.warning('注册名字内容不能为空');
					}
            console.log(nickNameArr)//为一个数组,内容每次换行是一个字符转
            this.AutomaticRegisterClose()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
  
      },

    /* 
        function: AccountClose
        params: null
        desc: 关闭添加账号弹窗
    */
    AccountClose(){
      this.$refs.AutomaticRules.resetFields();
        this.showAccountDialog=false
      },

    /* 
        function: SubmitAccount
        params: null
        desc: 提交添加账号弹窗
    */
    SubmitAccount(){
        this.$refs.AutomaticRules.validate((valid) => {
          if (valid) {
            	// 处理文本域数据
          let AccountArr = [];
					this.AccountRuleForm.accountToken.split('\n').forEach((item) => {
						if (item != '') {
							AccountArr.push(item);
						}
					});
					if (AccountArr.length && AccountArr[0]) {
						this.AccountRuleForm.accountToken = AccountArr.join('\n');
					} else {
						return this.$message.warning('添加账号内容不能为空');
					}
            console.log(AccountArr)//输入框中的内容为一个数组,内容每次换行是一个字符串
            this. AccountClose()
          } else {
            return this.$message.warning('添加账号内容不能为空');
          }
        });
  
      },

    /* 
        function: redactClose
        params: null
        desc: 关闭账号编辑弹窗
    */
    redactClose(){
      this.redactDialog=false
      this.batchHeadRuleForm.batchHead=false,//批量修改头像
      this.batchHeadRuleForm.batchNikeName=false,//批量修改昵称
      this.batchHeadRuleForm.batchDeleteBlock=false//批量删除被封账号
      this.batchHeadRuleForm.batchVideo=false//批量删除被封账号
      },


    /* 
        function: SubmitRedact
        params: null
        desc: 提交账号编辑弹窗
    */
    SubmitRedact(){
      if(this.batchHeadRuleForm.batchHead || this.batchHeadRuleForm.batchNikeName || this.batchHeadRuleForm.batchDeleteBlock || this.batchHeadRuleForm.batchVideo){
        this.redactClose()
        return this.$message.success('操作成功');
      }else{
        return this.$message.warning('请选择需要执行的操作');
      }
     
      },

    /* 
        function: deleteAccount
        params: null
        desc: 批量删除选中
    */
    deleteAccount(){
      this.selectionId=""
      if(this.selectionVal){
        this.selectionVal.forEach(element => {
        this.selectionId= this.selectionId+element.a+","
      });
      console.log(this.selectionId)
      }else{
        this.$message.error("请选择需要删除的数据")
      }
      
      },

    
    /* 
        function: handlePagination
        params: val | 默认参数
        desc: 页面回调
    */
    handlePagination(val) {
      this.current_page = val.page; //页数
      this.current_limit = val.limit; //条数
    },


  },
};
</script>

<style scoped>
/* 头像上传内style */
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 200px;
    line-height: 200px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }
  .red{
    color:red
  }
</style>