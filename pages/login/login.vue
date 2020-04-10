<template>
    <view class="content">
        <view class="oauth-row" v-if="hasProvider" v-bind:style="{top: positionTop + 'px'}">
            <view class="oauth-image" v-for="provider in providerList" :key="provider.value">
				<view @tap="oauth(provider.value)">微信登录</view>
				<view @tap="click">微信登录</view>
            </view>
        </view>
    </view>
</template>

<script>
    import service from '../../service.js'
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import mInput from '../../components/m-input.vue'
	import http from '../../components/utils/http.js'

    export default {
        components: {
            mInput
        },
        data() {
            return {
                providerList: [],
                hasProvider: false,
                account: '',
                password: '',
                positionTop: 0
            }
        },
        computed: mapState(['forcedLogin']),
		mounted(){
			console.log("123",this);
		},
		onLoad() {
			var pageObject={
				onGotUserInfo: function(e) {
					console.log(e.detail.errMsg)
					console.log(e.detail.userInfo)
					console.log(e.detail.rawData)
				},
			}
			// this.onGotUserInfo()
		},
        methods: {
            ...mapMutations(['login']),
			onGotUserInfo(e) {
				// console.log("123",e)
			},
			click () {
				let opts = {
					url: '/api/user/login',
					method: 'GET',
				};
				let param = {
					account: "test1",
					password: '123456'
				};
				http.httpTokenRequest(opts, param).then(res => {
						console.log(res.data);
						if(res.data.code == 1){
							const token = res.data.data.userinfo.token
							const user_id = res.data.data.userinfo.user_id
							this.$store.commit("token", token);
							console.log(user_id)
							this.$store.commit('user_id',user_id)
							uni.setStorageSync("token",token)
							uni.showToast({
								title: res.data.msg
							});
							setTimeout(()=>{
								// uni.switchTab({
									this.toMain(res.data.data.userinfo.nickname);
								    // url: '/pages/main/main'
								// });
							},500)	 
						}else{
							uni.showToast({
								title: res.data.msg
							});
						}
					},error => {
					console.log(error)
				})
			},
            initProvider() {
                const filters = ['weixin', 'qq', 'sinaweibo'];
                uni.getProvider({
                    service: 'oauth',
                    success: (res) => {
						console.log(res)
                        if (res.provider && res.provider.length) {
                            for (let i = 0; i < res.provider.length; i++) {
                                if (~filters.indexOf(res.provider[i])) {
                                    this.providerList.push({
                                        value: res.provider[i],
                                        image: '../../static/img/' + res.provider[i] + '.png'
                                    });
                                }
                            }
							console.log(1)
                            this.hasProvider = true;
                        }
                    },
                    fail: (err) => {
                        console.error('获取服务供应商失败：' + JSON.stringify(err));
                    }
                });
            },
            initPosition() {
                /**
                 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
                 * 反向使用 top 进行定位，可以避免此问题。
                 */
                this.positionTop = uni.getSystemInfoSync().windowHeight - 490;
            },
            bindLogin() {
                /**
                 * 客户端对账号信息进行一些必要的校验。
                 * 实际开发中，根据业务需要进行处理，这里仅做示例。
                 */
                if (this.account.length < 5) {
                    uni.showToast({
                        icon: 'none',
                        title: '账号最短为 5 个字符'
                    });
                    return;
                }
                if (this.password.length < 6) {
                    uni.showToast({
                        icon: 'none',
                        title: '密码最短为 6 个字符'
                    });
                    return;
                }
				let opts = {
					url: '/api/user/login',
					method: 'GET',
				};
				let param = {
					account: this.account,
					password: this.password
				};
				http.httpTokenRequest(opts, param).then(res => {
						console.log(res.data);
						if(res.data.code == 1){
							uni.showToast({
								title: res.data.msg
							});
							setTimeout(()=>{
								// uni.switchTab({
									this.toMain(res.data.data.userinfo.nickname);
								    // url: '/pages/main/main'
								// });
							},500)	 
						}else{
							uni.showToast({
								title: res.data.msg
							});
						}
					},error => {
					console.log(error)
				})
                /**
                 * 下面简单模拟下服务端的处理
                 * 检测用户账号密码是否在已注册的用户列表中
                 * 实际开发中，使用 uni.request 将账号信息发送至服务端，客户端在回调函数中获取结果信息。
                 */
            },
            oauth(value) {
                uni.login({
                    provider: value,
                    success: (res) => {
						console.log(res)
						if (res.code) {
						  //发起网络请求
						  let opts = {
						  	url: '/api/user/weixinAppLogin',
						  	method: 'GET',
						  };
						  let param = {
						  	code: res.code
						  };
						  http.httpTokenRequest(opts, param).then(res => {
						  		console.log(res.data);
						  		if(res.data.code == 1){
						  			uni.showToast({
						  				title: res.data.msg
						  			}); 
						  		}else{
						  			uni.showToast({
						  				title: res.data.msg
						  			});
						  		}
						  	},error => {
						  	console.log(error)
						  })
						  uni.getUserInfo({
						      provider: value,
						      success: (infoRes) => {
						  		uni.openSetting({
						  			success(res) {
						  				console.log(res.authSetting)
						  			}
						  		});
						  		console.log(infoRes)
						          /**
						           * 实际开发中，获取用户信息后，需要将信息上报至服务端。
						           * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
						           */
								  setTimeout(()=>{
									  this.toMain(infoRes.userInfo.nickName);
								  },500)	
						      }
						  });
						} else {
						  console.log('登录失败！' + res.errMsg)
						}
                    },
                    fail: (err) => {
                        console.error('授权登录失败：' + JSON.stringify(err));
                    }
                });
            },
            toMain(userName) {
                this.login(userName);
                /**
                 * 强制登录时使用reLaunch方式跳转过来
                 * 返回首页也使用reLaunch方式
                 */
                if (this.forcedLogin) {
                    uni.reLaunch({
                        url: '../user/user',
                    });
                } else {
					uni.reLaunch({
					    url: '../user/user',
					});
                    // uni.navigateBack();
                }

            }
        },
        onReady() {
            this.initPosition();
            this.initProvider();
        }
    }
</script>

<style>
    .action-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .action-row navigator {
        color: #007aff;
        padding: 0 20upx;
    }

    .oauth-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }

    .oauth-image {
        width: 360upx;
        height: 68upx;
        /* border: 1upx solid #dddddd; */
        border-radius: 40upx;
        text-align:center;
		color: #ffffff;
		font-size: 30upx;
		line-height: 68upx;
        background-color: #663333;
    }

    .oauth-image image {
        width: 60upx;
        height: 60upx;
        margin: 20upx;
    }
</style>
