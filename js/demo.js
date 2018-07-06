;(function($){
	var Tab = function(tab){
		var _this_ = this;
		//保存单个tab组件
		this.tab = tab;
		//默认配置参数
		this.config = {
			'triggerType': 'click',//用来定义鼠标的触发类型是click还是mouseout
			'effect': 'default',//用来定义内容切换效果是直接切换还是淡入淡出
			'invoke': 1, //默认显示第几个tab
			'auto': false //用来定义tab是否自动切换，当指定了时间间隔，就表示自动切换，并且切换时间为指定的时间间隔
		}
		//如果配置参数存在，就扩展掉默认的配置参数
		if(this.getConfig()){
			$.extend(this.config,this.getConfig());
		}

		//保存tab标签列表，对应的内容列表
		this.tabItems = this.tab.find('ul.tab-nav li');
		this.contentItems = this.tab.find('div.content-wrap div.content-item');
		//保存配置参数
		var config = this.config;

		if (config.triggerType === 'click') {
			this.tabItems.bind(config.triggerType,function(){
				_this_.invoke($(this));
			})
		}else if(config.triggerType === 'mouseover'||config.triggerType != 'click'){
			this.tabItems.mouseover(function(){
				_this_.invoke($(this));
			})
		}

		//自动切换功能，当配置了时间，就按时间进行自动切换
		if (config.auto) {
			//定义一个全局的定时器
			this.timer = null;
			//定义一个计数器
			this.loop = 0;

			this.autoPlay();

			this.tab.hover(function(){
				window.clearInterval(_this_.timer);
			},function(){
				_this_.autoPlay();
			})
		}

		//设置默认显示第几个tab
		if (config.invoke) {
			this.invoke(this.tabItems.eq(config.invoke-1));
		}
	};	

	Tab.prototype = {
		//获取配置参数的方法
		getConfig: function(){
			//拿一下tab elem 节点上的data-config
			var config = this.tab.attr('data-config');

			//确保有配置参数
			if (config&&config!='') {
				return $.parseJSON(config);
			}else{
				return null;
			}
		},
		//事件驱动函数
		invoke: function(currentTab){
			var _this_ = this;
			/*
				1、要执行Tab的选中状态，当前选中的加上active(标记为白底)
				2、切换对应的Tab内容，要根据参数effect是defalult还是fade
			*/
			var index = currentTab.index();
			//tab选中状态
			currentTab.addClass('active').siblings().removeClass('active')
			//切换对应的内容区域
			var effect = this.config.effect;
			var conItems = this.contentItems;
			if (effect === 'default'||effect != 'fade') {
				conItems.eq(index).addClass('current').siblings().removeClass('current');
			}else if(effect === 'fade') {
				conItems.eq(index).fadeIn().siblings().fadeOut();
			}

			//如果配置了自动切换，记得把当前的loop的值设置成当前显示的index
			if (this.config.auto) {
				this.loop = index;
			}
		},
		//自动时间间隔切换
		autoPlay:function(){
			var _this_ = this;
			tabItems = this.tabItems;//临时保存tab列表
			tabLength = tabItems.size();//tab的个数
			config = this.config;
			this.timer = window.setInterval(function(){
				_this_.loop++;
				if (_this_.loop>=tabLength) {
					_this_.loop = 0;
				}
				tabItems.eq(_this_.loop).trigger(config.triggerType);
			},config.auto);
		}
	};
	Tab.init = function(tabs){
		var _this_ = this;
		tabs.each(function(){
			new _this_($(this));
		})
	}

	//注册成jq方法
	$.fn.extend({
		tab:function(){
			this.each(function(){
				new Tab($(this));
			})

			return this;
		}
	})
	window.Tab = Tab;
})(jQuery);