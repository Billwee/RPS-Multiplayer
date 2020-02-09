// Your web app's Firebase configuration
function preload() {
  var firebaseConfig = {
    apiKey: 'AIzaSyCdDxIP-Ncf2OYHSXHr8WC0xl_YwAvny8Y',
    authDomain: 'rps-multiplayer-2b78c.firebaseapp.com',
    databaseURL: 'https://rps-multiplayer-2b78c.firebaseio.com',
    projectId: 'rps-multiplayer-2b78c',
    storageBucket: 'rps-multiplayer-2b78c.appspot.com',
    messagingSenderId: '443339784960',
    appId: '1:443339784960:web:2d33d52c532b6ed85369e5',
    measurementId: 'G-5X4F0EH7T4'
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  let database = firebase.database();
  let connectionsRef = database.ref('/connections');
  let connectedRef = database.ref('.info/connected');
  let users = database.ref('/users');
  let score = database.ref('/score');
  let choice = database.ref('/choice');

  var player1 = '';

  // let enterName = prompt('Enter Your Name');

  connectedRef.on('value', function(snap) {
    // If they are connected..
    if (snap.val()) {
      // Add user to the connections list.
      var con = connectionsRef.push(true);
      // Remove user from the connection list when they disconnect.

      con.onDisconnect().remove();
    }
  });

  connectionsRef.on('value', function(snap) {
    if (snap.val()) {
      console.log(snap.numChildren());
    }
    //assign();
  });

  $('#nameBTN').on('click', function(event) {
    event.preventDefault(event);

    var name = $('#nameInput')
      .val()
      .trim();

    return connectionsRef.once('value').then(function(snapshot) {
      if (snapshot.numChildren() === 1) {
        var user = users.push(true);
        // var user = users.push(name);
        // var user = users.push().set({ player1: name });
        // users.push({ player1: name });
      } else if (snapshot.numChildren() === 2) {
        // var user = users.push().set({ player2: name });
        // users.push({ player2: name });
      } else if (snapshot.numChildren() >= 3) {
        // var user = users.push().set({ extra: name });
        // users.push({ extra: name });
      }
      console.log(snapshot.numChildren());
      user.onDisconnect().remove();
    });
  });

  //Attempt one : listeners to add data with prompt
  // function assign() {
  //   users.once('value', function(snap) {
  //     if (snap.numChildren() === 0) {
  //       console.log('player1:' + enterName);
  //       users.push({ player1: enterName });
  //       console.log();
  //     } else if (snap.numChildren() === 1) {
  //       console.log('player2:' + enterName);
  //       console.log(snap.child('player1').val());
  //       users.push({ player2: enterName });
  //     } else if (snap.numChildren() >= 2) {
  //       console.log('extra:' + enterName);
  //       users.push({ extra: enterName });
  //     }
  //   });
  // }

  //CHAT
  $('#send').on('click', function(event) {
    event.preventDefault(event);

    let chat = $('#chatInput')
      .val()
      .trim();

    database
      .ref()
      .child('chat')
      .push({
        enterName,
        chat
      });
  });

  database
    .ref()
    .child('chat')
    .on('child_added', function(snapshot) {
      // console.log(snapshot.val());

      $('#chatBox').append(
        '<p class="msg">' +
          snapshot.val().enterName.bold() +
          ': ' +
          snapshot.val().chat +
          '</p>'
      );

      $('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);
    });

  // REMOVE EXAMPLE
  //   var adaRef = firebase.database().ref('users/ada');
  // adaRef.remove()
  //   .then(function() {
  //     console.log("Remove succeeded.")
  //   })
  //   .catch(function(error) {
  //     console.log("Remove failed: " + error.message)
  //   });
}

$(document).ready(function() {
  preload();
});
