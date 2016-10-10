

define(function (require,exports,module){

	var Imgmodule = require('modules/module/img.js');

	var Imgcollection = Backbone.Collection.extend({
        model:Imgmodule,
		Id:0,
		fetchdata:function (fn){
			var self = this;
			$.get('data/imageList.json',function (res){
                  if(res && res.errno == 0){
                  	res.data.sort(function(){
                  		return Math.random() > .5 ? 1:-1
                  	});
                  	res.data.map(function(obj){
                  		obj.id =  self.Id++
                  	});

                  	//在集合实例化对象中加入数据

                     self.add(res.data)
                     console.log(self)
                  }
			})
		}
	})

	module.exports = Imgcollection;
    // var ic = new Imgcollection();

    // ic.fetchdata()
})