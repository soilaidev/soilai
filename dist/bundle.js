"use strict";var t="soil-ai-form-container";function o(t,o,n){void 0===n&&(n={});var e=document.createElement(t);return Object.assign(e.style,o),Object.assign(e,n),e}var n="http://localhost:".concat(4444,"/");var e='<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-5.0 -10.0 110 110" width="28px" height="28px">\n  <path d="m92.918 56.398c5.2773-2.6367 5.2773-10.16 0-12.797l-79.418-39.699c-5.6602-2.8281-11.934 2.5312-10.027 8.5586l10.902 34.414h35.625c1.7266 0 3.125 1.3984 3.125 3.125s-1.3984 3.125-3.125 3.125h-35.625l-10.902 34.414c-1.9062 6.0273 4.3672 11.387 10.027 8.5586z" />\n</svg>';function r(t,n){void 0===n&&(n=!1);var e=o("div",{position:"fixed",bottom:"20px",left:"50%",transform:"translateX(-50%)",backgroundColor:n?"#ff3333":"#333",color:"#fff",padding:"10px 20px",borderRadius:"5px",boxShadow:"0 0 10px rgba(0, 0, 0, 0.5)",opacity:"0",transition:"opacity 0.5s, bottom 0.5s",width:"fit-content",maxWidth:"100%",zIndex:"999"},{textContent:t});document.body.appendChild(e),setTimeout((function(){e.style.opacity="1",e.style.bottom="30px"}),10),setTimeout((function(){e.style.opacity="0",e.style.bottom="20px",setTimeout((function(){e.remove()}),500)}),3e3)}function i(i,c,s,a){var d,l,p=function(t){var o={border:t.style.border,boxShadow:t.style.boxShadow,transform:t.style.transform,transition:t.style.transition};return t.style.transition="box-shadow 0.2s ease",t.style.boxShadow="inset 0 2px 5px rgba(0, 0, 0, 0.6), inset 0 -2px 5px rgba(255, 255, 255, 0.6)",function(){t.style.border=o.border,t.style.boxShadow=o.boxShadow,t.style.transform=o.transform,t.style.transition=o.transition}}(i),u=o("input",{color:"#333",boxSizing:"content-box",padding:"7px",border:"1px solid #ccc",borderRadius:"3px",marginRight:"3px",height:"19px",flex:"1"},{type:"text",autofocus:!0,placeholder:"Describe your change..."}),x=o("button",{boxSizing:"content-box",padding:"2px 0px 4px 0px"},{type:"submit",innerHTML:e}),f=i.getBoundingClientRect(),h=document.body.getBoundingClientRect(),b=f.top-h.top,m=h.bottom-f.bottom,g=f.left-h.left,w=h.right-f.right;m>30?(d="".concat(f.bottom+window.scrollY,"px"),l="".concat(f.left+window.scrollX,"px")):b>30?(d="".concat(f.top-30+window.scrollY,"px"),l="".concat(f.left+window.scrollX,"px")):w>150?(d="".concat(f.top+window.scrollY,"px"),l="".concat(f.right+10+window.scrollX,"px")):g>150?(d="".concat(f.top+window.scrollY,"px"),l="".concat(f.left-150+window.scrollX,"px")):(d="".concat(f.bottom+window.scrollY,"px"),l="".concat(f.left+window.scrollX,"px"));var v=o("div",{position:"absolute",zIndex:"999",backgroundColor:"#fff",padding:"5px",borderRadius:"5px",margin:"5px",border:"1px solid #ccc",boxShadow:"0px 5px 5px rgba(0, 0, 0, 0.4)",width:"300px",maxWidth:"100%",top:d,left:l},{id:t}),y=o("div",{position:"absolute",zIndex:"998",top:"0px",right:"0px",bottom:"0px",left:"0px"});function S(){p(),v.remove(),y.remove()}y.onclick=S;var C=o("form",{display:"flex"},{onsubmit:function(t){var o;t.preventDefault(),(o={soilId:c,message:u.value,env:s},fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then((function(t){if(!t.ok)throw Error("Server responded with status ".concat(t.status));return t.json()})).catch((function(t){return console.error("Error posting to server:",t),null}))).then((function(){return r("Harvest time!")})).catch((function(t){return r(t.message)})),setTimeout((function(){S(),r("Planting in rich soil...")}),500)}});return C.appendChild(u),C.appendChild(x),v.appendChild(C),document.body.appendChild(y),document.body.appendChild(v),setTimeout((function(){return u.focus()})),S}function c(o){function e(n){if(!document.getElementById(t)){var e=n.target.closest("[data-soil-id]");if(e){var r=e.getAttribute("data-soil-id");r&&i(e,r,o)}}}return fetch(n,{method:"GET"}).then((function(t){if(!t.ok)throw new Error("Server responded with status ".concat(t.status));return!0})).catch((function(t){return console.error("Error posting to server:",t),!1})).then((function(t){if(!t)return r("Soil AI server is not running",!0);document.addEventListener("click",e)})),function(){document.removeEventListener("click",e)}}document.addEventListener("DOMContentLoaded",(function(){return c("js")}));
//# sourceMappingURL=bundle.js.map
