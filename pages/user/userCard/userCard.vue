<template>
	<view class="form">
		<view class="uni-padding-wrap uni-common-mt">
            <form @submit="formSubmit" @reset="formReset">
                <view class="uni-form-item uni-column">
                    <input class="uni-input" name="input" placeholder="姓名" v-model="name"/>
                </view>
				<view class="uni-form-item uni-column">
				    <input class="uni-input" name="input" placeholder="头像" v-model="photo"/>
				</view>
				<view class="uni-form-item uni-column">
				    <input class="uni-input" name="input" placeholder="公司" v-model="company"/>
				</view>
				<view class="uni-form-item uni-column">
				    <input class="uni-input" name="input" placeholder="职位" v-model="position"/>
				</view>
				<view class="uni-form-item uni-column">
				    <input class="uni-input" name="input" placeholder="手机号码" v-model="mobile"/>
				</view>
				<view class="uni-form-item uni-column">
				    <input class="uni-input" name="input" placeholder="地址" v-model="address"/>
				</view>
				<view class="uni-form-item uni-column">
				    <input class="uni-input" name="input" placeholder="网址" v-model="web_ur"/>
				</view>
				<view class="uni-form-item uni-column">
				    <input class="uni-input" name="input" placeholder="公司简介" v-model="about"/>
				</view>
				<view class="uni-form-item uni-column">
				    <input class="uni-input" name="input" placeholder="公司相册" v-model="xiangce"/>
				</view>
				<view class="uni-form-item uni-column">
				    <input class="uni-input" name="input" placeholder="视频简介" v-model="video"/>
				</view>
				<view class="uni-form-item uni-column">
				    <input class="uni-input" name="input" placeholder="公司二维码" v-model="wx_qrcode"/>
				</view>
                <view class="uni-btn-v">
                    <button formType="submit">完成</button>
                </view>
            </form>
        </view>
	</view>
</template>

<script>
	import http from '@/components/utils/http.js'
	 import {
	    mapState,
	    mapMutations
	} from 'vuex'
	export default {
		computed: {
		    ...mapState(['userInfo', 'user_id'])
		},
		data() {
			return {
				companyDetail:{},
				name:'',
				photo:'',
				company:'',
				position:'',
				mobile:'',	
			}
		},
		onLoad() {
			let opts = {
				url: '/api/company/companyDetail',
				method: 'GET',
			};
			let param = {
				uid: this.user_id
			};
			http.httpTokenRequest(opts, param).then(res => {
					if(res.data.code == 1){
						this.companyDetail = res.data;
						this.name = res.data.data.member.name
						this.company = res.data.data.company
						console.log(this.company)
						console.log(this.companyDetail)
					}else{
						uni.showToast({
							title: "加载失败..."
						});
					}
				},error => {
				console.log(error)
			})
		},
		methods: {
			formSubmit: function(e) {
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
			},
		}
	}
</script>

<style>
.form {
	padding: 40upx;
	padding-top: 0;
	width: 100%;
}
.uni-input {
	border-bottom:1px solid #999;
	padding-top: 30upx;
	padding-bottom:30upx;
}
</style>
