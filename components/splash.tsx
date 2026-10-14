/**
 * Intro sequence. Server-rendered and hidden by default; the inline head script in the
 * root layout adds `html.intro-play` before first paint, but only on the first page view
 * of a browser session. The CSS removes the overlay itself, so it can never block the site.
 */
export function Splash() {
  return (
    <div className="splash" aria-hidden="true">
      <div className="splash-grid" />
      <span className="splash-axis splash-axis--h" />
      <span className="splash-axis splash-axis--v" />
      <svg className="splash-route" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <path className="splash-route-ghost" d="M-20 810 H240 V700 H560 V765 H900 V665 H1160 V600 H1330" />
        <path className="splash-route-line" pathLength={1} d="M-20 810 H240 V700 H560 V765 H900 V665 H1160 V600 H1330" />
        <path className="splash-route-head" d="M1318 586 L1338 600 L1318 614" />
        <rect className="splash-node" x="235" y="695" width="10" height="10" style={{ animationDelay: '.85s' }} />
        <rect className="splash-node" x="895" y="660" width="10" height="10" style={{ animationDelay: '1.1s' }} />
        <rect className="splash-node" x="1155" y="595" width="10" height="10" style={{ animationDelay: '1.25s' }} />
      </svg>
      <div className="splash-mark">
        <span className="splash-evac"><span>EVAC</span></span>
        <span className="splash-sub">Fire &amp; Safety</span>
        <span className="splash-tag">
          <span><span>PLAN.</span></span>
          <span><span>PREPARE.</span></span>
          <span><span>EVACUATE.</span></span>
        </span>
      </div>
    </div>
  )
}

// Runs synchronously in <head>: decides once per session whether the intro plays.
export const introScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('evac-intro')){return}sessionStorage.setItem('evac-intro','1')}catch(e){return}d.classList.add('intro-play');var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;setTimeout(function(){d.classList.remove('intro-play')},r?1200:5400)})()`
