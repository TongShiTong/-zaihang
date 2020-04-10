<template>
	<view class="content">
		<view class="input-search">
			<view style="font-size: 46upx; color: #333;font-weight: 600; text-align: center;margin-top: 100upx; margin-bottom: 40upx;">您最近的供求详情是？</view>
			<view style="width: 80upx; height: 6upx; background: #000000;margin: 0 auto;border-radius: 4upx;"></view>
			<view class="input-box">
				<label class="uni-list-cell-left" for="title">
					标题
					<input id="title" class="biaoti" type="text" placeholder-style="color:#999;" v-model="title">
					</label>
					
				
				<!--基于让用户少做选择的原则，行业选项取消掉-->
				<!--
				<view class="uni-list">
					<view class="uni-list-cell" style="padding-top: 46upx;">
						<view class="uni-list-cell-left">
							行业分类
						</view>
						<view class="uni-list-cell-db">
							<picker @change="bindPickerChange" :value="index" :range="infoCatList" :range-key="'name'"  >
								<view  class="uni-input">{{infoCatList[index].name}}</view>
							</picker>
						</view>
					</view>
				</view>
				-->
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-left">
							信息类型
						</view>
						<view class="uni-list-cell-db">
							 <radio-group @change="bindTypeChange" class="radio">
								<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in infoTypeList" :key="index">
									<view>
										<radio :value="item.value" :checked="item.value == typeIndex" color="#DB2311"/>
									</view>
									<view>{{item.name}}</view>
								</label>
							</radio-group>
						</view>
					</view>
				</view>
				<label class="uni-list-cell-left">
				<view style="margin-top: 68upx;">联系手机号</view>
				<input class="biaoti" type="text" placeholder-style="color:#999;" v-model="mobile"></label>
				<view style="margin-top: 68upx;margin-bottom: 40upx;">
					<label class="uni-list-cell-left">
					<view>供求内容</view>
					<textarea class="textarea" placeholder-style="color:#999;" v-model="content"/></label>
				</view>
			<!-- 	<view class="uni-form-item uni-column">
				
					<editor id="aboutEditor" name="about" class="ql-container" @ready="onEditorReady" @input="onAboutChange">{{content}}</editor>
				</view> -->
				
			</view>
			<view style="font-size: 28upx; color: #666; text-align: center;margin-top: 56upx;margin-bottom: 20upx;">————&nbsp;&nbsp;杭州市安庆商会&nbsp;&nbsp;————</view>
			<view style="font-size: 24upx; color: #999; text-align: center; margin-bottom: 30upx;">杭州九之信息技术有限公司提供技术支持</view>
			<button class="btn" type="primary" @tap="release()">发布</button>
		</view>
	</view>
</template>

<script>
	import http from '@/components/utils/http.js'
	import {
	    mapState
	} from 'vuex'
	export default {
		computed: mapState(['token']),
		data() {
			return {
				title:'',
				content:'',
				// title: 'picker',
				// infoCatList: [],
				index:0,
				mobile:'',
				infoTypeList: [
					{name:'供应',value:'1'},
					{name:'需求',value:'2'},
					{name:'其他',value:'3'},
				],
				typeIndex: 1,
				infoCatList: [],
				fromData:{
					cid:0,
				}
			}
		},
		onLoad() {
			// let opts = {
			// 	url: '/api/category/categoryList',
			// 	method: 'GET',
			// };
			// let param = {
			// 	type: 'info'
			// };
			// http.httpRequest(opts, param).then(res => {
			// 		if(res.data.code == 1){
			// 			this.infoCatList = res.data.data;
			// 			//console.log(typeof this.infoCatList)
			// 			if(typeof this.infoCatList[0].id !="undefined"&&this.infoCatList.length>0){
			// 			this.fromData.cid = this.infoCatList[0].id
			// 			//console.log(123333,this.fromData)
			// 			//console.log(this.infoCatList)
			// 			}
			// 		}else{
			// 			uni.showToast({
			// 				title: "加载失败..."
			// 			});
			// 		}
			// 	},error => {
			// 	console.log(error)
			// })
			this.mobile = uni.getStorageSync('mobile')
			// console.log(this.mobile)
		},
		methods: {
			bindPickerChange: function(e) {
				let index = e.target.value
				let cid=this.infoCatList[index].id;
				this.index = index;
				this.fromData.cid=cid;
			},
			bindTypeChange: function(e) {
				this.typeIndex = e.target.value
			},
			// onEditorReady: function(e) {
			// 	let that = this;
			// 	uni.createSelectorQuery().select('#aboutEditor').context((res) => {
			// 		res.context.setContents({
			// 			html: this.content,
			// 			success: (res) => {
			// 				console.log(res)
			// 			},
			// 			fail: (res) => {
			// 				console.log(res)
			// 			},
			// 		});
			// 	}).exec();
			// },
			// onAboutChange: function(e) {
			// 	this.company.about = e.detail.html;
			// },
			release() {
				let opts = {
					url: '/api/info/infoAdd',
					method: 'POST',
					header: this.token
				};
				let param = {
					cid: this.fromData.cid,
					type: parseInt(this.typeIndex),
					title: this.title,
					mobile: this.mobile,
					content: this.content
				};
				http.httpTokenRequest(opts, param).then(res => {
						console.log("2",res);
						if(res.data.code == 1){
							uni.getStorageSync('mobile',this.mobile)
							uni.setStorageSync('mobile',this.mobile)
							uni.showToast({
								title: res.data.msg
							});
							uni.$emit("editInfo",{});
							setTimeout(()=>{
								uni.navigateBack({delta:1});
								// uni.reLaunch({
								// 	url: '/pages/gongqiu/gongqiu',
								// });
							},1000);
						}else{
							uni.showToast({
								title: "加载失败..."
							});
						}
					},error => {
					console.log('error=>',error);
				})
			}
		}
	}
</script>

<style>
.input-search {
	min-height: 140vh;
}
.input-box {
	padding-top: 30upx;
	padding-left: 20upx;
	padding-right: 20upx;
}
.input-box .biaoti {
	font-size: 32upx;
	color: #333;
	border-bottom: 1upx solid #ccc;
	/* padding-bottom: 40upx; */
}
.uni-list-cell {
	font-size: 30upx;
/* 	display: flex;
	justify-content: space-between; */
	/* padding-bottom: 86upx; */
}
.uni-list-cell-left {
	font-size: 30upx;
	color: #999;
	margin-top: 68upx;
	margin-bottom: 30upx;
}
.textarea {
	width: 660upx;
	height: 366upx;
	font-size: 32upx;
	color: #333;
	border: 1upx solid #ccc;
	text-align: justify;
	line-height: 1.5em;
	margin-top: 40upx;
}
.btn {
	/* margin: 0 auto; */
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
.uni-list-cell-pd {
	display: flex;
}
.radio {
	display: flex;
	justify-content: space-between;
	margin-top: 40upx;
}
</style>
