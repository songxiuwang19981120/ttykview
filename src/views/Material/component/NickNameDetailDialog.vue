<template>
	<el-dialog title="详情" :visible="outerVisible" @close="btnCancel">
		<!-- 详情页面内容 -->
		<!-- 表格 -->
		<table-custom :loading="loading" :tableData="tableData" :columns="columns"></table-custom>
		<!-- 分页 -->
		<pagination
			:total="total"
			:page="page.page"
			:limit="page.limit"
			@pagination="pageChange"
		></pagination>
    <!-- 编辑弹层 -->
		<el-dialog width="30%" title="编辑" :visible.sync="innerVisible" append-to-body @close="btnCancel2">
      <el-form label-width="70px" :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="昵称：" prop="nickname">
          <el-input v-model="ruleForm.nickname" style="width: 90%;"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <el-row type="flex" justify="end">
        <el-button size="small" @click="btnCancel2">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK2">确定</el-button>
      </el-row>
    </el-dialog>
		<div slot="footer" class="dialog-footer">
			<el-button @click="btnCancel" size="small">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import tableCustom from '@/components/myComponent/table/tableCustom.vue';
	import pagination from '@/components/myComponent/table/pagination.vue';
	export default {
		props: {
			outerVisible: {
				type: Boolean,
				default: false,
			},
		},
		components: {
			tableCustom,
			pagination,
		},
		data() {
      const validateNickname = (rule, value, callback) => {
        if(value === this.curNickName){
          return callback(new Error('与编辑前昵称一致，请重新编辑'));
        }else{
          callback()
        }
      }
			return {
				innerVisible: false,
				loading: false, // 表格-分页组件相关
				tableData: [
          {
            nickname: 'Jack'
          },
          {
            nickname: 'Tom'
          },
          {
            nickname: 'Yorn'
          }
        ],
				columns: [
					{
						prop: 'nickname',
						label: '昵称',
						align: 'center',
					},
					{
						label: '操作',
						align: 'center',
						render: (h, { row }) => {
							return (
								<div>
									<el-button
										style="margin-right: 5px;"
										type="primary"
										size="mini"
										onClick={this.editNickName.bind(this,{name: 'testname'})}
									>
										编辑
									</el-button>
									<el-popconfirm
										confirm-button-text="删除"
										cancel-button-text="取消"
										title="确认删除该昵称吗？"
										onConfirm={this.delNickName.bind(this, row)}
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
				page: {
					page: 1,
					limit: 20,
					nickname: '',
					typecontrol_id: '',
					status: null,
					grouping_id: null,
				},
				total: 0,
        ruleForm: { // 表单相关
          nickname: ''
        },
        rules: {
          nickname: [
            { required: true, message: '请输入昵称', trigger: 'blur' },
            { validator: validateNickname, trigger: 'blur' }
          ]
        },
        curNickName: '' // 点击当前编辑按钮的id
			};
		},
		methods: {
      // 点击编辑按钮
      editNickName(obj) {
        console.log(obj)
        this.innerVisible = true
        this.curNickName = obj.name
        this.ruleForm.nickname = obj.name
      },
      // 点击删除按钮
      delNickName() {},
      // 当前页数据条数/页码改变
			pageChange(obj) {
				(this.page.page = obj.page), (this.page.limit = obj.limit);
			},
			// 点击取消按钮
			btnCancel() {
				this.$emit('update:outerVisible', false);
			},
      // 点击编辑页面取消按钮
      btnCancel2() {
        this.innerVisible = false
        this.$refs.ruleForm.resetFields()
      },
      // 点击编辑页面确定按钮
      async btnOK2() {
        try {
          await this.$refs.ruleForm.validate()
        } catch (error) {
          console.log(error)
        }
      }
		},
	};
</script>

<style></style>
