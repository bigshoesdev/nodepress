var articleimages = $('img');
var articleurl = window.location.href;
// var articleimages = $('#inner-dark-blog-content-one').find($('img')[0])[0];
for (var i = 0; i < articleimages.length; i++) {
   if (articleimages[i].parentElement.tagName == 'FIGURE') {
      var element = articleimages[i];
      var string = "<a href='" + articleurl + "'>" + element.outerHTML + "</a>";
      var p = document.createElement("textarea");
      p.setAttribute('id', 'copylink');
      $('figcaption').css('text-align', 'center');
      var copybtn = document.createElement('button');
      copybtn.innerHTML = "Copy Image";
      copybtn.style.margin = "10px";
      copybtn.classList.add("copybutton");
      copybtn.classList.add("btn");
      copybtn.classList.add("btn-primary");
      $('figcaption').empty();
      $('figcaption').append(copybtn);
      p.style.marginLeft = "auto";
      p.style.marginRight = "auto";
      p.style.marginTop = "10px";
      p.style.marginBottom = "10px";
      p.classList.add('form-control');
      p.style.display = "none";
      p.style.width = "50%";
      p.value = string;
      articleimages[i].parentElement.append(p);
   }
}
$('.copybutton').click(function () {
   $('#copylink').css('display', 'block');
});
var body = document.body;
var articleheight = $('#inner-dark-blog-content-one').height();
var percent = 0;
var totalheight = $('.dark-blog-banner').height() + articleheight;
window.addEventListener('scroll', function () {
   var y = window.scrollY;
   if (y < $('.dark-blog-banner').height()) {
      percent = 0;
   } else if (y > totalheight) {
      percent = 100;
   } else {
      percent = (y - $('.dark-blog-banner').height()) / (articleheight) * 100;
   }
   $('#processbar').css('width', Math.floor(percent) + "%");
});
$('#darkmode').removeAttr('checked');
$('#darkmode').click(function () {
   if (this.checked) {
      document.body.style.background = 'black';
      $('#header-logo-image').attr('src', '/images/GOLDEN-PNG1.png');
      $('.inner-dark-blog-content-one').css('color', 'white');
      $('.inner-dark-blog-makeby').css('color', 'white');
      $('.recommended-for-you').css('color', 'white');
      $('.recommended-for-you').css('background', 'black');
      $('.recommended-txt').css('color', 'white');
      $('#footer').css('background', '#0a0a0a');
      $('#header').css('background', 'rgb(29, 29, 27)');
      $('.searchbar').css('color', 'white');
      $('.dropdown a').css('color', 'white');
      $('.dropdown a:focus, .dropdown a:hover').css('color', 'white');
      $('.username_span').css('color', 'white');
      $('.dropdown-menu').css('background', 'black');
      $('.sidenav').css('background-color', '#1d1d1b');
   } else {
      document.body.style.background = 'white';
      $('#header-logo-image').attr('src', '/images/GOLDEN-PNG.png');
      $('.inner-dark-blog-content-one').css('color', 'black');
      $('.inner-dark-blog-makeby').css('color', 'black');
      $('.recommended-for-you').css('color', 'black');
      $('.recommended-for-you').css('background', 'white');
      $('.recommended-txt').css('color', 'black');
      $('#footer').css('background', '#f4f4f4');
      $('#header').css('background', 'white');
      $('.searchbar').css('color', 'rgb(29, 29, 27)');
      $('.dropdown a').css('color', 'black');
      $('.dropdown a:focus, .dropdown a:hover').css('color', 'black');
      $('.username_span').css('color', 'white');
      $('.dropdown-menu').css('background', 'white');
      $('.sidenav').css('background-color', 'black');
   }
});
var firstchild = $('.inner-dark-blog-content-one').children(":first");
var clildstring = firstchild[0].innerText;
var firstlettercolor = $('#firstlettercolor').val();
$("#processbar").css('background-color', firstlettercolor);
var newstring = "<span style='color:" + firstlettercolor + "; font-size:80px;'>" + clildstring.charAt(0) + "</span>" + clildstring.substr(1, clildstring.length);;
firstchild[0].innerHTML = newstring;
function upvote() {
   // $('#upvoteForm').submit();
   console.log("this is the ajax call part");
   var articleId = $('#articleId').val();
   var uId = $('#userId').val();
   $.ajax({
      url: "/article/upvote-ajax",
      type: 'post',
      dataType: 'json',
      data: { articleId: articleId, userId: uId },
      success: function (data) {
         $('#upvoteCount').text(data);
      }
   });
}

$(document).on('mousedown', '.mobile-upvote', function(){
   console.log("this is mobile click function!");
   upvote();
});

$(window).scroll(function () {
   if ($(this).scrollTop() >= 0) {        // If page is scrolled more than 50px
      $('#return-to-top').fadeIn(200);    // Fade in the arrow
   } else {
      $('#return-to-top').fadeOut(200);   // Else fade out the arrow
   }
});
$('.cancelNav').click(function () {
   $('.sidenav').css('display', 'none');
});
function getmonth(data) {
   switch (data) {
      case 0:
         return 'Jan';
         break;
      case 1:
         return 'Feb';
         break;
      case 2:
         return 'March';
         break;
      case 3:
         return 'Apr';
         break;
      case 4:
         return 'May';
         break;
      case 5:
         return 'Jun';
         break;
      case 6:
         return 'Jul';
         break;
      case 7:
         return 'Aug';
         break;
      case 8:
         return 'Sep';
         break;
      case 9:
         return 'Oct';
         break;
      case 10:
         return 'Nov';
         break;
      case 11:
         return 'Dec';
         break;
      default: break;
   }
};
function openNav() {
   document.getElementById("myTopnav").style.height = "220px";
}
function closeNav() {
   document.getElementById("myTopnav").style.height = "0";
   document.getElementById('closebtn').style.visibility = "hidden";
}
function searchForm() {
   document.getElementById("searchForm").submit();
}
document.getElementById('closebtn').style.visibility = "hidden";

function displaySearchbtn() {
   document.getElementById('closebtn').style.visibility = "visible";
}
function openSidebar() {
   document.getElementById("sidenav").style.display = "block";
}