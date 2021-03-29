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
				clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
				userId: "0TBAAga2Mn6g","username":"T Series 2019","uemail":"epictubehelp@gmail.com",	
				isEmbed: 0,"nextUrl":"/html/list.html",
				bgload: process.env.SWF_URL + "/go_full.swf","lid":"11","ctc":"go","themeColor":"silver",
				tlang: "en_US","siteId":"13","templateshow":"false","forceshow":"false","appCode":"go","lang":"en","tmcc":4048901,
				fb_app_url: "/","is_published":"0","is_private_shared":"1","is_password_protected":false,"upl":1,"hb":"1","pts":"1","msg_index":"",
				ad: 0,"has_asset_bg":0,"has_asset_char":0,"initcb":"studioLoaded","retut":0,"featured_categories":null,
				st: "","uisa":0,"u_info":"OjI6SVkxU3FJV1BablhsMlVVeWdNelJfQTBkYTZqYWFEU0ZiMHZSRERoU0Z3TitzUUs0ZmZ1Y3FvVklsMDJFbTZWSWRtSXh5dUJRU0VQU0puVk12MlVSWFlaQkJ3OVpSQVU4R3FYeFRY",
				free_trial: 1,"tm":"FIN","tray":"custom","isWide":1,"newusr":1,"goteam_draft_only":0},
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
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	Object.assign(params.flashvars, query);
	res.end(
		`<script>document.title='${title}',flashvars=${JSON.stringify(
			params.flashvars
		)}</script><body style="margin:0px">${toObjectString(attrs, params)}</body>${stuff.pages[url.pathname] || ""}`
	);
	return true;
};
