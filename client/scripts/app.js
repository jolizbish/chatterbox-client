// YOUR CODE HERE:

var app = {
  server: 'http://parse.atx.hackreactor.com/chatterbox/classes/messages',
  friends: [],
  username: 'Jordan'
};

app.init = function() {
  app.fetch();
  app.handleUsernameClick();
  app.handleSubmit();
};
app.send = function(text) {
  var message = {
    username: app.username,
    text: text,
    roomname: 'lobby'
  };
        
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.atx.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  }); 
};

app.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.atx.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    data: {
      order: '-createdAt'
    },
    success: function (data) {
      console.log('chatterbox: Message(s) received', data);
      for (var i = 0; i < data.results.length; i++) {
        app.renderMessage(data.results[i]);
      }
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message(s)');
    }
  }); 
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function(message) {
  //$('#chats').append('<div class="chat"> <div class="username">' + JSON.stringify(message.username) + '</div><div class="text">' + JSON.stringify(message.text) + '</div><div class="time">' + message.createdAt + '</div></div>');
  $('#chats').append($('<div class="chat"></div>').append($('<div class="username"></div>').text(message.username)  , $('<div class="text"></div>').text(message.text)));
  
};

app.renderRoom = function(roomName) {
  $('#roomSelect').append('<div>' + roomName + '</div>');  
};

app.handleUsernameClick = function() {
  $('.username').on('click', function() {
    app.friends.push($(this).text());
  });
};

app.handleSubmit = function() {
  $('.button').on('click', function() {
    app.send(text);
  });
};









































