const fUtil = require("../misc/file");
const stuff = require("./info");
const http = require("http");

function toAttrString(table) {
	return typeof table == "object"
		? Object.keys(table)
				.filter((key) => table[key] !== null)
				.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`)
				.join("&")
		: table.replace(/"/g, '\\"');
}
function toParamString(table) {
	return Object.keys(table)
		.map((key) => `<param name="${key}" value="${toAttrString(table[key])}">`)
		.join(" ");
}
function toObjectString(attrs, params) {
	return `<object id="obj" ${Object.keys(attrs)
		.map((key) => `${key}="${attrs[key].replace(/"/g, '\\"')}"`)
		.join(" ")}>${toParamString(params)}</object>`;
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "GET") return;
	const query = url.query;

	var attrs, params, title;
	switch (url.pathname) {
		case "/cc": {
			title = "Character Creator";
			attrs = {
				data: process.env.SWF_URL + "/cc.swf", // data: 'cc.swf',
				type: "application/x-shockwave-flash",
				id: "char_creator",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
			        apiserver:"/","m_mode":"school","isLogin":"Y","isEmbed":"0","ctc":"go","tlang":"en_US",
			        storePath: process.env.STORE_URL + "/<store>",
			        clientThemePath: process.env.CLIENT_URL + "/<client_theme>","appCode":"go","page":"","siteId":"13","userId":"0TBAAga2Mn6g","themeId":"family","ut":30,"ft":"_sticky_filter_guy"
				},
				allowScriptAccess: "always",
				movie: process.env.SWF_URL + "/cc.swf", // 'http://localhost/cc.swf'
			};
			break;
		}
		
		case "/cc_browser": {
			title = "CC Browser";
			attrs = {
				data: process.env.SWF_URL + "/cc_browser.swf", // data: 'cc_browser.swf',
				type: "application/x-shockwave-flash",
				id: "char_creator",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					original_asset_id: query["id"] || null,
					themeId: "family",
					ut: 60,
					appCode: "go",
					page: "",
					siteId: "go",
					m_mode: "school",
					isLogin: "Y",
					isEmbed: 1,
					ctc: "go",
					tlang: "en_US",
					lid: 13,
				},
				allowScriptAccess: "always",
				movie: process.env.SWF_URL + "/cc_browser.swf", // 'http://localhost/cc_browser.swf'
			};
			break;
		}

		case "/videomaker/full": {
			let presave =
				query.movieId && query.movieId.startsWith("m")
					? query.movieId
					: `m-${fUtil[query.Autosave ? "getNextFileId" : "fillNextFileId"]("movie-", ".xml")}`;
			title = "Video Editor";
			attrs = {
				data: process.env.SWF_URL + "/go_full.swf",
				type: "application/x-shockwave-flash",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
				        apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					isEmbed: 1,
					ctc: "go",
					ut: 30,
					bs: "default",
					appCode: "go",
					page: "",
					siteId: "go",
					lid: 11,
					isLogin: "Y",
					retut: 1,
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					themeId: "business",
					tlang: "en_US",
					presaveId: presave,
					goteam_draft_only: 1,
					isWide: 1,
					collab: 0,
					nextUrl: "/html/list.html",
				},
				allowScriptAccess: "always",
			};
			break;
		}

		case "/player": {
			title = "Player";
			attrs = {
				data: process.env.SWF_URL + "/player.swf",
				type: "application/x-shockwave-flash",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
	apiserver: "/", ctc: "go", tlang: "en_US",
        autostart: "1", appCode: "go", isEmbed: "0", 
	storePath: process.env.STORE_URL + "/<store>", 
	clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
    },
				allowScriptAccess: "always",
				allowFullScreen: "true",
			};
			break;
		}

		default:
			return;
	}
	res.setHeader('Content-Type', 'text/html; charset=UTF-8');
	Object.assign(params.flashvars, query);
	res.end(`
	<head>
		<script>
			document.title='${title}',flashvars=${JSON.stringify(params.flashvars)}
		</script>
		<script>
			if(window.location.pathname == '/player') {
				function hideHeader() {
					document.getElementById("header").style.display = "none";
				}
			} else if(window.location.pathname == '/videomaker/full') {
				function hideHeader() {
					document.getElementById("header").style.display = "none";
				}
			}
		</script>
                <link href="https://d2bm7x1jqouzel.cloudfront.net/fonts/1/sailec.css" rel="stylesheet" type="text/css">
                <link href="https://d3v4eglovri8yt.cloudfront.net/static/add8e214e09bd155/go/css/common_combined.css.gz.css" rel="stylesheet" type="text/css">
                <link href="https://d3v4eglovri8yt.cloudfront.net/static/add8e214e09bd155/go/css/watermark.css.gz.css" rel="stylesheet" type="text/css">
                <link href="https://d3v4eglovri8yt.cloudfront.net/static/add8e214e09bd155/go/css/video.css.gz.css" rel="stylesheet" type="text/css">
                <link href="https://d3v4eglovri8yt.cloudfront.net/static/add8e214e09bd155/go/css/myvideos.css.gz.css" rel="stylesheet" type="text/css">
                <link href="https://d3v4eglovri8yt.cloudfront.net/static/add8e214e09bd155/go/css/video_export.css.gz.css" rel="stylesheet" type="text/css">
                <link href="https://d3v4eglovri8yt.cloudfront.net/static/add8e214e09bd155/go/css/vm5_alpha/banner.css.gz.css" rel="stylesheet" type="text/css">
<style>
		html {
			font-family: 'Sailec', Arial, sans-serif;
			-ms-text-size-adjust: 100%;
			-webkit-text-size-adjust: 100%;
		}

		body {
			margin: 0;
			background-color: #fff;
			color: #474747;
			font-size: 16px;
			font-weight: 400;
			line-height: 1.5;
			position: relative;
		}

		header {
			position: sticky;
			top: 0;
			width: 100%;
		}

		header>:nth-child(1) {
			align-content: center;
			background-color: #1e1e1e;
			display: inline-block;
			padding-bottom: 13px;
			text-align: center;
			color: #fff;
			width: 100%;
		}

		header>:nth-child(1)>:nth-child(1) {
			float: left;
		}

		header>:nth-child(1)>:nth-child(1)>:nth-child(1)>* {
			margin-left: 10px;
			margin-top: 7px;
			height: 30px;
		}

		header>:nth-child(1)>:nth-child(1)>:nth-child(2) {
			color: #666;
			padding-left: 4px;
			font-weight: 700;
		}

		header>:nth-child(1)>:nth-child(2) {
			margin-right: 20px;
			clear: both;
		}

		.button_big,
		.button_small {
			margin-left: 20px;
			margin-top: 7px;
			display: inline-block;
			padding-top: 5px;
			padding-bottom: 3px;
			border-radius: 3px;
			font-size: 14px;
			text-decoration: none;
			color: #fff;
		}

		.button_big {
			background-color: #d85e27;
			width: 160px;
		}

		.button_big:hover {
			text-decoration: underline;
		}

		.button_small:hover {
			color: #d85e27;
		}

		.button_big:hover,
		.button_small:hover {
			cursor: pointer;
		}

		.char_dropdown:hover>:nth-child(1) {
			cursor: context-menu;
			color: #d85e27;
		}

		.char_dropdown>menu {
			position: relative;
			display: none;
			top: 100%;
			left: 0;
			z-index: 1000;
			float: left;
			width: 100%;
			padding: 10px 0;
			margin: 9px 0 0;
			list-style: none;
			font-size: 14px;
			text-align: left;
			background-color: #fff;
			border: 1px solid #ccc;
			border: 1px solid rgba(0, 0, 0, 0.15);
			border-radius: 4px;
			-webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
			box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
			-webkit-background-clip: padding-box;
			background-clip: padding-box;
		}

		.char_dropdown:hover>menu {
			display: block;
		}

		.char_dropdown>menu>a {
			display: block;
			padding: 2px 20px;
			clear: both;
			font-weight: normal;
			color: #333;
			text-decoration: none;
		}

		.char_dropdown>menu>a:hover {
			color: #d85e27;
			background-color: #f5f5f5;
		}

		.char_dropdown>menu>div {
			height: 1px;
			margin: 10px 0;
			background-color: #e5e5e5;
		}

		.warning {
			font-size: 14px;
			padding: 10px 0;
			background-color: #fd7;
			text-align: center;
		}

		.warning::before {
			font-family: 'GlyphiconsRegular';
			padding-right: 4px;
			content: '\E079';
			font-size: 12px;
		}

		.warning>a {
			color: #5596e6;
		}

		table {
			width: 100%;
			max-width: 100%;
			margin-bottom: 127px;
			margin-right: auto;
			margin-left: auto;
			margin-top: 70px;
			background-color: transparent;
			border-collapse: collapse;
			border-spacing: 0;
			font-size: 14px;
		}

		@media(min-width: 768px) {
			table {
				width: 750px;
			}

			tr>:nth-child(2)>* {
				width: 350px;
			}
		}

		@media(min-width: 992px) {
			table {
				width: 970px;
			}

			tr>:nth-child(2)>* {
				width: 580px;
			}
		}

		@media (min-width: 1030px) {
			header>:nth-child(1) {
				padding-bottom: 0;
				height: 44px;
			}

			header>:nth-child(1)>:nth-child(2) {
				clear: none;
				float: right;
			}
		}

		@media(min-width: 1200px) {
			table {
				width: 1170px;
			}

			tr>:nth-child(2)>* {
				width: 780px;
			}
		}

		thead {
			font-weight: 200;
		}

		td {
			padding: 8px;
			vertical-align: middle;
			line-height: 1.42857143;
		}

		thead {
			border-bottom: 2px solid #ddd;
			border-top: 1px solid #ddd;
		}

		tbody>tr {
			border-top: 0;
			border-bottom: 1px solid #ddd;
		}

		tbody>tr:hover {
			background-color: #f5f5f5;
		}

		tr>:nth-child(1) {
			width: 64px;
		}

		tr>:nth-child(1)>img {
			height: 36px;
		}

		tr>:nth-child(1) {
			word-break: break-word;
		}

		tr>:nth-child(2) {
			color: #999;
		}

		tr>:nth-child(2)>:nth-child(1) {
			overflow: hidden;
			text-overflow: ellipsis;
		}

		tr>:nth-child(2)>:nth-child(2) {
			font-family: monospace;
		}

		tr>:nth-child(3) {
			width: 200px;
		}

		tr>:nth-child(3)>* {
			font-family: monospace;
			display: inline-block;
			text-align: center;
			font-size: 14px;
		}

		tr>:nth-child(4) {
			font-family: 'GlyphiconsRegular';
			text-decoration: none;
			padding-top: 5px;
			font-size: 14px;
			width: 80px;
		}

		tr>:nth-child(4)>a {
			display: inline-block;
			text-decoration: none;
			padding-right: 10px;
			color: #474747;
		}

		tr>:nth-child(4)>a:hover {
			color: #d85e27;
		}

		tr>:nth-child(4)>:nth-child(1)::before {
			content: '\E174';
		}

		tr>:nth-child(4)>:nth-child(2)::before {
			content: '\E235';
		}

		tr>:nth-child(4)>:nth-child(3)::before {
			content: '\E182';
		}

		tfoot>tr>td {
			text-align: center;
			border: none;
		}

		tfoot>tr>td>a {
			text-decoration: none;
			color: #474747;
			font-size: 14px;
		}

		form {
			display: none;
		}

		@font-face {
			font-family: 'Sailec';
			font-weight: 100;
			src: url('/html/Sailec-Thin.woff') format('woff');
		}

		@font-face {
			font-family: 'Sailec';
			font-weight: 200;
			src: url('/html/Sailec-Light.woff') format('woff');
		}

		@font-face {
			font-family: 'Sailec';
			font-weight: 400;
			src: url('/html/Sailec-Regular.woff') format('woff');
		}

		@font-face {
			font-family: 'Sailec';
			font-weight: 500;
			src: url('/html/Sailec-Medium.woff') format('woff');
		}

		/* font weight 500 and font weight 700 (bold) are the same for better integration support */
		@font-face {
			font-family: 'Sailec';
			font-weight: 700;
			src: url('/html/Sailec-Medium.woff') format('woff');
		}

		@font-face {
			font-family: 'GlyphiconsRegular';
			src: url('/html/glyphicons-regular.woff') format('woff');
			font-weight: normal;
			font-style: normal;
		}
	</style>
	</head>
	
	<div class="site-header">
    <div class="navbar site-nav site-nav--legacy" role="navigation">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                  </button>
                  <a class="navbar-brand" href="/html/list.html" title="Vyond">
                      <img alt="Vyond" src="https://d3v4eglovri8yt.cloudfront.net/static/add8e214e09bd155/go/img/vyond/vyond_logo_legacy.png">
                  </a>
            </div>

            <div class="collapse navbar-collapse navbar-ex1-collapse">
                <ul class="nav navbar-nav navbar-right">
<li class="dropdown">
    <a class="dropdown-toggle" href="https://support.vyond.com" data-toggle="dropdown">Help<span class="dropdown-caret"></span></a>
    <ul class="dropdown-menu dropdown-menu-help">

        <li>
            <a href="#" onclick="zE.activate({hideOnClose: true});amplitudeTrackCtaHelp('quick_search');return false;">Quick Search</a>
        </li>
        <li>
            <a href="https://support.vyond.com" onclick="amplitudeTrackCtaHelp('help_center');" target="_blank">Help Center</a>
        </li>
        <li>
            <a href="https://product.vyond.com/" onclick="amplitudeTrackCtaHelp('whats_new');" target="_blank">What’s New</a>
        </li>
    </ul>
</li>
<li>
                    <li>
                        <a class="hidden-sm hidden-md hidden-lg" href="/html/videomaker.html">Make a Video</a>
                        <span class="site-nav-btn hidden-xs"><a class="btn btn-orange" href="/html/videomaker.html">Make a Video</a></span>
                    </li>
<li class="dropdown">
    <a class="dropdown-toggle" href="https://app.vyond.com/v2/profile" data-toggle="dropdown">
        <span class="hidden-sm hidden-md hidden-lg">Your Account</span>
        <div class="site-nav__profile-image">
            <div class="badge-circle">OL</div>
        </div><span class="dropdown-caret"></span>
    </a>
    <ul class="dropdown-menu dropdown-menu-user">
        <li class="dropdown-user-profile">
            <div class="dropdown-user-profile__display-name">
                Old Vyond LVM            </div>
            <div class="dropdown-user-profile__status">
                Free trial | <a href="https://www.vyond.com/pricing">Upgrade now</a>            </div>
        </li>
        <li class="divider"></li>
        <li><a href="https://app.vyond.com/v2/profile">Profile Settings</a></li>
        <li><a href="https://app.vyond.com/v2/users/list">Users</a></li>
        <li><a href="https://app.vyond.com/v2/security">Security</a></li>
        <li><a href="https://app.vyond.com/v2/subscription">Subscription</a></li>
        <li class="divider"></li>
        <li><a href="/videos/list.html" onclick="amplitudeTrackSwitchVideoMaker('Go to Vyond Studio')">Go to Vyond Studio</a></li>
        <li class="divider"></li>
        <li><a class="gtm-logout" href="https://ga.vyond.com/logoff">Log Out</a></li>
    </ul>
</li>
<body style="margin:0px" onload="hideHeader()">${toObjectString(attrs, params)
		}</body>${stuff.pages[url.pathname] || ''}`);
	<footer class="site-footer">
    <div class="container">
        Vyond™ is a trademark of GoAnimate. Inc. ©2018 GoAnimate. Inc. <a href="https://www.vyond.com/terms">Terms of Service</a> | <a href="https://www.vyond.com/privacy">Privacy Policy</a> | <a href="https://www.vyond.com/cookies">Cookies Policy</a>
    </div>
</footer>

	return true;
}

