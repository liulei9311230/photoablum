
define(function (require,exports,module){
    
    var h = $(window).height();

   require('modules/layer/layer.css');

	var Layer = Backbone.View.extend({

    imageid:0,

    imagelist:[],

	tpl:_.template($('#tpl').text()),
    
    events:{
          
          'swipeLeft .layer-container img':'shownext',
          'swipeRight .layer-container img':'showpre',
          'tap  .layer-container img':'togglehead',
          'tap  .layer .header .btn' :'goback',
          'click  .login' :'gobackq'
          
    },
    gobackq:function(){
        location.hash='#';
        this.imagelist.length=0;
         this.$el.find('.header h1').html('自己的图片网')
    },
    goback:function(){
           this.imagelist.pop();
           var id = this.imagelist[this.imagelist.length-1];

           if(id !== undefined){
               var model = this.collection.get(id);
               this.changeview(model)
           }else{
           	    location.hash='#';
                this.$el.find('.header h1').html('自己的图片网')
           }

    },
    togglehead:function(){
          this.$el.find('.layer .header').toggleClass('hide');
    },
    shownext:function(){
           this.imageid++;
           var model = this.collection.get(this.imageid);
           if(model){
           	  this.changeview(model);
           	  this.imagelist.push(this.imageid);
           }else{
           	  alert('最后一张');
           	  this.imageid--;
           }
    },
    showpre:function(){
    	this.imageid--;
    	var model = this.collection.get(this.imageid);
    	if(model){
    		this.changeview(model);
    		this.imagelist.push(this.imageid);
    	}else{
    		alert('第一张');
    		this.imageid++;
    	}
    },
    changeview:function(model){
          var url =  model.get('url');
          var title = model.get('title');
          var self = this;
          this.$el.find('.layer-container img').animate({'opacity':0},500,function(){
                  // console.log(111111)
             self.$el.find('.layer-container img').attr('src',url).animate({'opacity':1},500);
          });
          this.$el.find('.header h1').html(title)
    },
    render:function(id){
       var data = this.collection.get(id);
       if(!data){
       	   location:'#';
       	   return;
       };
        
       this.imageid = data.get('id');

       this.imagelist.push(this.imageid);

       var dealdata = {
       	   url:data.get('url'),
       	   title:data.get('title'),
       	   style:'line-height:'+h+'px;'
       };

       var tpl = this.tpl;

       var html = tpl(dealdata);

       this.$el.find('.layer').html(html);
    }

	});


//暴露一个累
	module.exports = Layer;
})