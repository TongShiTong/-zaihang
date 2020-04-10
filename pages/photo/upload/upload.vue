<template>
	<view>
		<view class="photoUpload" @tap="photoUpload">上传照片</view>
	</view>
</template>

<script>
	import http from '@/components/utils/http.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {

			}
		},
		methods: {
			photoUpload() {
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
										console.log(resData);
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
			}
		}
	}
</script>

<style>
</style>
