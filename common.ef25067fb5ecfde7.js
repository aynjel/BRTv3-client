"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[592],{3234:(E,u,t)=>{t.d(u,{Z:()=>g});var h=t(8645),c=t(8504),v=t(5177),e=t(6306),a=t(553),i=t(9422),m=t(6317),l=t(105),d=t(6689),P=t(360);let g=(()=>{class n{constructor(r){this.router=r,this.eventSource=new EventSource(""),this.responseSubject=new h.x}connect(r,s){const f=(0,m.Z)();if(!f)return(0,c._)(()=>new Error("No Merchant selected!"));const D={...s,auth:l.t.get("auth"),merchantID:f.merchantID};return this.eventSource=new EventSource(a.Z.apiUrl+r+(n=>{if(!n||!Object.keys(n).length)return"";const j=Object.entries(n);return"?"+(a.Z.production?"data="+(0,i.Eo)(n):j.map(s=>s[0]+"="+s[1]).join("&"))})(D)),this.eventSource.onmessage=o=>{this.responseSubject.next((0,i.nN)(o.data))},this.responseSubject.asObservable().pipe((0,v.g)(500),(0,e.K)(o=>(o.status&&401===o.status&&(l.t.remove("auth"),this.router.navigate(["/unauthorized"])),(0,c._)(()=>o))))}disconnect(){this.eventSource&&this.eventSource.close()}static#t=this.\u0275fac=function(s){return new(s||n)(d.LFG(P.F0))};static#n=this.\u0275prov=d.Yz7({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})()},1687:(E,u,t)=>{t.d(u,{F:()=>v});var h=t(4352),c=t(4825);function v(e=0,a=h.z){return e<0&&(e=0),(0,c.H)(e,e,a)}}}]);