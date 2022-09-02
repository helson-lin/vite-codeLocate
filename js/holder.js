console.log(
	"%c FORNEND DEVTOOLS",
	"background:#1a73e8; padding: 5px; border-radius: 3px 0 0 3px; color: #fff;"
);
document.addEventListener("DOMContentLoaded", function () {
	window.fdt = {};
	window.fdt.notyf = new Notyf();
});
// 是否开启vscode调试
let isOpenDebugForVscode = false;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log("[FDT]:", JSON.stringify(request));
    const {type} = request;
    if(type === 'vscodebug') {
        isOpenDebugForVscode = !isOpenDebugForVscode;
        fdt.notyf.success(isOpenDebugForVscode ?  chrome.i18n.getMessage("openedDebug") :  chrome.i18n.getMessage("closedDebug"));
    }
});
document.addEventListener('click', (ev) => {
    if(!isOpenDebugForVscode) return;
    ev.preventDefault();
    const codePath = ev.target.getAttribute('code-location');
    if(!codePath) return;
    const codeUrl = window.origin + `/code/open?path=${codePath}`
    fetch(codeUrl)
}, true)