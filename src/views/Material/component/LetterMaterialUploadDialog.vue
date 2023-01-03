<template>
	<el-dialog title="私信上传" :visible="showDialog" @close="btnCancel">
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
			<el-form-item label="私信类型选择：" prop="type">
				<el-select v-model="ruleForm.type" placeholder="私信类型选择" style="margin-right: 20px">
					<el-option
						v-for="item in searchTypeList"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<!-- 添加私信 -->
			<el-form-item prop="content" label="添加私信：">
				<el-input placeholder="请输入私信" rows="6" v-model="ruleForm.content" style="width: 60%">
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
			nnClassifyDate: {
				type: Array,
			},
		},
		data() {
			return {
				searchEquipmentList: [], // 分组数据
				searchTypecontrolList: [], // 账号分类数据
				searchTypeList: [
					{
						label: '文本话术',
						value: '0',
					},
					{
						label: '短连接',
						value: '1',
					},
					{
						label: '好友名片',
						value: '2',
					},
					{
						label: '作品转发',
						value: '3',
					},
				], //私信类型
				ruleForm: {
					content: '',
					typecontrol_id: '',
					typecontrol: [],
					grouping_id: null,
					type: '',
				},
				rules: {
					grouping_id: [{ required: true, message: '请选择账号分组', trigger: 'blur' }],
					content: [{ required: true, message: '请输入私信', trigger: 'blur' }],
					typecontrol: [{ required: true, message: '请选择账号分类', trigger: 'blur' }],
					type: [{ required: true, message: '请选择私信类型', trigger: 'blur' }],
				},
				baseUrl: BASE_URL, // 基地址
				btnloading: false,
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
				this.ruleForm.typecontrol_id = e;
			},
			// 获取账号分组数据
			async getaccGroup() {
				try {
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
				}
			},
			// 新增签名
			async addPrivateLetter(data) {
				try {
					const res = await this.$api({
						type: 'addPrivateLetter',
						data,
					});
					if (res.status == 200) {
						this.$message.success(res.msg);
					} else {
						this.$message.error(res.msg);
					}
				} catch (error) {
					console.error(error);
				} finally {
					this.btnloading = false;
				}
			},
			// 点击取消按钮
			btnCancel() {
				(this.searchTypecontrolList = []), this.$emit('update:showDialog', false);
				this.$refs.groupselect.group = ''
				this.$refs.ruleForm.resetFields();
			},
			// 点击确定按钮
			async btnOK() {
				try {
					await this.$refs.ruleForm.validate();
					let nickNameArr = [];
					this.ruleForm.content.split('\n').forEach((item) => {
						if (item != '') {
							nickNameArr.push(item);
						}
					});
					if (nickNameArr.length && nickNameArr[0]) {
						this.ruleForm.content = nickNameArr.join('\n');
					} else {
						return this.$message.warning('私信内容不能为空');
					}

					const { typecontrol } = this.ruleForm;
					this.ruleForm.typecontrol_id = typecontrol.length
						? typecontrol[typecontrol.length - 1]
						: '';
					// 调用新增昵称接口
					this.btnloading = true;
					await this.addPrivateLetter(this.ruleForm);
					this.$emit('update:showDialog', false);
					this.$parent.getPrivateLetterClassify(this.upParameter);
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
