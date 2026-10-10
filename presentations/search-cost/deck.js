'use strict';
const slides=[...document.querySelectorAll('.slide')];
const notes=JSON.parse(document.getElementById('notes-data').textContent);
const previous=document.getElementById('prev'), next=document.getElementById('next'), jump=document.getElementById('jump');
const notePanel=document.getElementById('notes'), noteButton=document.getElementById('notes-toggle');
let current=0;
function show(index,updateHash=true){
 current=Math.min(slides.length-1,Math.max(0,index));
 slides.forEach((slide,i)=>{slide.classList.toggle('active',i===current);slide.hidden=i!==current;});
 previous.disabled=current===0;next.disabled=current===slides.length-1;jump.value=String(current);
 document.getElementById('counter').textContent=`${current+1} / ${slides.length}`;
 document.getElementById('progress').style.width=`${(current+1)/slides.length*100}%`;
 notePanel.replaceChildren();
 const title=document.createElement('h2');title.textContent=notes[current].title;notePanel.append(title);
 const text=notes[current].text;
 const sourceMatches=[...text.matchAll(/https?:\/\/[^\s;]+/g)];
 const p=document.createElement('p');p.textContent=text.replace(/https?:\/\/[^\s;]+/g,'').replace(/\s+;/g,'').trim();notePanel.append(p);
 if(sourceMatches.length){const list=document.createElement('ul');sourceMatches.forEach(match=>{const li=document.createElement('li'),a=document.createElement('a');a.href=match[0].replace(/[.,]$/,'');a.target='_blank';a.rel='noopener noreferrer';a.textContent=new URL(a.href).hostname+' — источник';li.append(a);list.append(li);});notePanel.append(list);}
 if(updateHash)history.replaceState(null,'',`#${current+1}`);
}
function toggleNotes(){const open=notePanel.classList.toggle('open');noteButton.setAttribute('aria-expanded',String(open));}
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{document.body.classList.toggle('presentation-mode');}}
previous.addEventListener('click',()=>show(current-1));next.addEventListener('click',()=>show(current+1));jump.addEventListener('change',()=>show(Number(jump.value)));noteButton.addEventListener('click',toggleNotes);document.getElementById('fullscreen').addEventListener('click',fullscreen);
document.addEventListener('keydown',event=>{if(['INPUT','TEXTAREA','SELECT','BUTTON','A'].includes(event.target.tagName))return;if(['ArrowRight','PageDown',' '].includes(event.key)){event.preventDefault();show(current+1);}else if(['ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();show(current-1);}else if(event.key==='Home'){event.preventDefault();show(0);}else if(event.key==='End'){event.preventDefault();show(slides.length-1);}else if(event.key.toLowerCase()==='n'){toggleNotes();}else if(event.key.toLowerCase()==='f'){fullscreen();}else if(event.key==='Escape'){document.body.classList.remove('presentation-mode');}});
function fromHash(){const match=location.hash.match(/^#(\d+)$/);show(match?Number(match[1])-1:0,false);}window.addEventListener('hashchange',fromHash);fromHash();
