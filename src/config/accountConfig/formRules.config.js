export default {
    'follow':{
      account_region:[
        {required: true,message:"请选择国家",trigger: "change"},
        ],
        user_chat_upper_limit:[
          {required: true,message:"请填写单号私信上限",trigger: "blur"},
        ],
        total_task_num:[
          {required: true,message:"请填写总私信上限",trigger: "blur"},
        ],
        task_name:[
          {required: true,message:"请备注任务名称",trigger: "blur"},
        ],
        privateletter_id:[
          {required: true,message:"请选择私信素材",trigger: "change"},
        ],
        type_list:[
          {required: true,message:"请选择类型",trigger: "change"},
        ],
      },
      'letter':{
        account_region:[
          {required: true,message:"请选择国家",trigger: "change"},
        ],
        tasklist_id_list:[
          {required: true,message:"请选择数据来源",trigger: "change"},
        ],
        user_follow_upper_limit:[
          {required: true,message:"请设置每日需关注上限",trigger: "blur"},
        ],
        can_fail_num:[
          {required: true,message:"请设置连续失败次数",trigger: "blur"},
        ],
        follower_status:[
        {required: true,message:"请填写粉丝量小于次数",trigger: "blur"},
        { pattern: /^\d+$/, message: '格式 必须为正整数', trigger: 'blur' }
        ],
        following_count:[
          {required: true,message:"请填写关注数量小于次数",trigger: "blur"},
          {pattern: /^\d+$/, message: '格式 必须为正整数', trigger: 'blur' }
        ],
        total_favorited:[
          {required: true,message:"请填写获赞评论小于次数",trigger: "blur"},
          {pattern: /^\d+$/, message: '格式 必须为正整数', trigger: 'blur' }
        ],
        black_list:[
          {required: true,message:"请配置黑名单",trigger: "change"}
        ]
      },
      'likeComment':{
        account_region:[
          {required: true,message:"请选择国家",trigger: "blur"},
        ],
        tasklist_id_list:[
          {required: true,message:"请选择数据来源",trigger: "blur"},
        ],
        user_digg_upper_limit:[
        {required: true,message:"请填写点赞上限",trigger: "blur"},
        { pattern: /^\d+$/, message: '格式 必须为正整数', trigger: 'blur' }
        ],
        black_list:[
          {required: true,message:"请选择黑名单",trigger: "change"},
        ],
        acc_likenum_max:[
          {required: true,message:"请填写点赞上限",trigger: "blur"},
          {pattern: /^\d+$/, message: '格式 必须为正整数', trigger: 'blur' }
        ],
        can_fail_num:[
          {required: true,message:"请填写失败次数",trigger: "blur"},
          {pattern: /^\d+$/, message: '格式 必须为正整数', trigger: 'blur' }
        ],
        source_data:[
          {required: true,message:"请选择数据来源",trigger: "change"}
        ]
      },
      'video': {
        video_num: [
          {
            required: true,
            message: "请填写发布数量",
            trigger: "blur",
          },
        ],
      },
      'editorDialog':  {
        typecontrol_id: [
          { required: true, message: "请选择分类", trigger: "change" },
        ],
      },
}