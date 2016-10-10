 
 define(function (require,exports,module){
       
       var  Imgcollection = require('modules/collection/img')
  
       var Layer = require('modules/layer/layer');
       var List = require('modules/list/list');
    
        var imgcollection = new Imgcollection();

        var layer = new Layer({
        	el:$("#app"),
          collection:imgcollection
        });
        var list = new List({
        	el:$('#app'),
            collection:imgcollection

        });


   //根据项目样式 有两种页面要求 根据路由的不同设定
 	var Router = Backbone.Router.extend({
         routes:{
         	'layer/:id':'showlayer',
         	'*other':'showlist'
         },
         //由于有两种不同的路由对应的页面 所以要写两个文件对应页面
         showlayer:function(id){
          $("#app .list").hide()
          $('#app .layer').show()
            layer.render(id);
         },
         showlist:function(){
           // list.render();
           $('#app .list').show();
           $('#app .layer').hide();
         }
 	})

    var router = new Router();

    

//将启动，路由的开关 写在暴露的接口中 那么我们就可以人为的控制什么时候启动
 	module.exports = function(){
 		Backbone.history.start();
 	}
 })