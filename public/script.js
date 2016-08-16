$(function(){
  console.log('alive');

//posting a todo item
$('#addToDo').on('submit', function(e){
  console.log('todo added');
  e.preventDefault();

  info = $(this).children('input').val()

  todo = {info:info}
  $('#input-field').val('');

  $.ajax({
    "url": "http://localhost:3000/add_item",
    "method": "POST",
    "data": todo,
    "success" : function (item){

      addNewItem();
      addDeleteHandler();
      itemDone()

      console.log('ajax call was good')
    }
  });
});

//appending a new list item
function addNewItem(){
  var newDiv = $('<div>');
  newDiv.append($('<h5>').text(info));
  newDiv.append('</br>');

  newDiv.append('<button class="btn btn-primary delete-button">Delete</>')
  // .click(function(){
  //   $.ajax({
  //     "url": "http://localhost:3000/todo/" + item.id,
  //     "method": "DELETE",
  //     "success" : function (todo){
  //       console.log('ajax call was good for delete')
  //     }
  //   });
  // });

  newDiv.append('<button class="btn btn-primary done-button">Done</>')
  //.click(function(){
  //   $.ajax({
  //     "url": "http://localhost:3000/todo/" + item.id,
  //     "method" : "PUT",
  //     "success": function (todo){
  //       console.log('ajax call was good for done')
  //     }
  //   });
  // });

  $('#new-list').append(newDiv);
};


//adding delete handler
function addDeleteHandler() {
  $('.delete-button').click(function(e) {
    var id = $(this).attr('name');
    $(this).parent().remove();
    $.ajax({
      "url": "http://localhost:3000/todo/" + id,
      "method": "DELETE",
      "success" : function (todo){
        console.log('ajax call was good')
      }
    });
  });
}
addDeleteHandler();


//changing item to 'done' // changing boolean from false to true
function itemDone(){
  $('body').on('click', '.done-button', function(e){
    var id = $(this).attr('name');
    $(this).css('background-color', 'red');

    $.ajax({
      "url": "/todo/" + id,
      "method" : "put",
      "success": function (todo){
        console.log('ajax call was good for done')
      }
    });
  });
};
itemDone();








});

//add done button for boolean
