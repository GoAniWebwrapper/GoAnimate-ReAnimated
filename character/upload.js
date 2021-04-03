const formidable = require("formidable");
const fUtil = require("../misc/file");
const parse = require("./parse");
const http = require("http");
const fs = require("fs");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "POST" || url.path != "/upload_character") return;
	new formidable.IncomingForm().parse(req, (e, f, files) => {
		if (!files.import) return;
		var path = files.import.path;
		var buffer = fs.readFileSync(path);
		var numId = fUtil.getNextFileId("original_asset-", ".xml");
		parse.unpackXml(buffer, `m-${numId}`);
		fs.unlinkSync(path);

		res.statusCode = 302;
		var url = `/charactercreator?original_asset_id=m-${numId}`;
		res.setHeader("Location", url);
		res.end();
	});
	return true;
};
