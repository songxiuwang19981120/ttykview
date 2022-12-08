export default {
    //Autograph API start
    'getAutograph': {
        url: '/Autograph/index',
        method: 'POST',
    },
    'addAutograph':{
        url: '/Autograph/add',
        method: 'POST',
    },
    'updateAutograph':{
        url: '/Autograph/update',
        method: 'POST',
    },
    'deleteAutograph':{
        url: '/Autograph/delete',
        method: 'POST',
    },
    'viewAutograph':{
        url: '/Autograph/view',
        method: 'GET',
    },
    //Autograph API end

    //file API start
    'uploadFile': {
      url: '/Base/upload',
      method: 'POST',
    },
    'imgAuthor': {
      url: '/Base/captcha',
      method: 'GET',
    },
    //file API end


    //comment API start
    'getCommentList': {
      url: '/Commentlist/index',
      method: 'POST',
    },
    'addCommentList': {
      url: '/Commentlist/add',
      method: 'POST',
    },
    'updateCommentList': {
      url: '/Commentlist/update',
      method: 'POST',
    },
    'deleteCommentList': {
      url: '/Commentlist/delete',
      method: 'POST'
    },
    'viewCommenList': {
      url: '/Commentlist/view',
      method: 'POST'
    },
    //comment API end


    //fans API start
    'getFansList': {
      url: '/Fanslist/index',
      method: 'POST'
    },
    //fans API end


    //Following API start
    'getFollowingList': {
      url: '/Followinglist/index',
      method: 'POST'
    },
    //Following API end


    //Grouping API start
    'getGrouping': {
      url: '/Grouping/index',
      method: 'POST'
    },
    'addGrouping': {
      url: '/Grouping/add',
      method: 'POST'
    },
    'updateGrouping': {
      url: '/Grouping/update',
      method: 'POST'
    },
    'deletaGrouping': {
      url: '/Grouping/delete',
      method: 'POST'
    },
    //Grouping API end


    //Headimage  API start
    'getHeadimageList': {
      url: '/Headimage/index',
      method: 'POST',
    },
    'addHeadimage': {
        url: '/Headimage/add',
        method: 'POST',
      },
      'updateHeadimage': {
        url: '/Headimage/update',
        method: 'POST',
      },
      'deleteHeadimage': {
        url: '/Headimage/delete',
        method: 'POST',
      },
      'viewHeadimage': {
        url: '/Headimage/view',
        method: 'GET',
      },
      //Headimage API end

      //Likeworks API start
      'getLikeWorksList': {
        url: '/Likeworks/index',
        method: 'POST',
      },
      'addLikeWorks': {
        url: '/Likeworks/add',
        method: 'POST',
      },
      'deleteLikeWorks': {
        url: '/Likeworks/delete',
        method: 'POST',
      },
      //Likeworks API end

      //Material API start
      'getMaterialList': {
        url: '/Material/index',
        method: 'POST',
      },
      'addMaterial': {
        url: '/Material/add',
        method: 'POST',
      },
      'updateMaterial': {
        url: '/Material/update',
        method: 'POST',
      },
      'deleteMaterial': {
        url: '/Material/delete',
        method: 'POST',
      },
      //Material API end

      //Member API start
      'getMember': {
        url: '/Member/index',
        method: 'POST',
      },
      'addMember': {
        url: '/Member/add',
        method: 'POST',
      },
      'deleteMember': {
        url: '/Member/delete',
        method: 'POST',
      },
      //Member API end

      //Membervideo  API start
      'getMemberList': {
        url: '/Membervideo/index',
        method: 'POST',
      },
      'addMemberVideo': {
        url: '/Membervideo/add',
        method: 'POST',
      },
      'updateMember': {
        url: '/Membervideo/update',
        method: 'POST',
      },
      'deleteMemberVideo': {
        url: '/Membervideo/delete',
        method: 'POST',
      },
      'viewMemberCollection': {
        url: '/Membervideo/collection_video',
        method: 'POST',
      },
      'viewMember': {
        url: '/Membervideo/view',
        method: 'POST',
      },
      //Membervideo  API end

      //Nickname   API start
      'getNickName': {
        url: '/Nickname/index',
        method: 'POST',
      },
      'addNickName': {
        url: '/Nickname/add',
        method: 'POST',
      },
      'updateNickName': {
        url: '/Nickname/update',
        method: 'POST',
      },
      'deleteNickName': {
        url: '/Nickname/delete',
        method: 'POST',
      },
      'viewNickName': {
        url: '/Nickname/view',
        method: 'POST',
      },
      //Nickname  API end


      //Videotasks API start
      'getVideotasks': {
        url: '/Videotasks/index',
        method: 'POST',
      },
      'addVideotasks': {
        url: '/Videotasks/add',
        method: 'POST',
      },
      'updateVideotasks': {
        url: '/Videotasks/update',
        method: 'POST',
      },
      'deleteVideotasks': {
        url: '/Videotasks/delete',
        method: 'POST',
      },
      //Videotasks API end


      //Videotaskdetails  API start
      'getVideotaskdetails': {
        url: '/Videotaskdetails/index',
        method: 'POST',
      },
      'addVideotaskdetails': {
        url: '/Videotaskdetails/add',
        method: 'POST',
      },
      'updateVideotaskdetails': {
        url: '/Videotaskdetails/update',
        method: 'POST',
      },
      'deleteVideotaskdetails': {
        url: '/Videotaskdetails/delete',
        method: 'POST',
      },
      //Videotaskdetails  API end


      //Videocomments  API start
      'getVideocomments': {
        url: '/Videocomments/index',
        method: 'POST',
      },
      'addVideocomments': {
        url: '/Videocomments/add',
        method: 'POST',
      },
      'updateVideocomments': {
        url: '/Videocomments/update',
        method: 'POST',
      },
      'deleteVideocomments': {
        url: '/Videocomments/delete',
        method: 'POST',
      },
      //Videocomments  API end


      //Videocommentdetails API start
      'getVideocommentdetails': {
        url: '/Videocommentdetails/index',
        method: 'POST',
      },
      'addVideocommentdetails': {
        url: '/Videocommentdetails/add',
        method: 'POST',
      },
      'deleteVideocommentdetails': {
        url: '/Videocommentdetails/delete',
        method: 'POST',
      },
      //Videocommentdetails API end


      //User  API start
      'getUser': {
        url: '/User/index',
        method: 'POST',
      },
      'addUser': {
        url: '/User/add',
        method: 'POST',
      },
      'updateUser': {
        url: '/User/update',
        method: 'POST',
      },
      'updateUserPassword': {
        url: '/User/updatePassword',
        method: 'POST',
      },
      'loginUserPassword': {
        url: '/User/login',
        method: 'POST',
      },
      //User  API end


      'getTypecontrol': {
        url: '/Typecontrol/index',
        method: 'POST',
      },
      'addTypecontrol': {
        url: '/Typecontrol/add',
        method: 'POST',
      },
      'updateTypecontrol': {
        url: '/Typecontrol/update',
        method: 'POST',
      },
      'deleteTypecontrol': {
        url: '/Typecontrol/delete',
        method: 'POST',
      },
      'viewTypecontrol': {
        url: '/Typecontrol/view',
        method: 'GET',
      },



  }



  //昵称   跳转TIkTOK首页 参数  unique_id   https://www.tiktok.com/@7164384802589606918（unique_id）
  //