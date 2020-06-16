import store from './store.js';
import api from './api.js';

// console.log(store.bookmarks);

const render = function (generatingFunction) {
  $('main').html(generatingFunction);
  bindEventListeners();
  console.log('store.bookmarks.length is: ' + store.bookmarks.length);
  // console.log('api is: ' + api.getBookmarks());
}

const generateStarRatingElement = function (bookmark) {
  let ratingImageString = `<div class="star-rating flex-item">`;

  for(let i=0; i<bookmark.rating; i++) {
    ratingImageString += `<img class="star filled-star" src="./images/star.png">`;
  }

  for(let i=0; i<5-bookmark.rating; i++) {
    ratingImageString += `<img class="star unfilled-star" src="./images/no-star.png">`;
  }

  ratingImageString += `</div>`;
return ratingImageString;
}

// helper function only meant to be used in generateBookmarkListString function
const generateBookmarkElement = function (bookmark) {
  let bookmarkClass = "";
  if(bookmark.expanded) {
    bookmarkClass = "expanded";
  }
  else {
    bookmarkClass = "";
  }
  
  return `
    <div class="bookmark-element ${bookmarkClass}" data-id="${bookmark.id}">
      <div class="bookmark-section">
        <div>Title:</div>
        <div>${bookmark.title}</div>
      </div>  
      <div class="bookmark-rating bookmark-section">
        <div class="flex-item">Rating:</div>
        ${generateStarRatingElement(bookmark)}
      </div>
      <div class="bookmark-section">
        <div>Description:</div>
        <div>${bookmark.desc}</div>
      </div>
      <div class="bookmark-section">
        <div class="bookmark-link"><a href="${bookmark.url}">Visit Site</a></div>
      </div>
      <div class="bookmark-buttons bookmark-section">
        <!-- disable edit button for now
        <img class="flex-item edit-button" src="./images/edit-button.png" alt="Edit Button">
        -->
        <img class="flex-item delete-button" src="./images/delete-button.png" alt="Delete Button">
      </div>
    </div>
  `;
};

const generateBookmarkListString = function (bookmarkList) {
  // console.log("bookmarkList length is: " + bookmarkList.length);
  const list = bookmarkList.map(bookmark => generateBookmarkElement(bookmark));
  return list.join('');
};

const generateMainView = function () {
  // console.log(store.bookmarks[1]);
  // console.log(store.bookmarks.length);
  // store.bookmarks.forEach(bookmark => console.log(bookmark));
  return `
  <div>
    <img id="create-button" src="./images/create-button2.png" alt="Create New Bookmark">
  </div>

  ${generateBookmarkListString(store.bookmarks)}
  `;
}

const generateCreateView = function () {
  return `
    <div id="create-view">
      <h2>Create a new bookmark</h2>
      <form id="create-form" action="" method="post">
        <div class="form-field">
          <label for="title">Title:</label>
          <input type="text" name="title" id="title" required>
        </div>      
        <div class="form-field">
          <label for="url">URL:</label>
          <input type="url" name="url" id="url" required>
        </div>
        <div class="form-field">
          <label for="description">Description:</label>
          <textarea name="description" id="description" placeholder="(optional)"></textarea>
        </div>
        <div class="form-field">
          <label for="rating">Rating:</label>
          <select name="rating" id="rating" required>      
            <option value="">Select one</option>
            <option value="1">1-star</option>
            <option value="2">2-stars</option>
            <option value="3">3-stars</option>
            <option value="4">4-stars</option>
            <option value="5">5-stars</option>
          </select>
        </div>
        <div class="form-field button-section">
          <input type="image" id="cancel-button" src="./images/cancel-button.png" alt="Cancel Button" formnovalidate>
          <input type="image" id="save-button" src="./images/save-button.png" alt="Save Button">
        </div>
      </form>
    </div>
  `;
}

const generateEditView = function (bookmark) {
  return `
    <div id="edit-view" class="bookmark-element" data-id="${bookmark.id}">
      <h2>Create a new bookmark</h2>
      <form id="edit-form" action="" method="post">
        <div class="form-field">
          <label for="title">Title:</label>
          <input type="text" name="title" id="title" value="${bookmark.title}" required>
        </div>      
        <div class="form-field">
          <label for="url">URL:</label>
          <input type="url" name="url" id="url" value="${bookmark.url}" required>
        </div>
        <div class="form-field">
          <label for="description">Description:</label>
          <textarea name="description" id="description" value="${bookmark.desc}"></textarea>
        </div>
        <div class="form-field">
          <label for="rating">Rating:</label>
          <select name="rating" id="rating" value="${bookmark.rating}" required>      
            <option value="">Select one</option>
            <option value="1">1-star</option>
            <option value="2">2-stars</option>
            <option value="3">3-stars</option>
            <option value="4">4-stars</option>
            <option value="5">5-stars</option>
          </select>
        </div>
        <div class="form-field button-section">
          <input type="image" id="cancel-button" src="./images/cancel-button.png" alt="Cancel Button" formnovalidate>
          <input type="image" id="save-button" src="./images/save-button.png" alt="Save Button">
        </div>
      </form>
    </div>
  `;
}

const getBookmarkIdFromElement = function (element) {
  return $(element)
    .closest('.bookmark-element')
    .data('id');
};

const handleEditButtonClick = function () {
  $('.bookmark-element').on("click", '.edit-button', event => {
    store.state.editing = true;
    // const id = getBookmarkIdFromElement(event.currentTarget);
    const id = $(event.currentTarget).closest('.bookmark-element').data('id');
    // let currentBookmarkId = $(event.currentTarget).data('id');
    console.log(id);
    // let newData = {

    // }
    

    // get the current bookmark attached to this edit button click

    render(generateEditView);
    // handleCancelButtonClick();
    // handleSaveButtonClick();
  });
}

const handleDeleteButtonClick = function () {
  $('.bookmark-element').on("click", '.delete-button', event => {
    console.log("delete button was just clicked");
    const id = getBookmarkIdFromElement(event.currentTarget);
    // const id = $(event.currentTarget).closest('.bookmark-element').data('id');
    // store.findAndDelete(id);
    // api.deleteBookmark(id)
    // .then(response => render(generateMainView));

    console.log(id);
    console.log(api.getBookmarks());

    api.deleteBookmark(id)
    // .then( response => response.json())
    .then(response => {
      store.findAndDelete(id);
      render(generateMainView);
    });

    // handleCreateButtonClick();
    // handleEditButtonClick();
    // handleDeleteButtonClick();
  });
}

const handleCancelButtonClick = function () {
  $('#cancel-button').click(event => {
    store.state.creating = false;
    store.state.editing = false;
    render(generateMainView);
    // handleCreateButtonClick();
    // handleEditButtonClick();
    // handleDeleteButtonClick();
  });
}

const handleSaveButtonClick = function () {
  // user clicked on create button
  if(store.state.creating) {
    $('#create-form').submit(event => {
      event.preventDefault();
      let title = $('#title').val();
      let url = $('#url').val();
      let desc = $('#description').val();
      let rating = parseInt($('#rating').val());
      let expanded = false;

      let newBookmark = {title,url,desc,rating,expanded};

      store.state.creating = false;
      store.addBookmark(newBookmark);
      api.createBookmark(newBookmark)
      // .then(response => response.json())
      .then(response => render(generateMainView));
    });
  }

  // user clicked on edit button
  else if(store.state.editing) {
    $('#edit-form').submit(event => {
      event.preventDefault();

      // const id = $(event.currentTarget).closest('.bookmark-data').data('id');
      const id = getBookmarkIdFromElement(event.target);
      console.log('store.state.editing is true, and bookmark id is:' + id);

      // let title = $('#title').val();
      // let url = $('#url').val();
      // let desc = $('#description').val();
      // let rating = parseInt($('#rating').val());

      // let newBookmark = {title,url,desc,rating};

      let newData = {
        title : $('#title').val(),
        url : $('#url').val(),
        desc : $('#description').val(),
        rating : parseInt($('#rating').val())
      }

      store.findAndUpdate(id, newData);
      store.addBookmark(newBookmark);
      api.createBookmark(newBookmark)
      .then(() => render(generateMainView));
    });
  }
}

const handleCreateButtonClick = function () {
  $('#create-button').click(event => {
    store.state.creating = true;
    render(generateCreateView);
    // handleCancelButtonClick();
    // handleSaveButtonClick();
  });
}

const bindEventListeners = function () {
  handleCreateButtonClick();
  handleEditButtonClick();
  handleDeleteButtonClick();
  handleCancelButtonClick();
  handleSaveButtonClick();
}

// const handleNewItemSubmit = function () {
//   $('#js-shopping-list-form').submit(function (event) {
//     event.preventDefault();
//     const newItemName = $('.js-shopping-list-entry').val()
//     $('.js-shopping-list-entry').val('');

//     api.createItem(newItemName)
//     .then(response => response.json())
//     .then(newItem => {
//       store.addItem(newItem);
    
//     render();
//     });
//   });
// };

// const getItemIdFromElement = function (item) {
//   return $(item)
//     .closest('.js-item-element')
//     .data('item-id');
// };

// const handleDeleteItemClicked = function () {
//   // like in `handleItemCheckClicked`, we use event delegation
//   $('.js-shopping-list').on('click', '.js-item-delete', event => {
//     // get the index of the item in store.items
//     const id = getItemIdFromElement(event.currentTarget);

//     api.deleteItem(id)
//     .then( response => response.json())
//     .then( () => {
//       store.findAndDelete(id);
//       render();
      
//     })
//   });
// };

// const handleEditShoppingItemSubmit = function () {
//   $('.js-shopping-list').on('submit', '.js-edit-item', event => {
//     event.preventDefault();
//     const id = getItemIdFromElement(event.currentTarget);
//     const itemName = $(event.currentTarget).find('.shopping-item').val();
//     // store.findAndUpdateName(id, itemName);

//     // Call api.updateItem, passing in the id and a new object containing the itemName
//     api.updateItem(id, {name : itemName})
//     .then( () => {
//       store.findAndUpdate(id, {name : itemName});
//       render();
//     })
//   });
// };

// const handleItemCheckClicked = function () {
//   $('.js-shopping-list').on('click', '.js-item-toggle', event => {
//     const id = getItemIdFromElement(event.currentTarget);
//     let item = store.findById(id);
//     api.updateItem(id, { checked : !item.checked })
//     .then( () => {
//       store.findAndUpdate(id, { checked : !item.checked });      
//       render();
//     })
//   });
// };

// const handleToggleFilterClick = function () {
//   $('.js-filter-checked').click(() => {
//     store.toggleCheckedFilter();
//     render();
//   });
// };

// const bindEventListeners = function () {
//   handleNewItemSubmit();
//   handleItemCheckClicked();
//   handleDeleteItemClicked();
//   handleEditShoppingItemSubmit();
//   handleToggleFilterClick();
// };
// // This object contains the only exposed methods from this module:
// export default {
//   render,
//   bindEventListeners
// };

export default{
    generateStarRatingElement,
    generateBookmarkElement,
    generateBookmarkListString,
    generateMainView,
    generateCreateView,
    bindEventListeners,
    render
};