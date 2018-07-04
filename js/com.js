/**
 * @author Vickyhuang
 */
var testOS = {},
	userAgent = navigator.userAgent;
testOS.msie = userAgent.match(/MSIE\/([\d.]+)/) ? true : false;
testOS.webkit = userAgent.match(/WebKit\/([\d.]+)/) ? true : false;
testOS.opera = (userAgent.match(/Opera Mobi/) || userAgent.match(/Opera.([\d.]+)/)) ? true : false;
testOS.android = userAgent.match(/(Android)\s+([\d.]+)/) || userAgent.match(/Silk-Accelerated/) || userAgent.match(/Android/) ? true : false;
testOS.ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false;
testOS.iphone = !testOS.ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false;
testOS.webos = userAgent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/) ? true : false;
testOS.touchpad = testOS.webos && userAgent.match(/TouchPad/) ? true : false;
testOS.ios = testOS.ipad || testOS.iphone;
testOS.blackberry = userAgent.match(/BlackBerry/) || userAgent.match(/PlayBook/) ? true : false;
testOS.fennec = userAgent.match(/fennec/i) ? true : false;
testOS.desktop = !(testOS.ios || testOS.android || testOS.blackberry || testOS.opera || testOS.fennec);
testOS.facebookInAppBrowser = (userAgent.indexOf("FBAN") > -1) || (userAgent.indexOf("FBAV") > -1);
testOS.lineInAppBrowser = (userAgent.indexOf("Line") > -1);
testOS.inAppBrowser = testOS.facebookInAppBrowser || testOS.lineInAppBrowser;

var Com = {
	init: function() {
		// load ad
		this.loadAD.addAd();
		if (typeof page != "undefined" && page === "quiz") {
			// share btn
			this.bindShare();
			if (testOS.desktop) {
				this.bindCopyShareUrl();
			}
		}
		if ((typeof page != "undefined" && page === "quiz") && (typeof page != "undefined" && subPage === "result")) {
			// show like
			this.showLike();
			this.showResultShare();
		}
	},

	/**
	 * @author VickyHuang
	 * @param {Object} options include: "args" :
	 * @description 銴�ˊ����韐湔踎
	 */
	fnCopyToClipboard: function(args) {
		var version = $("meta[name='version']").attr("content");
		Com.loadDoc.loader(["https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.6.0/clipboard.min.js?v=" + version], function() {
			var clipboard = new Clipboard(args.copyObj, {
				target: args.target,
				text: args.text,
				action: args.action || "copy"
			});
			clipboard.on("success", function(e) {
				console.log("success", e);
				alert('銴�ˊ��𣂼���')
			});
			clipboard.on("error", function(e) {
				console.log("error", e);
			});
		});
	},
	bindCopyShareUrl: function() {
		var og_url_meta = $("meta[property='og:url']"),
			og_title_meta = $("meta[property='og:title']"),
			og_description_meta = $("meta[property='og:description']"),
			og_image_meta = $("meta[property='og:image']"),
			og_url = (og_url_meta !== void 0) ? og_url_meta.attr('content') : void 0,
			og_title = (og_title_meta !== void 0) ? og_title_meta.attr('content') : void 0,
			og_description = (og_description_meta !== void 0) ? og_description_meta.attr('content') : void 0,
			og_image = (og_image_meta !== void 0) ? og_image_meta.attr('content') : void 0,
			pageUrlArr = window.location.href.split('?'),
			pageUrl = pageUrlArr[0];
		this.fnCopyToClipboard({
			copyObj: '.btn_share[data-type="copy"]',
			text: function(trigger) {
				var title = $.trim(trigger.getAttribute("data-title")) || og_title || "",
					url = $.trim(trigger.getAttribute("data-url")) || og_url || pageUrl;
				// return (title + url);
				return url;
			}
		});
	},

	/**
	 * @author VickyHuang
	 * @param {Object} options include: "args" :
	 * @description �獈甇ａ�㗇𥋘���𢰧�睸
	 */
	fnStopSelectAndContextmenu: function() {
		if (testOS.desktop) {
			document.body.oncopy = function(e) {
				if (window.clipboardData) {
					window.clipboardData.clearData();
				}
				return false;
			};
			document.body.onselectstart = function(e) {
				return false;
			};
			document.oncontextmenu = function() {
				return false;
			};
		}
	},


	/**
	 *@author VickyHuang
	 *@param {Object} options include:
	 *@description share ��鈭�
	 */
	showResultShare: function() {
		var $shareObj = $('#detailMain').find('.info').find('.share');
		$shareObj.on('click', '.btn_close', function() {
			$shareObj.hide();
		});
		setTimeout(function() {
			$shareObj.show();
		}, 20000);
	},
	bindShare: function() {
		var self = this;
		if (!testOS.desktop) {
			$('.btn_share[data-type="line"]').show();
			$('.btn_share[data-type="copy"]').hide();
		} else {
			$('.btn_share[data-type="copy"]').show();
			$('.btn_share[data-type="line"]').hide();
		}
		$("#wrap").on("click", ".btn_share", function() {
			var $this = $(this),
				type = $this.attr("data-type");

			var doShareFunction = function() {
				var og_url_meta = $("meta[property='og:url']"),
					og_title_meta = $("meta[property='og:title']"),
					og_description_meta = $("meta[property='og:description']"),
					og_image_meta = $("meta[property='og:image']"),
					og_url = (og_url_meta !== void 0) ? og_url_meta.attr('content') : void 0,
					og_title = (og_title_meta !== void 0) ? og_title_meta.attr('content') : void 0,
					og_description = (og_description_meta !== void 0) ? og_description_meta.attr('content') : void 0,
					og_image = (og_image_meta !== void 0) ? og_image_meta.attr('content') : void 0,
					pageUrlArr = window.location.href.split('?'),
					pageUrl = pageUrlArr[0];
				return self.shareToWeb({
					type: $this.attr("data-type"),
					ga_click: $this.attr("data-ga-click"),
					url: $.trim($this.attr("data-url")) || og_url || pageUrl,
					title: $.trim($this.attr("data-title")) || og_title || "",
					description: og_description || "",
					image: og_image || "",
				});
			};

			if (type != 'copy') {
				doShareFunction();
			}
		});
	},
	shareToWeb: function(args) {
		var type = args.type,
			ga_click = args.ga_click,
			url = args.url,
			title = args.title,
			description = args.description,
			image = args.image,
			waitingForResult = $("meta[name='waitingForResult']").attr("content") == "true",
			encodedUrl = encodeURIComponent(url),
			encodedTitle = encodeURIComponent(title),
			encodedDescription = encodeURIComponent(description),
			encodedImage = encodeURIComponent(image),
			encodedAppId = encodeURIComponent("1735307520119524"),
			shareLink = "";

		var theGAData = {
			eventCategory: 'Outbound Link',
			eventAction: ga_click,
			eventLabel: url,
		};
		ga('send', 'event', theGAData);
		ga('quizTracker.send', 'event', theGAData);

		switch (type) {
			case "facebook":
				shareLink = ("https://www.facebook.com/sharer/sharer.php?u=" + encodedUrl + "&title=" + encodedTitle + "&picture=" + encodedImage + "&description=" + encodedDescription);
				break;
			case "messenger":
				if (testOS.desktop) {
					var FBUIMessengerShareFunction = function() {
						FB.ui({
							method: 'send',
							link: url,
							title: encodedTitle,
							picture: encodedImage,
							description: encodedDescription,
						});
					};

					if (waitingForResult) {
						var self = this;
						self.doWaitingForResult(FBUIMessengerShareFunction);
						return ;
					}
					else {
						FBUIMessengerShareFunction();
					}

					return;
				} else {
					if (testOS.android) {
						if (testOS.inAppBrowser) {
							shareLink = ("fb-messenger://share?link=" + encodedUrl + '&app_id=' + encodedAppId);
						}
						else {
							shareLink = "intent://share/#Intent;scheme=fb-messenger;package=com.facebook.orca;S.android.intent.extra.TEXT=" + encodedUrl + ";end";
						}
					}
					else {
						shareLink = ("fb-messenger-share://?type=FBShareableTypeURL&link=" + encodedUrl);
					}
				}
				// shareLink = ("fb-messenger://share?link=" + encodedUrl + "&title=" + encodedTitle + "&picture=" + encodedImage + "&description=" + encodedDescription);
				break;
			case "google":
				shareLink = "https://plus.google.com/share?url=" + encodedUrl;
				break;
			case "pinterest":
				shareLink = "http://pinterest.com/pin/create/button/?url=" + encodedUrl;
				break;
			case "linkedIn":
				shareLink = "http://www.linkedin.com/cws/share?url=" + encodedUrl + "&original_referer=" + encodedUrl + "&isFramed=false&ts=" + (new Date).getTime();
				break;
			case "twitter":
				shareLink = "https://twitter.com/intent/tweet?text=" + encodedTitle + "&url=" + encodedUrl;
				break;
			case "line":
				if ((! testOS.inAppBrowser)) {
					if (testOS.android) {
						shareLink = "intent://msg/text/" + encodedUrl + "#Intent;scheme=line;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=jp.naver.line.android;end;";
					}
					else {
						shareLink = "line://msg/text/" + encodedUrl;
					}
				}
				else {
					shareLink = "http://line.me/R/msg/text/?" + encodedTitle + "%0D%0A" + encodedUrl;
				}
				// shareLink = "https://timeline.line.me/social-plugin/share?url=" + encodedUrl;
				break;
			case "wechat":
				shareLink = "http://apps.example8.com/app/wechat?url=" + encodedUrl;
				break;
		}

		if (waitingForResult) {
			this.popupCenter(window.location.href + "&callback=" + encodeURIComponent(shareLink), 685, 500);
			return;
		}

		this.popupCenter(shareLink, 685, 500);
		return shareLink;
	},
	popupCenter: function(e, t, n, i) {
		var r = screen.width / 2 - t / 2,
			s = screen.height / 2 - n / 2;
		return window.open(e, i, "menubar=no,toolbar=no,status=no,width=" + t + ",height=" + n + ",toolbar=no,left=" + r + ",top=" + s);
	},
	doWaitingForResult: function(callback) {
		var generateShareUrl = $("meta[name='generateShareUrl']").attr("content"),
		checkShareUrl = $("meta[name='checkShareUrl']").attr("content");

		var actionDone = false;
		var pictureExisting = false;
		Com.loadDoc.loader([
			"https://cdn.jsdelivr.net/jquery.loadingoverlay/latest/loadingoverlay.min.js",
			// "https://cdn.jsdelivr.net/jquery.loadingoverlay/latest/loadingoverlay_progress.min.js?v=" + version,
		], function() {

			$.LoadingOverlay("show");

			$.get(generateShareUrl, function(data) {
				$.LoadingOverlay("hide");

				pictureExisting = data === "true";
				if (! actionDone) {
					actionDone = true;
					callback();
				}
			})
			.always(function() {
				if (pictureExisting) {
					return;
				}

				var startTime = Date.now();

				var checkShareStatusFunction = function(){

					// Check has the picture been generated for share usages.
					$.get(checkShareUrl, function(data) {

						// console.log(data);
						var resultExists = data === "true";
						// If the picture is generated or retry too many times
						if (resultExists || Date.now() - startTime > 2 * 1000) {
							$.LoadingOverlay("hide");
							callback();
						} else {
							setTimeout(checkShareStatusFunction, 500);
						}
					});
				};

				setTimeout(checkShareStatusFunction, 500);
			});

		});
	},


	/**
	 *@author VickyHuang
	 *@param {Object} options include:
	 *@description show like
	 */
	showLike: function() {
		var version = $("meta[name='version']").attr("content"),
			self = this;
		Com.loadDoc.loader(["https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js?v=" + version], function() {

			if (!$.cookie('show_fb_like')) {
				window.showLikeTimer = setTimeout(function() {
					if (!window.showPopLike && typeof(FB) != "undefined") {
						window.showPopLike = true;
						self.showLikePopup();
					}
				}, 10000);
			}

		});
	},
	/**
	 *@author VickyHuang
	 *@param {Object} options include:
	 *@description showLikePopup
	 */
	showLikePopup: function() {
		var $winLikeObj = $('#win_like');
		if ($winLikeObj.length <= 0) {
			var $winLike = $('#tpl_winLike').html();
			$('#wrap').append($winLike);
			$winLikeObj = $('#win_like');
		}
		FB.XFBML.parse($winLikeObj.get(0));
		// $winLikeObj.show();
		$winLikeObj.find(".liked").off().on("click", function() {
			var expiresDate = new Date();
			expiresDate.setTime(expiresDate.getTime() + (24 * 60 * 60 * 1000));
			$.cookie('show_fb_like', 1, {
				expires: expiresDate,
				path: '/'
			});
			$winLikeObj.hide().remove();
		});
		$winLikeObj.find(".btn_close").off().on("click", function() {
			var expiresDate = new Date();
			expiresDate.setTime(expiresDate.getTime() + (30 * 60 * 1000));
			$.cookie('show_fb_like', 1, {
				expires: expiresDate,
				path: '/'
			});
			$winLikeObj.hide().remove();
		});
	},


	/**
	 *@author VickyHuang
	 *@param {Object} options include:
	 *@description load ad
	 */
	loadAD: {
		data: {
			pc: {
				'LOOKERquiz_pc_header': '<ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-9997482642326755" data-ad-slot="1564806623�� data-ad-channel="4321786221"></ins>',

				'LOOKERquiz_pc_rightside_1': '<ins class="adsbygoogle" style="display:inline-block;width:300px;height:250px" data-ad-client="ca-pub-9997482642326755" data-ad-slot="6134607021" data-ad-channel="5798519428"></ins>',

				'LOOKERquiz_pc_rightside_2': '<ins class="adsbygoogle" style="display:inline-block;width:300px;height:600px" data-ad-client="ca-pub-9997482642326755" data-ad-slot="9088073429�� data-ad-channel="7275252624"></ins>',

				'LOOKERquiz_pc_answer': '<ins class="adsbygoogle" style="display:inline-block;width:336px;height:280px" data-ad-client="ca-pub-9997482642326755" data-ad-slot="4657873824" data-ad-channel="8751985826"></ins>',

				'LOOKERquiz_pc_afterquiz_left': '<ins class="adsbygoogle" style="display:inline-block;width:336px;height:280px" data-ad-client="ca-pub-9997482642326755" data-ad-slot="4657873824" data-ad-channel="2705452223"></ins>',

				'LOOKERquiz_pc_afterquiz_right': '<ins class="adsbygoogle" style="display:inline-block;width:336px;height:280px" data-ad-client="ca-pub-9997482642326755" data-ad-slot="4657873824" data-ad-channel="4182185429"></ins>'
			},
			mobile: {
				'LOOKERquiz_m_header': '<ins class="adsbygoogle" style="display:inline-block;width:100%;height:100px" data-ad-client="ca-pub-9997482642326755" data-ad-slot="7611340224" data-ad-channel="5658918621"></ins>',

				'LOOKERquiz_m_answer': '<ins class="adsbygoogle" style="display:inline-block;width:100%;height:280px" data-ad-client="ca-pub-9997482642326755" data-ad-slot="4657873824" data-ad-channel="7135651826"></ins>',

				'LOOKERquiz_m_afterquiz': '<ins class="adsbygoogle" style="display:inline-block;width:100%;height:280px" data-ad-client="ca-pub-9997482642326755" data-ad-slot="4657873824" data-ad-channel="8612385025"></ins>',

				'LOOKERquiz_m_recommend': '<ins class="adsbygoogle" style="display:inline-block;width:100%;height:280px" data-ad-client="ca-pub-9997482642326755" data-ad-slot="4657873824" data-ad-channel="4042584628"></ins>'
			}
		},
		addAd: function(id) {
			var datas = this.data.pc,
				htmlStar = '<script async src="http://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js">\x3c/script>',
				htmlEnd = '<script>(adsbygoogle = window.adsbygoogle || []).push({});\x3c/script>';
			if (!testOS.desktop) {
				datas = this.data.mobile
			}
			if (id) {
				if (!datas[id]) {
					return false;
				}
				$('#' + id).append(htmlStar + datas[id] + htmlEnd).addClass('adunit');
			} else {
				for (var obj in datas) {
					$('#' + obj).append(htmlStar + datas[obj] + htmlEnd).addClass('adunit');
				}
			}
		}
	},

	/**
	 * @author VickyHuang
	 * @param {Object} "args":
	 * @description �𢆡����𥕦遣��㰘蝸 css/js
	 */
	loadDoc: {
		filterDoc: function(tag, url) {
			var _tags = document.getElementsByTagName(tag),
				attr = tag === 'script' ? 'src' : 'href',
				urls = [];

			for (var i = 0; i < _tags.length; i++) {
				for (var j = 0; j < url.length; j++) {
					if (_tags[i].getAttribute(attr) === url[j]) {
						urls = url.slice(0, j).concat(url.slice(j + 1, url.length));
					}
				}
			}
			if (urls.length > 0) {
				return urls;
			} else {
				return [];
			}
		},

		JS: {
			jsOnload: function(node, callback) {
				node.onload = node.onreadystatechange = function() {
					if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
						callback && callback.call(this);
						node.onload = node.onreadystatechange = null;
					}
				}
			},

			poll: function(node, callback) {
				var i = 0;

				for (; i < node.length; i++) {
					if (i === node.length - 1) {
						Com.loadDoc.JS.jsOnload(node[i], function() {
							callback && callback.call(this);
						});
					} else {
						Com.loadDoc.JS.jsOnload(node[i], function() {});
					}
				}
			},

			loaded: function(url, callback) {
				var _head = document.getElementsByTagName('head')[0],
					tag = [],
					// urls = url;
					urls = Com.loadDoc.filterDoc('script', url);

				urls = urls.length > 0 ? urls : url;

				for (var i = 0; i < urls.length; i++) {
					tag[i] = document.createElement("script");
					tag[i].setAttribute("type", "text/javascript");
					tag[i].setAttribute("src", urls[i]);
					if ($("script[src='" + urls[i] + "']").length > 0) {
						$("script[src='" + urls[i] + "']").remove();
					}
					_head.appendChild(tag[i]);
				}

				Com.loadDoc.JS.poll(tag, callback);
			}
		},

		CSS: {
			styleOnload: function(node, callback) {
				// for IE6-9 and Opera
				for (var i = 0; i < node.length; i++) {
					if (node[i].attachEvent) {
						if (i === (node.length - 1)) {
							node[i].attachEvent('onload', callback);
						} else {
							node[i].attachEvent('onload', function() {});
						}
						// NOTICE:
						// 1. "onload" will be fired in IE6-9 when the file is 404, but in
						// this situation, Opera does nothing, so fallback to timeout.
						// 2. "onerror" doesn't fire in any browsers!
					}
					// polling for Firefox, Chrome, Safari
					else {
						var j = i;
						if (j === (node.length - 1)) {
							setTimeout(function() {
								Com.loadDoc.CSS.poll(node[j], callback);
							}, 0); // for cache
						} else {
							setTimeout(function() {
								Com.loadDoc.CSS.poll(node[j], function() {});
							}, 0);
						}
					}
				}
			},
			poll: function(node, callback) {
				if (callback.isCalled) {
					return;
				}

				var isLoaded = false;

				if (/webkit/i.test(navigator.userAgent)) { //webkit
					if (node['sheet']) {
						isLoaded = true;
					}
				}
				// for Firefox
				else if (node['sheet']) {
					try {
						if (node['sheet'].cssRules) {
							isLoaded = true;
						}
					} catch (ex) {
						// NS_ERROR_DOM_SECURITY_ERR
						if (ex.code === 1000) {
							isLoaded = true;
						}
					}
				}

				if (isLoaded) {
					// give time to render.
					setTimeout(function() {
						callback();
					}, 1);
				} else {
					setTimeout(function() {
						Com.loadDoc.CSS.poll(node, callback);
					}, 1);
				}
			},
			loaded: function(url, callback) {
				var _head = document.getElementsByTagName('head')[0],
					tag = [],
					urls = Com.loadDoc.filterDoc('link', url);

				urls = urls > 0 ? urls : url;

				for (var i = 0; i < urls.length; i++) {
					tag[i] = document.createElement("link");
					tag[i].setAttribute("rel", "stylesheet");
					tag[i].setAttribute("type", "text/css");
					tag[i].setAttribute("href", urls[i]);
					if ($("link[href='" + urls[i] + "']").length > 0) {
						$("link[href='" + urls[i] + "']").remove();
					}
					_head.appendChild(tag[i]);
				}

				Com.loadDoc.CSS.styleOnload(tag, function() {
					callback && callback.call(this);
				});
			}
		},

		// args.url {Array}
		loader: function(url, callback) {
			var css = [],
				js = [];

			for (var i = 0; i < url.length; i++) {
				if (url[i].indexOf('.css') > -1) {
					css.push(url[i]);
				} else {
					js.push(url[i]);
				}
			}

			if (css.length > 0 && js.length > 0) {
				Com.loadDoc.CSS.loaded(css, function() {
					Com.loadDoc.JS.loaded(js, callback);
				});
			} else if (css.length > 0 && js.length === 0) {
				Com.loadDoc.CSS.loaded(css, callback);
			} else if (css.length === 0 && js.length > 0) {
				Com.loadDoc.JS.loaded(js, callback);
			}
		}
	}

};

$(document).ready(function() {
	Com.init();
});