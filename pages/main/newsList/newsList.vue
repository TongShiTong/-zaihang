<template>
	<view style="margin: 0 auto;">
		<view>
			<!-- 代码块 uli -->
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in itemList" :key="index" @tap="openinfo" :data-newsid="item.id">
					<view class="uni-media-list">
						<image class="uni-media-list-logo" :src="item.thumb_image"></image>
						<view class="uni-media-list-body" >
							<view class="title">
								<view class="uni-media-list-text-top timu">{{item.title}} &nbsp;&nbsp;</view>
								<view class="uni-media-list-text-top time">{{item.createtime*1000 | formatDate}}</view>
							</view>
							<!-- <view class="article-content">
								<rich-text :nodes="item.content"></rich-text>
							</view> -->
							<!-- <view class="uni-media-list-text-top xuyao">{{item.content}}</view> -->
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
	import {
		formatDate
	} from '@/components/date.js'
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
		computed: mapState(['token', 'user_id', 'group_id']),
		data() {
			return {
				itemList: [],
				keywordinput: '',
				keyword: '',
				infoType: 0,
				userid: 0,
				page: 1,
				nextPage: 1,
				status: 'more', //more   显示文字加载更多  loading  显示文字 正在加载   nomore  显示没有更多了
				groupid: false,
				lodingLock: false,
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '—— 杭州市安庆商会 ——'
				},

			}
		},
		onLoad() {
			let that = this;
			if (this.user_id && this.group_id == 2) {
				this.groupid = true
			}

			// 数据未加载前，可以放加载动画
			uni.showLoading({
				title: '加载中...',
			});

			this.loadData(() => {
				//加载完成的回调，隐藏加载框
				uni.hideLoading();
			});

			
		},
		onUnload(e) {
			
		},
		onReachBottom() {
			let that = this;
			if (that.nextPage > 0) {
				that.loadData(() => {

				});
			} else {

			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '自定义分享标题',
				path: '/pages/gongqiu/gongqiu'
			}
		},
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
				};
				http.apiRequest({
					api: "/api/news/newsList",
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
			//打开供求信息
			openinfo(e) {
				var itemId = e.currentTarget.dataset.newsid
				uni.navigateTo({
					// 传递 userid 在详情页接收
					url: '/pages/main/newsDetail/newsDetail?newsid=' + itemId
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

			//发布按钮
			release() {
				uni.navigateTo({
					url: './release/release'
				});
			},
			//打电话
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
		position: relative;
	}

	.uni-media-list-body {
		height: auto;
	}

	.uni-media-list-body .title {
		display: flex;
		justify-content: space-between;
	}

	.uni-media-list-body .title .time {
		font-size: 18upx;
		color: #999;
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
		width: 450upx;
		font-size: 34upx;
		color: #333;
		font-weight: 700;
		/* margin-bottom: 10upx; */
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.xuyao {
		width: 610upx;
		font-size: 26upx;
		color: #999;
		margin-bottom: 56upx;
		display: -webkit-box;
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
		background: url(/static/img/juxing.png) no-repeat;
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
		top: 0upx;
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
		width: 106upx;
		font-size: 24upx;
		border-radius: 34upx;
		line-height: 68upx;
		color: #ffffff;
		margin: 0;
	}



	.anniu-box {
		display: flex;
		justify-content: center;
	}

	.anniu-box .anniu {
		/* border: 1upx solid #666; */
		width: 160upx;
		margin: 10upx;
		font-size: 30upx;
		height: 68upx;
		line-height: 68upx;
		border-radius: 34upx;
		color: #fff;
		background: #F86A6A;
		text-align: center;
	}
</style>
