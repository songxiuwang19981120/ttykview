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
					<span>素材库：</span>
					<el-cascader
						clearable
						:props="{ checkStrictly: true}"
						:options="searchTypecontrolList"
						v-model="searchTableData.typecontrol"
						placeholder="素材库选择"
						style="margin-right: 20px"
						@focus="getTypecontrol"
					></el-cascader>
				</div>
				<div>
					<span>时间排序：</span>
					<el-select
						v-model="searchTableData.sortTime"
						placeholder="时间排序选择"
						style="margin-right: 20px"
					>
						<el-option
							v-for="item in searchTimeList"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</div>
				<div>
					<!-- 查询 -->
					<el-button type="primary" :loading="btnloading" @click="searchNickName">{{
						btnloading ? '加载中...' : '查询'
					}}</el-button>
				</div>
			</div>
			<div class="tt-accsituation--operation">
				<div>
					<el-button type="primary" @click="uploadNickName">上传</el-button>
				</div>
			</div>
		</div>
		<el-card>
			<!-- 表格 -->
			<table-custom :loading="loading" :tableData="tableData" :columns="columns"></table-custom>
			<!-- 分页 -->
			<el-row type="flex" justify="end">
				<pagination
					:total="total"
					:page="page.curpage"
					:limit="page.curlimit"
					@pagination="pageChange"
				></pagination>
			</el-row>
		</el-card>
		<!-- 编辑弹层 -->
		<NickNameEditDialog :showDialog.sync="showEditDialog"></NickNameEditDialog>
	</div>
</template>

<script>
	import tableCustom from '@/components/myComponent/table/tableCustom.vue';
	import pagination from '@/components/myComponent/table/pagination.vue';
	import NickNameEditDialog from './component/NickNameEditDialog.vue';
	export default {
		name: 'NikName',
		components: {
			tableCustom,
			pagination,
			NickNameEditDialog,
		},
		data() {
			return {
				// 分组数据
				searchEquipmentList: [],
				// 素材库数据
				searchTypecontrolList: [],
				// 时间排序
				searchTimeList: [
					{
						value: '升序',
						label: '升序',
					},
					{
						value: '降序',
						label: '降序',
					},
				],
				btnloading: false,
				// 表格搜索
				searchTableData: {
					equipment: '',
					typecontrol: '',
					sortTime: '',
				},
				// 表格-分页组件
				loading: false,
				tableData: [],
				columns: [
					{
						label: '国家',
						align: 'center',
					},
					{
						label: '项目',
						align: 'center',
					},
					{
						label: '一级分类',
						align: 'center',
					},
					{
						label: '二级分类',
						align: 'center',
					},
					{
						label: '已上标签数量',
						align: 'center',
					},
					{
						label: '已用素材数量',
						align: 'center',
					},
					{
						label: '当前可用素材',
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
										onClick={this.editMaterial.bind(this)}
									>
										编辑
									</el-button>
									<el-popconfirm
										confirm-button-text="删除"
										cancel-button-text="取消"
										title="确认删除该素材库吗？"
										onConfirm={this.delMaterial.bind(this, row)}
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
				showEditDialog: false,
				equipmentLoading: false,
				typecontrolLoading: false
			};
		},

		created() {
			// 获取昵称素材库数据
			this.getNickName(this.page);
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
					console.log(res, '设备分组名称');
					this.searchEquipmentList = res.list;
				} catch (error) {
					console.error(error);
				} finally {
					this.equipmentLoading = false;
				}
			},
			// 获取素材分类数据
			async getTypecontrol() {
				try {
					const res = await this.$api({
						type: 'getTypecontrol',
					});
					console.log(res, '素材分类数据');
					this.searchTypecontrolList = res
				} catch (error) {
					console.error(error);
				} 
			},
			// 获取昵称素材库数据
			async getNickName(data) {
				this.loading = true;
				try {
					const res = await this.$api({
						type: 'getNickName',
						data,
					});
					console.log(res, '昵称数据列表');
					this.tableData = res.list;
					this.total = res.count;
				} catch (error) {
					console.error(error);
				} finally {
					this.loading = false;
				}
			},
			// 点击查询按钮
			searchNickName() {},
			// 点击上传按钮
			uploadNickName() {},
			// 点击编辑按钮
			editMaterial() {
				this.showEditDialog = true;
			},
			// 点击删除按钮
			async delMaterial() {},
			// 当前页数据条数/页码改变
			pageChange(obj) {
				(this.page.curpage = obj.page), (this.page.limit = obj.limit);
			},
		},
	};
</script>

<style lang="stylus" scoped>
	.tt-accsituation{
		background-color #fff
		margin-bottom  20px
		border-radius 4px
		padding 0 12px
		.tt-accsituation--operation{
			display flex
			height 70px
			line-height 70px
		}
	}
</style>
