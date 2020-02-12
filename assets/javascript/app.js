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
  let winsRef = database.ref('/wins');
  let lossesRef = database.ref('/losses');
  let tiesRef = database.ref('/ties');
  let choiceRef = database.ref('/choice');
  let player1Ref = database.ref().child('player1');
  let player2Ref = database.ref().child('player2');
  let player1RefStart = database.ref().child('player1Start');
  let player2RefStart = database.ref().child('player2Start');
  let extraRef = database.ref().child('extra');

  var name = '';
  var active = false;
  var player1Active = false;
  var player2Active = false;
  var round = true;
  var tie = 0;
  var oneWin = 0;
  var oneLoss = 0;
  var twoWin = 0;
  var twoLoss = 0;

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
    if (snap.val()) {
      $('#player1').text(snap.child('name').val());
    } else {
      player1RefStart.set({ name: 'Enter Name to Play' });
      player1RefStart.once('value', function(snap) {
        $('#player1').text(snap.child('name').val());
      });
    }
    // player1RefStart.onDisconnect().remove();
  });

  player2Ref.on('value', function(snap) {
    if (snap.val()) {
      $('#player2').text(snap.child('name').val());
    } else {
      player2RefStart.set({ name: 'Enter Name to Play' });
      player2RefStart.once('value', function(snap) {
        $('#player2').text(snap.child('name').val());
      });
    }
    // player2RefStart.onDisconnect().remove();
  });

  //Name Click Function
  $(document).on('click', '#nameBTN', function(event) {
    event.preventDefault(event);
    if ($('#nameInput').val() === '' && active) {
      return console.group('no name');
    }

    name = $('#nameInput')
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
        player1Active = true;
        console.log('player1Active = ' + player1Active);
        player1Ref.onDisconnect().remove();
      } else if (snap.child('player2').exists() === false && !active) {
        player2Ref.set({ name: name });
        active = true;
        player2Active = true;
        console.log('player2Active = ' + player2Active);
        player2Ref.onDisconnect().remove();
      }
    });
    //Work on disconnecting players resetting active and playerActive
    //WORK ON EXTRA PLAYERS
  });

  //FIND A WAY TO MAKE INDIVIDUAL CHOICES

  choiceRef.on('value', function(snap) {
    console.log('choice');
    if (snap.val() === null) {
      console.log('null');
      return;
    }
    if (snap.child('player1').val() === '' && player1Active === true) {
      $('.choices1').css('display', 'block');
    }
    if (snap.child('player1').val() === '' && player2Active === true) {
      $('.player1Picking').css('display', 'block');
    }
    if (snap.child('player1').val() !== '') {
      console.log('choicemade');
      $('.choices1').css('display', 'none');
      $('.player1Picking').css('display', 'none');
    }
    if (snap.child('player1').val() !== '' && player2Active === true) {
      $('.choices2').css('display', 'block');
    }
    if (snap.child('player2').val() !== '') {
      $('.choices2').css('display', 'none');
      console.log('choices made!');
    }
    if (
      snap.child('player2').val() !== '' &&
      snap.child('player2').val() !== ''
    ) {
      var choice1 = snap.child('player1').val();
      var choice2 = snap.child('player2').val();

      if (choice1 === choice2) {
      }
    }
  });

  //Starts Game - Sets Default Values
  database.ref().on('value', function(snap) {
    if (
      snap.child('player1').exists() &&
      snap.child('player2').exists() &&
      round === true &&
      active === true
    ) {
      console.log('start');
      choiceRef.set({
        player1: '',
        player2: ''
      });
      winsRef.set({
        player1: 0,
        player2: 0
      });
      lossesRef.set({
        player1: 0,
        player2: 0
      });
      tiesRef.set({
        ties: 0
      });
      round = false;
      choiceRef.onDisconnect().remove();
      winsRef.onDisconnect().remove();
      lossesRef.onDisconnect().remove();
      tiesRef.onDisconnect().remove();
    }
  });

  $('.choice').on('click', function() {
    var pick = $(this).attr('id');
    if (player1Active === true) {
      choiceRef.child('player1').set(pick);
    } else if (player2Active === true) {
      choiceRef.child('player2').set(pick);
    }
  });

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
        name,
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
          snapshot.val().name.bold() +
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
