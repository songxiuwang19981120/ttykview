<template>
	<el-dialog title="主题内容上传" :visible="showDialog" @close="btnCancel">
		<!-- 新增条件选择 -->
		<el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="120px">
			<el-form-item label="设备分组选择：" prop="grouping_id">
				<el-select
					v-model="ruleForm.grouping_id"
					placeholder="设备分组选择"
					style="margin-right: 20px"
					@focus="getEquipmentGroup()"
					:loading="equipmentLoading"
					loading-text="数据加载中..."
					clearable
				>
					<el-option
						v-for="item in searchEquipmentList"
						:key="item.grouping_id"
						:label="item.grouping_name"
						:value="item.grouping_id"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="账号分类选择：" prop="typecontrol">
				<el-cascader
					clearable
					:props="{ checkStrictly: true }"
					:options="searchTypecontrolList"
					v-model="ruleForm.typecontrol"
					placeholder="账号分类选择"
					style="margin-right: 20px"
					@focus="getTypecontrol"
				></el-cascader>
			</el-form-item>
			<!-- 添加签名 -->
			<el-form-item prop="nickname" label="添加主题内容：">
				<el-input
					type="textarea"
					placeholder="请输入主题内容(一行仅限一个)"
					rows="6"
					v-model="ruleForm.nickname"
					style="width: 60%"
				>
				</el-input>
			</el-form-item>
		</el-form>
		<!-- 上传 -->

		<!-- 按钮 -->
		<el-row type="flex" justify="end" slot="footer">
			<el-button size="small" @click="btnCancel">取消</el-button>
			<el-button size="small" type="primary" @click="btnOK">确定</el-button>
		</el-row>
	</el-dialog>
</template>

<script>
	import { BASE_URL } from '@/config/base.config';
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
				equipmentLoading: false,
				typecontrolLoading: false,
				ruleForm: {
					nickname: '',
					typecontrol_id: '',
					typecontrol: [],
					grouping_id: null,
				},
				rules: {
					nickname: [
						{ required: true, message: '请输入昵称', trigger: 'blur' },
					],
					typecontrol: [{ required: true, message: '请选择账号分类', trigger: 'blur' }],
				},
				baseUrl: BASE_URL, // 基地址
			};
		},
		methods: {
			// 获取设备分组数据
			async getEquipmentGroup() {
				try {
					this.equipmentLoading = true;
					const res = await this.$api({
						type: 'getGrouping',
					});
					console.log(res, '设备分组名称');
					if (res.status == 200) {
						this.searchEquipmentList = res.data.list;
					} else {
						this.$message.error(res.msg);
					}
				} catch (error) {
					console.error(error);
				} finally {
					this.equipmentLoading = false;
				}
			
	
			},
			// 获取素材分类数据
			async getTypecontrol() {
				try {
					this.typecontrolLoading = true;
					const res = await this.$api({
						type: 'getTypecontrol',
					});
					console.log(res, '素材分类数据');
					if (res.status == 200) {
						this.getTreeData(res.data);
						this.searchTypecontrolList = res.data;
					} else {
						this.$message.error(res.msg);
					}
				} catch (error) {
					console.error(error);
				} finally {
					this.typecontrolLoading = true;
				}
			},
			// 新增昵称
			async addNickName(data) {
				try {
					const res = await this.$api({
						type: 'subjectcontentAdd',
						data:{
							content:data.nickname,
							typecontrol_id: data.typecontrol[data.typecontrol.length - 1] ?? "", //点击设备分组的grouping_id
							grouping:data.grouping_id,//点击分类的typecontrol_id
						}
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
				this.$emit('update:showDialog', false);
				this.$refs.ruleForm.resetFields();
			},
			// 点击确定按钮
			async btnOK() {
				try {
					await this.$refs.ruleForm.validate();
					let nickNameArr = [];
					// 处理文本域数据
					this.ruleForm.nickname.split('\n').forEach((item) => {
						console.log(item.replace(/\s/gi, ''));
						if (item.replace(/\s/gi, '')) {
							nickNameArr.push(item.replace(/\s/gi, ''));
						}
					});
					this.ruleForm.nickname = nickNameArr.join('\n');
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
