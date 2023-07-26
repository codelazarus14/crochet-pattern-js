// When the user scrolls the page, execute myFunction
window.onscroll = () => makeSticky();

// Get the navbar
var sidebar = document.querySelector(".sidebar");

// Get the offset position of the navbar
var sticky = sidebar.offsetTop - 12;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function makeSticky() {
  if (window.scrollY >= sticky) {
    sidebar.classList.add("sticky")
  } else {
    sidebar.classList.remove("sticky");
  }
} 