<template>
	<div>
		<div class="tt-accsituation">
			<div class="tt-accsituation--operation">
				<div>
					<span>设备分组：</span>
					<el-select
						v-model="searchTableData.equipment"
						placeholder="分组选择"
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
					<!-- 查询 -->
					<el-button type="primary" :loading="btnloading" @click="searchData" class="search">{{
						btnloading ? '加载中...' : '查看'
					}}</el-button>
				</div>
			</div>
		</div>
		<!-- 数据概览 -->
		<div class="showdata">
			<el-row type="flex" justify="space-between" style="margin-bottom: 18px">
				<el-col>
					<i class="el-icon-s-flag"></i>
					<span class="title">数据总览</span>
				</el-col>
			</el-row>
			<div class="contentBox" style="margin-bottom: 40px">
				<div class="content">
					<span class="name">设备数量</span>
					<div class="count">96/100</div>
				</div>
				<div class="content">
					<span class="name">账号数量</span>
					<div class="count">2796/3000</div>
				</div>
				<div class="content">
					<span class="name">已发布作品</span>
					<div class="count">12796</div>
				</div>
				<div class="content">
					<span class="name">播放量</span>
					<div class="count">42396</div>
					<div class="compare">
						较昨天 <span class="compCount">2421</span> <i class="el-icon-top"></i>
					</div>
				</div>
				<div class="content">
					<span class="name">直播场次</span>
					<div class="count">217</div>
				</div>
				<div class="content">
					<span class="name">粉丝量</span>
					<div class="count">2796030</div>
					<div class="compare">
						较昨天 <span class="compCount">21651</span> <i class="el-icon-bottom"></i>
					</div>
				</div>
				<div class="content">
					<span class="name">评论量</span>
					<div class="count">342210</div>
					<div class="compare">
						较昨天 <span class="compCount">24221</span> <i class="el-icon-top"></i>
					</div>
				</div>
				<div class="content">
					<span class="name">收藏量</span>
					<div class="count">23432</div>
					<div class="compare">
						较昨天 <span class="compCount">3421</span> <i class="el-icon-top"></i>
					</div>
				</div>
				<div class="content">
					<span class="name">分享量</span>
					<div class="count">54278</div>
					<div class="compare">
						较昨天 <span class="compCount">342</span> <i class="el-icon-top"></i>
					</div>
				</div>
				<div class="content">
					<span class="name">主页访问量</span>
					<div class="count">16534</div>
					<div class="compare">
						较昨天 <span class="compCount">2411</span> <i class="el-icon-top"></i>
					</div>
				</div>
			</div>
		</div>
		<!-- 视频数据趋势 -->
		<div class="showdata">
			<el-row type="flex" justify="space-between" style="margin-bottom: 18px">
				<el-col>
					<i class="el-icon-s-flag"></i>
					<span class="title">视频数据趋势</span>
				</el-col>
				<el-col>
					<el-row type="flex" justify="end">
						<chooseduration :btnData="videoChoose" @choosedur="chooseVideoDur"></chooseduration>
						<el-date-picker
							v-model="videoDate"
							type="daterange"
							range-separator="——"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							size="small"
						>
						</el-date-picker>
					</el-row>
				</el-col>
			</el-row>
			<choosetype
				:typeData="videotype"
				:curWidth="videotypewid"
				@changeType="changeVideoType"
			></choosetype>
			<div class="tip">
				<el-row type="flex" justify="space-between">
					<el-col>
						<span class="showcount">2022-12-05~2022-12-11</span>
						<span>转发</span>
						<span class="showcount">最高值为<i>401</i></span>
						<span class="showcount">最低值为<i>0</i></span>
						<span class="showcount">平均值为<i>103</i></span>
					</el-col>
					<el-col>
						<el-row type="flex" justify="end"> 统计时间: <span>2022-12-12 22:33:21</span> </el-row>
					</el-col>
				</el-row>
			</div>
			<div class="videoLine"></div>
		</div>
		<!-- 粉丝变化趋势 -->
		<div class="showdata">
			<el-row type="flex" justify="space-between" style="margin-bottom: 18px">
				<el-col>
					<i class="el-icon-s-flag"></i>
					<span class="title">粉丝变化趋势</span>
				</el-col>
				<el-col>
					<el-row type="flex" justify="end">
						<chooseduration :btnData="fansChoose" @choosedur="chooseFansDur"></chooseduration>
						<el-date-picker
							v-model="fansDate"
							type="daterange"
							range-separator="——"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							size="small"
						>
						</el-date-picker>
					</el-row>
				</el-col>
			</el-row>
			<choosetype
				:typeData="fanstype"
				:curWidth="fanstypewid"
				@changeType="changeFansType"
			></choosetype>
			<div class="tip">
				<el-row type="flex" justify="space-between">
					<el-col>
						<span class="showcount">2022-12-05~2022-12-11</span>
						<span class="showcount">粉丝<span>增长总量</span>为<i>32.9k</i></span>
					</el-col>
					<el-col>
						<el-row type="flex" justify="end"> 统计时间: <span>2022-12-12 22:33:21</span> </el-row>
					</el-col>
				</el-row>
			</div>
			<div class="fansLine"></div>
		</div>
	</div>
</template>

<script>
	import * as echarts from 'echarts';
	import chooseduration from '@/components/index/chooseduration.vue';
	import choosetype from '@/components/index/choosetype.vue';
	export default {
		name: 'TtIndex',

		data() {
			return {
				searchEquipmentList: [], // 分组数据
				searchTableData: {
					equipment: '',
				},
				equipmentLoading: false,
				btnloading: false,
				videoDate: '', // 视频趋势日期选择
				fansDate: '', // 粉丝变化趋势
				videoChoose: ['7天', '15天', '30天', '90天'],
				fansChoose: ['7天', '15天', '30天', '90天'],
				videotype: ['播放量', '点赞量', '评论量', '转发量'],
				fanstype: ['总量', '增量'],
				videotypewid: 300,
				fanstypewid: 175,
			};
		},

		components: {
			chooseduration,
			choosetype,
		},

		mounted() {
			this.showVideoLine();
			this.showFansLine();
		},

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
			// 点击查看按钮
			searchData() {},
			// 视频趋势图
			showVideoLine() {
				const myEcharts = echarts.init(document.querySelector('.videoLine'));
				myEcharts.setOption({
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow',
							shadowStyle: {
								color: '#ABD1FD',
								opacity: 0.1,
							},
						},
					},
					xAxis: {
						type: 'category',
						data: ['2000', '2001', '2002', '2003', '2004'],
					},
					yAxis: {
						type: 'value',
					},
					grid: {
						containLabel: true,
						left: '0%',
						right: '0%',
					},
					color: ['#5a72e0'],
					series: [
						{
							data: [820, 932, 901, 934, 1290],
							type: 'line',
							smooth: true,
						},
					],
				});
				window.addEventListener('resize', function () {
					myEcharts.resize();
				});
			},
			// 粉丝变化趋势图
			showFansLine() {
				const myEcharts = echarts.init(document.querySelector('.fansLine'));
				myEcharts.setOption({
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow',
							shadowStyle: {
								color: '#ABD1FD',
								opacity: 0.1,
							},
						},
					},
					xAxis: {
						type: 'category',
						data: ['2000', '2001', '2002', '2003', '2004'],
					},
					yAxis: {
						type: 'value',
					},
					grid: {
						containLabel: true,
						left: '0%',
						right: '0%',
					},
					color: ['#5a72e0'],
					series: [
						{
							data: [820, 932, 901, 934, 1290],
							type: 'line',
							smooth: true,
							itemStyle: {
								normal: {
									color: '#DB8067', //改变折线点的颜色
									lineStyle: {
										color: '#DB8067', //改变折线颜色
									},
								},
							},
						},
					],
				});
				window.addEventListener('resize', function () {
					myEcharts.resize();
				});
			},
			// 点击切换xxx量
			changeVideoType(count) {
				console.log(count);
			},
			// 点击切换粉丝xxx量
			changeFansType(count) {
				console.log(count);
			},
			// 选择时长 - 视频
			chooseVideoDur(index) {
				console.log(index);
			},
			// 选择时长 - 粉丝
			chooseFansDur(index) {
				console.log(index);
			},
		},
	};
</script>

<style lang="scss" scoped>
	@import '@/assets/base/_color_variables.scss';
	.tt-accsituation {
		background-color: #fff;
		margin-bottom: 20px;
		border-radius: 4px;
		padding: 0 12px;
		.tt-accsituation--operation {
			display: flex;
			height: 70px;
			line-height: 70px;
			.search {
				background-color: $button-back-color;
				border: $button-bord-color;
			}
		}
	}
	.showdata {
		background-color: #fff;
		margin-bottom: 20px;
		border-radius: 10px;
		padding: 14px;
		border: 1px solid #dedede;
		.el-icon-s-flag {
			margin-right: 6px;
			color: red;
		}
		.title {
			font-size: 16px;
			font-weight: 700;
		}
		.contentBox {
			display: flex;
			justify-content: space-evenly;
			flex-wrap: wrap;
			padding: 0 30px;
			.content {
				width: 230px;
				height: 72px;
				background-color: #efefef;
				border: 1px solid #bbb;
				border-radius: 4px;
				padding: 6px 12px;
				margin: 0 25px;
				margin-bottom: 40px;
				.name {
					font-size: 14px;
					font-weight: 700;
				}
				.count {
					margin-top: 5px;
					width: 100%;
					text-align: center;
					font-size: 20px;
					font-weight: 700;
				}
				.compare {
					text-align: center;
					font-size: 12px;
					color: #6c6c6c;
					.el-icon-top {
						color: red;
					}
					.el-icon-bottom {
						color: forestgreen;
					}
				}
			}
		}
		.tip {
			height: 40px;
			line-height: 40px;
			background-color: #f5f5f5;
			border: 1px solid #bbb;
			border-radius: 10px;
			font-size: 12px;
			padding: 0 8px;
			.showcount {
				margin-right: 16px;
				i {
					margin-left: 2px;
				}
			}
		}
		.videoLine {
			padding: 0 50px;
			height: 340px;
		}
		.fansLine {
			padding: 0 50px;
			height: 340px;
		}
	}
</style>
