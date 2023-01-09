<template>
	<div class="ttproject-wrap">
		<el-row class="tt-hd">
			<el-header class="tt-header--wrap">
				<BaseHeader />
			</el-header>
		</el-row>
		<el-row>
			<el-col :span="3">
				<el-aside class="tt-aside--wrap">
					<BaseAside />
				</el-aside>
			</el-col>
			<el-col :span="21">
				<el-main class="tt-main">
					<router-view></router-view>
				</el-main>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import BaseAside from '@/components/base/BaseAide';
	import BaseHeader from '@/components/base/BaseHeader';
	export default {
		name: 'TtLayOut',
		components: { BaseAside, BaseHeader },
		data() {
			return {};
		},

		mounted() {},

		methods: {},
	};
</script>

<style lang="scss" scoped>
	.ttproject-wrap {
		height: 100%;
	}

	.tt-aside--wrap {
		width: 100% !important;
		height: calc(100vh - 70px);
	}

  .tt-hd {
    height: 70px;
    background-color: #1890FF;
  }

	.tt-header--wrap {
		height: 100% !important;
		padding: 10px 20px 10px;
		box-shadow: 10px 10px 10px #221e1e;
	}

	.tt-main {
		width: 100% !important;
		height: calc(100vh - 70px);
		box-sizing: border-box;
		background-color: #efefef;
		padding: 10px 20px 10px;
	}
</style>
