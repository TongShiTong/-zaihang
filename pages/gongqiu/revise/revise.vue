<template>
	<view class="content">
		<view class="input-search">
			<view style="font-size: 46upx; color: #333; text-align: center;margin-top: 100upx; margin-bottom: 40upx; font-weight: 600;">您可以在下面修改您的供求信息！</view>
			<view style="width: 80upx; height: 6upx; background: #000000;margin: 0 auto; border-radius: 4upx;"></view>
			<view class="input-box">
				<label class="uni-list-cell-left">标题
				<input class=".biaoti" type="text" v-model="fromData.title"></label>
				<!--基于让用户少做选择的原则，行业选项取消掉-->
				<!--
				<view class="uni-list">
					<view class="uni-list-cell" style="padding-top: 46upx;">
						<view class="uni-list-cell-left">
							行业分类
						</view>
						<view class="uni-list-cell-db">
							<picker @change="bindPickerChange" :value="cateDefault" :range="infoCatList" :range-key="'name'">
								<view class="uni-input">{{infoCatList[cateDefault].name}}</view>
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
										<radio :value="item.value" :checked="item.value == typeIndex" color="#DB2311" />
									</view>
									<view>{{item.name}}</view>
								</label>
							</radio-group>
						</view>
					</view>
				</view>
				<label class="uni-list-cell-left">
				<view style="margin-top: 68upx;">联系手机号</view>
				<input class=".biaoti" type="text" v-model="fromData.mobile"></label>
				<view style="margin-top: 68upx;margin-bottom: 40upx;">
					<label class="uni-list-cell-left">
					<view>供求内容</view>
					<textarea class="textarea" placeholder-style="color:#ccc" v-model="fromData.content" /></label>
				</view>
			</view>
				<view style="font-size: 28upx; color: #666; text-align: center;margin-top: 56upx;margin-bottom: 20upx;">————&nbsp;&nbsp;杭州市安庆商会&nbsp;&nbsp;————</view>
				<view style="font-size: 24upx; color: #999; text-align: center; margin-bottom: 30upx;">杭州九之信息技术有限公司提供技术支持</view>
			<button class="btn" type="primary" @tap="revise()">修改</button>
		</view>
	</view>
</template>

<script>
	import http from '@/components/utils/http.js'
	import {
	    mapState
	} from 'vuex'
	export default {
		computed: mapState(['token','user_id']),
		data() {
			return {
				title:'',
				content:'',
				// title: 'picker',
				array: [],
				index: 0,
				//type: ["供应","需求","其他"],
				infoTypeList: [
					{name:'供应',value:'1'},
					{name:'需求',value:'2'},
					{name:'其他',value:'3'},
				],
				typeIndex: 1,
				gongqiu: [],
				usersid:'',
				cateDefault:0,
				typeDefault:0,
				infoCatList: [],
				fromData:{
					cid:0,
					type:0,
					mobile:''
				}
			}
		},
		onLoad(e) {
			console.log("1",e)
			this.title = e.title
			this.content = e.content
			this.usersid = e.usersid
			console.log(this.content)
			let opts = {
				url: '/api/info/infoDetail',
				method: 'POST',
				header: this.token
			};
			
			//infoDetail
			let param = {
				id: e.usersid,
			};
			http.httpTokenRequest(opts, param).then(res => {
					if(res.data.code == 1){
						this.fromData=res.data.data;
						this.fromData.cid=this.fromData.category_id;
						this.fromData.itemid=this.fromData.id;
						this.fromData.mobile = this.fromData.mobile;
						this.typeDefault=this.fromData.type;
						
						http.httpTokenRequest({
							url: '/api/category/categoryList',
							method: 'GET',
							header: this.token,
							}, {type:"info"}).then(res => {
							if(res.data.code == 1){
								this.infoCatList = res.data.data;
							
								for(let i=0;i<this.infoCatList.length;i++){
									if(this.infoCatList[i].id==this.fromData.category_id){
										this.cateDefault=i;
									}
								}
							}	
						},error => {
							console.log('error=>',error)
						})	
					}else{
						uni.showToast({
							title: "加载失败..."
						});
					}
				},error => {
				console.log('error=>',error)
			})
		
		},
		methods: {
			bindPickerChange: function(e) {
				let index = e.target.value
				let cid=this.infoCatList[index].id;
				this.fromData.cid=cid;	
				this.cateDefault=index;

				//console.log('picker发送选择改变，携带值为', this.fromData.cid)
			},
			bindTypeChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				//this.typeIndex = e.target.value
				let index = e.target.value
				this.fromData.type=index;	
				this.typeDefault=index;
			},
			revise() {
				let opts = {
					url: '/api/info/infoEdit',
					method: 'POST',
					header: this.token
				};

				http.httpTokenRequest(opts, this.fromData).then(res => {
						console.log(res.data);
						if(res.data.code == 1){
							uni.setStorageSync('mobile',this.fromData.mobile)
							uni.$emit("editInfo",{});
							uni.showToast({
								title: res.data.msg
							});
							setTimeout(()=>{
								uni.navigateBack({delta:1});
								// uni.reLaunch({
								// 	url: '/pages/user/myinfo/myinfo',
								// });
							},1000);
							
						}else{
							uni.showToast({
								title: "加载失败..."
							});
						}
					},error => {
					console.log('error=>',error)
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
/* 	padding-bottom: 86upx; */
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
