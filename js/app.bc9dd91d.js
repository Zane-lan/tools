(function(){"use strict";var e={6517:function(e,t,n){var r=n(5130),a=n(6768);const s={class:"app"},o={class:"sidebar"},u={class:"content"};function i(e,t,n,r,i,l){const c=(0,a.g2)("TreeMenu"),p=(0,a.g2)("router-view");return(0,a.uX)(),(0,a.CE)("div",s,[(0,a.Lk)("div",o,[t[1]||(t[1]=(0,a.Lk)("h2",{class:"sidebar-title"},"工具菜单",-1)),(0,a.bF)(c,{"menu-data":i.menuData,searchQuery:i.searchQuery,"onUpdate:searchQuery":t[0]||(t[0]=e=>i.searchQuery=e),onItemSelected:l.handleItemSelected},null,8,["menu-data","searchQuery","onItemSelected"])]),(0,a.Lk)("div",u,[(0,a.bF)(p)])])}var l=n(4232);const c={class:"tree-menu-container"},p=["value"],d={class:"tree-menu"},m=["onClick"],h=["innerHTML"],v={key:0,class:"arrow"};function f(e,t,n,r,s,o){const u=(0,a.g2)("TreeMenu",!0);return(0,a.uX)(),(0,a.CE)("div",c,[n.isRoot?((0,a.uX)(),(0,a.CE)("input",{key:0,value:n.searchQuery,onInput:t[0]||(t[0]=(...e)=>o.onInput&&o.onInput(...e)),placeholder:"🔍 搜索工具...",class:"search-input"},null,40,p)):(0,a.Q3)("",!0),(0,a.Lk)("ul",d,[((0,a.uX)(!0),(0,a.CE)(a.FK,null,(0,a.pI)(o.filteredMenu,(r=>((0,a.uX)(),(0,a.CE)("li",{key:r.name},[(0,a.Lk)("div",{onClick:e=>o.handleItemClick(r),class:"menu-item"},[(0,a.Lk)("span",{innerHTML:o.highlightMatch(r.name)},null,8,h),r.children?((0,a.uX)(),(0,a.CE)("span",v,(0,l.v_)(r.isOpen?"▼":"▶"),1)):(0,a.Q3)("",!0)],8,m),r.children&&r.isOpen?((0,a.uX)(),(0,a.Wv)(u,{key:0,"menu-data":r.children,"search-query":n.searchQuery,"is-root":!1,"onUpdate:searchQuery":t[1]||(t[1]=t=>e.$emit("update:searchQuery",t)),onItemSelected:o.handleItemSelected},null,8,["menu-data","search-query","onItemSelected"])):(0,a.Q3)("",!0)])))),128))])])}n(4114),n(8111),n(2489),n(1701);var k={name:"TreeMenu",props:{menuData:{type:Array,required:!0},searchQuery:{type:String,default:""},isRoot:{type:Boolean,default:!0}},computed:{filteredMenu(){const e=this.searchQuery.toLowerCase();if(!e)return this.menuData;const t=n=>n.map((e=>{const n={...e};return n.children&&(n.children=t(n.children),n.children.length>0&&(n.isOpen=!0)),n})).filter((t=>t.name.toLowerCase().includes(e)||t.children&&t.children.length>0));return t(this.menuData)}},methods:{handleItemClick(e){e.children?e.isOpen=!e.isOpen:(this.$emit("item-selected",e),this.$router.push(e.path))},highlightMatch(e){const t=this.searchQuery.toLowerCase();if(!t)return e;const n=new RegExp(`(${t})`,"gi");return e.replace(n,'<span class="highlight">$1</span>')},onInput(e){this.$emit("update:searchQuery",e.target.value)},handleItemSelected(e){this.$emit("item-selected",e)}}},g=n(1241);const y=(0,g.A)(k,[["render",f],["__scopeId","data-v-1eb8444a"]]);var T=y,L={components:{TreeMenu:T},data(){return{searchQuery:"",menuData:[{name:"时间戳转换",path:"/timeTools"},{name:"JSON格式化",path:"/parseJson"},{name:"更多",isOpen:!1,children:[{name:"Profile",path:"/profile"},{name:"Security",path:"/security"}]}]}},methods:{handleItemSelected(e){this.searchQuery="",this.expandParentMenu(e)},expandParentMenu(e){const t=(e,n)=>{for(const r of e){if(r.children&&r.children.includes(n))return void(r.isOpen=!0);r.children&&t(r.children,n)}};t(this.menuData,e)}}};const b=(0,g.A)(L,[["render",i],["__scopeId","data-v-b4cfcd60"]]);var S=b,I=n(973);const C={class:"page"};function O(e,t){return(0,a.uX)(),(0,a.CE)("div",C,t[0]||(t[0]=[(0,a.Lk)("h1",null,"Home Page",-1),(0,a.Lk)("p",null,"Welcome to the home page!",-1)]))}const J={},M=(0,g.A)(J,[["render",O],["__scopeId","data-v-540d2474"]]);var Q=M;const _={class:"unix-timestamp"},E={class:"container"},w={class:"section"},X={class:"timestamp"},N={class:"section"},D={class:"input-group"},$={key:0,class:"result"},j={class:"section"},x={class:"input-group"},R={key:0,class:"result"};function K(e,t,n,s,o,u){return(0,a.uX)(),(0,a.CE)("div",_,[(0,a.Lk)("div",E,[(0,a.Lk)("div",w,[t[7]||(t[7]=(0,a.Lk)("h2",null,"当前 Unix 时间戳",-1)),(0,a.Lk)("p",X,(0,l.v_)(s.timestamp),1),(0,a.Lk)("button",{onClick:t[0]||(t[0]=e=>s.copyTimestamp(s.timestamp))},"复制时间戳")]),(0,a.Lk)("div",N,[t[8]||(t[8]=(0,a.Lk)("h2",null,"时间转时间戳",-1)),(0,a.Lk)("div",D,[(0,a.bo)((0,a.Lk)("input",{"onUpdate:modelValue":t[1]||(t[1]=e=>s.timeInput=e),placeholder:"YYYY-MM-DD HH:mm:ss",class:"input"},null,512),[[r.Jo,s.timeInput]]),(0,a.Lk)("button",{onClick:t[2]||(t[2]=(...e)=>s.convertTimeToTimestamp&&s.convertTimeToTimestamp(...e))},"转换")]),s.convertedTimestamp?((0,a.uX)(),(0,a.CE)("p",$,[(0,a.eW)(" 时间戳："+(0,l.v_)(s.convertedTimestamp)+" ",1),(0,a.Lk)("button",{onClick:t[3]||(t[3]=e=>s.copyTimestamp(s.convertedTimestamp))},"复制")])):(0,a.Q3)("",!0)]),(0,a.Lk)("div",j,[t[9]||(t[9]=(0,a.Lk)("h2",null,"时间戳转时间",-1)),(0,a.Lk)("div",x,[(0,a.bo)((0,a.Lk)("input",{"onUpdate:modelValue":t[4]||(t[4]=e=>s.timestampInput=e),placeholder:"输入时间戳（毫秒）",class:"input"},null,512),[[r.Jo,s.timestampInput]]),(0,a.Lk)("button",{onClick:t[5]||(t[5]=(...e)=>s.convertTimestampToTime&&s.convertTimestampToTime(...e))},"转换")]),s.convertedTime?((0,a.uX)(),(0,a.CE)("p",R,[(0,a.eW)(" 时间："+(0,l.v_)(s.convertedTime)+" ",1),(0,a.Lk)("button",{onClick:t[6]||(t[6]=e=>s.copyTimestamp(s.convertedTime))},"复制")])):(0,a.Q3)("",!0)])])])}var P=n(144),A={name:"TimeTools",setup(){const e=(0,P.KR)(Date.now()),t=(0,P.KR)(""),n=(0,P.KR)(""),r=(0,P.KR)(null),s=(0,P.KR)(null);let o=null;const u=()=>{e.value=Date.now()};(0,a.sV)((()=>{o=setInterval(u,100)})),(0,a.hi)((()=>{o&&clearInterval(o)}));const i=e=>{navigator.clipboard.writeText(e.toString()).then((()=>alert("已复制到剪贴板！"))).catch((e=>console.error("复制失败：",e)))},l=()=>{const e=new Date(t.value);isNaN(e.getTime())?alert("请输入正确的时间格式（YYYY-MM-DD HH:mm:ss）"):r.value=e.getTime()},c=()=>{const e=parseInt(n.value,10);if(isNaN(e))return void alert("请输入正确的时间戳（毫秒）");const t=new Date(e);s.value=p(t)},p=e=>{const t=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0"),a=String(e.getHours()).padStart(2,"0"),s=String(e.getMinutes()).padStart(2,"0"),o=String(e.getSeconds()).padStart(2,"0");return`${t}-${n}-${r} ${a}:${s}:${o}`};return{timestamp:e,timeInput:t,timestampInput:n,convertedTimestamp:r,convertedTime:s,copyTimestamp:i,convertTimeToTimestamp:l,convertTimestampToTime:c}}};const Y=(0,g.A)(A,[["render",K],["__scopeId","data-v-3bcabbd5"]]);var H=Y;const F={class:"json-formatter"},U={class:"input-area"},V={key:0,class:"error-message"},W={class:"button-group"},q={class:"output-area"},B={key:0,class:"json-output"},z={key:1,class:"placeholder"};function G(e,t,n,s,o,u){const i=(0,a.g2)("json-pretty");return(0,a.uX)(),(0,a.CE)("div",F,[(0,a.Lk)("div",U,[t[3]||(t[3]=(0,a.Lk)("h2",null,"JSON 输入",-1)),(0,a.bo)((0,a.Lk)("textarea",{"onUpdate:modelValue":t[0]||(t[0]=e=>s.jsonInput=e),placeholder:"请输入 JSON 字符串",class:(0,l.C4)(["json-input",{error:s.errorMessage}])},null,2),[[r.Jo,s.jsonInput]]),s.errorMessage?((0,a.uX)(),(0,a.CE)("p",V,(0,l.v_)(s.errorMessage),1)):(0,a.Q3)("",!0),(0,a.Lk)("div",W,[(0,a.Lk)("button",{onClick:t[1]||(t[1]=(...e)=>s.formatJson&&s.formatJson(...e))},"格式化 JSON"),(0,a.Lk)("button",{onClick:t[2]||(t[2]=(...e)=>s.compressJson&&s.compressJson(...e)),class:"compress-btn"},"压缩 JSON")])]),(0,a.Lk)("div",q,[t[4]||(t[4]=(0,a.Lk)("h2",null,"格式化 / 压缩结果",-1)),s.formattedJson?((0,a.uX)(),(0,a.CE)("div",B,[(0,a.bF)(i,{data:s.parsedJson,deep:3},null,8,["data"])])):((0,a.uX)(),(0,a.CE)("p",z,"格式化或压缩后的 JSON 将在此显示"))])])}var Z=n(3074),ee={name:"JsonFormatter",components:{JsonPretty:Z.A},setup(){const e=(0,P.KR)(""),t=(0,P.KR)(""),n=(0,P.KR)(null),r=(0,P.KR)(""),a=()=>{try{n.value=JSON.parse(e.value),t.value=JSON.stringify(n.value,null,2),r.value="",e.value=t.value}catch(a){r.value=`❌ JSON 格式错误：${a.message}`,t.value="",n.value=null}},s=()=>{try{n.value=JSON.parse(e.value),t.value=JSON.stringify(n.value),r.value="",e.value=t.value}catch(a){r.value=`❌ JSON 格式错误：${a.message}`,t.value="",n.value=null}};return{jsonInput:e,formattedJson:t,parsedJson:n,errorMessage:r,formatJson:a,compressJson:s}}};const te=(0,g.A)(ee,[["render",G],["__scopeId","data-v-7a557425"]]);var ne=te;const re={class:"page"};function ae(e,t){return(0,a.uX)(),(0,a.CE)("div",re,t[0]||(t[0]=[(0,a.Lk)("h1",null,"Profile Page",-1),(0,a.Lk)("p",null,"This is the profile page.",-1)]))}const se={},oe=(0,g.A)(se,[["render",ae],["__scopeId","data-v-482e5283"]]);var ue=oe;const ie={class:"page"};function le(e,t){return(0,a.uX)(),(0,a.CE)("div",ie,t[0]||(t[0]=[(0,a.Lk)("h1",null,"Security Page",-1),(0,a.Lk)("p",null,"This is the security page.",-1)]))}const ce={},pe=(0,g.A)(ce,[["render",le],["__scopeId","data-v-37820b58"]]);var de=pe;const me=[{path:"/",component:Q},{path:"/timeTools",component:H},{path:"/parseJson",component:ne},{path:"/profile",component:ue},{path:"/security",component:de}],he=(0,I.aE)({history:(0,I.Bt)(),routes:me});var ve=he;(0,r.Ef)(S).use(ve).mount("#app")}},t={};function n(r){var a=t[r];if(void 0!==a)return a.exports;var s=t[r]={exports:{}};return e[r].call(s.exports,s,s.exports,n),s.exports}n.m=e,function(){var e=[];n.O=function(t,r,a,s){if(!r){var o=1/0;for(c=0;c<e.length;c++){r=e[c][0],a=e[c][1],s=e[c][2];for(var u=!0,i=0;i<r.length;i++)(!1&s||o>=s)&&Object.keys(n.O).every((function(e){return n.O[e](r[i])}))?r.splice(i--,1):(u=!1,s<o&&(o=s));if(u){e.splice(c--,1);var l=a();void 0!==l&&(t=l)}}return t}s=s||0;for(var c=e.length;c>0&&e[c-1][2]>s;c--)e[c]=e[c-1];e[c]=[r,a,s]}}(),function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){n.d=function(e,t){for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){var e={524:0};n.O.j=function(t){return 0===e[t]};var t=function(t,r){var a,s,o=r[0],u=r[1],i=r[2],l=0;if(o.some((function(t){return 0!==e[t]}))){for(a in u)n.o(u,a)&&(n.m[a]=u[a]);if(i)var c=i(n)}for(t&&t(r);l<o.length;l++)s=o[l],n.o(e,s)&&e[s]&&e[s][0](),e[s]=0;return n.O(c)},r=self["webpackChunktools"]=self["webpackChunktools"]||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))}();var r=n.O(void 0,[504],(function(){return n(6517)}));r=n.O(r)})();
//# sourceMappingURL=app.bc9dd91d.js.map