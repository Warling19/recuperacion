const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'wali123',
  database: 'recuperacion'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.post('/asignaciones', upload.single('archivo'), (req, res) => {
  const { nombre, matricula } = req.body;
  const archivoPath = req.file.path;

  const query = 'INSERT INTO asignaciones (nombre, matricula, archivo_path) VALUES (?, ?, ?)';
  db.query(query, [nombre, matricula, archivoPath], (err, result) => {
    if (err) {
      console.error('Error al insertar asignación en la base de datos:', err);
      res.status(500).json({ error: 'Error al procesar la asignación' });
    } else {
      console.log('Asignación almacenada correctamente');
      res.status(200).json({ message: 'Asignación almacenada correctamente' });
    }
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
