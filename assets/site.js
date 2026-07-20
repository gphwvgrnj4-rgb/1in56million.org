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
