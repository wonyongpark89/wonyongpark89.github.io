(function(){
  'use strict';
  const root=document.querySelector('[data-archive]');
  if(!root)return;
  const form=document.getElementById('archive-password-form');
  const input=document.getElementById('archive-password');
  const submit=document.getElementById('archive-unlock');
  const error=document.getElementById('archive-error');
  const gate=document.getElementById('archive-gate');
  const content=document.getElementById('archive-content');
  const lock=document.getElementById('archive-lock');
  const title=document.getElementById('archive-title');
  const expected=root.dataset.passwordHash;
  const key='wp-archive:'+root.dataset.archive+':'+expected.slice(0,12);
  const readSession=()=>{try{return sessionStorage.getItem(key)==='unlocked'}catch{return false}};
  function showArchive(focus){
    gate.hidden=true;content.hidden=false;lock.hidden=false;
    input.value='';input.removeAttribute('aria-invalid');error.textContent='';
    if(focus)title.focus({preventScroll:true});
    let target=null;
    try{target=location.hash&&document.getElementById(decodeURIComponent(location.hash.slice(1)))}catch{}
    if(target&&content.contains(target))requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
  }
  if(readSession())showArchive(false);
  input.addEventListener('input',()=>{input.removeAttribute('aria-invalid');error.textContent=''});
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(submit.disabled)return;
    submit.disabled=true;error.textContent='';
    try{
      if(!window.crypto||!window.crypto.subtle)throw new Error('unsupported');
      const digest=await window.crypto.subtle.digest('SHA-256',new TextEncoder().encode(input.value));
      const hash=Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('');
      if(hash!==expected){
        input.setAttribute('aria-invalid','true');error.textContent='That password is not correct. Please try again.';input.focus();input.select();return;
      }
      try{sessionStorage.setItem(key,'unlocked')}catch{}
      showArchive(true);
    }catch{
      error.textContent='The password could not be checked. Please try a current browser.';
    }finally{submit.disabled=false}
  });
  lock.addEventListener('click',()=>{
    try{sessionStorage.removeItem(key)}catch{}
    content.hidden=true;lock.hidden=true;gate.hidden=false;
    input.value='';error.textContent='';input.removeAttribute('aria-invalid');input.focus();
  });
})();
