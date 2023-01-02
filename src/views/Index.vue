<template>
	<div>
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
						较昨天 <span class="compCount">2421</span>
						<img class="up" src="../assets/up.png" alt="" />
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
						较昨天 <span class="compCount">21651</span>
						<img class="down" src="../assets/down.png" alt="" />
					</div>
				</div>
				<div class="content">
					<span class="name">评论量</span>
					<div class="count">342210</div>
					<div class="compare">
						较昨天 <span class="compCount">24221</span>
						<img class="down" src="../assets/up.png" alt="" />
					</div>
				</div>
				<div class="content">
					<span class="name">收藏量</span>
					<div class="count">23432</div>
					<div class="compare">
						较昨天 <span class="compCount">3421</span>
						<img class="down" src="../assets/up.png" alt="" />
					</div>
				</div>
				<div class="content">
					<span class="name">分享量</span>
					<div class="count">54278</div>
					<div class="compare">
						较昨天 <span class="compCount">342</span>
						<img class="down" src="../assets/up.png" alt="" />
					</div>
				</div>
				<div class="content">
					<span class="name">主页访问量</span>
					<div class="count">16534</div>
					<div class="compare">
						较昨天 <span class="compCount">2411</span>
						<img class="down" src="../assets/up.png" alt="" />
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
						<el-date-picker
							v-model="videoDate"
							type="daterange"
							range-separator="——"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							size="small"
							:picker-options="videoOptions"
							@change="videoTimeChange"
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
			<div class="videoLine">
				<axis ref="videoAxis" chartId="videoAxis" height="340px" width="100%"></axis>
			</div>
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
						<el-date-picker
							v-model="fansDate"
							type="daterange"
							range-separator="——"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							size="small"
							:picker-options="fansOptions"
							@change="fansTimeChange"
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
			<div class="fansLine">
				<axis ref="fansAxis" chartId="fansAxis" height="340px" width="100%"></axis>
			</div>
		</div>
	</div>
</template>

<script>
	import choosetype from '@/components/index/choosetype.vue';
	import axis from '@/components/myComponent/echarts/axis.vue';

	export default {
		name: 'TtIndex',

		data() {
			return {
				btnloading: false,
				videoDate: '', // 视频趋势日期选择
				fansDate: '', // 粉丝变化趋势
				videotype: ['播放量', '点赞量', '评论量', '转发量'],
				fanstype: ['总量', '增量'],
				videotypewid: 300,
				fanstypewid: 175,
				curVideoType: '', // 当前类型
				curFansType: '', // 当前类型
				curVideoDur: '', // 当前日期间隔
				curFansDur: '', // 当前日期间隔
				videoData: [1000, 2500, 2000, 3000, 5000, 2000, 2500],
				fansData: [1000, 2500, 2000, 3000, 5000, 2000, 2500],
				videoAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
				fansAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
				videoOptions: {
					shortcuts: [
						{
							text: '最近一周',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
								picker.$emit('pick', [start, end]);
							},
						},
						{
							text: '最近半个月',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
								picker.$emit('pick', [start, end]);
							},
						},
						{
							text: '最近一个月',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
								picker.$emit('pick', [start, end]);
							},
						},
						{
							text: '最近三个月',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
								picker.$emit('pick', [start, end]);
							},
						},
					],
				},
				fansOptions: {
					shortcuts: [
						{
							text: '最近一周',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
								picker.$emit('pick', [start, end]);
							},
						},
						{
							text: '最近半个月',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
								picker.$emit('pick', [start, end]);
							},
						},
						{
							text: '最近一个月',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
								picker.$emit('pick', [start, end]);
							},
						},
						{
							text: '最近三个月',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
								picker.$emit('pick', [start, end]);
							},
						},
					],
				},
			};
		},

		components: {
			choosetype,
			axis,
		},

		mounted() {
			this.initVideoAxis();
			this.initFansAxis();
		},

		methods: {
			// 视频趋势图
			initVideoAxis() {
				let chartData = [
					{
						data: this.videoData,
						type: 'line',
						smooth: true,
						itemStyle: {
							normal: {
								color: '#0052D9', //改变折线点的颜色
								lineStyle: {
									color: '#0052D9', //改变折线颜色
								},
							},
						},
					},
				];
				let xAxis = this.videoAxis;
				this.$refs.videoAxis.getIint(chartData, xAxis);
			},

			// 粉丝变化趋势图
			initFansAxis() {
				let chartData = [
					{
						data: this.fansData,
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
				];
				let xAxis = this.fansAxis;
				this.$refs.fansAxis.getIint(chartData, xAxis);
			},

			// 点击切换xxx量
			changeVideoType(count) {
				if (count == 0) {
					this.videoData = [1000, 2500, 2000, 3000, 5000, 2000, 2500];
				} else if (count == 1) {
					this.videoData = [2100, 3000, 2000, 1200, 3000, 2800, 1000];
				} else if (count == 2) {
					this.videoData = [2500, 1800, 4000, 3200, 3600, 3800, 1900];
				} else if (count == 3) {
					this.videoData = [1500, 3000, 1800, 4200, 2000, 3800, 2100];
				}
				this.initVideoAxis();
			},
			// 点击切换粉丝xxx量
			changeFansType(count) {
				if (count == 0) {
					this.fansData = [1000, 2500, 2000, 3000, 5000, 2000, 2500];
				} else if (count == 1) {
					this.fansData = [2100, 3000, 4000, 1200, 3000, 2800, 1000];
				}
				this.initFansAxis();
			},
			// 日历 - 视频
			videoTimeChange() {
				console.log(this.videoDate);
			},
			// 日历 - 粉丝
			fansTimeChange() {
				console.log(this.fansDate);
			},
		},
	};
</script>

<style lang="scss" scoped>
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
					.up,
					.down {
						width: 12px;
						height: 12px;
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
