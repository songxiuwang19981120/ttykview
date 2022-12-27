<template>
	<el-dialog title="签名上传" :visible="showDialog" @close="btnCancel">
		<!-- 新增条件选择 -->
		<el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="120px">
			<el-form-item label="账号分组选择：" prop="grouping_id">
				<el-select
					v-model="ruleForm.grouping_id"
					placeholder="账号分组选择"
					style="margin-right: 20px"
					@focus="getaccGroup"
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
			<el-form-item prop="autograph" label="添加签名：">
				<el-input
					type="textarea"
					placeholder="请输入签名(一行仅限一个)"
					rows="6"
					v-model="ruleForm.autograph"
					style="width: 60%"
				>
				</el-input>
			</el-form-item>
		</el-form>
		<!-- 上传 -->

		<!-- 按钮 -->
		<el-row type="flex" justify="end" slot="footer">
			<el-button size="small" @click="btnCancel">取消</el-button>
			<el-button type="primary" :loading="btnloading" @click="btnOK">{{
				btnloading ? '上传中...' : '确定'
			}}</el-button>
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
			nnClassifyDate: {
				type: Array,
			},
		},
		data() {
			return {
				searchEquipmentList: [], // 分组数据
				searchTypecontrolList: [], // 账号分类数据
				equipmentLoading: false,
				typecontrolLoading: false,
				ruleForm: {
					autograph: '',
					typecontrol_id: '',
					typecontrol: [],
					grouping_id: null,
					usage_time: '',
				},
				rules: {
					autograph: [
						{ required: true, message: '请输入签名', trigger: 'blur' },
					],
					typecontrol: [{ required: true, message: '请选择账号分类', trigger: 'blur' }],
				},
				baseUrl: BASE_URL, // 基地址
				btnloading: false
			};
		},
		methods: {
			// 获取账号分组数据
			async getaccGroup() {
				try {
					this.equipmentLoading = true;
					const res = await this.$api({
						type: 'getGrouping',
					});
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
			async addAutograph(data) {
				try {
					const res = await this.$api({
						type: 'addAutograph',
						data,
					});
					if (res.status == 200) {
						this.searchTypecontrolList=[]
						this.$message.success(res.msg);
					} else {
						this.$message.error(res.msg);
					}
				} catch (error) {
					console.error(error);
				} finally {
					this.btnloading = false
				}
			},
			// 点击取消按钮
			btnCancel() {
				this.$emit('update:showDialog', false);
				this.searchTypecontrolList=[]
				this.$refs.ruleForm.resetFields();
			},
			// 点击确定按钮
			async btnOK() {
				try {
					await this.$refs.ruleForm.validate();
					let nickNameArr = [];
					// 处理文本域数据
					this.ruleForm.autograph.split('\n').forEach((item) => {
						if (item!='') {
							nickNameArr.push(item);
						}
					});
					if (nickNameArr.length && nickNameArr[0]){
						this.ruleForm.autograph = nickNameArr.join('\n');
					} else {
						return this.$message.warning('签名内容不能为空')
					}
					const { typecontrol } = this.ruleForm;
					this.ruleForm.typecontrol_id = typecontrol.length
						? typecontrol[typecontrol.length - 1]
						: '';
					// 调用新增签名接口
					this.btnloading = true
					await this.addAutograph(this.ruleForm);
					this.$emit('update:showDialog', false);
					this.$parent.getAutographClassify(this.upParameter);
				} catch (error) {
					// console.error(error);
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
</style>
