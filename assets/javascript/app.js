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

  let name = '';
  var active = false;
  var player1Active = false;
  var player2Active = false;
  var tie = 0;
  var oneWin = 0;
  var twoWin = 0;
  var round = true;

  connectionsRef.on('value', function(snap) {
    if (snap.val()) {
      console.log(snap.numChildren());
    }
  });

  //These two functions check if a player is logged in
  //if not the player spot will display "Enter name to play"
  player1Ref.on('value', function(snap) {
    if (snap.val()) {
      $('#player1').text(snap.child('name').val());
    } else {
      player1RefStart.set({ name: 'Enter Name to Play' });
      player1RefStart.once('value', function(snap) {
        $('#player1').text(snap.child('name').val());
      });
    }
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
  });

  //Name Click Function
  //Input validation first then it sets your name in the correct
  //player position. Any players that enter after the first two
  //will still be able to chat, but not play.
  $('#nameBTN').on('click', function(event) {
    event.preventDefault(event);
    if ($('#nameInput').val() === '') {
      return (
        $('#blankAlert').css('display', 'none'),
        $('#alert')
          .text('Please Enter A Name')
          .css('display', 'block'),
        setTimeout(function() {
          $('#blankAlert').css('display', 'block');
          $('#alert')
            .text('')
            .css('display', 'none');
        }, 2000)
      );
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
  });

  //This function compares the two players choices and updates the html
  //with the database entries.
  choiceRef.on('value', function(snap) {
    if (snap.val() === null) {
      return;
    }
    if (snap.child('player1').val() === '' && player1Active === true) {
      $('.choices1').css('display', 'block');
    }
    if (snap.child('player1').val() === '' && player2Active === true) {
      $('.player1Picking').css('display', 'block');
    }
    if (snap.child('player1').val() !== '') {
      $('.choices1').css('display', 'none');
      $('.player1Picking').css('display', 'none');
    }

    if (snap.child('player1').val() !== '' && player1Active === true) {
      $('.player2Picking').css('display', 'block');
    }
    if (snap.child('player1').val() !== '' && player2Active === true) {
      $('.choices2').css('display', 'block');
    }
    if (snap.child('player2').val() !== '') {
      $('.choices2').css('display', 'none');
      $('.player2Picking').css('display', 'none');
    }
    if (
      snap.child('player1').val() !== '' &&
      snap.child('player2').val() !== ''
    ) {
      var choice1 = snap.child('player1').val();
      var choice2 = snap.child('player2').val();

      if (choice1 === choice2) {
        tie++;
        tiesRef.child('ties').set(tie);
        $('#tie').css('display', 'block');
        setTimeout(function() {
          $('#tie').css('display', 'none');
          choiceRef.child('player1').set('');
          choiceRef.child('player2').set('');
        }, 3000);
      } else if (
        (choice1 === 'P' && choice2 === 'R') ||
        (choice1 === 'R' && choice2 === 'S') ||
        (choice1 === 'S' && choice2 === 'P')
      ) {
        $('#onewins').css('display', 'block');
        oneWin++;
        winsRef.child('player1').set(oneWin);
        lossesRef.child('player2').set(oneWin);
        setTimeout(function() {
          $('#onewins').css('display', 'none');
          choiceRef.child('player1').set('');
          choiceRef.child('player2').set('');
        }, 3000);
      } else {
        $('#twowins').css('display', 'block');
        twoWin++;
        winsRef.child('player2').set(twoWin);
        lossesRef.child('player1').set(twoWin);
        setTimeout(function() {
          $('#twowins').css('display', 'none');
          choiceRef.child('player1').set('');
          choiceRef.child('player2').set('');
        }, 3000);
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

  //Displays wins for individual players
  database
    .ref()
    .child('wins')
    .on('value', function(snap) {
      if (player1Active === true) {
        $('#winCount').text(snap.child('player1').val());
      } else if (player2Active === true) {
        $('#winCount').text(snap.child('player2').val());
      }
    });

  //Displays losses for individual players
  database
    .ref()
    .child('losses')
    .on('value', function(snap) {
      if (player1Active === true) {
        $('#loseCount').text(snap.child('player1').val());
      } else if (player2Active === true) {
        $('#loseCount').text(snap.child('player2').val());
      }
    });

  //Displays ties for individual players
  database
    .ref()
    .child('ties')
    .on('value', function(snap) {
      if (player1Active === true) {
        $('#tieCount').text(snap.child('ties').val());
      } else if (player2Active === true) {
        $('#tieCount').text(snap.child('ties').val());
      }
    });

  //Sets RPS choice for individual players
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

    if (name === '') {
      $('#blankAlert').css('display', 'none');
      $('#alert')
        .text('Please Enter A Name')
        .css('display', 'block');
      setTimeout(function() {
        $('#blankAlert').css('display', 'block');
        $('#alert')
          .text('')
          .css('display', 'none');
      }, 2000);
    } else if ($('#chatInput').val() === '') {
      return;
    } else {
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

      $('#chatInput').val('');
    }
  });

  database
    .ref()
    .child('chat')
    .on('child_added', function(snapshot) {
      $('#chatBox').append(
        '<p class="msg">' +
          snapshot.val().name.bold() +
          ': ' +
          snapshot.val().chat +
          '</p>'
      );

      $('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);
    });
}

$(document).ready(function() {
  preload();
});
