console.log(
    "%c FORNEND DEVTOOLS",
    "background:#1a73e8; padding: 5px; border-radius: 3px 0 0 3px; color: #fff;"
);
function getIP(callback) {
    let recode = {};
    let RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    if (!RTCPeerConnection) {
        let win = iframe.contentWindow;
        RTCPeerConnection = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection;
    }
    let pc = new RTCPeerConnection();
    function handleCandidate(candidate) {
        let ip_regexp = /([0-9]{1,3}(\.[0-9]{1,3}){3}|([a-f0-9]{1,4}((:[a-f0-9]{1,4}){7}|:+[a-f0-9]{1,4}){6}))/;
        let ip_isMatch = candidate.match(ip_regexp)[1];
        if (!recode[ip_isMatch]) {
            callback(ip_isMatch);
            recode[ip_isMatch] = true;
        }
    }

    pc.onicecandidate = (ice) => {
        if (ice.candidate) {
            handleCandidate(ice.candidate.candidate);
        }
    };
    pc.createDataChannel('');
    pc.createOffer((res) => {
        pc.setLocalDescription(res);
    }, () => { });

    setTimeout(() => {
        let lines = pc.localDescription.sdp.split('\n');
        lines.forEach(item => {
            if (item.indexOf('a=candidate:') === 0) {
                handleCandidate(item);
            }
        })
    }, 1000);
}
function injectPointEventCss() {
    const css = "* { /* fixed fullscreen mask */ pointer-events: all !important;}"
    const style = document.createElement('style');
    style.id = "codeLocate"
    style.type = "text/css"
    style.innerHTML = css;
    window.document.head.appendChild(style);
}
function removePointEventCss() {
    const styleTag = document.getElementById("codeLocate")
    if(styleTag) {
        window.document.head.removeChild(styleTag)
    }
}
// DOMContentLoaded callback
document.addEventListener("DOMContentLoaded", function () {
    window.fdt = {};
    window.fdt.notyf = new Notyf();
});
// 是否开启vscode调试
let isOpenDebugForVscode = false;
function changeCodeLocate () {
    isOpenDebugForVscode = !isOpenDebugForVscode;
    if(isOpenDebugForVscode) {
        injectPointEventCss();
    } else {
        removePointEventCss();
    }
    window.fdt.notyf.success(isOpenDebugForVscode ? chrome.i18n.getMessage("openedDebug") : chrome.i18n.getMessage("closedDebug"));
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("[FDT]:", JSON.stringify(request));
    const { type } = request;
    if (type === 'vscodebug') {
        changeCodeLocate();
    }
});
document.addEventListener('click', (ev) => {
    if (!isOpenDebugForVscode) return;
    ev.preventDefault();
    console.dir(ev, "event");
    const codePath = ev.target.getAttribute('code-location');
    if (!codePath) return;
    const codeUrl = window.origin + `/code/open?path=${codePath}`
    fetch(codeUrl)
}, true)
// shocut
document.onkeydown = shortCut;
function shortCut(e) {
    e = e || window.event;
    if (e.ctrlKey && e.keyCode == 81) {
        changeCodeLocate();
        return false;
    }
}