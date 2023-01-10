<template>
	<div class="tt-acccountsit--vieotask">
		<el-dialog
			width="45%"
			:visible="showVideoDialog"
			:before-close="handlerClose"
			title="视频发布任务配置"
		>
			<el-form
				:rules="rules"
				ref="videoForm"
				label-position="left"
				label-width="170px"
				:model="vieoTaskForm"
			>
				<el-form-item label="选择分组：" prop="grouping_id">
					<GroupSelect ref="groupselect" @handleChange="handleChange($event)" />
				</el-form-item>

				<el-form-item label="选择分类：" prop="typecontrol_id">
					<TypeSelect
						ref="typeselect"
						@handleTypeChange="handleTypeChange($event)"
						:typeList="typeList"
					/>
				</el-form-item>
				<el-form-item label="">
					<p style="font-size: 12px">当前已选中<span style="color: red">{{ accCount }}</span>个账号</p>
				</el-form-item>
				<el-form-item label="任务名称：" prop="task_name">
					<el-input
						size="medium"
						placeholder="任务名称"
						v-model="vieoTaskForm.task_name"
					></el-input>
				</el-form-item>
				<el-form-item label="单账号视频发布数量：" prop="video_num">
					<el-input
						size="medium"
						placeholder="输入发布视频数量"
						v-model="vieoTaskForm.video_num"
					></el-input>
				</el-form-item>
				<el-form-item label="单视频标签数量：" prop="label_num">
					<el-input
						size="medium"
						v-model="vieoTaskForm.label_num"
						placeholder="输入发布标签数量"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="作品文案：" prop="text">
					<el-input
						size="medium"
						:disabled="isTextAreaDisabled"
						placeholder="请输入指定文案/选择随机文案，一行一条"
						class="input-textarea"
						type="textarea"
						v-model="vieoTaskForm.text"
						style="width: 80%; margin-right: 10px"
					></el-input>
					<el-checkbox :disabled="isRandomTextDisabled" v-model="vieoTaskForm.text_round" s
						>随机</el-checkbox
					>
				</el-form-item>

				<el-form-item label="发布时间：" prop="push_time">
					<el-date-picker
						v-model="vieoTaskForm.push_time"
						type="date"
						placeholder="选择日期"
						format="yyyy - MM - dd"
						value-format="yyyy-MM-dd"
					>
					</el-date-picker>
				</el-form-item>
			</el-form>
			<p style="font-size: 12px; text-align: center">
				该筛选条件可以发布<span style="color: red">{{ videoCount }}</span
				>条视频
			</p>

			<span slot="footer" class="dialog-footer">
				<el-button @click="handleReset" size="medium">重 置</el-button>
				<el-button @click="handlerClose" size="medium">取 消</el-button>
				<el-button type="primary" :loading="btnloading" @click="handlerConfrim" size="medium">{{
					btnloading ? '执行中...' : '确认并执行'
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
					label_num: [
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
					// uid_list: [], // uid数组
					video_num: '', //视频发布数量
					label_num: '', //主题标签数量
					text: '', //主题内容
					text_round: false, //如果是随机内容的话为1
					task_name: '', //备注任务名称
					push_time: '',
				},
			};
		},

		methods: {
			// 分组选择
			async handleChange(e) {
				this.vieoTaskForm.grouping_id = e;
				if (e == '') {
					this.vieoTaskForm.typecontrol_id = '';
					this.typeList = [];
					return;
				}
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
				} catch (error) {}
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
			// 发布视频任务
			async uploadVideoTask(data) {
				try {
					const res = await this.$api({
						type: 'uploadVideoTask',
						data,
					});
					if (res.status == 200) {
						this.$parent.getVideoTasks();
						this.handlerClose()
						this.$message.success(res.msg);
					} else {
						this.$message.error(res.msg);
					}
				} catch (error) {
					console.error(error);
				} finally {
				}
			},

			// 限制日期选择范围
			// pickerOptions: {
			// 	disabledDate(v) {
			// 		return v.getTime() < new Date().getTime() - 86400000; //  - 86400000是否包括当天
			// 	},
			// },

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
				this.typeList = [];
				this.resetForm();
			},

			/*
		function: handlerConfrim
		params: null
		desc: 提交后的回调
	*/
			async handlerConfrim() {
				try {
					await this.$refs.videoForm.validate();
					if (!this.vieoTaskForm.text_round) {
						// 处理文本域数据
						let themeList = [];
						this.vieoTaskForm.text.split('\n').forEach((item) => {
							console.log(item);
							if (item != '') {
								themeList.push(item);
							}
						});
						if (themeList.length && themeList[0]) {
							this.vieoTaskForm.text = themeList.join('\n');
						} else {
							return this.$message.warning('作品文案内容不能为空');
						}
					}
					if (this.accCount * this.vieoTaskForm.video_num > this.videoCount) {
						return this.open();
					}
					await this.uploadVideoTask(this.vieoTaskForm);
					this.$parent.getVideoTasks();
				} catch (error) {
					console.error(error);
				}
			},

			// 确认提示框
			open() {
				this.$confirm(
					`当前分类素材库素材不足（仅 ${this.videoCount} 个）部分账号将无视频发布，是否继续发布？`,
					'提示',
					{
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}
				)
					.then(async () => {
						await this.uploadVideoTask(this.vieoTaskForm);
					})
					.catch(() => {});
			},

			/*
		function: resetForm
		params: null
		desc: 重置表单字段
	*/
			resetForm() {
				this.$refs['videoForm'].resetFields();
				this.typeList = [];
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
