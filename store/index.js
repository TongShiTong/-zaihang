import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        /**
         * 是否需要强制登录
         */
        forcedLogin: false,
        hasLogin: false,
        userName: "",
		token:"",
		//user_id:"",
		
		
		isLogin:false,
		group_id:0,
		user_id:0,
		//token:"",
		userInfo:{
			id:0,
			user_id:0,
			group_id:0,
			username:"游客",
			nickname:"游客",
			mobile:"",
			avatar:"",
			title:"",
		},
		
    },
    mutations: {
        login(state, userName) {
            state.userName = userName || '新用户';
            state.hasLogin = true;
        },
        logout(state) {
            state.userName = "";
            state.hasLogin = false;
        },
		token(state,token) {
			state.token=token
			console.log( "0",state.token)
			return state.token
		},
		user_id(state,user_id) {
			state.user_id = user_id
			console.log("1",state.user_id)
			return state.user_id 
		},
		chacktoken(state) {
			if(state.token){
				state.hasLogin = true;
			}
		}
    }
})

export default store
