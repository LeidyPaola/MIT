



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
app.use(helmet());  // Seguridad adicional

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'MIT'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

// Ruta de Inicio de Sesión
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: 'Email o contraseña inválidos' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Email o contraseña inválidos' });

    req.session.user = user;
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  });
});

// Ruta de Registro
app.post('/api/register', (req, res) => {
  const { name, email, password, registrationDate } = req.body;

  if (!name || !email || !password || !registrationDate) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: 'Error en el cifrado de la contraseña' });

    const user = { name, email, password: hash, registration_date: registrationDate };
    const sql = 'INSERT INTO users SET ?';
    db.query(sql, user, (err, result) => {
      if (err) return res.status(500).json({ message: 'Error al guardar el usuario', error: err.message });
      res.status(200).json({ success: true, message: 'Usuario registrado exitosamente' , user: { name, email } });
    });
  });
});

app.get('/api/user', (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ message: 'No hay usuario logueado' });
  res.json({ name: user.name, email: user.email });
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
app.post('/api/reset-password', async (req, res) => {
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
  req.session.destroy();
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
      if (err) return res.status(500).json({ message: 'Error al guardar el usuario', error: err.message });
      res.status(200).json({ success: true, message: 'Usuario registrado exitosamente' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro con Google', error: error.message });
  }
});

// Ruta para obtener la información del perfil del usuario
app.get('/api/profile/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(results[0]);
  });
});

// Ruta para actualizar el perfil del usuario
app.put('/api/profile/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  const updateFields = [];
  const values = [];
  
  if (name) {
    updateFields.push('name = ?');
    values.push(name);
  }
  if (email) {
    updateFields.push('email = ?');
    values.push(email);
  }
  if (password) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ error: err.message });
      updateFields.push('password = ?');
      values.push(hashedPassword);
      
      const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
      values.push(userId);

      db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Perfil actualizado exitosamente' });
      });
    });
  } else {
    const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    values.push(userId);

    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: 'Perfil actualizado exitosamente' });
    });
  }
});

// Ruta para eliminar el perfil del usuario
app.delete('/api/profile/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Perfil eliminado exitosamente' });
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});


function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect('/login');
  }
}

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

// Usar el middleware en las rutas protegidas
app.get('/home', isAuthenticated, (req, res) => {
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














