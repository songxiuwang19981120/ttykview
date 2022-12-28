<template>
	<div style="margin-right: 36px" class="chooseduration">
		<button v-for="(item,index) in btnData" :key="index" @click="chooseduration(index)" :class="curActive == index ? 'curactive' : ''">{{item}}</button>
	</div>
</template>

<script>
	export default {
    props: {
      btnData: {
        type: Array,
        required: true
      }
    },

		data() {
			return {
				curActive: 0
			}
		},

		methods: {
			chooseduration(index) {
				this.curActive = index
				this.$emit('choosedur',index)
			}
		}
  };
</script>

<style lang="scss" scoped>
	.chooseduration {
		button {
			height: 32px;
			background-color: #fff;
			padding: 0 20px;
			border: 1px solid #abd1fd;
		}
		.curactive{
			border: 1px solid blue;
		}
	}
</style>
