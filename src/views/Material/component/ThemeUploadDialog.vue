<template>
	<el-dialog title="主题内容上传" :visible="showDialog" @close="btnCancel">
		<!-- 新增条件选择 -->
		<el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="120px">
			<el-form-item label="账号分组选择：" prop="grouping_id">
				<GroupSelect ref="groupselect" @handleChange="handleChange($event)" />
			</el-form-item>
			<el-form-item label="账号分类选择：" prop="typecontrol">
				<TypeSelect
					@handleTypeChange="handleTypeChange($event)"
					:typeList="searchTypecontrolList"
				/>
			</el-form-item>
			<!-- 添加签名 -->
			<el-form-item prop="nickname" label="添加主题内容：">
				<el-input
					type="textarea"
					placeholder="请输入主题内容(一行仅限一个)"
					rows="6"
					v-model="ruleForm.nickname"
					style="width: 60%"
					size="medium"
				>
				</el-input>
			</el-form-item>
		</el-form>
		<!-- 上传 -->

		<!-- 按钮 -->
		<el-row type="flex" justify="end" slot="footer">
			<el-button size="medium" @click="btnCancel">取消</el-button>
			<el-button size="medium" type="primary" @click="btnOK">确定</el-button>
		</el-row>
	</el-dialog>
</template>

<script>
	import { BASE_URL } from '@/config/base.config';
	import GroupSelect from '@/components/base/baseSelect/GroupSelect.vue';
	import TypeSelect from '@/components/base/baseSelect/TypeSelect.vue';

	export default {
		props: {
			showDialog: {
				type: Boolean,
				default: false,
			},
			upParameter: {
				type: Object,
			},
		},
		data() {
			return {
				searchEquipmentList: [], // 分组数据
				searchTypecontrolList: [], // 账号分类数据
				typecontrolLoading: false,
				ruleForm: {
					nickname: '',
					typecontrol_id: '',
					typecontrol: [],
					grouping_id: null,
				},
				rules: {
					grouping_id: [{ required: true, message: '请选择账号分组', trigger: 'blur' }],
					nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
					typecontrol: [{ required: true, message: '请选择账号分类', trigger: 'blur' }],
				},
				baseUrl: BASE_URL, // 基地址
			};
		},
		created() {
			this.getaccGroup();
		},

		components: {
			GroupSelect,
			TypeSelect,
		},

		methods: {
			// 分组选择
			async handleChange(e) {
				this.ruleForm.grouping_id = e;
				let searchTypeData = {
					grouping_id: e,
				};
				try {
					let result = await this.$api({ type: 'getTypecontrol', data: searchTypeData });
					if (result.status == '200') {
						this.getTreeData(result.data);
						this.searchTypecontrolList = result.data;
					} else {
						this.$message.error({ message: result.msg });
					}
				} catch (error) {}
			},
			// 分类选择
			handleTypeChange(e) {
				this.ruleForm.typecontrol = e;
			},
			// 获取账号分组数据
			async getaccGroup() {
				try {
					const res = await this.$api({
						type: 'getGrouping',
					});
					console.log(res, '账号分组名称');
					if (res.status == 200) {
						this.searchEquipmentList = res.data.list;
					} else {
						this.$message.error(res.msg);
					}
				} catch (error) {
					console.error(error);
				} finally {
				}
			},
			// 新增昵称
			async addNickName(data) {
				try {
					const res = await this.$api({
						type: 'subjectcontentAdd',
						data: {
							content: data.nickname,
							typecontrol_id: data.typecontrol[data.typecontrol.length - 1] ?? '', //点击账号分组的grouping_id
							grouping: data.grouping_id, //点击分类的typecontrol_id
						},
					});
					if (res.status == 200) {
						this.$emit('update:showDialog', false);
						this.$refs.ruleForm.resetFields();
						this.$parent.getNickNameClassify(this.upParameter);
						this.$message.success(res.msg);
					} else {
						this.$message.error(res.msg);
					}
				} catch (error) {
					console.error(error);
				}
			},
			// 点击取消按钮
			btnCancel() {
				this.searchTypecontrolList = [];
				this.$emit('update:showDialog', false);
				this.$refs.groupselect.group = '';
				this.$refs.ruleForm.resetFields();
			},
			// 点击确定按钮
			async btnOK() {
				try {
					await this.$refs.ruleForm.validate();
					let nickNameArr = [];
					// 处理文本域数据

					this.ruleForm.nickname.split('\n').forEach((item) => {
						console.log(item);
						if (item != '') {
							nickNameArr.push(item);
						}
					});
					if (nickNameArr.length && nickNameArr[0]) {
						this.ruleForm.nickname = nickNameArr.join('\n');
					} else {
						return this.$message.warning('昵称内容不能为空');
					}
					// 调用新增昵称接口
					this.addNickName(this.ruleForm);
				} catch (error) {
					console.log(error);
				}
			},
			// 处理树型children问题
			getTreeData(arr) {
				arr.forEach((item) => {
					if (!item.children.length) {
						item.children = undefined;
					} else {
						this.getTreeData(item.children);
					}
				});
			},
		},
	};
</script>

<style lang="stylus" scoped>
	.nicknameIpt{
		width 60%
		vertical-align middle
	}
</style>
<style scoped>
	/* ::v-deep .el-form-item__content {
		text-align: center !important;
	} */
	/* ::v-deep .el-form-item__error {
		width: 100%;
		margin-left: 30%;
	} */
</style>
