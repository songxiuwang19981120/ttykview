export default {
    'accSituation': [
        //表格组件options（包含模板）      用来渲染表格
        {
          prop: "phone_number",
          label: "设备信息",
          align: "center",
          fixed: true,
          render: (h, { row }) => {
            return (
              <div>
                <el-tooltip
                  content="Top center"
                  placement="bottom"
                  effect="light"
                >
                  <span>{row.phone_number}</span>
                </el-tooltip>
              </div>
            );
          },
        },

        {
          prop: "avatar_thumb",
          label: "头像",
          width: "100",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                <el-image
                  src={row.avatar_thumb}
                  style="width: 60px; height: 60px"
                ></el-image>
              </div>
            );
          },
        },
        {
          prop: "nickname" ?? "匿名用户",
          label: "昵称",
          width: "150",
          align: "center",
        },
        {
          prop: "type_title" ?? "暂无类型",
          label: "账号类型",
          width: "160",
          align: "center",
        },
        {
          prop: "status",
          label: "状态",
          width: "100",
          align: "center",
          render: (h, { row }) => {
            return (
              <div class={row.status === "1" ? "bgcgreen" : "bgcred"}></div>
            );
          },
        },
        {
          prop: "signature" ?? "暂无签名",
          label: "签名",
          width: "200",
          align: "center",
        },
        {
          prop: "aweme_count" ?? 0,
          label: "视频数量",
          width: "100",
          align: "center",
          render: (h, { row }) => {
            return (
              <span
                onClick={this.showVideoTabel.bind(this, row)}
                class="videonum-span"
              >
                {row.aweme_count}
              </span>
            );
          },
        },
        {
          prop: "unread_viewer_count" ?? "",
          label: "主页访问人数",
          width: "150",
          align: "center",
          render: (h, { row }) => {
            return (
              <span
                class="videonum-span"
                onClick={this.toogleViewerTabel.bind(this, row)}
              >
                {row.unread_viewer_count}
              </span>
            );
          },
        },
        {
          prop: "follower_status",
          label: "粉丝量",
          width: "100",
          align: "center",
        },
        {
          prop: "following_status,following_count,play_num" ?? "暂无数据",
          label: "关注/获赞/播放",
          width: "150",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                {row.following_count} / {row.total_favorited} / {row.play_num}
              </div>
            );
          },
        },
        {
          prop: "operation",
          label: "操作",
          width: "190",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                <el-button
                  size="mini"
                  onClick={this.handleEdit.bind(this, row)}
                  type="primary"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  onClick={this.handleDelete.bind(this, row)}
                >
                  删除
                </el-button>
              </div>
            );
          },
        },
      ],
    'videoTable':[
        {
          prop: "nickname",
          label: "昵称",
          align: "center",
          width: "150",
        },
        {
          prop: "country",
          label: "国家",
          align: "center",
        },
        {
          prop: "signature",
          label: "签名",
          align: "center",
          minwidth: "200",
        },

        {
          prop: "avatar_thumb",
          label: "头像",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                <el-image
                  src={row.avatar_thumb}
                  style="width: 60px; height: 60px"
                ></el-image>
              </div>
            );
          },
        },

        {
          prop: "aweme_count",
          label: "视频数量",
          align: "center",
        },

        {
          prop: "follower_status,follow_status",
          label: "操作",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                <el-button
                  onClick={this.handleFollow.bind(this, row)}
                  v-show={
                    row.follower_status === "0" && row.follow_status === "0"
                  }
                >
                  关注
                </el-button>
                <el-button
                  v-show={
                    row.follower_status === "1" && row.follow_status === "0"
                  }
                >
                  回关
                </el-button>
                <el-button v-show={row.follow_status === "2"}>私信</el-button>
              </div>
            );
          },
        },
      ],
}