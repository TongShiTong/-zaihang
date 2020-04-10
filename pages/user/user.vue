<template>
	<view class="box">
		<!-- <view class="personal" v-if="!isLogin">
			<view class="avatar"></view>
			<view class="denglu" @tap="bindLogin">点击登录</view>
		</view> -->

		<view  v-if="userInfo.id>0" class="info">
			<view class="shposition" v-if="group_id==2">{{shMember.position}}</view>
			<view class="info-box">
				<image :src="userInfo.avatar" mode="aspectFill"></image>
				<view class="username">{{userInfo.username}}</view>
				<view class="companyinfo" v-if="group_id==2">
					<view>{{shMember.company}}</view>
					<view>{{shMember.composition}}</view>
				</view>
			</view>	
		</view>
		<view v-else>
			<view class="personal">
				<open-data class="avatar" type="userAvatarUrl"></open-data>
				<open-data class="denglu" type="userNickName"></open-data>
			</view>
		</view>
		<view class="tishi" v-if="userInfo.mobile == ''">
			<!-- <view class="shuxian"></view>
			<view class="bangding">
				商会成员绑定预留手机号 | 可享受专属服务
			</view>
			<view class="shuxian"></view> -->
			<image src="../../static/img/tiaofu.png"></image>
		</view>
		
		<view class="sing" style="margin-top: 88upx;" v-if="isLogin">
			<navigator class="dianji" url="userinfo/userinfo" hover-class="none">
				<view class="wode-box">
					<image class="tupian" src="../../static/img/ziliao.png"></image>
					<view>基本资料</view>
				</view>
				<image class="jiantou" src="../../static/img/xiangqing.png"></image>
			</navigator>
		</view>
		<view class="sing" v-if="userInfo.mobile == ''">
			<navigator class="dianji" url="bandMobile/bandMobile" hover-class="none">
				<view class="wode-box">
					<image class="tupian" src="../../static/img/bangding.png"></image>
					<view>绑定手机号</view>
				</view>
				<image class="jiantou" src="../../static/img/xiangqing.png"></image>
			</navigator>
		</view>
		<view class="sing" v-if="group_id!=2 && userInfo.mobile != ''">
			<navigator class="dianji" url="reviewMobile/reviewMobile" hover-class="none">
				<view class="wode-box">
					<image class="tupian" src="../../static/img/bangding.png"></image>
					<view>提交审核信息</view>
				</view>
				<image class="jiantou" src="../../static/img/xiangqing.png"></image>
			</navigator>
		</view>
		<!-- <view class="sing" v-if="group_id==2">
			<navigator url="company/company" hover-class="navigator-hover">
				<view>公司资料</view>
				<view>></view>
			</navigator>
		</view> -->
		<view class="sing" v-if="group_id==2">
			<navigator class="dianji" url="photo/photo" hover-class="none">
				<view class="wode-box">
					<image class="tupian" src="../../static/img/xiangce.png"></image>
					<view>公司相册</view>
				</view>
				<image class="jiantou" src="../../static/img/xiangqing.png"></image>
			</navigator>
		</view>

		<view class="sing" v-if="group_id==2">
			<navigator class="dianji" url="myinfo/myinfo" hover-class="none">
				<view class="wode-box">
					<image class="tupian" src="../../static/img/gongying.png"></image>
					<view>我的供求</view>
				</view>
				<image class="jiantou" src="../../static/img/xiangqing.png"></image>
			</navigator>
		</view>
		<view class="sing dianji" v-if="group_id==2"  @tap="userDetail">
			<view class="wode-box">
				<image class="tupian" src="../../static/img/mingpian.png"></image>
				<view>我的商会名片</view>
			</view>	
				<image class="jiantou" src="../../static/img/xiangqing.png"></image>
		</view>

		<!-- <view class="uni-list">
			<view class="page-body">
				<uni-tag text="供求" :circle="true" @click="bindGongqiu"></uni-tag>
				<uni-tag text="公司相册" :circle="true" @click="bindWode"></uni-tag>
			</view>
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in gongqiuWode" :key="index" v-if="!isShow">
				<view class="uni-media-list">
					 <image class="uni-media-list-logo" :src="item.author"></image> 
					<view class="info">
						<view class="info-box">
							<image class="img" :src="item.autho"></image>
							<view class="info-content">
								<view class="name">本人姓名</view>
								<view class="zhiwei">公司职位</view>
							</view>
						</view>
						<view class="time-box">
							<view class="uni-media-list-text-top">{{item.createtime}}</view>
							<view>123</view>
						</view>
					</view>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top timu">{{item.title}}</view>
						<view class="uni-media-list-text-top xuyao">{{item.content}}</view>
						<!- - <view class="uni-media-list-text-top">{{item.mobile}}</view> -->
		<!-- <view class="uni-media-list-text-bottom uni-ellipsis">{{item.createtime}}</view> - ->
					</view>
					<!- - <button type="primary" @tap="openinfo" :data-usersid="item.id">查看详情</button>
					<button type="primary" @tap='revise' :data-usersid="item.id" :data-title="item.title" 
					:data-content="item.content">修改</button>
					<button type="primary" @tap='delect' :data-usersid="item.id">删除</button> - ->
				</view>
			</view>
			<view v-if="isShow"> 暂时没有上传图片
				<image :src="photos.userInfo.avatar"></image>
			</view>
		</view> -->
		<view style="font-size: 28upx; color: #666; text-align: center;margin-top: 156upx;margin-bottom: 20upx;">————&nbsp;&nbsp;杭州市安庆商会&nbsp;&nbsp;————</view>
		<view style="font-size: 24upx; color: #999; text-align: center; margin-bottom: 30upx;">杭州九之信息技术有限公司提供技术支持</view>
	</view>
</template>

<script>
	import uniTag from "@/components/uni-tag/uni-tag.vue"
	import http from '@/components/utils/http.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		components: {
			uniTag
		},
		computed: {
			...mapState(['isLogin', 'forcedLogin', 'user_id', 'group_id', 'userInfo'])
		},

		data() {
			return {
				gongqiuWode: [],
				userid: '',
				isShow: false,
				photos: [],
				hasgroupid: false,
				shMember: {} ,//会员在商会成员注册的资料
				// userInfo:{
				// 	id:0,
				// 	user_id:0,
				// 	group_id:0,
				// 	username:"游客",
				// 	nickname:"游客",
				// 	mobile:'',
				// 	avatar:"",
				// }
			}
		},
		onLoad() {
			var that = this;
			// that.userInfo = Object.assign({}, that.userInfos, this.$store.state.userInfo);
			//console.log(that.userInfo)
			var setShMember = function(user_id) {
				if (that.isLogin && that.group_id == 2) {
					http.apiRequest({
						api: "/api/member/memberDetailByUid",
						method: "GET",
						data: {
							uid: user_id,
						},
						secuss: (res, httpStatus) => {
							if (res.code == 1) {
								that.shMember = res.data;
								//console.log(that.shMember);
							}
						},
					});
				}
			};

			//console.log("进入我的");
			if (!this.isLogin) {
				uni.login({
					success: (res) => {
						let code = res.code;
						http.apiRequest({
							api: "/api/user/weixinAppLogin",
							data: {
								code: code
							},
							secuss: (res, httpStatus) => {
								console.log(res);
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
									// this.userInfo = userInfo
									uni.setStorageSync("mobile", userInfo.mobile)

									//如果用户不是商会成员，更新用户的昵称为微信昵称
									//console.log(userInfo);
									if (userInfo.group_id != 2) {
										uni.getUserInfo({
											success: (res) => {
												//console.log('getUserInfo',res.userInfo);
												//用微信昵称代表用户昵称
												http.apiRequest({
													api: "/api/user/profile",
													method: "POST",
													data: {
														avatar: res.userInfo.avatarUrl,
														username: res.userInfo.nickName,
														nickname: res.userInfo.nickName,
														gender: 1,
													},
													secuss: (res, httpStatus) => {
														if (res.code == 1) {
															// console.log(res);
															uni.$emit("userInfoUpdate",{});
														}
													},

												});
											},
											fail: (res) => {
												//console.log(res);
												uni.navigateTo({
													url: '/pages/authorize/authorize'
												});
											}
										});
									} else {
										//是商会成员，则获取该成员对应的商会会员信息
										//this.$scopedSlots();
										setShMember(this.user_id);
									}
								}
							},
						});
					},
					fail: (res) => {
						//console.log(res);
					}
				})
			} else {
				setShMember(this.user_id);
			}

			if (this.group_id && this.group_id == 2) {
				this.hasgroupid = true
			}
		uni.$on("userInfoUpdate", () => {
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
							
							setShMember(userInfo.user_id);
							//console.log(userInfo);
						}else{
							//获取用户信息失败
							//wx_login();
						}
					},
				});
			});
		},
		onUnload(e) {
			uni.$off("userInfoUpdate", () => {
				//loadData();
			});
		},
		methods: {
			// ...mapMutations(['logout', 'chacktoken']),
// 			bindLogin() {
// 
// 			},
// 			bindLogout() {
// 				this.logout();
// 				/**
// 				 * 如果需要强制登录跳转回登录页面
// 				 */
// 				if (this.forcedLogin) {
// 
// 				}
// 			},
			userDetail() {
				//console.log(this.shMember)
				var shMember_id=this.shMember.id
				if(typeof shMember_id!="undefined"){
				uni.navigateTo({
					url: `../tongxun/userDetail/userDetail?id=${shMember_id}`
					// url:'/pages/authorize/authorize'
				});
				}
				
			},

		}
	}
</script>

<style>
	.box {
		width: 750upx;
	}
	.info {
		width: 100%;
		background: url(../../static/img/infobackground.png) no-repeat;
		background-size: 100% 100%;
	}
	.info .shposition {
		position: relative;
		left: 590upx;
		width: 130upx;
		height: 40upx;
		text-align: center;
		line-height: 40upx;
		border-radius: 40upx;
		font-size: 26upx;
		color: #fff;
		background:rgba(0,0,0,0.2);
	}
	.info .info-box {
		text-align: center;
	}
	.info .info-box image {
		width: 128rpx;
		height: 128rpx; 
		border-radius: 50%; 
		overflow: hidden;
	}
	.info .info-box .username {
		padding-top: 40upx;
		padding-bottom: 30upx;
		font-size: 38upx;
		color: #fff;
		font-weight: 700;
	}
	.info .info-box .companyinfo {
		color: #fff;
		font-size: 32upx;
		line-height: 1.5em;
		padding-bottom: 40upx;
	}
	.personal-box {
		background: #fff;
	}
	.tishi {
		width: 630upx;
		height: 88upx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto;
		margin-top: 40upx;
	}
	.tishi image {
		width: 100%;
		height: 100%;
	}
	.tishi .shuxian{
		height: 69upx;
		width: 6upx;
		background: #DB2311;
	}
	.bangding {
		width: 606upx;
		height: 64upx;
		background: #eee;
		font-size: 26upx;
		color: #DB2311;
		text-align: center;
		line-height: 64upx;	
	}
	.personal {
		width: 750upx;
		height: 330upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 80upx;
	}

	.sing {
		padding: 0upx 30upx 62upx;
		font-size: 32upx;
		color: #333;
		letter-spacing: 0.1em;
		font-weight: bold;
	}
	.dianji {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.dianji .wode-box {
		display: flex;
		align-items: center;
	}
	.dianji .wode-box .tupian {
		width: 54upx;
		height: 54upx;
		margin-right: 22upx;
	}
	.dianji .jiantou {
		width: 32upx;
		height: 32upx;
	}
	.personal .avatar {
		width: 128upx;
		height: 128upx;
		background: #ccc;
		border-radius: 50%;
		overflow: hidden;
		margin: 28upx 10upx;
	}

	.personal .denglu {
		font-size: 38upx;
		color: #663333;
	}

	.uni-list {
		background: #efeff4;
		min-height: 80vh;
		padding-bottom: 40upx;
	}

	.uni-media-list-body {
		height: auto;
	}

	.timu {
		font-size: 30upx;
		margin-bottom: 10upx;
	}

	.xuyao {
		font-size: 24upx;
		color: #999;
	}

	.uni-list-cell {
		background: #fff;
		margin: 40upx;
		padding: 40upx;
		box-sizing: border-box;
		width: 670upx;
	}

	/* .info {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.info .info-box {
		display: flex;
		align-items: center;
	}

	.info .info-box .name {
		font-size: 34upx;
	}

	.info .info-box .zhiwei {
		font-size: 22upx;
		color: #666;
	}

	.info .info-box .img {
		width: 90upx;
		height: 90upx;
		border-radius: 50%;
		background: #ffcccc;
		margin-right: 20upx;
	}

	.info .time-box {
		font-size: 18upx;
		color: #999;
	}

	.uni-media-list-body {
		margin-top: 20upx;
		line-height: 1.2em;
	}

	.uni-media-list-body .xuyao {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.page-body {
		text-align: center;
		padding: 40upx 0;
	} */
</style>
