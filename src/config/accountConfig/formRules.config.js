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
        grouping_id:[
          { required: true, message: "请选择分组", trigger: "change" },
        ]
      },
      'BatchEditor':{
        groupId:[
          { required: true, message: "请选择分类", trigger: "change" },
        ],
        typeId:[
          { required: true, message: "请选择分组", trigger: "change" },
        ]
      }
}