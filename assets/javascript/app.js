// Your web app's Firebase configuration
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

var database = firebase.database();
var connectionsRef = database.ref('/connections');
var connectedRef = database.ref('.info/connected');

connectedRef.on('value', function(snap) {
  // If they are connected..
  if (snap.val()) {
    // Add user to the connections list.
    var con = connectionsRef.push(true);
    connectionsRef.data.push({ player1: qweklqr });
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

var player1 = 'Player 1';
var player2 = 'Player 2';
var chatdata = database.ref();

$('#send').on('click', function(event) {
  event.preventDefault();

  let chat = $('#chatInput')
    .val()
    .trim();

  console.log(chat);

  database
    .ref()
    .child('chat')
    .push({
      chat
    });
  console.log(firebase.database.ServerValue.TIMESTAMP);
});

database
  .ref()
  .child('chat')
  .on('child_added', function(snapshot) {
    console.log(snapshot.val());

    $('#chatBox').append('<p class="msg">' + snapshot.val().chat + '</p>');

    $('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);
  });
