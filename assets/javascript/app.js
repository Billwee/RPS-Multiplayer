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
  let player1Ref = database.ref().child('player1');
  let player2Ref = database.ref().child('player2');
  let extraRef = database.ref().child('extra');

  var name = '';
  var active = false;
  var player1Active = false;
  var player2Active = false;
  var extra = [];

  //TRY CREATING AN OBJECT THAT CONTAINS ALL PLAYER INFO

  // ON DISCONNECT FUNCTION THAT REMOVES PLAYER OBJECTS

  // BOOLEANS FOR PLAYER ROLE, TURN (IN OBJECT),

  // USE THIS IN A FUNCTION AND CALL IT IN THE CLICK FUNCTION FOR THE
  // NAME SUBMIT BUTTON

  connectionsRef.on('value', function(snap) {
    if (snap.val()) {
      console.log(snap.numChildren());
    }
  });

  player1Ref.on('value', function(snap) {
    $('#player1').text(snap.child('name').val());
    console.log(snap.val());
    console.log(snap.child('player1').val());
  });

  player2Ref.on('value', function(snap) {
    $('#player2').text(snap.child('name').val());
    console.log(snap.val());
  });

  //Name Click Function
  $(document).on('click', '#nameBTN', function(event) {
    event.preventDefault(event);
    if ($('#nameInput').val() === '') {
      return console.group('no name');
    }

    var name = $('#nameInput')
      .val()
      .trim();

    if (!active) {
      connectedRef.on('value', function(snap) {
        if (snap.val()) {
          var con = connectionsRef.push(true);
          con.onDisconnect().remove();
        }
      });
    }

    database.ref().once('value', function(snap) {
      if (snap.child('player1').exists() === false && !active) {
        player1Ref.set({ name: name });
        active = true;
        player1Ref.onDisconnect().remove();
        console.log(snap.child('player1Ref').exists());
      } else if (snap.child('player2').exists() === false && !active) {
        player2Ref.set({ name: name });
        active = true;
        player2Ref.onDisconnect().remove();
      }
    });

    // return connectionsRef.once('value').then(function(snapshot) {
    //   if (snapshot.numChildren() === 1) {
    //     player1Ref.set({ name: name });
    //     player1Ref.onDisconnect().remove();
    //   } else if (snapshot.numChildren() === 2) {
    //     player2Ref.set({ name: name });
    //     player2Ref.onDisconnect().remove();
    //   } else if (snapshot.numChildren() >= 3) {
    //     extraRef.push({ name: name });
    //     extraRef.onDisconnect().remove();
    //     var extra = [];
    //     extra.push(name);
    //   }
    // });
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
