<template>
	<view class="content">
		<view class="art-content">
			<view class="title-box">
				<view class="title">{{detail.title}}</view>
				<text :class="{'gongying':detail.type==1, 'xuqiu': detail.type==2, 'qita':detail.type==3}">{{detail.type_text}}</text>
			</view>
			<view style="font-size: 22upx;color: #999;">{{detail.createtime*1000 | formatDate}}</view>
			<view class="detail-box">
				<view class="detail" @tap="openmember" :data-memberid="detail.member.id">
					<image class="img" :src="detail.userInfo.avatar" mode="aspectFill"></image>
					<view class="name-box">
						<view class="name">{{detail.member.name}}</view>
						<view class="gongsi">{{detail.company.company}}</view>
					</view>
				</view>
				<!-- <view class="type">【{{detail.cate.name}}】</view> -->
			</view>
			<view class="about">
				{{detail.content}}
			</view>
			<!--<view @tap="share">分享</view>-->
			<view class="but-box">
				<button open-type='share' class="btnshare">分享</button>
				<view class="time-box">
					<view v-if="detail.mobile&&detail.mobile !=''" @tap="callPhone" :data-ph="detail.mobile">联系ta</view>
					<view v-else @tap="callPhone" :data-ph="detail.member.mobile">联系ta</view>
				</view>
			</view>
			<!-- 用rich-text展示接收到的html内容 富文本-->
			<!-- <rich-text :nodes="strings" class="richText"></rich-text> -->
		</view>
		<view>
			<view style="font-size: 28upx; color: #666; text-align: center;margin-top: 56upx;margin-bottom: 20upx;">————&nbsp;&nbsp;杭州市安庆商会&nbsp;&nbsp;————</view>
			<view style="font-size: 24upx; color: #999; text-align: center; margin-bottom: 30upx;">杭州九之信息技术有限公司提供技术支持</view>
		</view>
		<view style="height: 166upx;"></view>
	</view>
</template>

<script>
	import http from '@/components/utils/http.js'
	import {
		formatDate
	} from '@/components/date.js'
	export default {
		filters: {
			formatDate(time) {
				var date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd')
			}
		},
		data() {
			return {
				detail:{},
				id: ''
			}
		},
		// 接收newsid
		onLoad(e) {
			// uni.showLoading({
			// 	title: '加载中...',
			// 	// mask: false
			// });
			console.log(e)
			this.id = e.itemid
			let opts = {
				url: '/api/info/infoDetail',
				method: 'GET',
			};
			let param = {
				id: e.itemid
			};
			http.httpRequest(opts, param).then(res => {
					if(res.data.code == 1){
						this.detail = res.data.data
						console.log(this.detail);	
					}else{
						uni.showToast({
							title: "加载失败..."
						});
					}
				},error => {
				console.log(error)
			})
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
			  console.log(res.target)
			}
			let shareurl=encodeURIComponent('/pages/gongqiu/gongqiuDetail/gongqiuDetail?itemid=' + this.id);
			console.log(shareurl)
			return {
			  title: this.detail.title,
			  path: '/pages/gongqiu/gongqiu?share=1&shareurl=' + shareurl,
			  imageUrl:"../../../static/img/huaban.png",
			}
		},
		methods: {
			share(){
				//获取服务供应商。
				uni.getProvider({
					service:"share",
					success:(res)=>{
						console.log("res",res)
					//	console.log("provider",provider)
						uni.share({
							provider:res.provider,
							type :5,
							title:"标题",
							summary:"摘要",
							href:"/page/main/main",
							imageUrl:"http://img11.360buyimg.com/cms/jfs/t1/10697/24/14604/57110/5c8b903bEf2ab1811/90c2336ab2ac8002.jpg",
							miniProgram:{
								id:"wx4cd3db3e1f0b85bf",
								path:"/page/main/main",
								type:"1",
								webUrl:"http://www.jd.com",
							},
							scene:"WXSceneSession",//WXSceneSession	分享到聊天界面  WXSenceTimeline	分享到朋友圈   WXSceneFavorite	分享到微信收藏
						});
					}
				})	
			},
			openmember(e) {
				var memberid = e.currentTarget.dataset.memberid
				uni.navigateTo({
					// 传递 userid 在详情页接收
					url: '/pages/tongxun/userDetail/userDetail?id=' + memberid
				});
			},
			callPhone(e) {
				console.log(e)
				var phone = e.currentTarget.dataset.ph
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
		}
	}
</script>

<style>
.content {
	margin: 0 auto;
}
/* .title {
	line-height: 2em;
	font-weight: 700;
	font-size: 38upx;
} */
.art-content{
	width: 690upx;
	min-height: 72vh;
}
.art-content .about {
	font-size: 30upx;
	color: #333;
	line-height: 1.6em;
	text-align: justify;
	word-wrap:break-word;
}
.title-box {
	display: flex;
	justify-content: flex-start;
}
.title-box .title {
	max-width: 600upx;
	font-size: 46upx;
	color: #333;
	font-weight: 700;
	word-wrap:break-word;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}
/* .title-box .xueqiu {
	width: 66upx;
	height: 32upx;
	background: #00A6A8;
	border-radius: 4upx;
	font-size: 22upx;
	color: #fff;
	margin-top: 16upx;
	margin-left: 20upx;
	text-align: center;
	line-height: 32upx;
} */
.gongying {
	width: 66upx;
	height: 32upx;
	background: #00A6A8;
	border-radius: 4upx;
	font-size: 22upx;
	color: #fff;
	margin-top: 16upx;
	margin-left: 20upx;
	text-align: center;
	line-height: 32upx;
}
.xuqiu {
	width: 66upx;
	height: 32upx;
	border-radius: 4upx;
	font-size: 22upx;
	color: #fff;
	margin-top: 16upx;
	margin-left: 20upx;
	text-align: center;
	line-height: 32upx;
	background: #E8426D;
}
.qita {
	width: 66upx;
	height: 32upx;
	border-radius: 4upx;
	font-size: 22upx;
	color: #fff;
	margin-top: 16upx;
	margin-left: 20upx;
	text-align: center;
	line-height: 32upx;
	background: #BFBFBF;
}
.detail-box {
	display: flex;
	width: 690upx;
	justify-content: space-between;
	align-items: center;
	padding: 36upx 0;
}
.detail-box .detail {
	display: flex;
	align-items: center;
}
.detail-box .type {
	font-size: 28upx;
	color: #333;
}
.detail-box .detail .img {
	width: 86upx;
	height: 86upx;
	border-radius: 50%;
	overflow: hidden;
	margin-right: 20upx;
	/* background: #ffcccc; */
}
.detail-box .detail .name-box {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.detail-box .detail .name-box .name {
	font-size: 30upx;
	color: #333;
	font-weight: 700;
}
.detail-box .detail .name-box .gongsi {
	font-size: 24upx;
	color: #666;
}
.btnshare {
	width: 300upx;
	height: 88upx;
	border-radius: 44upx;
	background: #FFECEB;
	font-size: 38upx;
	color: #DB2311;
	text-align: center;
	line-height: 88upx;
	margin: auto;
}
.time-box {
	width: 320upx;
	height: 88upx;
	font-size: 38upx;
	color: #fff;
	border-radius: 44upx;
	background: #DB2311;
	text-align: center;
	line-height: 88upx;
	margin: auto;
}
.but-box {
	width: 690upx;
	display: flex;
	position: fixed;
	bottom: 0upx;
	background: #fff;
	height: 166rpx;
	box-shadow: 0px -1upx 0upx #e5e5e5;
}
</style>
