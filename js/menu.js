function menuFunction() {
  var x = document.getElementById("menu-wrapper");
  if (x.style.display === "flex") {
    x.style.display = "none ";
  } else {
    x.style.display = "flex";
  }
}

/* puts menu to show all the time if over 601px */
    if (matchMedia) {
      const mq = window.matchMedia("(min-width: 601px)");
      mq.addListener(WidthChange);
      WidthChange(mq);
    }

    // media query change
    function WidthChange(mq) {
      if (mq.matches) {
        var x = document.getElementById("menu-wrapper");
     x.style.display = "flex";
      } else {
      var x = document.getElementById("menu-wrapper");
     x.style.display = "none";
      }

    }
