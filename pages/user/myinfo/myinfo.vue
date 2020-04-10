<template>
	<view class="content">
		<view style="min-height: 86vh;">
			<view class="input-search">
				<view class="input-box">
					<input type="text" v-model="keywordinput">
					<view class="iconfont" style="position: fixed;margin-top:12upx; left: 60upx;z-index: 1000; width: 40upx;height: 40upx;"><image style="width: 100%;height: 100%;" src="../../../static/img/sousuo.png"></image></view>
				</view>
				<button class="btn" type="primary" @tap="search()">搜索</button>
				<button class="btn fabu" type="primary" @tap="release()"></button>
			</view>
			<view style="height: 80upx;"></view>
		
			<!-- 代码块 uli -->
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in itemList" :key="index">
					<view class="uni-media-list">
						<view class="uni-media-list-body" @tap="openinfo" :data-itemid="item.id">
							<view class="title">
								<view class="timu">
									<view style="display: flex;justify-content: space-between; align-content: center;">
										<view :class="{'gongying':item.type==1, 'xuqiu': item.type==2, 'qita':item.type==3}">{{item.type_text}}</view>
										<view class="uni-media-list-text-top time">{{item.createtime*1000 | formatDate}}</view>
									</view>
									
									<view class="uni-media-list-text-top" style="line-height: 1.4em;text-align: justify;word-wrap: break-word;max-width: 610rpx;">{{item.title}}</view>
								</view>
							</view>
							<view class="uni-media-list-text-top xuyao">{{item.content}}</view>
							<!-- <view class="uni-media-list-text-bottom uni-ellipsis">{{item.createtime}}</view> -->
						</view>
						<view class="anniu-box">
							<!-- <button open-type='share' id="1" @tap="openshare" :data-itemid="item.id">1</button> -->
							<view class="anniu1" type="primary" @tap='revise' :data-usersid="item.id" :data-title="item.title" :data-content="item.content"></view>
							<view class="anniu2" type="primary" @tap='delect' :data-usersid="item.id" :data-index="index"></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="status" :content-text="contentText"></uni-load-more>
		<view style="font-size: 24upx; color: #999; text-align: center; margin-bottom: 30upx;">杭州九之信息技术有限公司提供技术支持</view>
	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import uniTag from "@/components/uni-tag/uni-tag.vue"
	import http from '@/components/utils/http.js'
	import {formatDate} from '@/components/date.js'
	import {
		mapState
	} from 'vuex'
	export default {
		components: {
			uniTag,
			uniLoadMore
		},
		filters: {
			formatDate(time) {
				var date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd')
			}
		},
		computed: mapState(['token', 'user_id','group_id']),
		data() {
			return {
				itemList: [],
				keywordinput: '',
				keyword: '',
				infoType: 0,
				userid: 0,
				page: 1,
				nextPage: 1,
				status: 'more',//more   显示文字加载更多  loading  显示文字 正在加载   nomore  显示没有更多了
				groupid: false,
				lodingLock: false,
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '———— 杭州市安庆商会 ————'
				},
				itemid: ''
			}
		},
		onLoad() {
			let that = this
			uni.showLoading({
				title: '加载中...',
			});
			
			this.loadData(() => {
				//加载完成的回调，隐藏加载框
				uni.hideLoading();
			});
			
			
			uni.$on("editInfo", () => {
				that.itemList = [];
				// that.keywordinput: '';
				// that.keyword: '';
				// that.infoType= 0;
				that.page= 1;
				that.nextPage= 1;
				that.status= 'more';
				that.loadData(() => {	
				});
			});
		},
		onUnload(e) {
			uni.$off("editInfo", () => {
				//loadData();
			});
		},
		//下拉触底
		onReachBottom() {
			let that = this;
			if (that.nextPage > 0) {
				that.loadData(() => {
			
				});
			} else {
			
			}	
		},
		// onShareAppMessage(res) {
		// 	if (res.from === 'button') {//来自页面内分享按钮
		// 		console.log(res.target)
		// 	}
		// 	return {
		// 	  title: '我的供求',
		// 	  path: '/pages/gongqiu/gongqiu'
		// 	}
		// },
		methods: {
			//加载供求数据
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
					uid: this.user_id
				};
				http.apiRequest({
					api: "/api/info/infoList",
					data: param,
					secuss: (res, httpStatus) => {
						that.lodingLock = false;
						if (res.code == "1") {
							that.nextPage = res.data.nextPage;
							that.page = res.data.page;
							that.itemList = that.itemList.concat(res.data.rows);
			
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
			openshare(e) {
				console.log(e)
				var itemid = e.currentTarget.dataset.itemid
				this.itemid = itemid
			},
			openinfo(e) {
				console.log(e)
				var itemid = e.currentTarget.dataset.itemid
				// console.log(userid)
				uni.navigateTo({
					// 传递 userid 在详情页接收
					url: '/pages/gongqiu/gongqiuDetail/gongqiuDetail?itemid=' + itemid
				});
			},
			//搜索按钮
			search(e) {
				let that = this;
				that.keyword = that.keywordinput;
				that.nextPage = 1;
				that.itemList = [];
				that.loadData(() => {
			
				});
			},
			revise(e) {
				console.log(e)
				var usersid = e.currentTarget.dataset.usersid
				var title = e.currentTarget.dataset.title
				var content = e.currentTarget.dataset.content
				uni.navigateTo({
					url: `/pages/gongqiu/revise/revise?usersid=${usersid}&title=${title}&contont=${content}`
				});
			},
			// share(e) {
			// 	console.log(e)
			// 	var that=this;
			// 	var item_index = e.currentTarget.dataset.index;
			// },
			delect(e) {
				var that=this;
				var usersid = e.currentTarget.dataset.usersid;
				var item_index = e.currentTarget.dataset.index;
				var token=this.token;
				this.userid = usersid
				uni.showModal({
					title: '提示',
					content: '你确定要删除吗？删除后将不能找回！',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							let opts = {
								url: '/api/info/infoRemove',
								method: 'POST',
								header: that.token
							};
							let param = {
								ids: usersid
							};
							http.httpTokenRequest(opts, param).then(res => {
								console.log(res.data);
								if (res.data.code == 1) {
									that.itemList.splice(item_index, 1);
									uni.showToast({
										title: "删除成功"
									});
									uni.switchTab({
										url: '/pages/user/myinfo/myinfo'
									});
								} else {
									uni.showToast({
										title: "加载失败..."
									});
								}
							}, error => {
								console.log('error=>', error)
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			release() {
				uni.navigateTo({
					url: '/pages/gongqiu/release/release'
				});
			}
		}
	}
</script>

<style>
.content {
		position: relative;
	}
	.uni-media-list-body {
		height: auto;
	}
	/* .uni-media-list-body .title{
		display: flex;
		justify-content: space-between;
	} */
	.uni-media-list-body .title .time {
		font-size: 18upx;
		color: #999;
		/* float: right; */
	}
	.page-body {
		/* width: 100%; */
		background: #fff;
		position: fixed;
		height: 60upx;
		width: 100%;
		z-index: 999;
		top: 0px;
		left: 50%;
		transform: translateX(-50%);
	}
	.uni-media-list-body .title .timu {
		max-width: 610upx;
		font-size: 34upx;
		color: #333;
		font-weight: 700;
		/* margin-bottom: 10upx; */
		word-wrap:break-word;
		/* display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden; */
	}
	
	.xuyao {
		width: 610upx;
		font-size: 26upx;
		color: #999;
		word-wrap:break-word;
		margin-bottom: 56upx;display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.uni-list {
		background: #fff;
	}
	
	.uni-list-cell {
		background: #fff;
		margin-bottom: 36upx;
		box-sizing: border-box;
	}
	.uni-media-list {
		box-shadow: 0px 0px 10px #f0f0f0;
		padding: 40upx;
	}
	.info {
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
		width: 160upx;
		height: 68upx;
		font-size: 30upx;
		color: #fff;
		background: url(../../../static/img/juxing.png) no-repeat;
		background-size: 100% 100%;
		text-align: center;
		line-height: 68upx;
	}

	.uni-media-list-body {
		margin-top: 20upx;
		line-height: 1.2em;
	}

	/* .uni-media-list-body .xuyao {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	} */
	.input-search {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20upx;
		padding-left: 10upx;
		width: 690upx;
		position: fixed;
		top:0upx;
		background: #fff;
		padding-bottom: 40upx;
		/* padding-top: 60upx; */

	}
	.input-box {
		display: flex;
		background: #ddd;
		border-radius: 34upx;
		height: 68upx;
		width: 520upx;
		line-height: 68upx;
	}
	.input-box input {
		width: 520upx;
		padding-left: 95upx;
		line-height: 68upx;
		height: 68upx; 
		box-sizing: border-box;
	}
	.btn {
		background: #4F3B3B !important;
		height: 68upx;
		width: 130upx;
		font-size: 32upx;
		border-radius: 34upx;
		line-height: 68upx;
		color: #ffffff;
		margin: 0;
	}
	.fabu {
		width: 106upx;
		height: 106upx;
		border-radius: 50%;
		line-height: 106upx;
		position: fixed;
		left: 75vw;
		top: 80vh;
		background: url(../../../static/img/fabu.png) no-repeat !important;
		background-size: 100% 100% !important;
	}
	.anniu-box {
		display: flex;
		justify-content:flex-end;
	}
	.anniu-box .anniu1 {
		/* border: 1upx solid #666; */
		width: 48upx;
		height: 48upx;
		background: url(../../../static/img/xiugai1.png) no-repeat;
		background-size: 100% 100%;
		margin-right: 100upx;
	}
	.anniu-box .anniu2 {
		width: 48upx;
		height: 48upx;
		background: url(../../../static/img/shanchu.png) no-repeat;
		background-size: 100% 100%;
	}
	.timu .gongying {
		width: 66upx;
		height: 32upx;
		background: #00A6A8;
		border-radius: 4upx;
		font-size: 22upx;
		color: #fff;
		/* margin-top: 10upx;
		margin-left: 20upx; */
		text-align: center;
		line-height: 32upx;
	}
	.timu .xuqiu {
		width: 66upx;
		height: 32upx;
		border-radius: 4upx;
		font-size: 22upx;
		color: #fff;
		/* margin-top: 10upx;
		margin-left: 20upx; */
		text-align: center;
		line-height: 32upx;
		background: #E8426D;
	}
	.timu .qita {
		width: 66upx;
		height: 32upx;
		border-radius: 4upx;
		font-size: 22upx;
		color: #fff;
		/* margin-top: 10upx;
		margin-left: 20upx; */
		text-align: center;
		line-height: 32upx;
		background: #BFBFBF;
	}
</style>
