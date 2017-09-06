require("../common/lazyload.js");
require("../common/demoUtils.js");
require("../common/iscroll-probe.js");

var Iscroll = require("../common/iscroll.js");
var categoryTpl = require("./category_item.mustache");
var goodsTpl = require("./goods.mustache");

function Page() {
  this.categoryElem = $(".js-category");
  this.contentElem = $(".js-content");
  this.flag = false;
	this.loading = false;
	this.loadNoticeElem = $("#loadNotice");
	this.listItem = $("#list");
}

$.extend(Page.prototype, {
    init: function() {
      // this.initIscroll();
      this.promoteEfficiency();
      this.getCategoryData();
      this.getLoadData();
    },

    promoteEfficiency: function() {
      document.addEventListener("touchmove", function(e) {e.preventDefault();}, this.isPassive() ? {
          capture: false,
          passive: false
        } : false);
    },

    getCategoryData: function() {
      $.ajax({
        url: "/mock/index.json",
        success: $.proxy(this.handleDataSucc, this)
      })
    },

    handleDataSucc: function(res) {
      var data = res.data,
          classifyHtml = categoryTpl({ categories: data.category}),
          contentHtml = goodsTpl({goods: data.goods});
      // var html = " ";
      // for (var i = 0; i < categories.length; i++) {
      //   html += '<li class="category-item category-item-active iconfont>"' +categories[i].icon + '</li>'
      // }
      this.categoryElem.append(classifyHtml);
      this.contentElem.append(contentHtml);
      this.initIscroll();
      // this.scroll.refresh();
      this.contentScroll.on('scroll', $.proxy(this.handleScroll, this));
      this.lazyload();
    },

    initIscroll: function() {
      this.classifyScroll = new Iscroll(".classify-wrapper", {
        scrollX: true,
        scrollY: false
      });

      this.contentScroll = new Iscroll(".content-wrapper", {
        scrollX: false,
        scrollY: true,
        probeType: 3,
        mouseWheel:true
      });

      this.contentScroll.on("scrollEnd", $.proxy(this.handleScrollEnd, this));
    },

    lazyload: function() {
      $(".lazy").lazyload();
    },

    handleScroll: function() {
			if (!this.loaidng) {
				if (this.contentScroll.y > 100) {
					this.loadNoticeElem.show();
					this.flag = true;
				}else {
					this.loadNoticeElem.hide();
				}
			}
		},

		handleScrollEnd: function() {
      $(window).trigger("scroll");
			if (this.flag) {
				this.loading = true;
				this.flag = false;
				setTimeout($.proxy(this.handleGetDate, this), 2000);
			}
		},

    getLoadData: function() {
      $.ajax({
        url: "/mock/index.json",
        success: $.proxy(this.handleGetDate, this)
      })
    },

		handleGetDate: function(res) {
      var data = res.data,
          contentHtml = goodsTpl({goods: data.goods});
			this.listItem.append(contentHtml);
      this.initIscroll();
      // this.scroll.refresh();
      this.contentScroll.on('scroll', $.proxy(this.handleScroll, this));
      this.lazyload();
			this.loading = false;
			this.contentScroll.refresh();
		},

    isPassive: function(){
      var supportPassiveOption = false;
      try {
        addEventListener("test", null, Object.defineProperty({}, 'passive', {
              get: function() {
                  supportPassiveOption = true;
              }
        }));
      } catch(e) {}
      return supportPassiveOption;
    }
})

var page = new Page();
page.init();
