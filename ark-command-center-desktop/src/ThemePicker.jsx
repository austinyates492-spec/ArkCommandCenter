import React from 'react';
import {Check} from 'lucide-react';
import './themes.css';

export const themes=[
 {id:'emerald',label:'Original Emerald',main:'#55d9a8',dark:'#0e2e28'},
 {id:'red',label:'Black & Red',main:'#ff5766',dark:'#330f1b'},
 {id:'purple',label:'Deep Purple & Black',main:'#bd83ff',dark:'#251035'},
 {id:'orange',label:'Ember Orange',main:'#ffa24a',dark:'#36200e'},
 {id:'pink',label:'Neon Pink',main:'#ff84c9',dark:'#351528'},
 {id:'gold',label:'Royal Gold',main:'#ebc46d',dark:'#332910'}
];
export default function ThemePicker({value,onChange}){
 return <section className="panel knockout-panel"><div className="panelhead"><h2>Command Center Themes</h2><span className="badge gold">PERSISTENT PER PC</span></div><div className="theme-grid">{themes.map(theme=><button key={theme.id} className={`theme-option ${theme.id===value?'active':''}`} onClick={()=>onChange(theme.id)}><span className="theme-swatch" style={{background:`linear-gradient(130deg,${theme.dark},#090d12 70%)`,borderColor:theme.main}}><i style={{background:theme.main}}/>{theme.id===value&&<Check size={23} color={theme.main}/>}</span><strong>{theme.label}</strong><small>{theme.id===value?'ACTIVE THEME':'CLICK TO APPLY'}</small></button>)}</div><div className="notice">Each tribe member can choose their own theme. This setting is saved on the current PC and doesn't change other installations.</div></section>;
}
