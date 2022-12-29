<template>
	<div class="typechange" :style="{width: curWidth + 'px'}">
    <div v-for="(item,index) in typeData" :key="index" @click="changeType(index)" :class="isDivAct == index ? 'videodivact' : ''">
			播放量
		</div>
	</div>
</template>

<script>
	export default {
    props: {
      typeData: {
        type: Array,
        required: true,
        validator(value) {
          return value.length >= 2
        }
      },
      curWidth: {
        type: Number
      }
    },
    data() {
      return {
        isDivAct: 0
      }
    },

    methods: {
      // 点击切换xxx量
			changeType(count) {
        this.$emit('changeType',count)
				this.isDivAct = count;
			}
    }
  };
</script>

<style lang="scss" scoped>
.typechange {
			// width: 300px;
			height: 42px;
			border-radius: 20px;
			border: 1px solid #bbb;
			padding: 5px 6px;
			margin-bottom: 10px;
			display: flex;
			.videodivact {
				border: 1px solid #000;
			}
			div {
				width: 80px;
				height: 30px;
				line-height: 30px;
				text-align: center;
				font-size: 14px;
				border: 1px solid #bbb;
        cursor:pointer;
			}
      div:first-child{
        border-radius: 15px 0 0 15px;
      }
      div:last-child{
        border-radius: 0 15px 15px 0;
      }
		}
</style>
