<template>
	<div>
		<div class="tt-accsituation">
			<div class="tt-accsituation--operation">
				<div>
					<span>设备分组：</span>
					<el-select
						v-model="searchTableData.equipment"
						placeholder="设备分组选择"
						style="margin-right: 20px"
						@focus="getEquipmentGroup"
						:loading="equipmentLoading"
						loading-text="数据加载中..."
					>
						<el-option
							v-for="item in searchEquipmentList"
							:key="item.grouping_id"
							:label="item.grouping_name"
							:value="item.grouping_id"
						>
						</el-option>
					</el-select>
				</div>
				<div>
					<span>账号分类：</span>
					<el-cascader
						:props="{ checkStrictly: true }"
						:options="searchTypecontrolList"
						v-model="searchTableData.typecontrol"
						placeholder="账号分类选择"
						style="margin-right: 20px"
						@focus="getTypecontrol"
					></el-cascader>
				</div>
				<div>
					<!-- 查询 -->
					<el-button
						type="primary"
						:loading="btnloading"
						@click="searchNickName"
						ref="search"
						style="margin-right: 20px"
						>{{ btnloading ? '加载中...' : '搜索' }}</el-button
					>
				</div>
				<div>
					<el-button type="primary" @click="btnReset">重置</el-button>
				</div>
			</div>
			<div class="tt-accsituation--operation">
				<div>
					<el-button type="primary" @click="uploadNickName">上传</el-button>
				</div>
			</div>
		</div>
		<!-- 表格 -->
		<table-custom :loading="loading" :tableData="tableData" :columns="columns"></table-custom>
		<!-- 详情弹层 -->
		<LabelDetailDialog
			:outerVisible.sync="showDetailDialog"
			ref="detailDialog"
			:upParameter="nickData"
		></LabelDetailDialog>
		<!-- 上传弹层 -->
		<LabelUploadDialog
			:showDialog.sync="showUploadDialog"
			:upParameter="parameterData"
			:nnClassifyDate="tableData"
		></LabelUploadDialog>
	</div>
</template>

<script>
	import tableCustom from '@/components/myComponent/table/tableCustom.vue';
	import LabelDetailDialog from './component/LabelDetailDialog.vue';
	import LabelUploadDialog from './component/LabelUploadDialog';
	export default {
		name: 'LaBel',
		components: {
			tableCustom,
			LabelDetailDialog,
			LabelUploadDialog,
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
						label: '已上标签数量',
						align: 'center',
						render: (h, { row }) => {
							const allCount = Number(row.yy) + Number(row.wy);
							return <div>{allCount}</div>;
						},
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
										标签列表
									</el-button>
								</div>
							);
						},
					},
				],
				total: 0,
				showDetailDialog: false,
				showUploadDialog: false,
				equipmentLoading: false,
				typecontrolLoading: false,
				nickData: {}, // 传递给详情弹层的数据
				parameterData: {},
				resetloading: false,
			};
		},

		created() {
			this.getLabelClassify(this.page);
		},

		mounted() {},

		methods: {
			// 获取设备分组数据
			async getEquipmentGroup() {
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
					this.typecontrolLoading = false;
				}
			},
			// 获取标签分类数据
			async getLabelClassify(data) {
				try {
					this.loading = true;
					const res = await this.$api({
						type: 'getLabelClassify',
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
				this.getLabelClassify({
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
				this.getLabelClassify();
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
				this.$refs.detailDialog.getLabel({
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

<style scoped>
	.tt-accsituation {
		background-color: #fff;
		margin-bottom: 20px;
		border-radius: 4px;
		padding: 0 12px;
	}
	.tt-accsituation--operation {
		display: flex;
		height: 70px;
		line-height: 70px;
	}
</style>
