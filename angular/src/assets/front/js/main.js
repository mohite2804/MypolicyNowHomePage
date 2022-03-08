$(document).ready(function () {
	// Variables declarations	
	var $wrapper = $('.main-wrapper');
	var $pageWrapper = $('.page-wrapper');
	var $slimScrolls = $('.slimscroll');

	// Header
	$(window).scroll(function () {
		if ($(this).scrollTop() > 80) {
			$('.header').addClass('sticky-header');
		} else {
			$('.header').removeClass('sticky-header');
		}
	});


	// Sidebar
	
	var Sidemenu = function() {
		this.$menuItem = $('#sidebar-menu a');
	};

	function init() {

        
		var $this = Sidemenu;
		
		$(document).on("click", "#sidebar-menu a", function(e) {
			if($(this).parent().hasClass('submenu')) {
				e.preventDefault();
			}
			if(!$(this).hasClass('subdrop')) {
				$('ul', $(this).parents('ul:first')).slideUp(350);
				$('a', $(this).parents('ul:first')).removeClass('subdrop');
				$(this).next('ul').slideDown(350);
				$(this).addClass('subdrop');
			} else if($(this).hasClass('subdrop')) {
				$(this).removeClass('subdrop');
				$(this).next('ul').slideUp(350);
			}
		});
		$('#sidebar-menu ul li.submenu a.active').parents('li:last').children('a:first').addClass('active').trigger('click');
	}
	
	// Sidebar Initiate
	init();	

    // Sidebar Slimscroll
    
	if($slimScrolls.length > 0) {
		$slimScrolls.slimScroll({
			height: 'auto',
			width: '100%',
			position: 'right',
			size: '7px',
			color: '#ccc',
			wheelStep: 10,
			touchScrollStep: 100
		});
		var wHeight = $(window).height() - 60;
		$slimScrolls.height(wHeight);
		$('.sidebar .slimScrollDiv').height(wHeight);
		$('.quotes-editoption .slimScrollDiv').height(wHeight);
		$(window).resize(function() {
			var rHeight = $(window).height() - 60;
			$slimScrolls.height(rHeight);
			$('.sidebar .slimScrollDiv').height(rHeight);
			$('.quotes-editoption .slimScrollDiv').height(rHeight);
		});
    }
    
    // Small Sidebar

	$(document).on('click', '#toggle_btn', function() {
		if($('body').hasClass('mini-sidebar')) {
			$('body').removeClass('mini-sidebar');
			$('.subdrop + ul').slideDown();
		} else {
			$('body').addClass('mini-sidebar');
			$('.subdrop + ul').slideUp();
		}
		return false;
	});
	$(document).on('mouseover', function(e) {
		e.stopPropagation();
		if($('body').hasClass('mini-sidebar') && $('#toggle_btn').is(':visible')) {
			var targ = $(e.target).closest('.sidebar').length;
			if(targ) {
				$('body').addClass('expand-menu');
				$('.subdrop + ul').slideDown();
			} else {
				$('body').removeClass('expand-menu');
				$('.subdrop + ul').slideUp();
			}
			return false;
		}
    });
    
    // Mobile menu sidebar overlay
	
	$('body').append('<div class="sidebar-overlay"></div>');
	$(document).on('click', '#mobile_btn', function() {
		$('.main-wrapper').toggleClass('slide-nav');
		$('.sidebar-overlay').toggleClass('opened');
		$('html').addClass('menu-opened');
		return false;
	});

	$(document).on('click', '#slidecover', function() {
		$('.main-wrapper').toggleClass('slide-quotes-editoption');
		$('.sidebar-overlay').toggleClass('opened');
		$('html').addClass('menu-opened');
		return false;
	});
	
	$(".sidebar-overlay").on("click", function () {
        $('html').removeClass('menu-opened');
        $(this).removeClass('opened');
        $('.main-wrapper').removeClass('slide-nav');
        $('.main-wrapper').removeClass('slide-quotes-editoption');
        $('.sidebar-overlay').removeClass('opened');
	});

	// Floating Label
	if ($('.floating').length > 0) {
		$('.floating').on('focus blur', function (e) {
			$(this).parents('.form-focus').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
		}).trigger('blur');
	}

	// Semantic Dropdown
	
	$('.ui.dropdown').dropdown();

	// Date Time Picker	
	if ($('.datetimepicker').length > 0) {
		$('.datetimepicker').datetimepicker({
			format: 'DD/MM/YYYY',
			icons: {
				up: "fa fa-angle-up",
				down: "fa fa-angle-down",
				next: 'fa fa-angle-right',
				previous: 'fa fa-angle-left'
			}
		});
	}

	// Rangeslider
	$('#range').on("input", function () {
		$('.idv-output').val(this.value);
	}).trigger("change");


	// Quick Quote Option
	$("#quickquote").click(function () {
	    if ($(this).is(":checked")) {
	        $("#ifFullQuote").addClass('d-none');
	        $("#getquotebtn").addClass('d-none');
	        $("#getquickquotebtn").removeClass('d-none');
	    } else {
	        $("#ifFullQuote").removeClass('d-none');
	        $("#getquotebtn").removeClass('d-none');
	        $("#getquickquotebtn").addClass('d-none');
	    }
	});

	// Ask for Previous Policy Type
	$("#askPolicytype input[name$='policytype']").click(function () {
		var radio_value = $(this).val();
		if (radio_value == 'policytypeNew') {
			$("#ifPolicytypeNew").removeClass('d-none');
			$("#ifPolicytypeRenew").addClass('d-none');
			$("#prevPolicyDetails").addClass('d-none');
		} else if (radio_value == 'policytypeRenew') {
			$("#ifPolicytypeNew").addClass('d-none');
			$("#ifPolicytypeRenew").removeClass('d-none');
			$("#prevPolicyDetails").removeClass('d-none');
		}
	});

	// Ask policy holder Type
	$("#askpolicyholdertype input[name$='policyholdertype']").click(function () {
		var radio_value = $(this).val();
		if (radio_value == 'policyholdertype-individual') {
			$("#cpaCover").removeClass('d-none');
			$("#ownerDetails").removeClass('d-none');
			$("#nomineeDetails").removeClass('d-none');
			$("#companyDetails").addClass('d-none');
		} else if (radio_value == 'policyholdertype-corporate') {
			$("#cpaCover").addClass('d-none');
			$("#ownerDetails").addClass('d-none');
			$("#nomineeDetails").addClass('d-none');
			$("#companyDetails").removeClass('d-none');
		}
	});

	// Ask for CPA Term
	$("#askCPATerm input[name$='cpacover']").click(function () {
		var radio_value = $(this).val();
		if (radio_value == 'cpacoverNone') {
			$("#cpaReasons").removeClass('d-none');
		} else if (radio_value == 'cpacover1yr') {
			$("#cpaReasons").addClass('d-none');
		} else if (radio_value == 'cpacover5yr') {
			$("#cpaReasons").addClass('d-none');
		}
	});
	  

	// Nominee Details
	$("#nomineeAge").change(function(){
	    $("#appointeeDetails").addClass('d-none');
	    var nomineeAgeValue = $(this).val();
	    if(nomineeAgeValue  <= 17){
	       $("#appointeeDetails").removeClass('d-none');
	    } 
	});

	// Accessories & Covers
	$("#accessories").click(function () {
	    if ($(this).is(":checked")) {
	        $("#accessoriesBox").removeClass('d-none');
	    } else {
	        $("#accessoriesBox").addClass('d-none');
	    }
	}); 

	$("#deductibles").click(function () {
	    if ($(this).is(":checked")) {
	        $("#deductiblesBox").removeClass('d-none');
	    } else {
	        $("#deductiblesBox").addClass('d-none');
	    }
	}); 

	$("#automobilessociation").click(function () {
	    if ($(this).is(":checked")) {
	        $("#automobilessociationBox").removeClass('d-none');
	    } else {
	        $("#automobilessociationBox").addClass('d-none');
	    }
	}); 

	$("#paCovers").click(function () {
	    if ($(this).is(":checked")) {
	        $("#paCoversBox").removeClass('d-none');
	    } else {
	        $("#paCoversBox").addClass('d-none');
	    }
	});

	$("#paUnnamed").click(function () {
	    if ($(this).is(":checked")) {
	        $("#paUnnamedSumInsured").removeClass('d-none');
	    } else {
	        $("#paUnnamedSumInsured").addClass('d-none');
	    }
	});  

	// Geographical Extension
	$("#geoExt-none").click(function () {
	    if ($(this).is(":checked")) {
	        $('input[name=geoExt]').prop('checked', false);
	        $('input[name=geoExt]').prop('disabled', true);
	    } else {
	        $('input[name=geoExt]').prop('disabled', false);
	    }
	});

	// Change In Ownership
	$("#changeOwnership input[name$='changeownership']").click(function () {
		var radio_value = $(this).val();
		if (radio_value == 'changeOwnershipYes') {
			$("#prevPolicy").addClass('d-none');
		} else if (radio_value == 'changeOwnershipNo') {
			$("#prevPolicy").removeClass('d-none');
		}
	});

	// Ask for Previous Policy 
	$("#prevPolicy input[name$='prevpolicy']").click(function () {
		var radio_value = $(this).val();
		if (radio_value == 'prevPolicy-Yes') {
			$("#prevPolicyType").removeClass('d-none');
			$("#prevPolicyExpDate").removeClass('d-none');
			$("#madeClaim").removeClass('d-none');
			$("#prevPolicyNilDep").removeClass('d-none');
			$("#prevPolicyNo").removeClass('d-none');
			$("#prevInsurance").removeClass('d-none');
		} else if (radio_value == 'prevPolicy-No') {
			$("#prevPolicyType").addClass('d-none');
			$("#prevPolicyExpDate").addClass('d-none');
			$("#madeClaim").addClass('d-none');
			$("#prevPolicyNilDep").addClass('d-none');
			$("#prevPolicyNo").addClass('d-none');
			$("#prevInsurance").addClass('d-none');
		}
	});
	
	// Ask for Previous Claim 
	$("#madeClaim input[name$='madeclaim']").click(function () {
		var radio_value = $(this).val();
		if (radio_value == 'madeClaim-Yes') {
			$("#previousncb").addClass('d-none');
		} else if (radio_value == 'madeClaim-No') {
			$("#previousncb").removeClass('d-none');
		}
	});


	// Quotes Page
	// Ask External CNG Fitted
	$("#askexternalCNGfittedvalue input[name$='externalCNGfitted']").click(function () {
		var radio_value = $(this).val();
		if (radio_value == 'externalCNGfitted-yes') {
			$("#externalCNGfittedvalue").removeClass('d-none');
		} else if (radio_value == 'externalCNGfitted-no') {
			$("#externalCNGfittedvalue").addClass('d-none');
		}
	});

	// Customer Detail Page
	// Customer Detail Step Box
	$("#ownerdetails-next").click(function () {
		$('#ownerdetails .step-block').addClass('d-none');
		$('#addressdetails .step-block').removeClass('d-none');
	});
	$("#addressdetails-next").click(function () {
		$('#addressdetails .step-block').addClass('d-none');
		$('#vehicledetails .step-block').removeClass('d-none');
	});
	$("#vehicledetails-next").click(function () {
		$('#vehicledetails .step-block').addClass('d-none');
		$('#completeddetails .step-block').removeClass('d-none');
	});

	$("#addressdetails-back").click(function () {
		$('#addressdetails .step-block').addClass('d-none');
		$('#ownerdetails .step-block').removeClass('d-none');
	});
	$("#vehicledetails-back").click(function () {
		$('#vehicledetails .step-block').addClass('d-none');
		$('#addressdetails .step-block').removeClass('d-none');
	});
	$("#ownerdetails-edit").click(function () {
		$('#ownerdetails .step-block').removeClass('d-none');
		$('#completeddetails .step-block').addClass('d-none');
	});
	$("#addressdetails-edit").click(function () {
		$('#addressdetails .step-block').removeClass('d-none');
		$('#completeddetails .step-block').addClass('d-none');
	});
	$("#vehicledetails-edit").click(function () {
		$('#vehicledetails .step-block').removeClass('d-none');
		$('#completeddetails .step-block').addClass('d-none');
	});
	$("#askforvehicleloan input[name$='vehicleloan']").click(function () {
		var radio_value = $(this).val();
		if (radio_value == 'vehicleloan-yes') {
			$("#selectbankname").removeClass('d-none');
		} else if (radio_value == 'vehicleloan-no') {
			$("#selectbankname").addClass('d-none');
		}
	});

	// Ttestimonials owlCarousel
	$('.testimonials-slider').owlCarousel({
		loop: true,
		items: 3,
		center: true,
		margin: 10,
		autoplay: true,
		dots: true,
		autoplayTimeout: 8500,
		smartSpeed: 450,
		responsiveClass: true,
		responsive: {
			0: {
				items: 1,
				nav: false
			},
			768: {
				items: 2,
				nav: false
			},
			1170: {
				items: 3,
				nav: true,
			}
		}
	});


	// Authenticate Proposal
	// $('.digit-group').find('input').each(function() {
	// 	$(this).attr('maxlength', 1);
	// 	$(this).on('keyup', function(e) {
	// 		var parent = $($(this).parent());
			
	// 		if(e.keyCode === 8 || e.keyCode === 37) {
	// 			var prev = parent.find('input#' + $(this).data('previous'));
				
	// 			if(prev.length) {
	// 				$(prev).select();
	// 			}
	// 		} else if((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
	// 			var next = parent.find('input#' + $(this).data('next'));
				
	// 			if(next.length) {
	// 				$(next).select();
	// 			} else {
	// 				if(parent.data('autosubmit')) {
	// 					parent.submit();
	// 				}
	// 			}
	// 		}
	// 	});
	// });


});

// Datatable
	if($('.datatable').length > 0) {
		$('.datatable').DataTable({
			// "bFilter": true,
		});
	}

// OTP Digit Box
function getCodeBoxElement(index) {
  return document.getElementById('digit-' + index);
}
function onKeyUpEvent(index, event) {
  const eventCode = event.which || event.keyCode;
  if (getCodeBoxElement(index).value.length === 1) {
     if (index !== 6) {
        getCodeBoxElement(index+ 1).focus();
     } else {
        getCodeBoxElement(index).blur();
        // Submit code
        console.log('submit code ');
     }
  }
  if (eventCode === 12 && index !== 1) {
     getCodeBoxElement(index - 1).focus();
  }
}
function onFocusEvent(index) {
  for (item = 1; item < index; item++) {
     const currentElement = getCodeBoxElement(item);
     if (!currentElement.value) {
          currentElement.focus();
          break;
     }
  }
}

/*!
 DataTables Bootstrap 4 integration
 ©2011-2017 SpryMedia Ltd - datatables.net/license
*/
var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.findInternal=function(a,b,c){a instanceof String&&(a=String(a));for(var e=a.length,d=0;d<e;d++){var k=a[d];if(b.call(c,k,d,a))return{i:d,v:k}}return{i:-1,v:void 0}};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.SIMPLE_FROUND_POLYFILL=!1;
$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)};$jscomp.getGlobal=function(a){a=["object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global,a];for(var b=0;b<a.length;++b){var c=a[b];if(c&&c.Math==Math)return c}throw Error("Cannot find global object");};$jscomp.global=$jscomp.getGlobal(this);
$jscomp.polyfill=function(a,b,c,e){if(b){c=$jscomp.global;a=a.split(".");for(e=0;e<a.length-1;e++){var d=a[e];d in c||(c[d]={});c=c[d]}a=a[a.length-1];e=c[a];b=b(e);b!=e&&null!=b&&$jscomp.defineProperty(c,a,{configurable:!0,writable:!0,value:b})}};$jscomp.polyfill("Array.prototype.find",function(a){return a?a:function(a,c){return $jscomp.findInternal(this,a,c).v}},"es6","es3");
(function(a){"function"===typeof define&&define.amd?define(["jquery","datatables.net"],function(b){return a(b,window,document)}):"object"===typeof exports?module.exports=function(b,c){b||(b=window);c&&c.fn.dataTable||(c=require("datatables.net")(b,c).$);return a(c,b,b.document)}:a(jQuery,window,document)})(function(a,b,c,e){var d=a.fn.dataTable;a.extend(!0,d.defaults,{dom:"<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
renderer:"bootstrap"});a.extend(d.ext.classes,{sWrapper:"dataTables_wrapper dt-bootstrap4",sFilterInput:"form-control form-control-sm",sLengthSelect:"custom-select custom-select-sm form-control form-control-sm",sProcessing:"dataTables_processing card",sPageButton:"paginate_button page-item"});d.ext.renderer.pageButton.bootstrap=function(b,l,v,w,m,r){var k=new d.Api(b),x=b.oClasses,n=b.oLanguage.oPaginate,y=b.oLanguage.oAria.paginate||{},g,h,t=0,u=function(c,d){var e,l=function(b){b.preventDefault();
a(b.currentTarget).hasClass("disabled")||k.page()==b.data.action||k.page(b.data.action).draw("page")};var q=0;for(e=d.length;q<e;q++){var f=d[q];if(a.isArray(f))u(c,f);else{h=g="";switch(f){case "ellipsis":g="&#x2026;";h="disabled";break;case "first":g=n.sFirst;h=f+(0<m?"":" disabled");break;case "previous":g=n.sPrevious;h=f+(0<m?"":" disabled");break;case "next":g=n.sNext;h=f+(m<r-1?"":" disabled");break;case "last":g=n.sLast;h=f+(m<r-1?"":" disabled");break;default:g=f+1,h=m===f?"active":""}if(g){var p=
a("<li>",{"class":x.sPageButton+" "+h,id:0===v&&"string"===typeof f?b.sTableId+"_"+f:null}).append(a("<a>",{href:"#","aria-controls":b.sTableId,"aria-label":y[f],"data-dt-idx":t,tabindex:b.iTabIndex,"class":"page-link"}).html(g)).appendTo(c);b.oApi._fnBindAction(p,{action:f},l);t++}}}};try{var p=a(l).find(c.activeElement).data("dt-idx")}catch(z){}u(a(l).empty().html('<ul class="pagination"/>').children("ul"),w);p!==e&&a(l).find("[data-dt-idx="+p+"]").trigger("focus")};return d});

