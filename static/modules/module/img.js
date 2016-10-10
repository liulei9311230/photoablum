

define(function (require,exports,module){

  // 获取页面的宽度
	var w = ($(window).width() - 6 * 3) / 2;

	var Imgmodel = Backbone.Model.extend({
		initialize:function(){
             this.on('add',function (model){
             	// 计算viewHeight值 h  = H / W * w
				var h = model.get('height') / model.get('width') * w;
	             model.set({
	             	"viewHeight":h,
	             	'viewWidth' :w
	             })
             });
		}
	})



   module.exports = Imgmodel;
    //以下是测试
	// var P = Backbone.Collection.extend({
	// 	model:Imgmodel
	// })
	// var pc = new P();

	// pc.add({
	// 	"title": "精彩建筑摄影作品",
	// 	"url": "img/01.jpg",
	// 	"width": 640,
	// 	"height": 400
	// })

	// console.log(pc)
})