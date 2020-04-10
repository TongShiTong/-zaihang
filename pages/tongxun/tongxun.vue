<template>
	<view class="content">
		<view class="input-search">
			<view class="input-box">
				<input type="text" v-model="keywordinput">
				<view class="iconfont" style="position: fixed;margin-top:-56upx; left: 60upx;z-index: 1000; width: 40upx;height: 40upx;"><image style="width: 100%;height: 100%;" src="../../static/img/sousuo.png"></image></view>
			</view>
			<button class="btn" type="primary" @tap="search()">搜索</button>
		</view>
		<view style="height: 120upx;"></view>
		<!-- 代码块 uli -->
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in itemList" :key="index">
				<view class="uni-media-list" @tap="openinfo" :data-id="item.id">
					<!-- <image class="uni-media-list-logo" :src="item.author"></image> -->
					<image class="img" :src="item.userInfo.avatar" mode="aspectFill"></image>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top name">{{item.name}}（{{item.position}}）</view>
						<view class="uni-media-list-text-top company">{{item.company}} （{{item.composition}}）</view>
						<!-- <view class="uni-media-list-text-top position">{{item.position}}</view> -->
						<!-- <view class="uni-media-list-text-top mobile">{{item.mobile}}</view> -->
						<!-- <view class="uni-media-list-text-bottom uni-ellipsis">{{item.createtime}}</view> -->
					</view>
				</view>
				<view v-if="group_id==2" class="uni-media-list-text-top mobile" @tap="callPhone" :data-ph="item.mobile">{{item.mobile}}</view>
			</view>
		</view>
		<uni-load-more :status="status" :content-text="contentText"></uni-load-more>
		<view style="font-size: 24upx; color: #999; text-align: center; margin-bottom: 30upx;">杭州九之信息技术有限公司提供技术支持</view>
		  <!-- <view v-if='loadDone'>
			<view class='loading-more ' v-if='!hasMore'>
			  <image src="/static/img/04.svg" class='loadmore-img '></image>
			  <text>正在拼命加载中</text>
			</view>
			<view class='no-more' v-if='hasMore'>
			  <text class='no-more-text'>已经全部加载</text>
			  <text class='line'></text>
			</view>
		  </view> -->
	</view>
</template>

<script>
	import uniLoadMore from "../../components/uni-load-more/uni-load-more.vue"
	import http from '../../components/utils/http.js'
	import {
		mapState
	} from 'vuex'
	export default {
		components: {uniLoadMore},
		computed: {
			...mapState(['group_id'])
		},
		data() {
			return {
				address: [],
				itemList:[],
				keywordinput:'',
				keyword: '',
				// loadingType: 0,
				page: 1,
				status: 'more',
				nextPage: 1,
				lodingLock: false,
				// hasMore: true,
				// loadDone: false,
				contentText: {
					contentdown: '查看更多',
					contentrefresh: '加载中...',
					contentnomore: '———— 杭州市安庆商会 ————'
				}
			}
		},
		onPullDownRefresh() {
			console.log('refresh');
			var that = this
			// that.address = []
			that.itemList = [];
			that.page=1;
			that.status='more';
			that.nextPage= 1;
			
			that.loadData()
			setTimeout(()=>{
				uni.stopPullDownRefresh();
			},1000);		
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
			  console.log('456', res.target)
			}
			return {
			  title: '名片列表',
			  path: '/pages/tongxun/tongxun'
			}
		},
		onLoad(e) {
			let that = this;
			let shareurl = e.shareurl;
			let share = e.share;
			if(share=="1"){
				console.log("01")
				let url=decodeURIComponent(shareurl);
				uni.navigateTo({
					// 传递 userid 在详情页接收
					url:url
				});
			}
			// 数据未加载前，可以放加载动画
			uni.showLoading({
				title: '加载中...',
				// mask: false
			});
			this.loadData()
			uni.hideLoading();
		},
		onReachBottom() {
			// if(this.nextPage != 0){
			// 	this.status = "loading"
			// 	setTimeout(()=>(
			// 		this.loadData()
			// 	),1000)
			// }else {
			// 	this.status = "loading"
			// 	setTimeout(() => {
			// 		this.status = "load"
			// 	},1000)
			// }	
			let that = this;
			if (that.nextPage > 0) {
				that.loadData(() => {
			
				});
			} else {
			
			}
		},
		methods: {
			openinfo(e) {
				console.log(e)
				var id = e.currentTarget.dataset.id
				// console.log(id)
				uni.navigateTo({
					// 传递 id 在详情页接收
					url: './userDetail/userDetail?id=' + id
				});
			},
			
			loadData(collback) {
				if (this.lodingLock) {
					return;
				}
				this.lodingLock = true;
				this.status = "loading"
				let that = this;
				let param = {
					page: that.nextPage,
					keyword: that.keyword,
					type: that.infoType,
				};
				http.apiRequest({
					api: "/api/member/memberList",
					data: param,
					secuss: (res, httpStatus) => {
						that.lodingLock = false;
						if (res.code == "1") {
							that.nextPage = res.data.nextPage;
							that.page = res.data.page;
							that.itemList = that.itemList.concat(res.data.rows);
							// console.log(that.itemList)
			
							if (that.nextPage > 0) {
								that.status = "more";
							} else {
								that.status = 'nomore';
							}
			
							if (typeof(collback) == "function") {
								collback();
							}
						} else {
							if (that.nextPage > 0) {
								that.status = "more"
							} else {
								that.status = "nomore"
							}
							uni.showToast({
								title: res.msg,
								duration: 1500,
								icon: "none"
							});
							if (typeof(collback) == "function") {
								collback();
							}
						}
					},
					error: (res, httpStatus) => {
						//接口调用失败，可能是网络故障，可能是接口报错
						if (that.nextPage > 0) {
							that.status = "more"
						} else {
							that.status = "nomore"
						}
						that.lodingLock = false;
						uni.showToast({
							title: "接口调用失败，请检查网络",
							duration: 1500,
							icon: "none"
						});
						if (typeof(collback) == "function") {
							collback();
						}
					},
				});
			},
		
			// loadData() {
			// 	let that = this;
			// 	let address = [];
			// 	this.page++;
			// 	let opts = {
			// 		url: '/api/member/memberList',
			// 		method: 'GET',
			// 	};
			// 	let param = {
			// 		page: this.page
			// 	};
			// 	http.httpTokenRequest(opts, param).then(res => {
			// 			console.log(res.data);
			// 			if(res.data.code == 1){
			// 				if(res.data.data.nextPage == 0){
			// 					this.nextPage = res.data.data.nextPage
			// 					this.loadingType = 2;
			// 					this.status = "load"
			// 					for(let i=0; i<res.data.data.rows.length;i++) {
			// 						address.push(res.data.data.rows[i])
			// 					}
			// 					this.address = this.address.concat(address)
			// 					// console.log(this.address)
			// 					return false
			// 				}else {
			// 					address = res.data.data.rows
			// 					this.address = this.address.concat(address)
			// 					this.nextPage = res.data.data.nextPage
			// 				}
			// 				// this.loadingType = 0;
			// 			}else{
			// 				uni.showToast({
			// 					title: "加载失败..."
			// 				});
			// 			}
			// 		},error => {
			// 		console.log('error=>',error)
			// 	});
			// },
			search(e) {
				let that = this;
				that.keyword = that.keywordinput;
				that.nextPage = 1;
				that.itemList = [];
				that.loadData(() => {
			
				});
			},
			// search() {
			// 	let opts = {
			// 		url: '/api/member/memberList',
			// 		method: 'GET',
			// 	};
			// 	let param = {
			// 		keyword: this.keyword
			// 	};
			// 	http.httpTokenRequest(opts, param).then(res => {
			// 			console.log(res.data);
			// 			if(res.data.code == 1){
			// 				this.address = res.data.data.rows
			// 			}else{
			// 				uni.showToast({
			// 					title: "加载失败..."
			// 				});
			// 			}
			// 		},error => {
			// 		console.log('error=>',error)
			// 	})
			// },
			callPhone(e) {
				console.log(e)
				var phone = e.currentTarget.dataset.ph
				uni.makePhoneCall({
					phoneNumber: phone
				});
			}
		}
	}
</script>

<style>
	.content {
		padding-top: 0 !important;
	}
	.uni-media-list-body .name {
		font-size: 34upx;
		color: #333;
	}
	.uni-media-list-body .company {
		font-size: 24upx;
		color: #333;
		padding-right: 10upx;
		max-width: 520upx;
	}
	.uni-media-list-body .position,.mobile {
		position: absolute;
		top: 40upx;
		right: 20upx;
		font-size: 24upx;
		color: #DB2311;
	}
	.uni-media-list-text-top {
		line-height: 1.6em;
		word-wrap:break-word;
		/* display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden; */
	}
	.uni-list {
		/* display: flex; */
		/* flex-wrap: wrap; */
		/* flex-direction: column; */
		/* align-items: center; */
		/* justify-content: space-around; */
	}
	.uni-list-cell {
		position: relative;
		width: 100%;
		background: #fff;
		box-shadow: 4px 4px 8px #f0f0f0;
		margin-bottom: 20upx;
		padding-top: 20upx;
		padding-bottom: 20upx;
		margin-right: 20upx;
	}
	/* .uni-list-cell:nth-child(2n){
		margin-right: 0px;
	} */
	.uni-media-list {
		display: flex;
		align-items: center;
	}
	.uni-media-list .img{
		width: 120upx;
		height: 120upx;
		border-radius: 50%;
		margin-right: 20upx;
		/* background: #ffcccc; */
	}
	.input-search {
		display: flex;
		justify-content: space-between;
		padding-bottom: 40upx;
		/* padding-left: 10upx; */
		width: 720upx;
		position: fixed;
		background: #fff;
		z-index: 999;
	}
	.input-box {
		position: relative;
		background: #ddd;
		border-radius: 34upx;
		height: 68upx;
		width: 520upx;
		line-height: 68upx;
	}
	.input-box input {
		padding-left: 95upx;
		line-height: 68upx;
		height: 68upx; 
		box-sizing: border-box;
		/* margin-right: 20upx; */
	}
	.btn {
		background: #4F3B3B !important;
		height: 68upx;
		width: 130upx;
		font-size: 32upx;
		border-radius: 34upx;
		line-height: 68upx;
		color: #ffffff;
		margin-right: 30upx;
		/* padding-right: 20upx; */
	}
	.callPhone {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
