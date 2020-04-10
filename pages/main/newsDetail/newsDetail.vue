<template>
	<view class="content">
		<view style="min-height: 78vh;">
			<view class="title">{{title}}</view>
			<view class="art-content">
				<!-- 用rich-text展示接收到的html内容 富文本-->
				<rich-text :nodes="content" class="richText"></rich-text>
			</view>
		</view>
		<view style="font-size: 28upx; color: #666; text-align: center;margin-top: 56upx;margin-bottom: 20upx;">————&nbsp;&nbsp;杭州市安庆商会&nbsp;&nbsp;————</view>
		<view style="font-size: 24upx; color: #999; text-align: center; margin-bottom: 30upx;">杭州九之信息技术有限公司提供技术支持</view>
	</view>
</template>

<script>
	import http from '@/components/utils/http.js'
	export default {
		data() {
			return {
				title: '',
				content: ''
			}
		},
		// 接收newsid
		onLoad(e) {
			// uni.showLoading({
			// 	title: '加载中...',
			// 	// mask: false
			// });
			console.log(e)
			let opts = {
				url: '/api/news/newsDetail',
				method: 'GET',
			};
			let param = {
				id: e.newsid
			};
			http.httpRequest(opts, param).then(res => {
					if(res.data.code == 1){
						console.log(res);
						this.title = res.data.data.title;
						this.content = res.data.data.content;	
						// this.$store.state.title=this.title;
						uni.setNavigationBarTitle({
							title: this.title
						})
					}else{
						uni.showToast({
							title: "加载失败..."
						});
					}
				},error => {
				console.log(error)
			})
		},
		methods: {
			
		}
	}
</script>

<style>
.content {
	padding: 10upx 2%; 
	width: 690upx;
	/* 允许换行 */
	flex-wrap: wrap;
}
.title {
	line-height: 2em;
	font-weight: 700;
	font-size: 38upx;
}
.art-content{
	padding: 0 10upx;
}
</style>
