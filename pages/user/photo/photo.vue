<template>
	<view class="content">
		<!-- 代码块 uli -->
		<view style="min-height: 76vh;">
			<view class="uni-list">
				<view class="uni-media-list">
					<view class="photoUpload" @tap="photoUpload"></view>
				</view>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in dataList" :key="index">
					<view class="uni-media-list">
						<image class="uni-media-list-logo" :src="item.image" :data-itemid="item.id" :data-index='index' @tap='previewImg' @longpress="deleteImage" mode="aspectFill"></image> 
					</view>
				</view>
			</view>
			<view class="uni-media-list">
				<!-- <view class="photoRemove" @tap="photoRemove">删除选中</view> -->
			</view>
		</view>
		<view>
			<view style="font-size: 28upx; color: #666; text-align: center;margin-top: 156upx;margin-bottom: 20upx;">————&nbsp;&nbsp;杭州市安庆商会&nbsp;&nbsp;————</view>
			<view style="font-size: 24upx; color: #999; text-align: center; margin-bottom: 30upx;">杭州九之信息技术有限公司提供技术支持</view>
		</view>
	</view>
</template>
<script>
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import uniTag from "@/components/uni-tag/uni-tag.vue"
	import http from '@/components/utils/http.js'
	import {
		mapState
	} from 'vuex'
	
	export default {
		components: {
			uniTag,
			uniLoadMore
		},
		computed: mapState(['token', 'user_id','group_id']),
		data() {
			return {
				// resourceUrl:'https://shanghui.jiuduanfw.com',
				nextPage:1,
				dataList:[],
				getDataLock:false,
				imgArr:[],
				getDataList:(page)=>{
					let that=this;
					if(that.getDataLock){
						return;
					}
					that.getDataLock=true;
					http.apiRequest({
						api: "/api/photos/photosList",
						data: {
							page:page,
							uid:that.$store.state.user_id,
						},
						secuss: (res, httpStatus) => {
							if(res.code=="1"){
								that.nextPage=res.data.nextPage;
								that.dataList = that.dataList.concat(res.data.rows);
								console.log(that.dataList)
								for(let i = 0; i < that.dataList.length; i++) {
									that.imgArr.push(that.dataList[i].image)
								}
							}
						},
						complete: (res, httpStatus) => {that.getDataLock=false;},
					});
				},
				editMode:false,
			}
		},
		onLoad() {
			this.getDataList(this.nextPage);
		},
		onReachBottom() {
			if(this.nextPage>0){
				this.getDataList(this.nextPage);
			}
		},
		methods: {
			longtapPhoto() {
				//绑定长按事件
				//长按进入编辑模式
				this.editMode=true;
			},
			tapPhoto() {
				//绑定点击事件
			},
			
			deleteImage: function (e) {
			    var that = this;
			    var image = that.dataList.image;
			    var index = e.currentTarget.dataset.index;//获取当前长按图片下标
				var itemid = e.currentTarget.dataset.itemid;
			    uni.showModal({
			      title: '提示',
			      content: '确定要删除此图片吗？',
			      success: function (res) {
			        if (res.confirm) {
			          console.log('点击确定了');
			          let opts = {
			          	url: '/api/photos/photosRemove',
			          	method: 'POST',
			          	header: that.token
			          };
			          let param = {
			          	ids: itemid
			          };
					  // that.dataList.splice(index, 1);
			          http.httpTokenRequest(opts, param).then(res => {
			          	console.log(res.data);
			          	if (res.data.code == 1) {
							console.log('012');
			          		that.dataList.splice(index, 1);
			          		uni.showToast({
			          			title: "删除成功"
			          		});
			          		// uni.navigateTo({
			          		// 	url: '/pages/user/photo/photo'
			          		// });
			          	} else {
			          		uni.showToast({
			          			title: "加载失败..."
			          		});
			          	}
			          }, error => {
			          	console.log('error=>', error)
			          })
			        } else if (res.cancel) {
			          console.log('点击取消了');
			          return false;
			        }
			       
			      }
			    })
			},
			photoUpload() {
				var that=this;
				uni.chooseImage({
					count: 9,
					sizeType: "compressed",
					success: (res) => {
						console.log(res);
						//tempFilePaths
						res.tempFilePaths.forEach(function(value, index) {
							uni.uploadFile({
								url: http.baseUrl + "/api/common/upload",
								filePath: value,
								name: "file",
								header: {
									'token': uni.getStorageSync('token'),
									'X-Requested-With': 'XMLHttpRequest',
									'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
								},
								success: (res) => {
									//console.log(res);
			
									if (res.statusCode == 200) {
										var resData = JSON.parse(res.data);
										//console.log(resData);
										if (typeof resData == "object" && typeof resData.code != "undefined" && resData.code == 1) {
											
											//图片上传成功
											//添加到相册
											http.apiRequest({
												api: "/api/photos/photosAdd",
												method: "GET",
												data: {
													title: "",
													image: resData.data.url
												},
												secuss: (res, httpStatus) => {
													//照片添加到相册成功
													if(res.code=="1"){
														//that.dataList = that.dataList.concat(res.data.rows);
														that.dataList = res.data.rows.concat(that.dataList);
													}
												},
											});
										}
			
									} else {
										//图片上传失败
									}
								},
								fail: (res) => {},
							});
						});
					},
					fail: () => {},
				});
			},
			previewImg(e) {
				let that = this
				console.log(e.currentTarget.dataset.index);
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
			photoRemove(){
				
			}
		}
	}
</script>

<style>
.uni-list {
	display: flex;
	flex-wrap: wrap;
	/* justify-content: space-between; */
}
.uni-media-list {
	width: 210upx;
	height: 210upx;
	margin-bottom: 20upx;
	margin-right: 20upx;
}
.uni-media-list .photoUpload {
	width: 100%;
	height: 100%;
	border: 4upx dashed #BFBFBF;
	background: url(../../../static/img/tianjia.png) no-repeat center;
	background-size: 68upx 68upx;
}
.uni-media-list .uni-media-list-logo {
	width: 100%;
	height: 100%;
}
</style>
