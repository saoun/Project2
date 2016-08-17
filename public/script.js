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
  var newLi = $('<li>');
  newLi.text(info);
  // newLi.append($('<br>'));
  newLi.append('<button class="btn-floating btn-small waves-effect waves-light blue-grey delete-button" name="{{id}}" id="delete"><i class="material-icons">delete</i></button>')
  newLi.append('<button class="btn-floating btn-small waves-effect waves-light blue-grey done-button" name="{{id}}" id="done"><i class="material-icons">done</i></button>')
  $('#new-list').append(newLi)
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
    $('#done-ul').append($(this).parent())

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


