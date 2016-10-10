

define(function (require,exports,module){
    
     //引入css文件
    require('modules/list/list.css');


	var List = Backbone.View.extend({
         startX:0,
         dx :0 ,
        //信号量
         x : 0,
         m:0,
         startTime :0,
         lastTwoPointDistance:0,
        events:{
            'click .search span':'showsearchview',
            'click  .go':'gotop',
            'touchstart .list ul':'kaishi',
            'touchmove .list ul':'yidon',
            'touchend .list ul':'jieshu',
            'tap .list .login':'sousuo',
            'longTap .image-container img':'fangda',
            'tap .list .unit .jiabtn':'showpindao',
            'tap  .erji .shang span':'hidepindao',
            'tap  .erji ol li':'showtypeviewagain'
            // 'click .list ul li' :'showtypeview'
        },
        sousuo:function(){
          this.$el.find('.list .search').toggleClass('hider');
        },
        showtypeviewagain:function(e){
            var self = this;
            setTimeout(function(){
                self.hidepindao()
            }, 300);
            this.showtypeview(e);
            console.log($(e.target).index(),78951845)
            this.$el.find('.unit li').eq($(e.target).index()+1).addClass('changecolor').siblings().removeClass('changecolor')
        },
        showpindao:function(){
             console.log('aaaaaaaaaa')
             this.$el.find('.list .erji').toggleClass('hide');

        },
        hidepindao:function(){
              // this.$el.find('.list .erji').css('display','none')
               this.$el.find('.list .erji').toggleClass('hide');
        },
        fangda:function(e){
            // console.log(e.target)
            event.preventDefault();
            e.target.style.transform = 'scale(2)';
            setTimeout(function(){
                   e.target.style.transform = 'none';
            }, 1000)
        },
        kaishi:function(event){
            event.preventDefault();
             startTime = new Date();
            var finger = event.touches[0];
             startX = finger.clientX;
            // //去掉缓冲
            // $("ul").css("transition",'none')
        },
        yidon:function(event){
            event.preventDefault();
           
            
            var finger = event.touches[0];
            //算增量
            this.dx = finger.clientX - startX;
            // console.log(this.dx)
            //最后两个点的坐标差
            lastTwoPointDistance = finger.clientX - this.m;
            this.m = finger.clientX;
            // console.log(finger.clientX)
            // console.log(lastTwoPointDistance)
            //从信号量反映增量
            // $("ul").css("transition",'none')
            $("ul").css('transform',"translate3d(" + (this.x + this.dx) + "px,0,0)");
        },
        
        jieshu:function(event){
            event.preventDefault();
            console.log(this.$el)

            //显示加号
            this.$el.find('.jiabtn').css('display','block')
            //判定是否点击链接，如果时间不足100毫秒，并且距离小于10，并且点到li，则点击链接
            var during = (new Date()) - startTime;
            // console.log(event.target)
            // console.log(this)
            if(during < 200 && this.dx < 10 && event.target.nodeName.toLowerCase() == "li"){
               // return true;
               this.showtypeview(event);
               // event.target.style.color='orange'
            };


            var finger = event.touches[0];
            //信号量改变
            this.x += this.dx;
            //清零
            this.dx = 0;

            //算一个最终的目标
            // console.log(lastTwoPointDistance)
            var targetl = this.x + this.lastTwoPointDistance * 4;
            //算一个用时
            // var time = Math.abs(lastTwoPointDistance / 30);
            var time = 0.4;
            var w = parseInt($('.unite').css('width'));
            // console.log(w)
            //如果过线了
            if(targetl > 0){
                targetl = 0;
                 //这个贝塞尔曲线表示冲过终点，然后回来
                 $('ul').css('transtion',"all " + time + "s cubic-bezier(0.33,2.5, 1, 1.06) 0.6s");

            }else if(targetl < -60 * 8 + w){
                targetl = -60 * 8 + w;
               // console.log(targetl)

                // $("ul").style.webkitTransition = "all " + time + "s cubic-bezier(0.33, 2.5, 1, 1.06) 0s";
                 $('ul').css('transtion',"all " + time + "s cubic-bezier(0.33, 2.5, 1, 1.06) 0s");
            }else{
                //这个贝塞尔曲线不反弹
                // $("ul").style.webkitTransition = "all " + time + "s cubic-bezier(0.32, 1.21, 1, 0.96) 0s";
                $('ul').css('transtion',"all " + time + "s cubic-bezier(0.32, 1.21, 1, 0.96) 0s");
            }
            
            //往我们计算的新终点冲过去
            // $('ul').css('transform',"translate3d(" + targetl + "px,0,0)");

             $('ul').animate({'transform':"translate3d(" + targetl + "px,0,0)"})
            // /console.log(lastTwoPointDistance,x,targetl,time);
            
            //让信号量等于新终点
            this.x = targetl;
        },

        tpl:_.template('<a href="#layer/<%=id%>"><img src="<%=url%>" style="<%=style%>" alt="" /></a>'),

		initialize:function(){
          this.getdata();
          this.initdom();

          this.listenTo(this.collection,'add',function (model,collection){
          	  this.render(model)
          });

          //监听窗口滚动事件
          var self = this;
          $(window).on('scroll',function(){
            var h = $('body').height() - $(window).height() -$(window).scrollTop()-200 > 0;
            if(!h){
               self.getdata()
            }
            if($(window).scrollTop() > 300){
                self.showtop()
            }else{
                self.hidetop()
            }
          })
		},
        showtop:function(){
            this.$el.find('.go').show()
        },
        hidetop:function(){
            this.$el.find('.go').hide()
        },
        gotop:function(){
            window.scrollTo(0,0)
        },
        getdata:function(){
        	this.collection.fetchdata();
        },
        //得到左右两个容器盒子
        initdom:function(){
          this.lefthezi = this.$el.find('.left-container');
          this.righthezi = this.$el.find('.right-container');
        },
        leftheight:0,
        rightheight:0,
        render:function(model){
        	// console.log(model,111)
        	//获取数据
        	var data = {
                    id:model.get('id'),
                    url:model.get('url'),
                    style:'width:'+model.get('viewWidth') +'px; height:'+model.get('viewHeight')+'px'
        	};
        	//获取模板字符串
        	var tpl = this.tpl;
        	var html = tpl(data);
        	//格式化模板字符串
        	if(this.leftheight <= this.rightheight){
        		this.renderleft(model,html)
        	}else{
        		this.renderright(model,html)
        	}
        	//模板字符串渲染到页面上
        },
        renderleft:function(model,html){
            this.lefthezi.append(html);
            this.leftheight += model.get('viewHeight')+6;
        },
        renderright:function(model,html){
            this.righthezi.append(html);
            this.rightheight += model.get('viewHeight')+6;
        },
        showsearchview:function(){
            var value = this.getvalue();
            if(!this.checkvalue(value)){
                return
            }
            //过滤首位空白符
            var value = value.replace(/^\s+|\s+$/,'');
            //根据输入词来过滤出相关的数据
            var result =this.collectionfilter(value);
              // console.log(result)
            //根据result来从新渲染
            this.reserresult(result);
        },
        getvalue:function(){
            return this.$el.find('.search input').val()
        },
        checkvalue:function(value){
            if(/^\s*$/.test(value)){
                alert('请输出搜索词');
                return false;
            }else{
                return true;
            }
        },
        collectionfilter:function(value,key){
            var key = key || 'title';
            var result = this.collection.filter(function(model){
                if(key === 'type'){
                    return model.get(key) == value
                }
                return model.get('title').indexOf(value) > -1
            })
            // console.log(result)
            return result;
        },
        reserresult:function(result){
            //清空视图
            this.lefthezi.html('');
            this.righthezi.html('');
            this.leftheight=0;
            this.rightheight=0;

            var self = this;

            result.forEach(function (model){
                self.render(model)
            })
        },
        showtypeview:function(e){
            // console.log(e)
            // console.log($(e.target),66666)
            // console.log(arguments)
            // if(!this.jieshu()){
            //     return
            // }

            // e.target.className += 'changecolor';
            $(e.target).addClass('changecolor').siblings().removeClass('changecolor')
            e.target.style.fontSize = '26px'
             setTimeout(function(){
                   // e.target.className = '';
                   e.target.style.fontSize = '16px'
            },600)
            var id = this.getid(e.target);
            var result = this.collectionfilter(id,'type');
            this.reserresult(result)

        },
        getid:function(dom){
            // console.log(dom,11111111)
            return $(dom).attr('data-id')
            // return $(dom).data('id')
        }

	});
	module.exports = List;
})