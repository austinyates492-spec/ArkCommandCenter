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
 {id:'mocha',label:'Mocha Cream',main:'#eac49d',dark:'#1c1512',backdrop:'#634638',field:'#423024'},
 {id:'jade',label:'Imperial Jade',main:'#6af4c0',dark:'#061b16',backdrop:'#0e6556',field:'#0d3a31'},
 {id:'ruby',label:'Royal Ruby',main:'#ff8491',dark:'#24070d',backdrop:'#820e30',field:'#470c1d'},
 {id:'violet',label:'Electric Violet',main:'#e5a0ff',dark:'#17051f',backdrop:'#6e1f91',field:'#3c1652'},
 {id:'teal',label:'Deep Sea Teal',main:'#79e7d2',dark:'#061a1c',backdrop:'#136f76',field:'#13454c'},
 {id:'bronze',label:'Antique Bronze',main:'#f2af64',dark:'#1c1009',backdrop:'#785029',field:'#482b18'},
 {id:'ice',label:'Arctic Ice',main:'#c0f9ff',dark:'#071a28',backdrop:'#397591',field:'#22465a'},
 {id:'crimson',label:'Crimson Night',main:'#ff425f',dark:'#21070f',backdrop:'#5d122c',field:'#310c1d'},
 {id:'lavender',label:'Pastel Lavender',main:'#dfc0ff',dark:'#1d142e',backdrop:'#685188',field:'#42345f'},
 {id:'forest',label:'Ancient Forest',main:'#a6e574',dark:'#0e1b0b',backdrop:'#34612b',field:'#203a1a'},
 {id:'ocean',label:'Ocean Depths',main:'#4fb6ff',dark:'#061322',backdrop:'#165182',field:'#0c2f53'}
];
export default function ThemePicker({value,onChange}){
 return <section className="panel knockout-panel"><div className="panelhead"><h2>Command Center Themes</h2><span className="badge gold">{themes.length} COMPLETE THEMES</span></div><div className="theme-grid">{themes.map(theme=><button key={theme.id} className={`theme-option ${theme.id===value?'active':''}`} aria-pressed={theme.id===value} onClick={()=>onChange(theme.id)}><span className="theme-swatch" style={{background:theme.stripe?`conic-gradient(from 30deg,#fa70a2,#f8c45c,#80e8b6,#73bfff,#b28fff,#fa70a2)`:`radial-gradient(ellipse at top right,${theme.backdrop},${theme.dark} 75%)`,borderColor:theme.main}}><span className="theme-preview-field" style={{background:theme.field,borderColor:theme.main}}/><i style={{background:theme.stripe||theme.main}}/>{theme.id===value&&<Check size={23} color={theme.main}/>}</span><strong>{theme.label}</strong><small>{theme.id===value?'ACTIVE THEME':'CLICK TO APPLY'}</small></button>)}</div><div className="notice">All {themes.length} themes recolor the full backdrop, sidebar, panels, buttons, text fields, and map controls. Your choice is saved with your personal preferences.</div></section>;
}
