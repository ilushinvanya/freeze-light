import{k as p,i as s,t,u as f,J as h,c,h as g,g as m,R as y,L as _,M as v,N as i,f as x,P as C,V as P}from"./index.4eda85ef.js";import{h as Q}from"./render.c882f68c.js";import{_ as $}from"./plugin-vue_export-helper.21dcd24c.js";var k=p({name:"QPage",props:{padding:Boolean,styleFn:Function},setup(o,{slots:r}){const{proxy:{$q:n}}=m(),e=s(f,t);if(e===t)return console.error("QPage needs to be a deep child of QLayout"),t;if(s(h,t)===t)return console.error("QPage needs to be child of QPageContainer"),t;const l=c(()=>{const a=(e.header.space===!0?e.header.size:0)+(e.footer.space===!0?e.footer.size:0);if(typeof o.styleFn=="function"){const d=e.isContainer.value===!0?e.containerHeight.value:n.screen.height;return o.styleFn(a,d)}return{minHeight:e.isContainer.value===!0?e.containerHeight.value-a+"px":n.screen.height===0?a!==0?`calc(100vh - ${a}px)`:"100vh":n.screen.height-a+"px"}}),u=c(()=>`q-page${o.padding===!0?" q-layout-padding":""}`);return()=>g("main",{class:u.value,style:l.value},Q(r.default))}});const F={},B=P("p",null,"\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435",-1);function N(o,r){const n=y("router-link");return _(),v(k,{class:"row items-center justify-evenly"},{default:i(()=>[B,x(n,{to:"main"},{default:i(()=>[C("START")]),_:1})]),_:1})}var T=$(F,[["render",N]]);export{T as default};
