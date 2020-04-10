<template>
	<view class="content-box">
		<view style="min-height: 76vh;">
		<view class="personal">
			<view class="box">
				<view>头像</view>
				<view @tap="photoUpload" data-type="avatar"><image style="width: 80rpx; height: 80rpx;"  :src="userInfo.avatar" mode="aspectFill"></image></view>
				<!--<open-data class="avatar" type="userAvatarUrl"></open-data>-->
			</view>
			<view class="box">
				<view>用户名</view>
				<view>{{userInfo.username}}</view>
				<!--<open-data class="denglu" type="userNickName"></open-data>-->
			</view>
			<view class="box box1">
				<view>手机号</view>
				
				<view v-if="userInfo.mobile!=null&&userInfo.mobile!=''">{{userInfo.mobile}}</view>
				<view v-else>
					<navigator class="dianji" url="/pages/user/bandMobile/bandMobile" hover-class="none">
						绑定手机号
					</navigator>
					
				</view>
				<!-- <open-data class="denglu" type="userNickName"></open-data>-->
			</view>
		</view>
		</view>
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
			...mapState(['isLogin', 'forcedLogin', 'user_id', 'group_id'])
		},
		onLoad() {
			let that=this;
			that.userInfo = Object.assign({}, that.userInfo, this.$store.state.userInfo);
			//console.log(this.$store.state.userInfo);
		},
		data() {
			return {
				userInfo:{
					id:0,
					user_id:0,
					group_id:0,
					username:"游客",
					nickname:"游客",
					mobile:"",
					avatar:"",
				}
			}
		},
		methods: {
			photoUpload(e) {
				var type = e.currentTarget.dataset.type
				var that=this;
				uni.chooseImage({
					count: 1,
					sizeType: "compressed",
					success: (res) => {
						//tempFilePaths
						res.tempFilePaths.forEach(function(value, index) {
							uni.uploadFile({
								url: http.baseUrl + "/api/common/upload",
								filePath: value,
								name: "file",
								header: {
									'token': uni.getStorageSync('token'),
									'X-Requested-With': 'XMLHttpRequest',
									'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
								},
								success: (res) => {
									if (res.statusCode == 200) {
										var resData = JSON.parse(res.data);
										//console.log(resData);
										if (typeof resData == "object" && typeof resData.code != "undefined" && resData.code == 1) {
											//图片上传成功
											http.apiRequest({
												api: "/api/user/profile",
												method: "POST",
												data: {
													avatar: resData.data.url,
													gender: 1,
												},
												secuss: (res, httpStatus) => {
													if (res.code == 1) {
														that.$store.state.userInfo.avatar=resData.data.url;
														that.userInfo.avatar=resData.data.url;
														uni.$emit("userInfoUpdate",{});
														uni.showToast({
															title: "上传头像成功！"
														});
													}
												},
											
											});
											
											
										}
			
									} else {
										//图片上传失败
									}
								},
								fail: (res) => {},
							});
						});
					},
					fail: () => {},
				});
			},
		}
	}
</script>

<style>
.content-box {
	width: 750upx;
	background: #f0f0f0;
	/* margin: 0 auto; */
}
.personal {
	width: 750upx;
	margin: 0 auto;
	background: #fff;
	margin-top: 20rpx;
	padding: 0 60upx;
	box-sizing: border-box;
	/* padding: 0 30upx; */
}
.box {
	/* width: 650upx; */
	height: 120upx;
	display: flex;
	justify-content: space-between;	
	align-items: center;
	border-bottom: 1upx solid #f0f0f0;
}
.box1 {
	height: 120upx;
	display: flex;
	justify-content: space-between;	
	align-items: center;
	border-bottom: none;
}
.box view {
	font-size: 30upx;
	color: #999;
}
.box .avatar {
	width: 68upx;
	height: 68upx;
	border-radius: 50%;
	overflow: hidden;
}
.box .denglu {
	font-size: 30upx;
	color: #333;
}
</style>
