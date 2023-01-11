<template>
	<div class="axis-contain">
		<span class="axis-title">流量</span>
		<div class="axis">
			<axis ref="axis" chartId="axis" height="476px" width="100%"></axis>
		</div>
    <el-row type="flex" justify="end" class="surplusflow">
      剩余流量：{{surplusFlow}}M
    </el-row>
	</div>
</template>

<script>
	import axis from '@/components/myComponent/echarts/axis.vue';

	export default {
		name: 'Trafficquery',

		data() {
			return {
				axis: ['1月', '2月', '3月', '4月', '5月'], // xaxios
				axisData: [100, 145, 235, 100, 130], // 图表数据
        surplusFlow: 35412, // 剩余流量
			};
		},

		components: {
			axis,
		},

		mounted() {
			this.initAxis();
		},

		methods: {
			// 流量趋势图初始化
			initAxis() {
				let chartData = [
					{
						data: this.axisData,
						type: 'line',
						// smooth: true,
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
				let xAxis = this.axis;
				this.$refs.axis.getIint(chartData, xAxis);
			},
		},
	};
</script>

<style lang="scss" scoped>
	.axis-contain {
		padding: 78px 0;
    .axis-title{
      font-size: 28px;
      font-weight: 700;
    }
		.axis {
			padding: 0 50px;
		}
    .surplusflow {
      margin-right: 50px;
      font-size: 28px;
      font-weight: 700;
    }
	}
</style>
