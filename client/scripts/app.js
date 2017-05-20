// YOUR CODE HERE:

var app = {
  server: 'http://parse.atx.hackreactor.com/chatterbox/classes/messages',
  messages: [],
  friends: [],
  roomname: 'lobby',
  username: 'anonymous'
};

app.init = function() {
  //username
  app.username = window.location.search.substr(10);
  //jQuery cache selectors
  app.$message = $('#message');
  app.$chats = $('#chats');
  app.$roomSelect = $('#roomSelect');
  app.$send = $('#send');
  
  //listeners
  // app.$chats.on('click', '.username', app.handleUsernameClick);
  app.$send.on('submit', app.handleSubmit);
  app.$roomSelect.on('change', app.handleRoomChange);
  
  app.fetch();
  
  // setInterval(function() {
  //   app.fetch();
  // }, 3000);

};

app.send = function(message) {

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.atx.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      app.$message.val('');
      app.fetch();
    },
    error: function (error) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', error);
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
    contentType: 'application/json',
    success: function (data) {
      //console.log('chatterbox: Message(s) received', data);
      app.messages = data.results;
      app.clearMessages();
      for (var i = 0; i < data.results.length; i++) {
        app.renderMessage(data.results[i]);
      }
      app.renderRoomList(data.results);
      app.renderMessages(data.results);
      
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

app.renderMessages = function(messages) {
  app.clearMessages();
  if (Array.isArray(messages)) {
    messages.filter(function(message) {
      return message.roomname === app.roomname || app.roomname === 'lobby' && !message.roomname;
    }).forEach(app.renderMessage);
  }
};

app.renderRoomList = function(messages) {
  app.$roomSelect.html('<option value="__newRoom">New room...</option>');
  
  if (messages) {
    var rooms = {};
    messages.forEach(function(message) {
      var roomname = message.roomname;
      if (roomname && !rooms[roomname]) {
        app.renderRoom(roomname);
        rooms[roomname] = true;
      }
    });
  }
  app.$roomSelect.val(app.roomname);
};

app.renderRoom = function(roomname) {
  app.roomname = roomname;
  var $option = $('<option/>').val(roomname).text(roomname);
  
  // $('#roomSelect').append('<div>' + roomname + '</div>');  
  app.$roomSelect.append($option);

};

app.renderMessage = function(message) {
  //$('#chats').append('<div class="chat"> <div class="username">' + JSON.stringify(message.username) + '</div><div class="text">' + JSON.stringify(message.text) + '</div><div class="time">' + message.createdAt + '</div></div>');
  $('#chats').append($('<div class="chat"></div>').append($('<div class="username"></div>').text(message.username), $('<div class="text"></div>').text(message.text), $('<div class="time"></div>').text(message.createdAt)));
  
};


app.handleUsernameClick = function() {
  $(document).on('click', '.username', function() {
    console.log('clicked');
    app.friends.push($(this).text());
    //console.log(friends);
  });
};

app.handleSubmit = function(event) {
  // $('.button').on('click', function() {
  //   console.log('clicked');
  //   app.send();
  //   app.fetch();
  // });
  
  var message = {
    username: app.username,
    text: app.$message.val(),
    roomname: app.roomname || 'lobby'
  };
  
  app.send(message);
  event.preventDefault();
};

app.handleRoomChange = function(event) {
  var selectIndex = app.$roomSelect.prop('selectedIndex');
  if (selectIndex === 0) {
    var roomname = prompt('Enter room name');
    if (roomname) {
      app.roomname = roomname;
      app.renderRoom(roomname);
      app.$roomSelect.val(roomname);
    } else {
      app.roomname = app.$roomSelect.val();
      app.renderRoom(roomname);
    }
  }
  app.renderMessages(app.messages);
};






































