import React from 'react';
import {Check} from 'lucide-react';
import './themes.css';

export const themes=[
 {id:'emerald',label:'Original Emerald',main:'#55d9a8',dark:'#09120f',backdrop:'#163a2d',field:'#0b1c17'},
 {id:'red',label:'Black & Red',main:'#ff5766',dark:'#16080d',backdrop:'#491321',field:'#2c0d17'},
 {id:'purple',label:'Deep Purple & Black',main:'#bd83ff',dark:'#13091f',backdrop:'#3a175e',field:'#251038'},
 {id:'orange',label:'Ember Orange',main:'#ffa24a',dark:'#211006',backdrop:'#5b2a0b',field:'#351908'},
 {id:'pink',label:'Neon Pink',main:'#ff84c9',dark:'#1f0a19',backdrop:'#651c4b',field:'#39132b'},
 {id:'gold',label:'Royal Gold',main:'#ebc46d',dark:'#211807',backdrop:'#594015',field:'#38290d'},
 {id:'sapphire',label:'Sapphire Blue',main:'#5b9dff',dark:'#070e25',backdrop:'#183e80',field:'#10264b'},
 {id:'cyan',label:'Cyber Cyan',main:'#42e9f1',dark:'#06181c',backdrop:'#115963',field:'#0c3139'},
 {id:'lime',label:'Radioactive Lime',main:'#c4f04f',dark:'#101808',backdrop:'#3c6016',field:'#1e3010'},
 {id:'silver',label:'Frost Silver',main:'#bacce6',dark:'#111923',backdrop:'#364c66',field:'#243449'},
 {id:'rainbow',label:'Rainbow Spectrum',main:'#ffa6d7',dark:'#150d34',backdrop:'#6632aa',field:'#35205b',stripe:'linear-gradient(90deg,#ff7196,#ffcf63,#7ce99e,#62baff,#c08dff)'},
 {id:'monochrome',label:'Black & White',main:'#ffffff',dark:'#000000',backdrop:'#4a4a4a',field:'#f0f0f0'},
 {id:'indigo',label:'Midnight Indigo',main:'#a4a8ff',dark:'#090c22',backdrop:'#313b93',field:'#1e2754'},
 {id:'sunset',label:'Sunset Coral',main:'#ff9c8c',dark:'#24101d',backdrop:'#914060',field:'#492138'},
 {id:'mocha',label:'Mocha Cream',main:'#eac49d',dark:'#1c1512',backdrop:'#634638',field:'#423024'}
];
export default function ThemePicker({value,onChange}){
 return <section className="panel knockout-panel"><div className="panelhead"><h2>Command Center Themes</h2><span className="badge gold">{themes.length} COMPLETE THEMES</span></div><div className="theme-grid">{themes.map(theme=><button key={theme.id} className={`theme-option ${theme.id===value?'active':''}`} aria-pressed={theme.id===value} onClick={()=>onChange(theme.id)}><span className="theme-swatch" style={{background:theme.stripe?`conic-gradient(from 30deg,#fa70a2,#f8c45c,#80e8b6,#73bfff,#b28fff,#fa70a2)`:`radial-gradient(ellipse at top right,${theme.backdrop},${theme.dark} 75%)`,borderColor:theme.main}}><span className="theme-preview-field" style={{background:theme.field,borderColor:theme.main}}/><i style={{background:theme.stripe||theme.main}}/>{theme.id===value&&<Check size={23} color={theme.main}/>}</span><strong>{theme.label}</strong><small>{theme.id===value?'ACTIVE THEME':'CLICK TO APPLY'}</small></button>)}</div><div className="notice">All 15 themes recolor the full backdrop, sidebar, panels, buttons, text fields, and map controls. Your choice is saved with your personal preferences.</div></section>;
}
