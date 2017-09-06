function Page() {
	this.minus = $(".js-minus");
	this.numInput = $(".js-numInput");
	this.plus = $(".js-plus");
	this.totalNum = $(".totalNum");
	this.totalPay = $(".totalPay");
	this.goodsSalePrice1 = $(".goodsSalePrice1");

}

$.extend(Page.prototype, {
	init: function() {
		this.bindEvents();
	},

	bindEvents: function() {
		this.minus.on("click", $.proxy(this.handleNumMinusClick, this));
		this.plus.on("click", $.proxy(this.handleNumPlusClick, this));
		// this.totalPay.on("click", $.proxy(this.handleTotalPayClick, this));
	},

	handleNumMinusClick: function() {
		var num = Number(this.numInput.val());
		num--;
		if(num > 0){
			this.numInput.val(num);
		}else {
			alert("不能再减了");
		}
	},

	handleNumPlusClick: function() {
		var num = Number(this.numInput.val());
		num++;
		this.numInput.val(num);
		this.totalNum.html(num);
		var money = Number(this.goodsSalePrice1.html());
		this.totalPay.html(num*money);
	}

	// handleTotalPayClick: function() {
	// 	var num = Number(this.numInput.val());
	// 	this.totalNum.val(num);
	// 	var money = Number(this.goodsSalePrice1.val());
	// 	this.totalPay.num(num*money);
	// }
})

var page = new Page();
page.init();
