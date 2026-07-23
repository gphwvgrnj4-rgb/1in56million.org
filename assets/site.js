/* Crypto-Jews.org — shared site behaviour */
(function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Scroll reveal (skipped when user prefers reduced motion)
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }
})();

/* language dropdown toggle */
(function(){
  function closeAll(except){
    var open=document.querySelectorAll('.langpick.open');
    for(var i=0;i<open.length;i++){ if(open[i]!==except){ open[i].classList.remove('open'); var b=open[i].querySelector('.langpick-btn'); if(b)b.setAttribute('aria-expanded','false'); } }
  }
  document.addEventListener('click',function(e){
    var btn=e.target.closest?e.target.closest('.langpick-btn'):null;
    if(btn){ e.preventDefault(); var pick=btn.closest('.langpick'); var willOpen=!pick.classList.contains('open'); closeAll(pick); pick.classList.toggle('open',willOpen); btn.setAttribute('aria-expanded',willOpen?'true':'false'); return; }
    if(!(e.target.closest&&e.target.closest('.langpick-menu'))) closeAll(null);
  });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'||e.keyCode===27) closeAll(null); });

/* YouTube facade: load the real player only on click */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.yt-facade');if(!b)return;var id=b.getAttribute('data-yt');var w=b.parentNode;w.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1" title="Tea Tephi and the Lost Tribes" allow="autoplay; encrypted-media; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe>';});
})();

/* share buttons: wire to the current page */
(function(){
  function wire(){
    var url=encodeURIComponent(location.href), t=document.title.split(' | ')[0]||document.title, title=encodeURIComponent(t);
    var m={whatsapp:'https://wa.me/?text='+title+'%20'+url, telegram:'https://t.me/share/url?url='+url+'&text='+title, x:'https://twitter.com/intent/tweet?url='+url+'&text='+title, facebook:'https://www.facebook.com/sharer/sharer.php?u='+url, email:'mailto:?subject='+title+'&body='+url};
    document.querySelectorAll('.share .sh[data-sh]').forEach(function(el){var k=el.getAttribute('data-sh'); if(m[k]) el.setAttribute('href',m[k]);});
    var cp=document.querySelector('.share .sh[data-sh="copy"]');
    if(cp) cp.addEventListener('click',function(e){e.preventDefault(); if(navigator.clipboard) navigator.clipboard.writeText(location.href).then(function(){cp.classList.add('copied'); setTimeout(function(){cp.classList.remove('copied');},1500);});});
  }
  if(document.readyState!=='loading') wire(); else document.addEventListener('DOMContentLoaded',wire);
})();

/* ---------- hero dot-flag animation: chaos > Union Jack > chaos > Israeli flag ---------- */
(function(){
  var cvs=document.querySelector('canvas.hero-dots'); if(!cvs) return;
  var ctx=cvs.getContext('2d');
  var reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR=Math.min(window.devicePixelRatio||1,2);
  var W=0,H=0,STEP=7,DOT=1.8,OPACITY=0.8,CHAOS_MS=1500,FLAG_MS=3200;
  var particles=[],sets=[],phase='chaos',nextFlag=0,holdUntil=0,visible=true,raf=null;

  function unionJack(g,w,h){
    g.fillStyle='#012169'; g.fillRect(0,0,w,h);
    g.strokeStyle='#fff'; g.lineWidth=h*0.30;
    g.beginPath(); g.moveTo(0,0); g.lineTo(w,h); g.moveTo(w,0); g.lineTo(0,h); g.stroke();
    g.strokeStyle='#C8102E'; g.lineWidth=h*0.11;
    g.beginPath(); g.moveTo(0,0); g.lineTo(w,h); g.moveTo(w,0); g.lineTo(0,h); g.stroke();
    g.strokeStyle='#fff'; g.lineWidth=h*0.33;
    g.beginPath(); g.moveTo(w/2,0); g.lineTo(w/2,h); g.moveTo(0,h/2); g.lineTo(w,h/2); g.stroke();
    g.strokeStyle='#C8102E'; g.lineWidth=h*0.19;
    g.beginPath(); g.moveTo(w/2,0); g.lineTo(w/2,h); g.moveTo(0,h/2); g.lineTo(w,h/2); g.stroke();
  }
  function star(g,cx,cy,R,lw,col){
    g.strokeStyle=col; g.lineWidth=lw; g.lineJoin='round';
    var rots=[0,180];
    for(var r=0;r<2;r++){ g.beginPath();
      for(var i=0;i<3;i++){ var a=(rots[r]+i*120-90)*Math.PI/180;
        var x=cx+R*Math.cos(a), y=cy+R*Math.sin(a); i?g.lineTo(x,y):g.moveTo(x,y); }
      g.closePath(); g.stroke(); }
  }
  function israel(g,w,h){
    g.fillStyle='#fff'; g.fillRect(0,0,w,h);
    g.fillStyle='#0038B8';
    var s=h*0.115, pad=h*0.115;
    g.fillRect(0,pad,w,s); g.fillRect(0,h-pad-s,w,s);
    star(g,w/2,h/2,h*0.215,h*0.038,'#0038B8');
  }
  function sample(painter,fw,fh,ox,oy){
    var off=document.createElement('canvas'); off.width=fw; off.height=fh;
    var g=off.getContext('2d'); painter(g,fw,fh);
    var d=g.getImageData(0,0,fw,fh).data, pts=[];
    for(var y=0;y<fh;y+=STEP) for(var x=0;x<fw;x+=STEP){
      var i=(y*fw+x)*4; if(d[i+3]<40) continue;
      pts.push({x:ox+x,y:oy+y,r:d[i],g:d[i+1],b:d[i+2]});
    }
    return pts;
  }
  function box(){
    var mob=W<760;
    var fw=Math.round(Math.min(W*(mob?0.82:0.58), (mob?H:H*0.60)*2));
    var fh=Math.round(fw/2);
    var oy=mob? 58 : Math.round((H-fh)/2);          // mobile: sit high, above the text
    return {fw:fw,fh:fh,ox:Math.round((W-fw)/2),oy:oy};
  }
  function assignFlag(i){
    var set=sets[i];
    for(var k=0;k<particles.length;k++){ var t=set[k%set.length],p=particles[k];
      p.tx=t.x;p.ty=t.y;p.tr=t.r;p.tg=t.g;p.tb=t.b; }
  }
  function assignChaos(){
    for(var k=0;k<particles.length;k++){ var p=particles[k];
      p.tx=Math.random()*W; p.ty=Math.random()*H; }
  }
  function build(){
    if(W<2||H<2) return;
    var b=box();
    sets=[sample(unionJack,b.fw,b.fh,b.ox,b.oy), sample(israel,b.fw,b.fh,b.ox,b.oy)];
    var t0=sets[0], n=t0.length; particles=new Array(n);
    for(var i=0;i<n;i++){ var t=t0[i];
      particles[i]={x:Math.random()*W,y:Math.random()*H,tx:t.x,ty:t.y,
        r:t.r,g:t.g,b:t.b,tr:t.r,tg:t.g,tb:t.b,
        sp:0.020+Math.random()*0.045, ph:Math.random()*Math.PI*2}; }
    if(reduce){ phase='flag'; assignFlag(1); holdUntil=Infinity; }
    else { phase='chaos'; nextFlag=0; assignChaos(); holdUntil=performance.now()+900; }
  }
  function resize(){
    var r=cvs.getBoundingClientRect();
    W=Math.round(r.width); H=Math.round(r.height);
    if(W<2||H<2){ requestAnimationFrame(resize); return; }
    cvs.width=W*DPR; cvs.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0);
    build();
  }
  function frame(now){
    raf=requestAnimationFrame(frame);
    if(!visible||!particles.length) return;
    ctx.clearRect(0,0,W,H);
    if(!reduce && now>holdUntil){
      if(phase==='flag'){ assignChaos(); phase='chaos'; holdUntil=now+CHAOS_MS; }
      else { assignFlag(nextFlag); phase='flag'; nextFlag=(nextFlag+1)%sets.length; holdUntil=now+FLAG_MS; }
    }
    var t=now/1000, amp=(phase==='chaos')?10:2.2;
    for(var i=0;i<particles.length;i++){
      var p=particles[i], tx=p.tx, ty=p.ty;
      if(!reduce){ tx+=Math.sin(t*0.7+p.ph)*amp; ty+=Math.cos(t*0.6+p.ph)*amp; }
      p.x+=(tx-p.x)*p.sp; p.y+=(ty-p.y)*p.sp;
      p.r+=(p.tr-p.r)*0.05; p.g+=(p.tg-p.g)*0.05; p.b+=(p.tb-p.b)*0.05;
      ctx.fillStyle='rgba('+(p.r|0)+','+(p.g|0)+','+(p.b|0)+','+OPACITY+')';
      ctx.fillRect(p.x,p.y,DOT,DOT);
    }
  }
  if(window.IntersectionObserver){
    new IntersectionObserver(function(e){ visible=e[0].isIntersecting; },{threshold:0.01}).observe(cvs);
  }
  var rt; addEventListener('resize',function(){clearTimeout(rt); rt=setTimeout(resize,180);});
  addEventListener('load',resize);
  resize(); raf=requestAnimationFrame(frame);
})();
