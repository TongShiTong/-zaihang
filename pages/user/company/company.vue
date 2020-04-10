<template>
	<view class="form">
		<view class="uni-padding-wrap uni-common-mt">
			<form @submit="formSubmit" @reset="formReset">
				<view class="uni-list-cell uni-list-cell-pd pd">
					<view class="uni-list-cell-db">对外展示</view>
					<switch :checked="display_switch" @tap="autoSubmit" name="display_switch" />
				</view>
				<view class="uni-form-item uni-column pd" @tap="photoUpload" data-type="photo">
					名片背景
					<view class="uni-media-list" v-if="company.photo!=''">
						<image class="uni-media-list-logo" style="margin-left: 48upx;" :src="company.photo" mode="aspectFill"></image>
					</view>
					<view class="photoUpload"></view>
				</view>
				<view class="uni-form-item uni-column pd" @tap="photoUpload" data-type="wx_qrcode">
					微信名片二维码
					<view class="uni-media-list" v-if="company.wx_qrcode!=''">
						<image class="uni-media-list-logo" :src="company.wx_qrcode" mode="aspectFill"></image>
					</view>
					<view class="photoUpload"></view>
				</view>

				<view class="uni-form-item uni-column">
					<label>
					<view>公司名称</view>
					<input class="uni-input" name="company" v-model="company.company" maxlength="20" /></label>
				</view>
				<view class="uni-form-item uni-column">
					<label>
					<view>职位</view>
					<input class="uni-input" name="position" v-model="company.position" /></label>
				</view>
				<view class="uni-form-item uni-column">
					<label>
					<view>公司地址</view>
					<input class="uni-input" name="address" v-model="company.address" /></label>
				</view>
				<view class="uni-form-item uni-column">
					<label>
					<view>网址</view>
					<input class="uni-input" name="web_url" v-model="company.web_url" /></label>
				</view>
				<view class="uni-form-item uni-column shipin" style="height: 180upx;
">
					<label>
						<view style="display: flex;justify-content: space-between;margin: 0;">
							<view style="margin: 0;">公司视频宣传</view>
							<view style="margin: 0;" class="videoUpload" @tap="videoUpload" data-type="video"><viwe>修改</viwe><image style="width: 17upx; height: 31upx;" src="../../../static/img/xiangyou.png"></image></view>
						</view>
						<input class="uni-input" name="video" v-model="company.video" />
						
					</label>
				</view>
				<view class="uni-form-item uni-column">
					<label>
					<view>公司简介</view>
					<editor id="aboutEditor" name="about" class="ql-container" @ready="onEditorReady" @input="onAboutChange">{{company.about}}</editor></label>
				</view>

				<view style="font-size: 28upx; color: #666; text-align: center;margin-top: 56upx;margin-bottom: 20upx;">————&nbsp;&nbsp;杭州市安庆商会&nbsp;&nbsp;————</view>
				<view style="font-size: 24upx; color: #999; text-align: center; margin-bottom: 30upx;">杭州九之信息技术有限公司提供技术支持</view>
				<view class="uni-btn-v">
					<button class="btn" formType="submit">保存</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	import uniTag from "@/components/uni-tag/uni-tag.vue"
	import http from '@/components/utils/http.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		components: {
			uniTag
		},
		computed: {
			...mapState(['isLogin', 'forcedLogin', 'user_id', 'group_id'])
		},
		data() {
			return {

				company: {
					photo: "",
					company: "",
					position: "",
					address: "",
					web_url: "",
					about: "",
					wx_qrcode: "",
					display: "2",
				},
				display_switch: false,
				isFormSubmit: false,
			}
		},
		onUnload(e) {
			console.log(e)
		},
		onLoad() {
			var that = this;
			console.log(this.isLogin);
			if (!this.isLogin) {}
			http.apiRequest({
				api: "/api/company/companyDetail",
				method: "GET",
				data: {
					uid: this.user_id,
				},
				secuss: (res, httpStatus) => {
					if (res.code == 1) {
						that.company = Object.assign({}, that.company, res.data);
						if (that.company.display == 1) {
							that.display_switch = true;
						}
						// console.log(that.company);
					}
				},
			});
		},
		methods: {
			autoSubmit: function() {
				var that = this;
				if (that.isFormSubmit) {
					return;
				}
				that.isFormSubmit = true;
				that.display_switch = !that.display_switch
				// var company = this.display_switch;
				if (that.display_switch == true) {
					that.company.display = 1;
				} else {
					that.company.display = 2;
				}
				http.apiRequest({
					api: "/api/company/companyEdit",
					data: that.company,
					secuss: (res, httpStatus) => {
						that.isFormSubmit = false;
						if (res.code == "1") {
							uni.$emit("editcompany", {});
							uni.$emit("userInfoUpdate",{});
						} else {
							
						}
					},
					error: (res, httpStatus) => {
						//接口调用失败，可能是网络故障，可能是接口报错
						that.isFormSubmit = false;
						console.log("接口调用失败，请检查网络");
					},
				});
			},
			formSubmit: function(e) {
				var that = this;
				if (this.isFormSubmit) {
					return;
				}
				this.isFormSubmit = true;
				var companyData = e.detail.value;
				if (e.detail.value.display_switch == true) {
					companyData.display = 1;
				} else {
					companyData.display = 2;
				}
				companyData.about = that.company.about;
				companyData.photo = that.company.photo;
				companyData.wx_qrcode = that.company.wx_qrcode;
				http.apiRequest({
					api: "/api/company/companyEdit",
					data: companyData,
					secuss: (res, httpStatus) => {
						this.isFormSubmit = false;
						if (res.code == "1") {

							//uni.showToast({title:res.msg,duration:1500,icon:"none"});

							uni.showToast({
								title: res.msg,
								duration: 1500
							});
							uni.$emit("editcompany", {});
							uni.$emit("userInfoUpdate",{});
							setTimeout(() => {
								//uni.reLaunch({url:"/pages/tongxun/userDetail/userDetail?id="+that.company.member.id});
								uni.navigateBack({
									delta: 1
								});
							}, 1500);

						} else {
							//短信发送失败
							uni.showToast({
								title: res.msg,
								duration: 1500,
								icon: "none"
							});
							console.log("保存失败");
						}
					},
					error: (res, httpStatus) => {
						//接口调用失败，可能是网络故障，可能是接口报错
						this.isFormSubmit = false;
						console.log("接口调用失败，请检查网络");
					},
				});
			},
			onEditorReady: function(e) {
				let that = this;
				uni.createSelectorQuery().select('#aboutEditor').context((res) => {
					res.context.setContents({
						html: this.company.about,
						success: (res) => {
							console.log(res)
						},
						fail: (res) => {
							console.log(res)
						},
					});
				}).exec();
			},
			onAboutChange: function(e) {
				this.company.about = e.detail.html;
			},
			videoUpload(e) {
				var type = e.currentTarget.dataset.type
				var that = this;
				//uni.chooseVideo(OBJECT)
				uni.chooseVideo({
					sourceType: ['album'],
					compressed: true,
					success: (res) => {
						//tempFilePaths
						console.log(res);

						uni.uploadFile({
							url: http.baseUrl + "/api/common/upload",
							filePath: res.tempFilePath,
							name: "file",
							header: {
								'token': uni.getStorageSync('token'),
								'X-Requested-With': 'XMLHttpRequest',
								'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
							},
							success: (res) => {
								if (res.statusCode == 200) {
									var resData = JSON.parse(res.data);
									//console.log(resData);
									if (typeof resData == "object" && typeof resData.code != "undefined" && resData.code == 1) {
										//图片上传成功
										switch (type) {
											case "video":
												that.company.video = resData.data.url;
												break;

											default:
												break;
										}
									}
								} else {
									//图片上传失败
								}
							},
							fail: (res) => {},
						});
					},
					fail: () => {},
				});
			},
			photoUpload(e) {
				var type = e.currentTarget.dataset.type
				var that = this;
				uni.chooseImage({
					count: 1,
					sizeType: "compressed",
					success: (res) => {
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
									if (res.statusCode == 200) {
										var resData = JSON.parse(res.data);
										//console.log(resData);
										if (typeof resData == "object" && typeof resData.code != "undefined" && resData.code == 1) {
											//图片上传成功
											let saveCompany={};
											switch (type) {
												case "photo":
													that.company.photo = resData.data.url;
													saveCompany.photo = resData.data.url;
													//
													break;
												case "wx_qrcode":
													that.company.wx_qrcode = resData.data.url;
													saveCompany.wx_qrcode = resData.data.url;
													break;
												default:
													break;
											}
											//直接提交saveCompany
											http.apiRequest({
												api: "/api/company/companyEdit",
												data: saveCompany,
												secuss: (res, httpStatus) => {
													that.isFormSubmit = false;
													if (res.code == "1") {
														uni.$emit("editcompany", {});
														uni.$emit("userInfoUpdate",{});
													} else {
														
													}
												},
												error: (res, httpStatus) => {
													//接口调用失败，可能是网络故障，可能是接口报错
													that.isFormSubmit = false;
													console.log("接口调用失败，请检查网络");
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
		}
	}
</script>

<style>
	.pd {
		font-size: 32upx;
		color: #333;
		height: 122upx;
		border-bottom: 1upx solid #e6e6e6;
		text-align: center;
		font-weight: bold;
	}
	.photoUpload {
		width: 17upx;
		height: 31upx;
		background: url(../../../static/img/xiangyou.png) no-repeat;
		background-size: 100% 100%;
	}
	.form {
		margin: 0 auto;
		padding-top: 0;
		width: 690upx;
		min-height: 150vh;
	}

	.uni-input {
		width: 690upx;
		border-bottom: 1px solid #E6E6E6;
		/* padding-top: 30upx;
		padding-bottom: 30upx; */
		font-size: 32upx;
		color: #333;
	}

	.uni-list-cell {
		display: flex;
		justify-content: space-between;
		padding: 20upx 0;
		align-items: center;
	}
	
	.uni-form-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		/* padding: 20upx 0; */
	}

	.uni-media-list {
		width: 88upx;
		height: 88upx;
		margin-left: 130px;
	}
	label {
		width: 690upx;
	}
	label view {
		font-size: 28upx;
		color: #999;
		margin-top: 44upx;
		margin-bottom: 30upx;
	}
	.uni-media-list .uni-media-list-logo {
		width: 100%;
		height: 100%;
	}
	/* .placeholder {
		font-size: 32upx;
		color: #333;
	} */
	#aboutEditor {
		/* height: 40upx; */
		border: 1px solid #e6e6e6;
		font-size: 32upx;
		color: #333;
	}

	.btn {
		position: fixed;
		bottom: 68upx;
		left: 196upx;
		width: 360upx;
		height: 88upx;
		line-height: 88upx;
		text-align: center;
		color: #fff;
		font-size: 38upx;
		background: #DB2311 !important;
		border-radius: 44upx;
		/* margin-top: 260upx; */
	}
	.shipin {
		height: 122upx;
		line-height: 122rpx;
		border-bottom: 1upx solid #e5e5e5;
	}
	.shipin .uni-input {
		border-bottom: none;
		font-size: 32upx;
		color: #333;
	}
	.videoUpload {
		font-size: 24upx;
		color: #999;
		width: 116upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		/* margin-right: 47upx; */
		/* background: url(../../../static/img/xiangyou.png) no-repeat;
		background-size: 100% 100%; */
	}
</style>
