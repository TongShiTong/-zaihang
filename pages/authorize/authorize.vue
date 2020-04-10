<template>
	<view class="shouquan">
		<view class="hua"><image style="width: 100%; height: 100%;" src="../../static/img/logo2x.png"></image></view>
		<p class="p1">杭州安庆商会会员信息平台</p>
		<p class="p2">同根同源 共建共享</p>
		<button class="btn" open-type='getUserInfo' @getuserinfo='getUserInfo' >微信登录</button>
		
	<!-- 	<button open-type='share'>分享</button>
		<button open-type='openSetting'>权限设置</button> -->
		<view style="font-size: 28upx; color: #666; text-align: center;margin-top: 56upx;margin-bottom: 20upx;">————&nbsp;&nbsp;杭州市安庆商会&nbsp;&nbsp;————</view>
		<view style="font-size: 24upx; color: #999; text-align: center; margin-bottom: 30upx;">杭州九之信息技术有限公司提供技术支持</view>
	</view>
</template>
<script>
	import http from '../../components/utils/http.js'
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			getUserInfo(res){
				console.log(res);
				let userInfo=res.detail.userInfo;
				//获取到了授权，拿到了用户信息，利用Token更新用户昵称和头像，并返回上一页
				http.apiRequest({
					api: "/api/user/profile",
					method: "POST",
					data: {
						avatar:userInfo.avatarUrl,
						username:userInfo.nickName,
						nickname:userInfo.nickName,
						gender:userInfo.gender
						},
					complete: (res, httpStatus) => {
						//执行完成，返回到上一页
						uni.navigateBack({delta:1})
						// uni.navigateTo({
						// 	url: '/pages/authorize/authorize'
						// });
					},
				});
			},
			getPhoneNumber(res){
				console.log(res);
			},
		}
	}
</script>

<style>
.shouquan {
	margin: 0 auto;	
}
.hua {
	width: 162upx;
	height: 162upx;
	/* font-size: 44upx;
	color: #000; */
	margin: 0 auto;
	margin-top: 120upx;
	margin-bottom: 54upx;
	text-align: center;
}
.shouquan .p1 {
	font-size: 30upx;
	color: #333;
	text-align: center;
	line-height: 1.4em;
}
.shouquan .p2 {
	font-size: 24upx;
	color: #333;
	text-align: center;
	line-height: 1.4em;
}
.btn {
	width: 520upx;
	height: 88upx;
	font-size: 38upx;
	color: #fff;
	background: #DB2311;
	line-height: 88upx;
	border-radius: 44upx;
	text-align: center;
	margin-top: 80upx;
}
</style>
