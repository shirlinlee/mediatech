

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-118988191-1');


function trackOutboundLink(url) {
	gtag('event', 'click', {
	  'event_category': 'outbound',
	  'event_label': url,
	  'transport_type': 'beacon',
	  'event_callback': function(){document.location = url;}
	});
  }



// ga('create', 'UA-118988191-1', 'auto');
// ga('require', 'displayfeatures');


// function gapage(page) {
// 	ga('send', 'pageview', page);
// 	console.log('page view: ' + page);
// }

// function gaclick(place) {
// 	ga('send', 'event', 'child-eyecare' ,'click', place);
// 	console.log('click: ' + place);
// }

// function trackWaitJump(place, url){
// 	setTimeout(function(){
// 		// location.href = url;
// 		window.open(url);
// 	},100);
// 	gaclick(place);
// }

// (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
// new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
//   j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
//   'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
//   })(window,document,'script','dataLayer','GTM-T22SFVH');




