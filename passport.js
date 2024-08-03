
module.exports = function(app) {
    // Código de passport.js aquí


// Configuración de Passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;



passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, cb) => {
  // Buscar usuario en la base de datos
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [profile.emails[0].value], (err, results) => {
    if (err) return cb(err);
    if (results.length === 0) {
      // Crear nuevo usuario
      const user = {
        name: profile.displayName,
        email: profile.emails[0].value,
      };
      const sql = 'INSERT INTO users SET ?';
      db.query(sql, user, (err, result) => {
        if (err) return cb(err);
        return cb(null, user);
      });
    } else {
      // Usuario ya existe, devuelve el usuario
      return cb(null, results[0]);
    }
  });
}));

// Serializar usuario
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

// Deserializar usuario
passport.deserializeUser((id, cb) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return cb(err);
    return cb(null, results[0]);
  });
});

// Ruta de registro con Google
app.get('/google-signin', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Ruta de registro con Google
app.get('/google-signin', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Ruta de callback de Google
app.get('/google-signin/callback', passport.authenticate('google', {
  failureRedirect: '/login',
}), (req, res) => {
  // Usuario autenticado, redirige a la página de inicio
  res.redirect('/home');
});
// ...

//Registro con google
app.post('/google-signin', (req, res) => {
  // Obtiene la información de autenticación de Google
  const { token, profile } = req.body;

  // Verifica la autenticación de Google
  const googleAuth = new google.auth.GoogleAuth({
    client_id: '657010755227-s3107hftc344175lfcejt24a60ibc1gr.apps.googleusercontent.com',
  });
  googleAuth.verifyIdToken(token, (error, result) => {
    if (error) {
      return res.status(401).send({ error: 'Autenticación inválida' });
    }

    // Obtiene la información del perfil de Google
    const { name, email } = profile;

    // Busca el usuario en la base de datos
    const user = User.findOne({ email });

    if (!user) {
      // Crea un nuevo usuario
      const newUser = new User({
        name,
        email,
      });
      newUser.save((error) => {
        if (error) {
          return res.status(500).send({ error: 'Error al crear usuario' });
        }
        // Inicia la sesión del usuario
        req.session.user = newUser;
        req.session.save((error) => {
          if (error) {
            return res.status(500).send({ error: 'Error al iniciar sesión' });
          }
          // Redirige a la página de inicio con la sesión iniciada
          res.redirect('/home');
        });
      });
    } else {
      // Inicia la sesión del usuario existente
      req.session.user = user;
      req.session.save((error) => {
        if (error) {
          return res.status(500).send({ error: 'Error al iniciar sesión' });
        }
        // Redirige a la página de inicio con la sesión iniciada
        res.redirect('/home');
      });
    }
  });
});


// Ruta de inicio con sesión
app.get('/home', (req, res) => {
  if (req.session.user) {
    // Muestra el mensaje de éxito
    res.send(`¡Bienvenido, ${req.session.user.name}!`);
  } else {
    // Redirige a la página de inicio sin sesión
    res.redirect('/login');
  }
});



module.exports = function(passport) {
    // Configuración de autenticación con Passport
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/google-signin/callback'
    }, (accessToken, refreshToken, profile, cb) => {
      // ...
    }));
  };

    app.get('/google-signin', passport.authenticate('google', {
      // ...
    }));
  };
