<template>
    <div>
            <div class="video">
				<div v-for="(item, index) in tableData" :key="index" class="videoData">
					<video controls loop :src="item.video_url" class="videosize"></video>
					<div :label="item.headimage_id" :key="item.headimage_id" class="videoNum"
						>头像编号:100{{ item.headimage_id }}</div
					>
					<div class="videoNum">上传时间:{{ item.usage_time }}</div>
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
    name: 'VideoMaterial',
    components: { pagination},
    data() {
        return {
            tableData:[
                {
                    add_time: "2023-01-10 20:22:27",
                    api_user_id: "2",
                    grouping_id: "1",
                    grouping_name: "测试",
                    material_id: "79",
                    pic: "",
                    status: "1",
                    type_title: "美女",
                    typecontrol_id: "1",
                    usage_time: "",
                    user_id: "",
                    video_num: "10079",
                    video_url: "http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd588321e8b.mp4"},
                {
                    add_time: "2023-01-10 20:22:27",
                    api_user_id: "2",
                    grouping_id: "1",
                    grouping_name: "测试",
                    material_id: "79",
                    pic: "",
                    status: "1",
                    type_title: "美女",
                    typecontrol_id: "1",
                    usage_time: "",
                    user_id: "",
                    video_num: "10079",
                    video_url: "http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd588321e8b.mp4"},
                {
                    add_time: "2023-01-10 20:22:27",
                    api_user_id: "2",
                    grouping_id: "1",
                    grouping_name: "测试",
                    material_id: "79",
                    pic: "",
                    status: "1",
                    type_title: "美女",
                    typecontrol_id: "1",
                    usage_time: "",
                    user_id: "",
                    video_num: "10079",
                    video_url: "http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd588321e8b.mp4"},
                {
                    add_time: "2023-01-10 20:22:27",
                    api_user_id: "2",
                    grouping_id: "1",
                    grouping_name: "测试",
                    material_id: "79",
                    pic: "",
                    status: "1",
                    type_title: "美女",
                    typecontrol_id: "1",
                    usage_time: "",
                    user_id: "",
                    video_num: "10079",
                    video_url: "http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd588321e8b.mp4"},
                {
                    add_time: "2023-01-10 20:22:27",
                    api_user_id: "2",
                    grouping_id: "1",
                    grouping_name: "测试",
                    material_id: "79",
                    pic: "",
                    status: "1",
                    type_title: "美女",
                    typecontrol_id: "1",
                    usage_time: "",
                    user_id: "",
                    video_num: "10079",
                    video_url: "http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd588321e8b.mp4"},
                {
                    add_time: "2023-01-10 20:22:27",
                    api_user_id: "2",
                    grouping_id: "1",
                    grouping_name: "测试",
                    material_id: "79",
                    pic: "",
                    status: "1",
                    type_title: "美女",
                    typecontrol_id: "1",
                    usage_time: "",
                    user_id: "",
                    video_num: "10079",
                    video_url: "http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd588321e8b.mp4"},
                {
                    add_time: "2023-01-10 20:22:27",
                    api_user_id: "2",
                    grouping_id: "1",
                    grouping_name: "测试",
                    material_id: "79",
                    pic: "",
                    status: "1",
                    type_title: "美女",
                    typecontrol_id: "1",
                    usage_time: "",
                    user_id: "",
                    video_num: "10079",
                    video_url: "http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd588321e8b.mp4"},
                {
                    add_time: "2023-01-10 20:22:27",
                    api_user_id: "2",
                    grouping_id: "1",
                    grouping_name: "测试",
                    material_id: "79",
                    pic: "",
                    status: "1",
                    type_title: "美女",
                    typecontrol_id: "1",
                    usage_time: "",
                    user_id: "",
                    video_num: "10079",
                    video_url: "http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd588321e8b.mp4"},
                {
                    add_time: "2023-01-10 20:22:27",
                    api_user_id: "2",
                    grouping_id: "1",
                    grouping_name: "测试",
                    material_id: "79",
                    pic: "",
                    status: "1",
                    type_title: "美女",
                    typecontrol_id: "1",
                    usage_time: "",
                    user_id: "",
                    video_num: "10079",
                    video_url: "http://192.168.4.30:8087/uploads/uploadfiles/api/202301/63bd588321e8b.mp4"},
            ],
            total: 0, //数据总量
				current_page: 1, //当前页
				current_limit: 50, //每页条数
            
        };
    },
  
    mounted() {
        
    },
  
    methods: {
            
    /* 
        function: handlePagination
        params: val | 默认参数
        desc: 页面回调
    */
    handlePagination(val) {
      this.current_page = val.page; //页数
      this.current_limit = val.limit; //条数
    },
    },
  };
  </script>
  
  <style scoped>
  .video {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    max-height: 700px;
    overflow-y: scroll;
}
.videoData {
		width: 170px;
		margin: 10px 15px;
	}
    .videosize {
		width: 100%;
		height: 266px;
	}
    .videoNum {
		color: rgba(16, 16, 16, 1);
		font-size: 12px;
		text-align: left;
		padding-top: 5px;
	}
  </style>