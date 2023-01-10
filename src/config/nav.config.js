export default {
    ASIDE_LIST: [
        {
            title: '首页',
            to: '/index',
            icon: 'el-icon-s-tools',
        },
        {
            title: '账号管理',
            to: '',
            icon: 'el-icon-s-tools',
            children: [
                {
                    title: '账号信息',
                    to: '/accsituation',
                    icon: '',
                },
                {
                    title: '账号分组',
                    to: '/equgroup',
                    icon: '',
                }
            ]
        },
        {
            title: '任务管理',
            to: '',
            icon: 'el-icon-s-tools',
            children: [
                {
                    title: '采集任务',
                    to: '/collection',
                    icon: '',
                },
                {
                    title: '私信任务',
                    to: '/private',
                    icon: '',
                },
                {
                    title: '素材任务',
                    to: '/material',
                    icon: '',
                },
                {
                    title: '账号编辑任务',
                    to: '/accountedit',
                    icon: '',
                }
            ]
        },
        {
            title: '素材库',
            to: '',
            icon: 'el-icon-s-platform',
            children: [
                {
                    title: '头像素材',
                    to: '/headportrait',
                    icon: '',
                },
                {
                    title: '视频素材',
                    to: '/videomaterial',
                    icon: '',
                },
                {
                    title: '昵称素材',
                    to: '/nickmaterial',
                    icon: '',
                },
            ]
        },
        {
            title: '采集库',
            to: '/collibrary',
            icon: 'el-icon-s-platform'
        },
        {
            title: '任务日志',
            to: '/tasklog',
            icon: 'el-icon-s-platform'
        },
        {
            title: '流量查询',
            to: '/trafficquery',
            icon: 'el-icon-s-platform'
        },
        {
            title: '平台简介',
            to: '/platintroduction',
            icon: 'el-icon-s-platform'
        }
    ]

}