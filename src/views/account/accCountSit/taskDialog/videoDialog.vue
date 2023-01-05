<template>
	<div class="tt-acccountsit--vieotask">
		<el-dialog width="45%" :visible="showVideoDialog" :before-close="handlerClose" title="视频发布任务配置">
			<el-form :rules="rules" ref="videoForm" label-position="left" label-width="170px" :model="vieoTaskForm">
				<el-form-item label="选择分组：" prop="grouping_id">
					<GroupSelect ref="groupselect" @handleChange="handleChange($event)" />
				</el-form-item>

				<el-form-item label="选择分类：" prop="typecontrol_id">
					<TypeSelect ref="typeselect" @handleTypeChange="handleTypeChange($event)" :typeList="typeList" />
				</el-form-item>
				<el-form-item label="">
					<p style="font-size:12px">当前已选中<span style="color:red">{{ accCount }}</span>个账号</p>
				</el-form-item>
				<el-form-item label="任务名称：" prop="task_name">
					<el-input size="medium" placeholder="任务名称" v-model="vieoTaskForm.task_name"></el-input>
				</el-form-item>
				<el-form-item label="单账号视频发布数量：" prop="video_num">
					<el-input size="medium" placeholder="输入发布视频数量" v-model="vieoTaskForm.video_num"></el-input>
				</el-form-item>
				<el-form-item label="单视频主题标签数量：" prop="label_num">
					<el-input size="medium" v-model="vieoTaskForm.label_num" placeholder="输入发布标签数量"
						autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="作品文案：" prop="text">
					<el-input size="medium" :disabled="isTextAreaDisabled" class="input-textarea" type="textarea"
						v-model="vieoTaskForm.text" style="width: 80%; margin-right: 10px"></el-input>
					<el-checkbox :disabled="isRandomTextDisabled" v-model="vieoTaskForm.text_round" s>随机</el-checkbox>
				</el-form-item>

				<el-form-item label="发布时间：" prop="date">
					<el-date-picker size="medium" v-model="vieoTaskForm.date" type="daterange" align="right"
						unlink-panels range-separator="——" start-placeholder="开始日期" end-placeholder="结束日期"
						:picker-options="pickerOptions">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<p style="font-size:12px;text-align: center;">该筛选条件可以发布<span style="color:red">{{videoCount}}</span>条视频</p>


			<span slot="footer" class="dialog-footer">
				<el-button @click="handleReset" size="medium">重 置</el-button>
				<el-button @click="handlerClose" size="medium">取 消</el-button>
				<el-button type="primary" :loading="btnloading" @click="handlerConfrim" size="medium">{{
					btnloading? '执行中...': '确认并执行'
				}}</el-button>
			</span>
		</el-dialog>
		<!-- 确认提示框 -->
		<el-button type="text" @click="open"></el-button>
	</div>
</template>

<script>
import GroupSelect from '@/components/base/baseSelect/GroupSelect.vue';
import TypeSelect from '@/components/base/baseSelect/TypeSelect.vue';

export default {
	name: 'TtprojectVideoDialog',
	props: {
		showVideoDialog: {
			type: Boolean,
		},
		classiFication: {
			type: Array,
		},
		batchEditorList: {
			type: Array,
		},
	},
	components: {
		GroupSelect,
		TypeSelect,
	},
	computed: {
		isRandomTextDisabled() {
			return this.vieoTaskForm.text.length !== 0;
		},
		isTextAreaDisabled() {
			return this.vieoTaskForm.text_round === true;
		},
		typeSelectPlaceholder() {
			return this.group === '' ? '请先选择分组' : '选择分类';
		},
		isTypeSelectDis() {
			return this.group === '';
		},
	},

	data() {
		return {
			accCount: 0, // 该条件下账号数量
			videoCount: 0, // 该条件下视频数量
			btnloading: false,
			rules: {
				grouping_id: [{ required: true, message: '请选择分组', trigger: 'blur' }],
				typecontrol_id: [{ required: true, message: '请选择分类', trigger: 'blur' }],
				task_name: [{ required: true, message: '请输入备注名称', trigger: 'blur' }],
				video_num: [
					{ required: true, message: '请输入视频发布数量', trigger: 'blur' },
					{
						pattern: /^[0-9]*[1-9][0-9]*$/,
						message: '请输入正整数',
						trigger: 'blur',
					},
				],
				user_num: [
					{ required: true, message: '请输入@用户数量', trigger: 'blur' },
					{
						pattern: /^[0-9]*[1-9][0-9]*$/,
						message: '请输入正整数',
						trigger: 'blur',
					},
				],
			},
			typeList: [],
			groupList: [],
			//TODO  需要跟后端对接字段  视频发布任务 提交表单
			vieoTaskForm: {
				grouping_id: '', // 分组id
				typecontrol_id: '', //分类id
				uid_list: [], // uid数组
				video_num: '', //视频发布数量
				label_num: '', //主题标签数量
				text: '', //主题内容
				text_round: false, //如果是随机内容的话为1
				task_name: '', //备注任务名称
				date: '',
			},

			pickerOptions: {
				shortcuts: [
					{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						},
					},
					{
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						},
					},
					{
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						},
					},
				],
			},
		};
	},

	methods: {
		// 分组选择
		async handleChange(e) {
			this.vieoTaskForm.grouping_id = e;
			let searchTypeData = {
				grouping_id: e,
			};
			try {
				let result = await this.$api({ type: 'getTypecontrol', data: searchTypeData });
				if (result.status == '200') {
					this.getTreeData(result.data);
					this.typeList = result.data;
				} else {
					this.$message.error({ message: result.msg });
				}
			} catch (error) { }
		},
		// 分类选择
		handleTypeChange(e) {
			if (e.length == 0) {
				this.accCount = 0;
				this.videoCount = 0;
			} else {
				this.vieoTaskForm.typecontrol_id = e[e.length - 1];
				this.getMemberList();
				this.getMaterialList();
			}
		},
		// 获取账号
		async getMemberList() {
			try {
				const res = await this.$api({
					type: 'getMember',
					data: {
						grouping_id: this.vieoTaskForm.grouping_id,
						typecontrol_id: this.vieoTaskForm.typecontrol_id,
					},
				});
				if (res.status == 200) {
					this.accCount = res.data.count;
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			}
		},
		// 获取视频素材
		async getMaterialList() {
			try {
				const res = await this.$api({
					type: 'getMaterialList',
					data: {
						grouping_id: this.vieoTaskForm.grouping_id,
						typecontrol_id: this.vieoTaskForm.typecontrol_id,
					},
				});
				if (res.status == 200) {
					this.videoCount = res.data.count;
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			}
		},
		// 确认提示框
		// open() {
		//   this.$confirm(`当前分类素材库素材不足（仅${this.videoCount}个）部分账号将无视频发布，是否继续发布？`, '提示', {
		//     confirmButtonText: '确定',
		//     cancelButtonText: '取消',
		//     type: 'warning'
		//   }).then(() => {
		//     this.$message({
		//       type: 'success',
		//       message: '操作成功'
		//     });
		//   }).catch(() => {
		//   });
		// },
		open() {
			const h = this.$createElement;
			this.$msgbox({
				title: '消息',
				message: h('div', null, [
					h('p', null, `当前分类素材库素材不足（仅${this.videoCount}个）`),
					h('p', null, '部分账号将无视频发布，是否继续发布？'),
				]),
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				beforeClose: (action, instance, done) => {
					if (action === 'confirm') {
						instance.confirmButtonLoading = true;
						instance.confirmButtonText = '执行中...';
						setTimeout(() => {
							done();
							setTimeout(() => {
								instance.confirmButtonLoading = false;
							}, 300);
						}, 1000);
					} else {
						done();
					}
				},
			})
				.then(() => this.$message.success('操作成功'))
				.catch(() => { });
		},

		/*
	function: getTreeData
	params: data | 需要进行递归处理的数组
	desc: 递归函数，对数组进行处理，设置dhilren长度为0的字段为undefined
	return: 处理后的数据
*/
		getTreeData(data) {
			data.forEach((item) => {
				if (!item.children.length) {
					item.children = undefined;
				} else {
					this.getTreeData(item.children);
				}
			});
			return data;
		},
		/* 
	function: handleReset
	params: null
	desc: 手动重置表单
*/
		handleReset() {
			this.resetForm();
		},

		/* 
	function: handlerClose
	params: null
	desc: 关闭后的回调
*/
		handlerClose() {
			this.$emit('closeVideoTask');
			this.videoCount = 0;
			this.accCount = 0;
			this.resetForm();
		},

		/* 
	function: handlerConfrim
	params: null
	desc: 提交后的回调
*/
		async handlerConfrim() {
			try {
				// await this.$refs['videoForm'].validate((valid) => {
				// 	if (valid) {
				// 		let userList = this.batchEditorList.map((item) => {
				// 			return item.uid;
				// 		});
				// 		this.vieoTaskForm.typecontrol_id =
				// 			this.classiFication[this.classiFication.length - 1];
				// 		this.vieoTaskForm.text_round = this.vieoTaskForm.text_round === true ? 1 : 0;
				// 		this.vieoTaskForm.uid_list = userList;
				// 		this.$api({ type: 'uploadVideoTask', data: this.vieoTaskForm })
				// 			.then((res) => {
				// 				if (res.status == 200) {
				// 					this.$message.success(res.msg);
				// 					this.handlerClose();
				// 					this.resetForm();
				// 					this.$message.success(res.msg ?? '操作成功');
				// 					return;
				// 				}
				// 				this.$message.error(res.msg ?? '操作失败');
				// 			})
				// 			.cathch(() => {
				// 				this.$message.error('未知错误');
				// 			});
				// 	}
				// });
				await this.$refs.videoForm.validate();
				if (this.accCount * this.vieoTaskForm.video_num > this.videoCount) {
					return this.open();
				}
				this.btnloading = true;
				setTimeout(() => {
					this.btnloading = false;
					this.$message.success('操作成功');
					this.$emit('closeVideoTask');
				}, 2000);
			} catch (error) {
				console.error(error);
			}
		},
		/* 
	function: resetForm
	params: null
	desc: 重置表单字段
*/
		resetForm() {
			this.$refs['videoForm'].resetFields();
			this.$refs.groupselect.group = '';
			this.$refs.typeselect.classiFication = '';
			this.vieoTaskForm.random_content = false;
		},
	},
};
</script>

<style lang="stylus" scoped>
		.tt-acccountsit--title {
		  margin-bottom: 20px;
		  font-size: 20px;
		}

		.el-input {
		  width: 220px;
		}

	  ::v-deep .el-form-item__label {
	    text-align: right !important;
	}
</style>
