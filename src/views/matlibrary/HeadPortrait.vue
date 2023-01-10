<template>
  <div>
    <div class="img">
				<div v-for="(item, index) in tableData" :key="index" class="imgData">
					<el-image :src="item.image" class="imgsize"></el-image>
					<div :label="item.headimage_id" :key="item.headimage_id" class="imgNum"
						>头像编号:100{{ item.headimage_id }}</div
					>
					<div class="imgNum">上传时间:{{ item.usage_time }}</div>
				</div>
			</div>
      <pagination
			:total="total"
			:page="current_page"
			:limit="current_limit" 
			@pagination="handlePagination"
		>
		</pagination>
  </div>
</template>

<script>
import pagination from '@/components/myComponent/table/pagination.vue';
export default {
  name: 'HeadPortrait',
  components: { pagination},

  data() {
      return {
        total: 0, //数据总量
				current_page: 1, //当前页
				current_limit: 50, //每页条数
        tableData: [
          {
          api_user_id:"2",
          grouping_id:"3",
          grouping_name:"未分组",
          headimage_id:"10",
          image:"http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd50bd3909d.jpg",
          status:"1",
          type_title:"1",
          typecontrol_id:"46",
          usage_count:"0",
          usage_time:"1970-01-01 08:00:00"},
          {
          api_user_id:"2",
          grouping_id:"3",
          grouping_name:"未分组",
          headimage_id:"10",
          image:"http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd50bd3909d.jpg",
          status:"1",
          type_title:"1",
          typecontrol_id:"46",
          usage_count:"0",
          usage_time:"1970-01-01 08:00:00"},
          {
          api_user_id:"2",
          grouping_id:"3",
          grouping_name:"未分组",
          headimage_id:"10",
          image:"http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd50bd3909d.jpg",
          status:"1",
          type_title:"1",
          typecontrol_id:"46",
          usage_count:"0",
          usage_time:"1970-01-01 08:00:00"},
          {
          api_user_id:"2",
          grouping_id:"3",
          grouping_name:"未分组",
          headimage_id:"10",
          image:"http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd50bd3909d.jpg",
          status:"1",
          type_title:"1",
          typecontrol_id:"46",
          usage_count:"0",
          usage_time:"1970-01-01 08:00:00"},
          {
          api_user_id:"2",
          grouping_id:"3",
          grouping_name:"未分组",
          headimage_id:"10",
          image:"http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd50bd3909d.jpg",
          status:"1",
          type_title:"1",
          typecontrol_id:"46",
          usage_count:"0",
          usage_time:"1970-01-01 08:00:00"},
          {
          api_user_id:"2",
          grouping_id:"3",
          grouping_name:"未分组",
          headimage_id:"10",
          image:"http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd50bd3909d.jpg",
          status:"1",
          type_title:"1",
          typecontrol_id:"46",
          usage_count:"0",
          usage_time:"1970-01-01 08:00:00"},
          {
          api_user_id:"2",
          grouping_id:"3",
          grouping_name:"未分组",
          headimage_id:"10",
          image:"http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd50bd3909d.jpg",
          status:"1",
          type_title:"1",
          typecontrol_id:"46",
          usage_count:"0",
          usage_time:"1970-01-01 08:00:00"},
          {
          api_user_id:"2",
          grouping_id:"3",
          grouping_name:"未分组",
          headimage_id:"10",
          image:"http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd50bd3909d.jpg",
          status:"1",
          type_title:"1",
          typecontrol_id:"46",
          usage_count:"0",
          usage_time:"1970-01-01 08:00:00"},
          {
          api_user_id:"2",
          grouping_id:"3",
          grouping_name:"未分组",
          headimage_id:"10",
          image:"http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd50bd3909d.jpg",
          status:"1",
          type_title:"1",
          typecontrol_id:"46",
          usage_count:"0",
          usage_time:"1970-01-01 08:00:00"},
          {
          api_user_id:"2",
          grouping_id:"3",
          grouping_name:"未分组",
          headimage_id:"10",
          image:"http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd50bd3909d.jpg",
          status:"1",
          type_title:"1",
          typecontrol_id:"46",
          usage_count:"0",
          usage_time:"1970-01-01 08:00:00"},
          {
          api_user_id:"2",
          grouping_id:"3",
          grouping_name:"未分组",
          headimage_id:"10",
          image:"http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd50bd3909d.jpg",
          status:"1",
          type_title:"1",
          typecontrol_id:"46",
          usage_count:"0",
          usage_time:"1970-01-01 08:00:00"},
          {
          api_user_id:"2",
          grouping_id:"3",
          grouping_name:"未分组",
          headimage_id:"10",
          image:"http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd50bd3909d.jpg",
          status:"1",
          type_title:"1",
          typecontrol_id:"46",
          usage_count:"0",
          usage_time:"1970-01-01 08:00:00"},
        ], //表格数据
      };
  },

  mounted() {
      
  },

  methods: {
      		/*
           翻页回调
        */
			handlePagination(val) {
				this.current_page = val.page; //页数
				this.current_limit = val.limit; //请求数据量
			},

  },
};
</script>

<style scoped>
.img {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    max-height: 700px;
    overflow-y: scroll;
}
.imgData {
		width: 170px;
		margin: 10px 15px;
	}
  .imgsize {
		width: 125px;
		height: 125px;
		border-radius: 100px;
	}
  .imgNum {
		color: rgba(16, 16, 16, 1);
		font-size: 12px;
		text-align: left;
		padding-top: 5px;
	}

</style>