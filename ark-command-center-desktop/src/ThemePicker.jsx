import React from 'react';
import {Check} from 'lucide-react';
import './themes.css';

export const themes=[
 {id:'emerald',label:'Original Emerald',main:'#55d9a8',dark:'#09120f',backdrop:'#163a2d',field:'#0b1c17'},
 {id:'red',label:'Black & Red',main:'#ff5766',dark:'#16080d',backdrop:'#491321',field:'#2c0d17'},
 {id:'purple',label:'Deep Purple & Black',main:'#bd83ff',dark:'#13091f',backdrop:'#3a175e',field:'#251038'},
 {id:'orange',label:'Ember Orange',main:'#ffa24a',dark:'#211006',backdrop:'#5b2a0b',field:'#351908'},
 {id:'pink',label:'Neon Pink',main:'#ff84c9',dark:'#1f0a19',backdrop:'#651c4b',field:'#39132b'},
 {id:'gold',label:'Royal Gold',main:'#ebc46d',dark:'#211807',backdrop:'#594015',field:'#38290d'}
];
export default function ThemePicker({value,onChange}){
 return <section className="panel knockout-panel"><div className="panelhead"><h2>Command Center Themes</h2><span className="badge gold">PERSISTENT PER PC</span></div><div className="theme-grid">{themes.map(theme=><button key={theme.id} className={`theme-option ${theme.id===value?'active':''}`} onClick={()=>onChange(theme.id)}><span className="theme-swatch" style={{background:`radial-gradient(ellipse at top right,${theme.backdrop},${theme.dark} 75%)`,borderColor:theme.main}}><span className="theme-preview-field" style={{background:theme.field,borderColor:theme.main}}/><i style={{background:theme.main}}/>{theme.id===value&&<Check size={23} color={theme.main}/>}</span><strong>{theme.label}</strong><small>{theme.id===value?'ACTIVE THEME':'CLICK TO APPLY'}</small></button>)}</div><div className="notice">Theme previews now show the backdrop and text-field color. Every selection recolors the app background, sidebar, panels, buttons, text fields, and map controls. Saved per computer.</div></section>;
}
