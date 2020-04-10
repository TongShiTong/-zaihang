<template>
	<view class="content">
		<view style="min-height: 76vh;">
			<view class="name">{{jieshao.name}}</view>
			<view class="code">{{jieshao.code}}</view>
		</view>
		<!-- <view class="article-content">
			<rich-text :nodes="jieshao.content"></rich-text>
		</view> -->
		<view style="font-size: 28upx; color: #666; text-align: center;margin-top: 56upx;margin-bottom: 20upx;">————&nbsp;&nbsp;杭州市安庆商会&nbsp;&nbsp;————</view>
		<view style="font-size: 24upx; color: #999; text-align: center; margin-bottom: 30upx;">杭州九之信息技术有限公司提供技术支持</view>
	</view>
</template>

<script>
	import http from '@/components/utils/http.js'
	export default {
		data() {
			return {
				jieshao:''
			}
		},
		onLoad() {
				uni.showLoading({
				title: '加载中...',
				// mask: false
			});
			let opts = {
				url: '/api/adszone/getAdsByMark',
				method: 'GET',
			};
			let param = {
				mark: 'shanghuijieshao'
			};
			http.httpTokenRequest(opts, param).then(res => {
					if(res.data.code == 1){
						this.jieshao = res.data.data
						uni.hideLoading();
						console.log("123",this.jieshao)
					}else{
						uni.showToast({
							title: "加载失败..."
						});
					}
				},error => {
				console.log("123",error)
			})	
		},
		methods: {
			
		}
	}
</script>

<style>
.name {
	font-size: 46upx;
	color: #333;
	margin-bottom: 40upx;
	font-weight: 700;
}
.code {
	font-size: 34upx;
	color: #333;
	text-align: justify;
	letter-spacing: 0.1em;
}
</style>
