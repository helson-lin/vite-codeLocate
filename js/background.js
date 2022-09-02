// 获取当前选项卡ID
function getCurrentTabId(callback) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		if (callback) callback(tabs.length ? tabs[0].id : null);
	});
}
function sendMessageToContentScript(message, callback) {
	getCurrentTabId((tabId) => {
		chrome.tabs.sendMessage(tabId, message, function (response) {
			if (callback) callback(response);
		});
	});
}

chrome.contextMenus.create({
	title: chrome.i18n.getMessage("vscodebug"),
	contexts: ["all"],
	onclick: function (info) {
		sendMessageToContentScript({ type: "vscodebug" }, () => {});
	},
});