(function($) {
  "use strict"; // Start of use strict

  let colorChoices = {"#about":"#2f6ebc", "#experience": "#2f7a3f", "#education": "#61a9bf", "#skills": "#dd7330", "#projects": "#6b097c", "#video": "#ea0e27" };

  $(document).ready(function(){
  let sidebarNavColor = colorChoices[$("ul.navbar-nav .nav-item .active")[0].attributes.href.nodeValue]
  $('#sideNav').css("background-color", sidebarNavColor);
  })

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#sideNav'
  });

  


  $(window).on('activate.bs.scrollspy', function (e,obj) {
          //console.log(obj.relatedTarget)
          let sideColor = colorChoices[obj.relatedTarget]
          //console.log(colorChoices[obj.relatedTarget])
          $('#sideNav').css("background-color", sideColor);
          //console.log(typeof(obj.relatedTarget));
      });

})(jQuery); // End of use strict
