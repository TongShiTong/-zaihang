
<script>
	import http from 'components/utils/http.js'
	export default {
		onLaunch: function() {
			let that=this;
			//console.log('在这里读取用户的token和用户信息，并设置全局变量，声明用户登录状态');
			//初始化用户信息
			//已经在store中初始化完成了
			uni.authorize({
				scope:'scope.userInfo',
				success:(res)=>{
					//console.log(111,res);
				},
				fail:(res)=>{
					//console.log(222,res);
				},
			});
			
			var  wx_login=function(){
				if (typeof that.isLogin!="undefined"&&that.isLogin) {
					uni.login({
						success: (res) => {
							let code = res.code;
							http.apiRequest({
								api: "/api/user/weixinAppLogin",
								data: {
									code: code
								},
								secuss: (res, httpStatus) => {
									if (res.code == 1) {
										//用户登陆成功
										let userInfo = res.data
										uni.setStorageSync("token", userInfo.token)
										this.$store.state.isLogin = true;
										this.$store.state.group_id = userInfo.group_id;
										this.$store.state.user_id = userInfo.user_id;
										this.$store.state.userInfo = Object.assign({}, this.$store.state.userInfo, {
											id: userInfo.id,
											group_id: userInfo.group_id,
											username: userInfo.username,
											nickname: userInfo.nickname,
											mobile: userInfo.mobile,
											avatar: userInfo.avatar,
										});
										uni.setStorageSync("mobile",userInfo.mobile)
									}
								},
							});
						},
						fail: (res) => {
							//console.log(res);
						}
					})
				}
			}
			
			//检测登录是否过期
			//#ifdef MP-WEIXIN
			uni.checkSession({
				success:(res)=>{
					console.log("session有效，获取用户的userinfo和token,调用接口获取用户信息");
					http.apiRequest({
						api:"/api/user/userinfo",
						method:"GET",
						data:{},
						secuss:(res,httpStatus)=>{
							if(res.code==1){
								//获取用户信息成功
								let userInfo=res.data;
								this.$store.state.isLogin=true;
								this.$store.state.group_id=userInfo.group_id;
								this.$store.state.user_id=userInfo.user_id;
								this.$store.state.userInfo=Object.assign({}, this.$store.state.userInfo, {
									id:userInfo.id,
									group_id:userInfo.group_id,
									username:userInfo.username,
									nickname:userInfo.nickname,
									mobile:userInfo.mobile,
									avatar:userInfo.avatar,
								});
								console.log(userInfo);
							}else{
								//获取用户信息失败
								wx_login();
							}
						},
					});
				},
				fail:(res)=>{
					wx_login();
					//console.log("session无效，设置用户为游客，未登录状态");
					
				},
				complete:()=>{
					
				},
			});
			//#endif
			//console.log(this.$store);
			//this.$store.commit("token", token);
			
			//
			//console.log('App Launch');
			
		},
		onShow: function() {
			//隐藏后再打开，直接打开
			//console.log('App Show');
		},
		onHide: function() {
			//隐藏，，切屏，打开相册上传图片等功能都会触发
			//console.log('App Hide');
		},
	}
</script>

<style>
	/*每个页面公共css */
	page {
		min-height: 100%;
		display: flex;
	}
	button::after{ border: none;} 
	/* #ifdef MP-BAIDU */
	page {
		width: 100%;
		height: 100%;
		display: block;
	}

	swan-template {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* 原生组件模式下需要注意组件外部样式 */
	custom-component {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* #endif */

	/* #ifdef MP-ALIPAY */
	page {
		min-height: 100vh;
	}

	/* #endif */

	/* 原生组件模式下需要注意组件外部样式 */
	m-input {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	.content {
		display: flex;
		flex: 1;
		flex-direction: column;
		background: #fff;
		/* background-color: #efeff4; */
		padding: 0 30upx;
	}

	.input-group {
		background-color: #ffffff;
		margin-top: 40upx;
		position: relative;
	}

	.input-group::before {
		position: absolute;
		right: 0;
		top: 0;
		left: 0;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.input-group::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.input-row {
		display: flex;
		flex-direction: row;
		position: relative;
	}

	.input-row .title {
		width: 20%;
		height: 50upx;
		min-height: 50upx;
		padding: 15upx 0;
		padding-left: 30upx;
		line-height: 50upx;
	}

	.input-row.border::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 15upx;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.btn-row {
		margin-top: 50upx;
		padding: 20upx;
	}

	button.primary {
		background-color: #0faeff;
	}
</style>
