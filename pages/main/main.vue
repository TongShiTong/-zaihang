<template>
    <view>
		<!-- <view class="uni-padding-wrap">
            <view class="page-section swiper">
                <view class="page-section-spacing">
                    <swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
                        <swiper-item v-for="(item,index) in swiper" :key="index">
                            <view class="swiper-item" style="height: 300upx;">
								<image :src="item.imageurl" style="width: 100%;height: 100%;"></image>
							</view>
                        </swiper-item>
                    </swiper>
                </view>
            </view>
        </view> -->
		<view class="banner">
			<image :src="swiper.imageurl"></image>
		</view>
		<view class="content">
			<view class="jieshao" @tap="shinfo">
				<view style="display: flex;justify-content: space-between; align-items: center; margin-bottom: 33upx; margin-top: 56upx;">
					<view class="jieshao-box">
						<view class="name">{{jieshao.name}}</view>
						<!-- <image class="img" src="../../static/img/xiangqing.png"></image> -->
					</view>
					<image style="width: 44upx; height: 44upx;" src="../../static/img/zu.png"></image>
				</view>
				<view class="code"><image src="../../static/img/shanghui.png"></image></view>
			</view>
			
			<view class="uni-padding-wrap">
				<view style="display: flex;justify-content: space-between;margin-top: 48upx; margin-bottom: 33upx;" @tap="itemsList">
					<view class="jieshao-box new">
						<view class="name">热门供求</view>
					</view>
					<image style="width: 44upx; height: 44upx;" src="../../static/img/zu.png"></image>
				</view>
			    <view class="page-section swiper">
			        <view class="page-section-spacing">
			            <swiper class="swiper" :circular="circular" :previous-margin="previousMargin" :duration="duration">
			                <swiper-item v-for="(item,index) in items" :key="index">
			                    <view class="uni-media-list remengq" :class="swipercss[index]">
			                    	<!-- <image class="uni-media-list-logo" :src="item.author"></image> -->
									<view style="padding-top: 2upx; margin-bottom: 12upx;">
										<view :class="{'gongying':item.type==1, 'xuqiu': item.type==2, 'qita':item.type==3}">{{item.type_text}}</view>
									</view>
			                    	<view class="uni-media-list-body infogq" @tap="openinfogq" :data-itemid="item.id">
			                    		<view class="gongqiu">
			                    			<view>
			                    				<view class="uni-media-list-text-top timu">{{item.title}}</view>
			                    			</view>
			                    			<view class="uni-media-list-text-top time">{{item.createtime*1000 | getDateDiff}}</view>
			                    		</view>
			                    		<view class="uni-media-list-text-top xuyao">{{item.content}}</view>
			                    	</view>
									<view class="info">
										<image style="width: 48upx;height: 48upx;border-radius: 50%;margin-right: 16upx;" :src="item.userInfo.avatar" mode="aspectFill"></image>
										<view>{{item.member.company}}</view>
									</view>
			                    </view>
			                </swiper-item>
			            </swiper>
			        </view>
			    </view>
			</view>
			
			<view class="uni-list">
				<view style="display: flex;justify-content: space-between; align-items: center;margin-bottom: 33upx;margin-top: 56upx;
" @tap="newsList">
					<view class="jieshao-box new">
						<view class="name">新闻资讯</view>
					</view>
					<image style="width: 44upx; height: 44upx;" src="../../static/img/zu.png"></image>
				</view>
				<view class="uni-list-cell-box">
					<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in news" :key="index">
						<view class="redian">#实时热点</view>
						<view class="uni-media-list redian-box" @tap="openinfo" :data-newsid="item.id">
							<view class="uni-media-list-body">
								<view class="uni-media-list-text-top newtitle">{{item.title}}</view>
							</view>
							<image class="uni-media-list-logo" :src="item.thumb_image" mode='aspectFill'></image>
						</view>
						<view class="hzaq">杭州市安庆商会</view>
					</view>
					<!-- <view style="height: 1upx; background: #e5e5e5; width: 630upx;margin: 0 auto; position: relative;top: -320upx;"></view> -->
				</view>
			</view>
			<view style="font-size: 28upx; color: #666; text-align: center;margin-top: 56upx;margin-bottom: 20upx;">————&nbsp;&nbsp;杭州市安庆商会&nbsp;&nbsp;————</view>
			<view style="font-size: 24upx; color: #999; text-align: center; margin-bottom: 30upx;">杭州九之信息技术有限公司提供技术支持</view>
		</view>
    </view>
</template>

<script>
	import http from '@/components/utils/http.js'
	import {formatDate, formatMsgTime} from '@/components/date.js'
    import {
        mapState
    } from 'vuex'

    export default {
        computed: mapState(['forcedLogin', 'hasLogin', 'userName']),
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
				// var padDate=function(va){
				// 	va=va<10?'0'+va:va;
				// 	return va
				// }
			 //     var value=new Date(dateTimeStamp);
			 //        var year=value.getFullYear();
			 //        var month=padDate(value.getMonth()+1);
			 //        var day=padDate(value.getDate());
			 //        var hour=padDate(value.getHours());
			 //        var minutes=padDate(value.getMinutes());
			 //        var seconds=padDate(value.getSeconds());
			 //        return year+'-'+month+'-'+day+' '+hour+':'+minutes+':'+seconds;
					result = "" + parseInt(dayC) + "天前"
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
		data() {
		    return {
				// indicatorDots: true,
				// autoplay: true,
				// current: 0,
				// interval: 3000,
				duration: 500,
				circular: false,
				previousMargin: '0px',
				swiper: [],
				swipercss: [
					"swiper1",
					"swiper2",
					"swiper3"
				],
				jieshao: '',
				news: [],
				items:[]
		    }
		},
		onPullDownRefresh() {
			console.log('refresh');
			var that = this
			this.newData()
			that.loadData()
			setTimeout(()=>{
				uni.stopPullDownRefresh();
			},1000);		
		},
        onLoad() {
			uni.showLoading({
				title: '加载中...',
				// mask: false
			});
			// setTimeout(() => {
			// 	uni.startPullDownRefresh();
			// },1000)
			let opts = {
				url: '/api/adszone/getAdsByMark',
				method: 'GET',
			};
			
			let param = {
				mark: 'shanghui_slide_01'
			};
			let param1 = {
				mark: 'shanghuijieshao'
			};
			
			http.httpTokenRequest(opts, param).then(res => {
					if(res.data.code == 1){
						this.swiper = res.data.data.data
						// console.log(this.swiper)
					}else{
						uni.showToast({
							title: "加载失败..."
						});
					}
				},error => {
				console.log('error=>',error)
			})
			http.httpTokenRequest(opts, param1).then(res => {
					if(res.data.code == 1){
						this.jieshao = res.data.data
						// console.log("123",this.jieshao)
					}else{
						uni.showToast({
							title: "加载失败..."
						});
					}
				},error => {
			})
			// http.httpTokenRequest(opts1, param2).then(res => {
			// 		// console.log(res.data.data);
			// 		if(res.data.code == 1){
			// 			this.news = res.data.data.rows	
			// 			this.news = this.news.slice(0,2)
			// 			// uni.stopPullDownRefresh();
			// 			uni.hideLoading();
			// 		}else{
			// 			uni.showToast({
			// 				title: "加载失败..."
			// 			});
			// 		}
			// 	},error => {
			// 	console.log(error)
			// })
			this.newData();
			this.loadData();
        },
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
			  console.log('456', res.target)
			}
			return {
			  title: '安庆商会信息共享平台',
			  path: '/pages/main/main',
			  imageUrl:"../../static/img/banner-1.png",
			}
		},
		methods: {
			openinfo(e) {
				var newsid = e.currentTarget.dataset.newsid
				uni.navigateTo({
					url: '/pages/main/newsDetail/newsDetail?newsid=' + newsid
				});
			},
			openinfogq(e) {
				console.log(e)
				var itemid = e.currentTarget.dataset.itemid
				// console.log(userid)
				uni.navigateTo({
					// 传递 userid 在详情页接收
					url: '/pages/gongqiu/gongqiuDetail/gongqiuDetail?itemid=' + itemid
				});
			},
			shinfo() {
				uni.navigateTo({
					url: './shanghui/shanghui',
				});
			},
			newsList() {
				uni.navigateTo({
					url: './newsList/newsList',
				});
			},
			itemsList() {
				uni.reLaunch({
					url: '/pages/gongqiu/gongqiu',
				})
			},
			newData() {
				let opts1 = {
					url: '/api/news/newsList',
					method: 'GET',
				};
				let param2 = {
				
				};
				http.httpTokenRequest(opts1, param2).then(res => {
						// console.log(res.data.data);
						if(res.data.code == 1){
							this.news = res.data.data.rows	
							this.news = this.news.slice(0,5)
							// uni.stopPullDownRefresh();
							uni.hideLoading();
						}else{
							uni.showToast({
								title: "加载失败..."
							});
						}
					},error => {
					console.log(error)
				})
			},
			loadData() {
				let items = [];
				this.page++;
				let opts = {
					url: '/api/info/infoList',
					method: 'GET',
				};
				
				let param = {
					page:this.page
				};
				http.httpTokenRequest(opts, param).then(res => {
					if (res.data.code == 1) {
						// console.log(res.data.data.nextPage)
						this.items = res.data.data.rows	
						this.items = this.items.slice(0,3)
						// console.log( '2',this.items)	
					} else {
						uni.showToast({
							title: "加载失败..."
						});
					}
				}, error => {
					console.log('error=>', error)
				})
			},
		}
    }
	/*
	reurest({api:"/api123/adszone/getAdsByMark",param:{},seccss:function(res){	
	}});
	function apiReurest(option){
		option=extends(option,{api:"",param:{},method:"GET",seccss:function(res){},error:function(res){alert("请求错误")},,httpError:function(res){alert("请求错误")}});
		http.httpRequest({
			url: option.api,
			method: option.method,
		}, param).then(res => {
			if(res.statusCode=="200"){
				if(res.data.code=="1"){
					option.seccss(res.data.data);
				}else{
					option.error(res);
				}
				
			}else{
				option.httpError(res);
			}
		
				console.log('res=>',res);
				if(res.data.code == 1){
					this.swiper = res.data.data.data
					// this.swiper.
					// uni.showToast({
					// 	title: res.data.msg
					// });
					// setTimeout(()=>{
						// uni.switchTab({
							
						    // url: '/pages/main/main'
						// });
					// },500)	 
				}else{
					uni.showToast({
						title: res.data.msg
					});
				}
			},error => {
			console.log('error=>',error)
		})
	}*/
</script>

<style>
	.banner {
		width: 750upx;
		height: 304upx;
	}
	.banner image {
		width: 100%;
		height: 100%;
	}
    .hello {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .ul {
        font-size: 30upx;
        color: #8f8f94;
        margin-top: 50upx;
    }

    .ul>view {
        line-height: 50upx;
    }
	.redian-box{
		display: flex;
		/* margin: 20upx; */
		/* padding: 0 30upx; */
		justify-content: space-between;
		/* background: #efeff4; */
		align-items: center;
	}
	.uni-list-cell-box {
	/* 	box-shadow: 0upx 10upx 10upx #f0f0f0;
		border-bottom-left-radius: 20upx;
		border-bottom-right-radius: 20upx;
		margin-top: 80upx;
		padding-bottom: 30upx; */
		box-shadow: 0upx 10upx 40upx #e5e5e5;
	}
	.uni-list-cell:nth-child(5) .hzaq{
		border-bottom: none;
	}
	.uni-list-cell {
		padding: 30upx;
		padding-bottom: 0upx;
	}
	.remengq {
		/* padding: 30upx; */
	}
	.infogq {
		padding: 0 30upx;
	}
	.redian {
		font-size: 26upx;
		color: #000000;
		margin-bottom: 26upx;
	}
	.hzaq {
		font-size: 20upx;
		color: #999;
		margin-top: 26upx;
		padding-bottom: 30upx;
		border-bottom: 1upx solid #e5e5e5;
	}
	.uni-media-list-body {
		height: auto;
	}
	.uni-media-list-logo {
		background-color: rgb(143, 143, 148);
		width: 134upx;
		height: 100upx;
	/* 	border-bottom-left-radius: 30upx;
		border-bottom-right-radius: 30upx; */
	}
	.newtitle {
		font-size: 30upx;
		color: #1A1A1A;
		line-height: 1.2em;
		font-weight: bold;
		width: 427upx;
		word-wrap: break-word;
	}
	.jieshao {
		width: 690upx;
	/* 	padding: 30upx;
		padding-top: 0;
		text-align: justify;
		box-shadow: 0upx 10upx 10upx #f0f0f0;
		border-bottom-left-radius: 20upx;
		border-bottom-right-radius: 20upx; */
	}
	.jieshao-box {
		/* display: flex; */
		/* justify-content: space-between; */
		/* align-items: center; */
		font-size: 46upx;
	}
	.jieshao-box navigator {
		font-size: 24upx;
		color: #999;
		line-height: 32upx;
	}
	.jieshao-box .img {
		width: 32upx;
		height: 32upx;
	}
	.detail {
		display: flex;
		align-items: center;
	}
	.name {
		font-size: 38upx;
		font-weight: 700;
		/* margin: 40upx 0; */
		/* margin-bottom: 28upx; */
		/* text-align: center; */
	}
	.code {
		/* font-size: 26upx; */
		/* color: #333; */
		/* line-height: 1.6em; */
		/* display: -webkit-box; */
		/* -webkit-box-orient: vertical; */
		/* -webkit-line-clamp: 4; */
		/* overflow: hidden; */
		width: 690upx;
		height: 150upx;
		box-shadow: 0 0 40upx #e5e5e5;
	}
	.code image {
		width: 100%;
		height: 100%;
	}
	swiper-item {
		width: 600upx !important;
		/* padding-right: 20upx !important; */
		padding-right: 20upx;
	}
	.swiper1 {
		width: 600upx !important;
		height: 296upx !important;
		/* margin-left: 20upx !important; */
		background: #f00;
		background: url(../../static/img/diban1.png) no-repeat;
		background-size: 100% 100%;
		/* box-shadow: 0 0 40upx #e5e5e5; */
	}
	.swiper2 {
		width: 600upx !important;
		height: 296upx !important;
		/* margin-left: 20upx !important; */
		background: #00A6A8;
		background: url(../../static/img/diban2.png) no-repeat;
		background-size: 100% 100%;
		/* box-shadow: 0 0 40upx #e5e5e5; */
	}
	.swiper3 {
		width: 600upx !important;
		height: 296upx !important;
		/* margin-left: 20upx !important; */
		background: url(../../static/img/diban03.png) no-repeat;
		background-size: 100% 100%;
		/* box-shadow: 0 0 40upx #e5e5e5; */
	}
	
	.gongqiu {
		/* width: 600upx; */
		display: flex;
		justify-content: space-between;
		/* align-items: center; */
	}
	.gongqiu .time {
		color: #999;
		text-align: right;
		font-size: 18upx;
		margin-top: 12upx;
	}
	.gongqiu .timu {
		max-width: 410upx;
		word-wrap: break-word;
		color: #1A1A1A;
		font-size: 34upx;
		font-weight: bold;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}
	.xuyao {
		/* width: 610upx; */
		font-size: 24upx;
		color: #666;
		padding-top: 20upx;
		text-align: justify;
		word-wrap: break-word;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.gongying {
		width: 66upx;
		height: 37upx;
		background: url(../../static/img/xu7672x.png) no-repeat;
		background-size: 100% 100%;
		border-radius: 4upx;
		font-size: 22upx;
		color: #fff;
		margin-top: 16upx;
		margin-left: 16upx;
		text-align: center;
		line-height: 32upx;
	}
	.xuqiu {
		width: 66upx;
		height: 37upx;
		border-radius: 4upx;
		font-size: 22upx;
		color: #fff;
		margin-top: 16upx;
		margin-left: 16upx;
		text-align: center;
		line-height: 32upx;
		background: url(../../static/img/gong7672x.png) no-repeat;
		background-size: 100% 100%;
	}
	.qita {
		width: 66upx;
		height: 37upx;
		border-radius: 4upx;
		font-size: 22upx;
		color: #fff;
		margin-top: 16upx;
		margin-left: 16upx;
		text-align: center;
		line-height: 32upx;
		background: url(../../static/img/qita7672x.png) no-repeat;
		background-size: 100% 100%;
	}
	.info {
		display: flex;
		font-size: 20upx;
		align-items: center;
		color: #333;
		margin-top: 22upx;
		margin-left: 30upx;
	}
</style>
