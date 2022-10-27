export default {
    state:{
        //登录状态
        loginStatus:false,
        //token
        token:null,
        //用户信息
        userInfo:{}
    },
    mutations:{
        login(state,userInfo){
            ///持久化存储=》本地存储
            localStorage.setItem('',JSON.stringify(userInfo));
        }

    },
    actions:{

    }
}