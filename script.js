const searchForm = document.getElementById('stylist-search-form');
const searchInput = document.getElementById('stylist-search-input');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault(); // prevent the form from reloading the page

  const searchTerm = searchInput.value;
  // send the search term to your backend server or a third-party API to search for stylists
});