<template>
	<view class="box">
		<view style="min-height: 76vh;">
		<view style="position: fixed;right: 0; background: rgba(0,0,0,0.2);height: 59upx;font-size: 24upx;color: #fff;text-align: center;line-height: 59upx;padding: 0 28upx;border-bottom-left-radius: 30upx;">杭州市安庆商会会员名片</view>
		<view v-if="companyDetail.photo!=null&&companyDetail.photo!=''">
			<!--如果用户上传了背景图-->
			<view class="avatar-box">
				<image class="avatar" :src="companyDetail.photo" mode="center"></image>
			</view>
		</view>
		<view v-else>
			<!--如果用户没有上传背景图，显示纯色-->
			<view class="avatar-box">
				<image src="../../../static/img/touxiang.png"></image>
			</view>
		</view>
		<view class="contentinfo">
			<view class="art-content">
				<view class="name">
					<view class="name-box">{{memberDetail.name}}</view>
					<view class="position">{{memberDetail.position}}</view>
				</view>
				<view class="company">{{memberDetail.company}}</view>
				<view style="font-size: 30upx; color: #333; font-weight: 700;margin-top: 20rpx;">{{memberDetail.composition}}</view>
				<!--商会成员可以看到手机号-->
				<view class="mobile" v-if="companyDetail.display == 1||group_id==2" @tap="callPhone" :data-ph="memberDetail.mobile">{{memberDetail.mobile}}</view>
				<!--点击下面的按钮，显示微信二维码-->
				<!-- <view class="mobile" v-if="group_id==2&&companyDetail.wx_qrcode!=''&&companyDetail.wx_qrcode!=null">微信二维码</view> -->
			
			
				<!-- 用rich-text展示接收到的html内容 富文本-->
				<!-- <rich-text :nodes="strings" class="richText"></rich-text> -->
			</view>
			<view class="touxiang">
				<!--显示头像-->
				<image style="width: 110upx; height: 110upx; border-radius: 50%;" :src="memberDetail.userInfo.avatar" mode="aspectFill"></image>
				<view class="mobile" v-if="group_id==2&&companyDetail.wx_qrcode!=''&&companyDetail.wx_qrcode!=null">
					<view class="erweima">
						<image class="img" :src="companyDetail.wx_qrcode" mode="aspectFill"></image>
						<!-- <view>扫一扫，私聊我</view> -->
					</view>
				</view>
			</view>
		</view>
		<view class="video" v-if="companyDetail.video!=''&&companyDetail.video!=null">
            <video id="myVideo" :src="companyDetail.video" @error="videoErrorCallback" customCache="false" controls>
				<!-- poster="https://shanghui.jiuduanfw.com/uploads/20190812/43a8b427765d691fb4c1fbc47df8a895.png" -->
				<!-- <cover-view class="controls" style="display:`${tab_image}`">
				<cover-image class="img" src="../../image/z5.png" />
				</cover-view> -->
			</video>
        </view>
		<view class="content-box" v-if="companyDetail.display == 1||memberDetail.user_id==user_id">
			<!--如果是我的公司信息，在这里可以快速查看公司信息是显示还是隐藏-->
			<!-- <view v-if="companyDetail.display == 1">
				公开
			</view>
			<view v-else>
				隐藏
			</view> -->
			
			<!-- <view class="sing" v-if="memberDetail.user_id==user_id">
				<navigator url="/pages/user/company/company" hover-class="none">
					<image class="img" src="../../../static/img/xiugai1.png"></image><text>编辑</text>
				</navigator>
			</view> -->
			
			<view class="but-box">
				<button open-type='share' class="btnshare">分享</button>
				<view class="time-box" v-if="memberDetail.user_id==user_id">
					<navigator url="/pages/user/company/company" hover-class="none">
						<!-- <image class="img" src="../../../static/img/xiugai1.png"></image> -->
						<text>编辑</text>
					</navigator>
				</view>
			</view>
			
			<view class="address">
				<view style="display: flex;align-items: center; margin-bottom: 26upx;">
					<view style="width: 12upx; height: 42upx; background: #23789B;margin-right: 16upx;"></view>
					<view>公司简介</view>
				</view>
				<view v-if="companyDetail.about!=''&&companyDetail.about!=null" style="font-size: 28upx; color: #333; width: 690upx;padding-bottom: 57upx;word-wrap:break-word;line-height: 1.6em;">{{companyDetail.about}}</view>
				<view v-else style="font-size: 28upx; color: #333; width: 690upx;padding-bottom: 57upx;word-wrap:break-word;line-height: 1.6em;">{{memberDetail.company}}</view>
				<view class="address-box" v-if="companyDetail.address!=''&&companyDetail.address!=null">
					<image src="../../../static/img/dingwei.png"></image>
					<view>{{companyDetail.address}}</view>
				</view>
				<view class="address-box" v-if="companyDetail.web_url!=''&&companyDetail.web_url!=null">
					<image src="../../../static/img/wangzhi.png"></image>
					<text selectable="true">{{companyDetail.web_url}}</text>

					<!--复制网址按钮-->
					<!--<web-view v-if="companyDetail.web_url!=''&&companyDetail.web_url!=null" :src="companyDetail.web_url"></web-view>
					-->
					<!-- <image src="../../../static/img/wangzhi.png"></image> -->
				</view>
			</view>
		<!-- 	<view class="about">
				<view style="margin-bottom: 26upx;">公司简介</view>
				
			</view> -->
			<view class="photo">
				<view style="display: flex;align-items: center; margin-bottom: 26upx;">
					<view style="width: 12upx; height: 42upx; background: #23789B;margin-right: 16upx;"></view>
					<view>公司相册</view>
				</view>
				
				<view class="xiangce" v-if="photosList != ''&&photosList != null">
					<view v-for="(item,index) in imgArr" :key="index">
						<image class="img" :src="item" mode="aspectFill" :data-index='index' @tap='previewImg'></image>
					</view>
					<!-- <navigator url="/pages/user/photo/photo">点击查看公司相册</navigator> -->
				</view>
				<view style="color: #666;text-align: center;font-size: 34rpx;" v-else>该会员未发布相册图片</view>
				<view style="text-align: center;font-size: 26upx; color: #999;margin-top: 30upx;" @tap="londMore" v-if="photosMore">加载更多...</view>
			</view>
		</view>
		<view class="content-box" style="text-align: center;padding-top: 60upx;" v-else>
			<view style="color: #666;text-align: center;font-size: 34rpx;">
				公司信息未对外公布
			</view>
		</view>
		</view>
		<view style="font-size: 28upx; color: #666; text-align: center;margin-top: 56upx;margin-bottom: 20upx;">————&nbsp;&nbsp;杭州市安庆商会&nbsp;&nbsp;————</view>
		<view style="font-size: 24upx; color: #999; text-align: center; margin-bottom: 30upx;">杭州九之信息技术有限公司提供技术支持</view>
		<!-- <navigator hover-class="none" target="miniProgram" open-type="exit">返回</navigator> -->
		<view style="height: 166upx;"></view>
	</view>
</template>

<script>
	import http from '@/components/utils/http.js'
	import {
		mapState
	} from 'vuex'
	export default {
		computed: mapState(['user_id','group_id']),
		data() {
			return {
				userDetail: {},
				userid: '',
				page: 1,
				// tab_image: "block",
				memberDetail: {},
				photosMore: false,
				companyDetail: {
					address: "",
					web_url: "",
					about: "",
					wx_qrcode: "",
					display: 0,
				},
				photosList: [],
				id: '',
				imgArr:[]
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
			  console.log(res.target)
			}
			let shareurl=encodeURIComponent('/pages/tongxun/userDetail/userDetail?id=' + this.id);
			console.log(shareurl)
			return {
			  title: this.memberDetail.name + '杭州市安庆商会会员名片',
			  path: '/pages/tongxun/tongxun?share=1&shareurl=' + shareurl,
			  imageUrl:"../../../static/img/touxiang.png",
			}
		},

		onLoad(e) {
			let that = this;
			let member_id = e.id; //商会会员编号
			this.id = e.id;
			var loadData=function(){
				//使用页面传入的商会会员编号，获取商会会员信息
				http.apiRequest({
					api: "/api/member/memberDetail",
					method: "GET",
					data: {
						id: member_id,
					},
					secuss: (res, httpStatus) => {
						if (res.code == 1) {
							that.memberDetail = Object.assign({}, that.memberDetail, res.data);
							//如果商会会员绑定了系统的用户，则根据用户ID，获取该用户对应的企业信息
							if (that.memberDetail.user_id > 0) {
								//根据user_id获取企业信息
								http.apiRequest({
									api: "/api/company/companyDetail",
									method: "GET",
									data: {
										uid: that.memberDetail.user_id,
									},
									secuss: (res, httpStatus) => {
										if (res.code == 1) {
											that.companyDetail = Object.assign({}, that.companyDetail, res.data);
										}
									},
									error: (res, httpStatus) => {
										uni.showToast({
											title: "请检查网络..."
										});
									},
								});
								//根据user_id获取企业相册列表
								http.apiRequest({
									api: "/api/photos/photosList",
									method: "GET",
									data: {
										page: that.page,
										limit: 8,
										uid: that.memberDetail.user_id,
									},
									secuss: (res, httpStatus) => {
										if (res.code == 1) {
											that.photosList = res.data.rows;
											that.page++
											if(that.photosList.length == 8) {
												that.photosMore = true
											}
											for(let i = 0; i < that.photosList.length; i++) {
											that.imgArr.push(that.photosList[i].image)
											
											// console.log(that.imgArr[i])
											}
										}
									},
									error: (res, httpStatus) => {
										uni.showToast({
											title: "请检查网络..."
										});
									},
								});
							} else {
								//该商会成员未绑定系统的用户，无公司信息
							}
						} else {
							uni.showToast({
								title: res.msg
							});
						}
					},
					error: (res, httpStatus) => {
						uni.showToast({
							title: "请检查网络..."
						});
					},
				});
			}
			
			uni.$on("editcompany",()=>{
				loadData();
			});
			loadData();
		},
		onUnload(e){
			uni.$off("editcompany",()=>{
				//loadData();
			});
		},
		methods: {
			callPhone(e) {
				// console.log(e)
				var phone = e.currentTarget.dataset.ph
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			// bindplay: function(e) {
			// 	this.tab_image = "none"
			// },
			previewImg(e) {
				let that = this
				// console.log(e.currentTarget.dataset.index);
				var index = e.currentTarget.dataset.index;
				var imgArr = that.imgArr;
				uni.previewImage({
				  current: imgArr[index],     //当前图片地址
				  urls: imgArr,               //所有要预览的图片的地址集合 数组形式
				  success: function(res) {},
				  fail: function(res) {},
				  complete: function(res) {},
				})
			},
			londMore() {
				let that = this 
				http.apiRequest({
					api: "/api/photos/photosList",
					method: "GET",
					data: {
						page: that.page,
						limit: 8,
						uid: that.memberDetail.user_id,
					},
					secuss: (res, httpStatus) => {
						if (res.code == 1) {
							that.photosList = res.data.rows;
							if(that.photosList.length<8){
								that.photosMore = false
							}
							for(let i = 0; i < that.photosList.length; i++) {
							that.imgArr.push(that.photosList[i].image)
							// console.log(that.imgArr[i])
							}
							that.page++
						}
					},
					error: (res, httpStatus) => {
						uni.showToast({
							title: "请检查网络..."
						});
					},
				});
			}
	
			// share(){
			// 	//获取服务供应商。
			// 	uni.getProvider({
			// 		service:"share",
			// 		success:(res)=>{
			// 			console.log("res",res)
			// 		//	console.log("provider",provider)
			// 			uni.share({
			// 				provider:res.provider,
			// 				type :5,
			// 				title:"标题",
			// 				summary:"摘要",
			// 				href:"/page/main/main",
			// 				imageUrl:"http://img11.360buyimg.com/cms/jfs/t1/10697/24/14604/57110/5c8b903bEf2ab1811/90c2336ab2ac8002.jpg",
			// 				miniProgram:{
			// 					id:"wx4cd3db3e1f0b85bf",
			// 					path:"/page/main/main",
			// 					type:"1",
			// 					webUrl:"http://www.jd.com",
			// 				},
			// 				scene:"WXSceneSession",//WXSceneSession	分享到聊天界面  WXSenceTimeline	分享到朋友圈   WXSceneFavorite	分享到微信收藏
			// 			});
			// 		}
			// 	})	
			// },
		}
	}
</script>

<style>
.box {
	/* background: #333; */
	width: 100%;
}

.content {
	padding: 10upx 2%;
	width: 96%;
	/* 允许换行 */
	flex-wrap: wrap;
}
.contentinfo {
	display: flex;
	justify-content: space-between;
	padding: 0 30rpx;
}
.touxiang {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding-top: 23upx;
	padding-bottom: 14upx;
}
.avatar-box {
	width: 750upx;
	height: 567upx;
}
.avatar-box image {
	width: 100%;
	height: 100%;
}
	.title {
		line-height: 2em;
		font-weight: 700;
		font-size: 38upx;
	}

	.art-content {
		/* padding: 60upx 100upx; */
		padding-top: 50upx;
		padding-left: 40upx;
		padding-bottom: 57upx;
		color: #333;
		/* line-height: 1.6em; */
		/* background: #fff; */
	}

	.art-content .name {
		display: flex;
		align-items: center;
	}
.art-content .name .name-box {
	font-size: 56upx;
	color: #000;
	font-weight: bold;
}
	.art-content .company {
		font-size: 36upx;
		margin-top: 24upx;
	}

	.art-content .position {
		font-size: 24upx;
		color: #fff;
		font-weight: bold;
		background: #c88f00;
		/* opacity: 0.5; */
		padding: 6upx 12upx;
		margin-left: 16upx;
	}

	.art-content .mobile {
		font-size: 36upx;
		color: #23789b;
		font-weight: bold;
		margin-top: 26upx;
	}

	.avatar {
		width: 750upx;
		height: 568upx;
		/* background: #ffcccc; */
	}
	.video {
		width: 690upx;
		height: 388.125upx;
		margin: 0 30upx;
		background: #7380FF;
	}
	video {
		width: 100%;
		height: 100%;
	}
	.content-box {
		position: relative;
		font-size: 40upx;
		color: #333;
		font-weight: 700;
		padding-left: 30upx;
	/* 	background: #121B4C;
		border-top-left-radius: 1em;
		border-top-right-radius: 1em;
		min-height: 50vh; */
		padding-bottom: 32upx;
	}

	.content-box .address {
		padding-top: 56upx;
		margin-bottom: 44upx;
	}

	.content-box .address .address-box {
		display: flex;
		font-size: 24upx;
		align-items: center;
		margin-bottom: 34upx;
	}

	.content-box .address .address-box image {
		width: 36upx;
		height: 36upx;
		margin-right: 20upx;
	}

	.sing {
		position: fixed;
		right: 30upx;
		bottom: 300upx;
		width: 168upx;
		height: 68upx;
		background: #fff;
		border-radius: 34upx;
		box-shadow: 0px 0px 10upx #f0f0f0;
	}

	.sing navigator .img {
		width: 44upx;
		height: 44upx;
		margin-top: 12upx;
		margin-left: 26upx;
	}
	.sing navigator text {
		font-size: 30upx;
		margin-left: 9upx;
		margin-top: 12upx;
	}
	.sing navigator {
		display: flex;
		align-items: center;
	}
    .photo{
		min-height: 42vh;
	}
	.xiangce {
		display: flex;
		flex-wrap: wrap;
		width: 690upx;
		/* height: 352upx; */
		/* border-radius: 20upx; */
		/* background: #E0E0E0; */
	}

	.xiangce .img {
		width: 150upx;
		height: 150upx;
		margin: 5upx 10upx;
	}

	.erweima {
		margin: 0 auto;
		text-align: center;
		font-size: 22upx;
	}

	.erweima .img {
		width: 152upx;
		height: 152upx;
		/* margin-top: 40upx; */
	}
	.btnshare {
		width: 300upx;
		height: 88upx;
		border-radius: 44upx;
		background: #DFF1F9;
		font-size: 38upx;
		color: #23789B;
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
		background: #23789B;
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
