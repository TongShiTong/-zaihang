<template>
	<view class="content">
		<view style="position: relative;min-height: 86vh;">
			<view class="input-search">
				<view style="width: 690upx; display: flex; justify-content: space-between; position: relative; padding-left: 5upx;">
					<view class="input-box">
						<input type="text" v-model="keywordinput">
						<view class="iconfont" style="position: fixed;margin-top:12upx; left: 60upx;z-index: 1000; width: 40upx;height: 40upx;"><image style="width: 100%;height: 100%;" src="../../static/img/sousuo.png"></image></view>
					</view>
					<button class="btn" type="primary" @tap="search()">搜索</button>
				</view>

				<button v-if="groupid" class="btn fabu" type="primary" @tap="release()"></button>
			</view>
			<view style="height: 120upx;"></view>
			<!-- 代码块 uli -->
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in itemList" :key="index">
					<view class="uni-media-list">
						<!-- <image class="uni-media-list-logo" :src="item.author"></image> -->
						<view class="uni-media-list-body" @tap="openinfo" :data-itemid="item.id">
							<view class="title">
								<view class="timu">
									
										<view style="display: flex;justify-content: space-between;align-items: center;" class="uni-media-list-text-top"><view :class="{'gongying':item.type==1, 'xuqiu': item.type==2, 'qita':item.type==3}">{{item.type_text}}</view>
										<view class="uni-media-list-text-top time">{{item.createtime*1000 | getDateDiff}}</view></view>
									
									<view style="word-wrap: break-word;max-width: 610rpx; line-height: 1.4em;text-align: justify;"> {{item.title}}</view>
								</view>
							</view>
							<view class="uni-media-list-text-top xuyao">{{item.content}}</view>
						</view>
						<view class="info">
							<view class="info-box" @tap="openmember" :data-memberid="item.member.id">
								<image class="img" :src="item.userInfo.avatar" mode="aspectFill"></image>
								<view class="info-content">
									<view class="name">{{item.member.name}}</view>
									<view class="zhiwei">{{item.company.company}}</view>
								</view>
							</view>
							<view class="time-box">
								<!-- <navigator :href="item.member.mobile" hover-class="none" @tap='telChange'>联系ta</navigator> -->
								<view v-if="item.mobile&&item.mobile !=''" @tap="callPhone" :data-ph="item.mobile">联系ta</view>
								<view v-else @tap="callPhone" :data-ph="item.member.mobile">联系ta</view>
							</view>
						</view>
					</view>
					<!-- <viea @tap='revise' v-if='haslimit'>修改</viea>-->
					
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
	} from '../../components/date.js'
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
			},
			getDateDiff (dateTimeStamp) {
			    var result = ''
			    var minute = 1000 * 60
			    var hour = minute * 60
			    var day = hour * 24
			    var month = day * 30
			    var now = new Date().getTime()
			    var diffValue = now - dateTimeStamp
			    if (diffValue < 0) return
			    var monthC = diffValue / month
			    var weekC = diffValue / (7 * day)
			    var dayC = diffValue / day
			    var hourC = diffValue / hour
			    var minC = diffValue / minute
			    if (monthC >= 1) {
			      result = "" + parseInt(monthC) + "月前"
			    }
			    else if (weekC>=1) {
			      result = "" + parseInt(weekC) + "周前"
			    }
			    else if (dayC >= 1) {
			      result = ""+ parseInt(dayC) + "天前"
			    }
			    else if (hourC >= 1){
			      result = "" + parseInt(hourC) + "小时前"
			    }
			    else if (minC >= 1) {
			      result = ""+ parseInt(minC) + "分钟前"
			    } else {
			      result = "刚刚"
			    }
			    return result
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
				status: 'more',//more   显示文字加载更多  loading  显示文字 正在加载   nomore  显示没有更多了
				groupid: false,
				lodingLock: false,
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '———— 杭州市安庆商会 ————'
				},
			}
		},
		onPullDownRefresh() {
			console.log('refresh');
			var that = this
			that.itemList = []
			that.loadData()
			setTimeout(()=>{
				uni.stopPullDownRefresh();
			},1000);		
		},
		onLoad(e) {
			let that = this;
			let shareurl = e.shareurl;
			let share = e.share;
			if(share=="1"){
				let url=decodeURIComponent(shareurl);
				uni.navigateTo({
					// 传递 userid 在详情页接收
					url:url
				});
			}
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


			uni.$on("editInfo", () => {
				that.itemList = [];
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
					api: "/api/info/infoList",
					data: param,
					secuss: (res, httpStatus) => {
						that.lodingLock = false;
						if (res.code == "1") {
							that.nextPage = res.data.nextPage;
							that.page = res.data.page;
							that.itemList = that.itemList.concat(res.data.rows);
							console.log(that.itemList)

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
				var itemId = e.currentTarget.dataset.itemid
				uni.navigateTo({
					// 传递 userid 在详情页接收
					url: './gongqiuDetail/gongqiuDetail?itemid=' + itemId
				});
			},
			//打开会员信息
			openmember(e) {
				var memberid = e.currentTarget.dataset.memberid
				uni.navigateTo({
					// 传递 userid 在详情页接收
					url: '/pages/tongxun/userDetail/userDetail?id=' + memberid
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
		padding: 0;
	}

	.uni-media-list-body {
		height: auto;
	}

	/* .uni-media-list-body .title {
		display: flex;
		justify-content: space-between;
	} */

	.time {
		/* text-align: right; */
		font-size: 18upx;
		color: #999;
		/* position: relative;
		top: -32upx;
		width: 120rpx;
		left: 490rpx; */
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
		font-size: 34upx;
		color: #333;
		font-weight: 700;
		margin-bottom: 10upx;
		/* display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden; */
	}

	.xuyao {
		width: 610upx;
		font-size: 26upx;
		color: #999;
		margin-bottom: 56upx;
		word-wrap:break-word;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.uni-list {
		background: #fff;
		padding: 0 30upx;
	}

	.uni-list-cell {
		background: #fff;
		margin-bottom: 36upx;
		box-sizing: border-box;
	}

	.uni-media-list {
		box-shadow: 0px 0px 10px #ddd;
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
		font-size: 28upx;
		font-weight: bold;
	}

	.info .info-box .zhiwei {
		font-size: 24upx;
		color: #999;
	}

	.info .info-box .img {
		width: 68upx;
		height: 68upx;
		border-radius: 50%;
		/* background: #ffcccc; */
		margin-right: 20upx;
	}

	.info .time-box {
		width: 160upx;
		height: 68upx;
		font-size: 30upx;
		color: #fff;
		background: url(../../static/img/juxing.png) no-repeat;
		background-size: 100% 100%;
		text-align: center;
		line-height: 68upx;
	}

	.uni-media-list-body {
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
		padding-left: 26upx;
		width: 750upx;
		position: fixed;
		/* top: 0upx; */
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
		background: url(../../static/img/fabu.png) no-repeat !important;
		background-size: 100% 100% !important;
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
	.timu .gongying {
		width: 66upx;
		height: 32upx;
		background: #00A6A8;
		border-radius: 4upx;
		font-size: 22upx;
		color: #fff;
		/* margin-top: 6upx; */
		/* margin-left: 20upx; */
		text-align: center;
		line-height: 32upx;
	}
	.timu .xuqiu {
		width: 66upx;
		height: 32upx;
		border-radius: 4upx;
		font-size: 22upx;
		color: #fff;
		/* margin-top: 6upx; */
		/* margin-left: 20upx; */
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
		/* margin-top: 6upx; */
		/* margin-left: 20upx; */
		text-align: center;
		line-height: 32upx;
		background: #BFBFBF;
	}
</style>
