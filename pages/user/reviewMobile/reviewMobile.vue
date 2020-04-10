<template>
	<view class="content">
		<view class="uni-padding-wrap uni-common-mt" v-if="status == 0">
		    <form @submit="formSubmit">
		        <view class="uni-form-item uni-column">
					<label>
						<view>姓名</view>
						<input class="uni-input" name="input" v-model="formData.name"/></label>
		        </view>
				<view class="uni-form-item uni-column">
					<label>
					<view>公司名</view>
				    <input class="uni-input" name="input" v-model="formData.company"/></label>
				</view>
				<view class="uni-form-item uni-column">
					<label>
					<view>公司职务</view>
				    <input class="uni-input" name="input" v-model="formData.position"/></label>
				</view>
				<view class="uni-form-item uni-column">
					<label>
					<view>身份证号</view>
				    <input class="uni-input" name="input" v-model="formData.idcard"/></label>
				</view>
		        <view class="uni-btn-v">
		            <button class="btn" formType="submit">提交</button>
		        </view>
		    </form>
		</view>
		
		<view class="uni-padding-wrap uni-common-mt" v-if="status == '1'">
			<view style="text-align: center; font-size: 40upx; color: #DD524D;margin-top: 40upx;">您的信息正在待审核状态！</view>
		    <form @submit="formSubmit">
		        <view class="uni-form-item uni-column">
					<label>
						<view>姓名</view>
						<input class="uni-input" style="color: #999;" name="input" disabled="true" v-model="formData.name"/></label>
		        </view>
				<view class="uni-form-item uni-column">
					<label>
					<view>公司名</view>
				    <input class="uni-input" name="input" style="color: #999;" disabled="true" v-model="formData.company"/></label>
				</view>
				<view class="uni-form-item uni-column">
					<label>
					<view>公司职务</view>
				    <input class="uni-input" name="input" style="color: #999;" disabled="true" v-model="formData.position"/></label>
				</view>
				<view class="uni-form-item uni-column">
					<label>
					<view>身份证号</view>
				    <input class="uni-input" name="input" style="color: #999;" disabled="true" v-model="formData.idcard"/></label>
				</view>
		        <view class="uni-btn-v">
		            <button class="btn" style="background: #999 !important;" disabled="true" formType="submit">提交</button>
		        </view>
		    </form>
		</view>
		
		<view v-if="status == '2'" style="text-align: center;font-size: 40upx;color: #DD524D;margin-top: 20vh;">您的信息已经审核成功！</view>
		
		<view class="uni-padding-wrap uni-common-mt" v-if="status == '3'">
			<view style="text-align: center; font-size: 40upx; color: #DD524D;margin-top: 40upx;">您的信息未通过审核！</view>
			<view style="text-align: center; font-size: 40upx; color: #DD524D;margin-top: 40upx;">因为您还不是本商会会员！如果您已经是本商会会员，请您重新提交详细信息！</view>
		    <form @submit="formSubmit">
		        <view class="uni-form-item uni-column">
					<label>
						<view>姓名</view>
						<input class="uni-input" name="input" v-model="formData.name"/></label>
		        </view>
				<view class="uni-form-item uni-column">
					<label>
					<view>公司名</view>
				    <input class="uni-input" name="input" v-model="formData.company"/></label>
				</view>
				<view class="uni-form-item uni-column">
					<label>
					<view>公司职务</view>
				    <input class="uni-input" name="input" v-model="formData.position"/></label>
				</view>
				<view class="uni-form-item uni-column">
					<label>
					<view>身份证号</view>
				    <input class="uni-input" name="input" v-model="formData.idcard"/></label>
				</view>
		        <view class="uni-btn-v">
		            <button class="btn" formType="submit">提交</button>
		        </view>
		    </form>
		</view>
	</view>
</template>

<script>
	import http from '@/components/utils/http.js'
	export default {
		data() {
			return {
				formData: {
					name:'',
					company:'',
					position:'',
					idcard:''
				},
				status:''
			}
		},
		onLoad() {
			http.apiRequest({
				api: "/api/certification/getCertification",
				method:"GET",
				data: {},
				secuss: (res, httpStatus) => {
					if (res.code == "1") {
						console.log(res)
						let data = res.data.data
						this.status = data.status
						console.log(this.status)
						this.formData.name = data.name
						this.formData.company = data.company
						this.formData.position = data.position
						this.formData.idcard = data.idcard	
					} else {
						uni.showToast({
							title: res.msg,
							duration: 1500,
							icon: "none"
						});
						// console.log("保存失败");
					}
				},
				error: (res, httpStatus) => {
					console.log("接口调用失败，请检查网络");
				},
			});
		},
		methods: {
			formSubmit: function(e) {
				http.apiRequest({
					api: "/api/certification/postCertification",
					data: this.formData,
					secuss: (res, httpStatus) => {
						if (res.code == "1") {
							uni.showToast({
								title: res.msg,
								duration: 1500
							});
							setTimeout(() => {
								//uni.reLaunch({url:"/pages/tongxun/userDetail/userDetail?id="+that.company.member.id});
								uni.navigateBack({
									delta: 1
								});
							}, 1500);
			
						} else {
							uni.showToast({
								title: res.msg,
								duration: 1500,
								icon: "none"
							});
							// console.log("保存失败");
						}
					},
					error: (res, httpStatus) => {
						console.log("接口调用失败，请检查网络");
					},
				});
			},
		}
	}
</script>

<style>
label {
	width: 690upx;
}
label view {
	font-size: 28upx;
	color: #999;
	margin-top: 44upx;
	margin-bottom: 20upx;
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
input{
	font-size: 32upx;
	color: #333;
}
.uni-form-item {
	border-bottom: 1upx solid #e6e6e6;
}
</style>
