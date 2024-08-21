require('dotenv').config();  // Carga variables de entorno

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const helmet = require('helmet');  // Middleware de seguridad

const session = require('express-session');
const app = express();
const port = 3100;

// Configuración de middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'MIT'
});
//Verificacion del nombre de usuario
db.connect(err => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

app.use(session({
  secret: 'mi secreto',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Ruta de Inicio de Sesión
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: 'Email o contraseña inválidos' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Email o contraseña inválidos' });

    // Asignar el valor de user a req.session
    req.session.user = user;

    // Generar token de autenticación JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  });
});

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.get('/api/user-info', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ username: req.session.user.name });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Rutas para páginas estáticas
app.get('/acerca', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'acerca.html'));
});

app.get('/ayuda', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'ayuda.html'));
});

app.get('/funcionamiento', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'funcionamiento.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/foro', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'foro.html'));
});

app.get('/progreso', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'progreso.html'));
});

app.get('/perfil', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'perfil.html'));
});

app.get('/hitos', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'hitos.html'));
});

app.get('/actividades-0-1', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'actividades-0-1.html'));
});

app.get('/actividades-1-2', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'actividades-1-2.html'));
});

app.get('/actividades-2-3', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'actividades-2-3.html'));
});

app.get('/actividades-3-5', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'actividades-3-5.html'));
});

app.get('/guias', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'guias.html'));
});

app.get('/terapias', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'terapias.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Ruta de Registro
app.post('/api/register', (req, res) => {
  const { name, email, password, registrationDate } = req.body;

  if (!name || !email || !password || !registrationDate) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }
  db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
    console.log('Error:', err); // Agrega esta línea para verificar si hay errores
  });
  
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.log('Error al cifrar la contraseña:', err); // Agrega esta línea para verificar si hay errores
      return res.status(500).json({ message: 'Error en el cifrado de la contraseña' });
    }

    const user = { name, email, password: hash, registration_date: registrationDate };

    const sql = 'INSERT INTO users SET ?';

    db.query(sql, user, (err, result) => {
      if (err) {
        console.log('Error al insertar el usuario:', err); // Agrega esta línea para verificar si hay errores
        return res.status(500).json({ message: 'Error al guardar el usuario', error: err.message });
      }
      res.status(200).json({ success: true, message: 'Usuario registrado exitosamente' });
    });
  });
});



// Ruta para manejar el inicio de sesión
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Validar las credenciales (esto es solo un ejemplo)
  if (email === 'usuario@example.com' && password === 'contraseña') {
      // Generar un token
      const token = jwt.sign({ email }, 'clave_secreta', { expiresIn: '1h' });

      // Enviar el token en la respuesta
      res.json({ token });
  } else {
      res.status(401).json({ error: 'Credenciales incorrectas' });
  }
});



// Ruta de Recuperación de Contraseña
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Email no encontrado' });

    const user = results[0];
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '15m' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Restablecer Contraseña',
      text: `Haz clic en el enlace para restablecer tu contraseña: http://localhost:${port}/reset-password?token=${token}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(500).json({ error: error.message });
      res.json({ message: 'Email de recuperación enviado' });
    });
  });
});

// Ruta para Restablecer Contraseña
app.post('/api/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) return res.status(400).json({ message: 'Token inválido' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    db.query(query, [hashedPassword, decoded.id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Contraseña restablecida exitosamente' });
    });
  });
});

// Ruta de Cierre de Sesión (Logout)
app.post('/api/logout', (req, res) => {
  res.json({ message: 'Sesión cerrada exitosamente' });
});

// Ruta para el registro con Google
app.post('/google-signin', async (req, res) => {
  const { tokenId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { email, name } = ticket.getPayload();

    const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
    db.query(sql, [name, email], (err, result) => {
      if (err) {
        console.error('Error al guardar el usuario con Google:', err);
        return res.status(500).json({ message: 'Error al guardar el usuario', error: err.message });
      }
      res.status(200).json({ success: true, message: 'Usuario registrado exitosamente' });
    });
  } catch (error) {
    console.error('Error en el registro con Google:', error);
    res.status(500).json({ message: 'Error en el registro con Google', error: error.message });
  }
});


//Verificar autenticacion
function verificarAutenticacion() {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/login';
    return;
  }

  fetch('/api/verificar-autenticacion', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then((response) => response.json())
  .then((data) => {
    if (!data.autenticado) {
      window.location.href = '/login';
    }
  })
  .catch((err) => {
    console.error('Error:', err);
  });
}


// Inicio del servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});

