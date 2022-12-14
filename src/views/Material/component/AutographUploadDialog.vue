<template>
	<el-dialog :visible="showDialog" @close="btnCancel">
		<!-- 新增条件选择 -->
		<el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="120px">
			<el-form-item label="设备分组选择：" prop="grouping_id">
				<el-select
					v-model="ruleForm.grouping_id"
					placeholder="设备分组选择"
					style="margin-right: 20px"
					@focus="getEquipmentGroup"
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
			<el-form-item label="素材库选择：" prop="typecontrol">
				<el-cascader
					clearable
					:props="{ checkStrictly: true }"
					:options="searchTypecontrolList"
					v-model="ruleForm.typecontrol"
					placeholder="素材库选择"
					style="margin-right: 20px"
					@focus="getTypecontrol"
				></el-cascader>
			</el-form-item>
		<!-- 添加签名 -->
			<el-form-item prop="autograph" label="添加签名：">
				<el-input
					type="textarea"
					placeholder="请输入昵称(一行仅限一个)"
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
			nnClassifyDate: {
				type: Array
			}
		},
		data() {
			return {
				searchEquipmentList: [], // 分组数据
				searchTypecontrolList: [], // 素材库数据
				equipmentLoading: false,
				typecontrolLoading: false,
				ruleForm: {
					autograph: '',
					typecontrol_id: '',
					typecontrol: [],
					grouping_id: null,
					usage_time: ''
				},
				rules: {
					autograph: [{ required: true, message: '请输入签名', trigger: 'blur' }],
					// grouping_id: [{ required: true, message: '请选择设备分组', trigger: 'blur' }],
					typecontrol: [{ required: true, message: '请选择素材库', trigger: 'blur' }],
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
					this.typecontrolLoading = true
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
					this.typecontrolLoading = true
				}
			},
			// 新增昵称
			async addAutograph(data) {
				try {
					const res = await this.$api({
						type: 'addAutograph',
						data,
					});
					console.log(res, '新增签名');
					if (res.status == 200) {
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
					console.log(this.ruleForm.autograph, '文本域数据');
					let nickNameArr = [];
					// 处理文本域数据
					this.ruleForm.autograph.split('\n').forEach((item) => {
						console.log(item.replace(/\s/gi, ''));
						if (item.replace(/\s/gi, '')) {
							nickNameArr.push(item.replace(/\s/gi, ''));
						}
					});
					this.ruleForm.autograph = nickNameArr.join('\n');
					const {typecontrol} = this.ruleForm
					this.ruleForm.typecontrol_id = typecontrol.length ? typecontrol[typecontrol.length - 1] : ''
					// 调用新增签名接口
					await this.addAutograph(this.ruleForm);
					this.$emit('update:showDialog', false);
					// 更新数据
					const arr = this.nnClassifyDate.filter(item => {
						return item.typecontrol_id == this.ruleForm.typecontrol_id
					})
					if(arr.length){
						this.$parent.getAutographClassify(this.upParameter)
					}
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
