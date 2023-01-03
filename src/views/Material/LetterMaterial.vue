<template>
	<div>
		<div class="tt-accsituation">
			<div class="tt-accsituation--operation">
				<div>
					<GroupSelect
						ref="groupselect"
						@handleChange="handleChange($event)"
						style="margin-right: 10px"
					/>
				</div>
				<div>
					<TypeSelect
						@handleTypeChange="handleTypeChange($event)"
						:typeList="searchTypecontrolList"
						style="margin-right: 10px"
					/>
				</div>
				<div>
					<!-- 查询 -->
					<el-button type="primary" :loading="btnloading" @click="searchNickName">{{
						btnloading ? '加载中...' : '搜索'
					}}</el-button>
					<el-button type="primary" @click="btnReset">重置</el-button>
					<el-button type="primary" @click="uploadNickName">上传</el-button>
				</div>
			</div>
		</div>
		<!-- 表格 -->
		<table-custom :loading="loading" :tableData="tableData" :columns="columns"></table-custom>
		<!-- 详情弹层 -->
		<LetterMaterialDetailDialog
			:outerVisible.sync="showDetailDialog"
			ref="detailDialog"
			:upParameter="nickData"
		>
		</LetterMaterialDetailDialog>
		<!-- 上传弹层 -->
		<LetterMaterialUploadDialog
			:showDialog.sync="showUploadDialog"
			:upParameter="parameterData"
			:nnClassifyDate="tableData"
		></LetterMaterialUploadDialog>
	</div>
</template>

<script>
	import tableCustom from '@/components/myComponent/table/tableCustom.vue';
	import LetterMaterialDetailDialog from './component/LetterMaterialDetailDialog.vue';
	import LetterMaterialUploadDialog from './component/LetterMaterialUploadDialog.vue';
	import GroupSelect from '@/components/base/baseSelect/GroupSelect.vue';
	import TypeSelect from '@/components/base/baseSelect/TypeSelect.vue';

	export default {
		name: 'PrivateLetterMaterial',
		components: {
			tableCustom,
			LetterMaterialDetailDialog,
			LetterMaterialUploadDialog,
			GroupSelect,
			TypeSelect,
		},
		data() {
			return {
				searchEquipmentList: [], // 分组数据
				searchTypecontrolList: [], // 账号分类数据
				btnloading: false,
				searchTableData: {
					equipment: '',
					typecontrol: '', // 表格搜索
				},
				loading: false, // 表格-分页组件相关
				tableData: [],
				columns: [
					{
						prop: 'type_title',
						label: '分类名称',
						// align: 'center'
					},
					{
						prop: 'zs',
						label: '素材数量',
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
										onClick={this.toNickNameDetail.bind(this, row)}
									>
										私信列表
									</el-button>
								</div>
							);
						},
					},
				],
				total: 0,
				showDetailDialog: false,
				showUploadDialog: false,
				nickData: {}, // 传递给详情弹层的数据
				parameterData: {},
				resetloading: false,
			};
		},

		created() {
			this.getPrivateLetterClassify(this.page);
			this.getaccGroup();
		},
		mounted() {},
		methods: {
			// 分组选择
			async handleChange(e) {
				this.searchTableData.equipment = e;
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
				this.searchTableData.typecontrol = e;
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
			// 获取私信数据
			async getPrivateLetterClassify(data) {
				try {
					this.loading = true;
					const res = await this.$api({
						type: 'getPrivateLetterClassify',
						data,
					});
					if (res.status == 200) {
						this.tableData = res.data;
						this.total = res.data.length;
					} else {
						this.$message.error(res.msg);
					}
				} catch (error) {
					console.error(error);
				} finally {
					this.loading = false;
					this.btnloading = false;
					this.resetloading = false;
				}
			},
			// 点击查询按钮
			searchNickName() {
				this.btnloading = true;
				const { equipment, typecontrol } = this.searchTableData;
				const typecontrol_id = typecontrol.length ? typecontrol[typecontrol.length - 1] : '';
				const grouping_id = equipment;
				this.parameterData = {
					typecontrol_id,
					grouping_id,
				};
				this.getPrivateLetterClassify({
					typecontrol_id,
					grouping_id,
				});
			},
			// 点击重置按钮
			btnReset() {
				this.resetloading = true;
				this.searchTableData = {
					equipment: '',
					typecontrol: '',
				};
				this.parameterData = {
					typecontrol_id: '',
					grouping_id: '',
				};
				this.searchTypecontrolList = [];
				this.$refs.groupselect.group = '';
				this.getPrivateLetterClassify();
			},
			// 点击上传按钮
			uploadNickName() {
				this.showUploadDialog = true;
			},
			// 点击详情按钮
			toNickNameDetail(obj) {
				this.showDetailDialog = true;
				this.nickData = {
					typecontrol_id: obj.typecontrol_id,
					grouping_id: obj.grouping_id,
				};
				this.$refs.detailDialog.getPrivateLetter({
					page: 1,
					limit: 20,
					typecontrol_id: obj.typecontrol_id,
					grouping_id: obj.grouping_id,
				});
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

<style scoped></style>
