var express = require('express');
var app = express();
var pgp = require('pg-promise')();
var mustacheExpress = require('mustache-express');
var bodyParser = require("body-parser");
var session = require('express-session');
var db = pgp('postgres://saoun@localhost:5432/project2_db');

//auth info
const bcrypt = require('bcrypt');
const salt = bcrypt.genSalt(10);

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'project2',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.listen(3000, function(){
  console.log('listening on port 3000')
})

//main page to login
app.get('/', function(req, res){
  var logged_in, email;

  if(req.session.user){
    logged_in = true;
    email = req.session.user.email;
    var id = req.session.user.id;
    var name = req.session.user.name;

    db.any("SELECT * FROM todo WHERE user_id = $1", [id]).
      then(function(resData){
        var data = {
          'logged_in':logged_in,
          'email': email,
          'data': resData,
          'name': name
        }
        res.render('index', data);
      });
  } else {
    var data = {
      'logged_in':logged_in,
      'email': email
    }
    res.render('index', data);
  }
})

//logging in
app.post('/login', function(req, res){
  var data = req.body;
  var error = 'Authorization failed. Check your email / password'

  db.one(
    'SELECT * FROM users WHERE email = $1',
    [data.email]
    ).catch(function(){
      res.send(error);
    }).then(function(user){
        //check that their password hashed === password_digest:
      bcrypt.compare(data.password, user.password_digest, function(err, match){
        if(match){
          //user logged in
          req.session.user = user;
          res.redirect('/');
        } else {
          res.send(error)
        }
      });
    });
});

//generate signup page
app.get('/signup', function(req, res){
  res.render('signup/index');
})

//signing up
app.post('/signup', function(req,res){
  var data = req.body;

  bcrypt.hash(data.password, 10, function(err, hashed_password){

    db.none("INSERT INTO users (name, email, password_digest) VALUES ($1, $2, $3)",
    [data.name, data.email, hashed_password]
    ).catch(function(){
      res.send('Error. The user could not be created')
    }).then(function(){
      res.send('User created!')
    });

  });
});

//logging out
app.get('/logout', function(req, res){
  req.session.user = null;
  res.redirect('/');
})


//posting to todo
app.post('/add_item', function(req, res){
  console.log(req.body)
  todo = req.body


  db.one('INSERT INTO todo (info, done, user_id) VALUES ($1, $2, $3) RETURNING id', [todo.info, false, req.session.user.id])
  .catch(function(){
    console.log('Error, could not add todo')
  })
  .then(function(id){
    console.log('id', id);
    res.success = id;
    res.send(id)
    // res.redirect('/')
  });
});

//edit todo
app.put('/edit_item'), function(req, res){
  console.log(req.body)
  todo = req.body

  db.none('UPDATE todo SET info=$1 WHERE done=$2, id=$3',
    [todo.info, false]).then(function(data){
      console.log('update done')
      res.json(todo)
    })
}

//delete todo
app.delete('/todo/:id', function(req, res){
  id = req.params.id
  db.none("DELETE FROM todo WHERE id=$1",[id]).then(function(data){
      console.log('delete done!!!!!')
      res.render('index')
    })
})

//edit todo for 'done!'
app.put('/todo/:id', function(req, res){
  console.log('request', req.params)
  var id = req.params.id
  db.none('UPDATE todo SET done = true WHERE id=$1',
    [id]).then(function(data){
      console.log('data', data)
      console.log('boolean done')
      res.json(data)
    }).catch(function(err){
      console.log(err);
      res.error = "nope"
    });

})






