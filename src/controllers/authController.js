const admin = require("firebase-admin");
const pool = require('../config/db');

const login = async (req, res) => {
  // Extraer el token del encabezado Authorization
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    // Verificar token con Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const userData = {
      p_uid: decodedToken.uid,
      p_nombre: decodedToken.name || "",
      p_email: decodedToken.email || ""
    };

    // Consultar si el usuario ya existe
    const [rows] = await pool.query('CALL SP_Obt_Uid(?)', [userData.p_uid]);
    const userExists = rows[0].length > 0;

    if (!userExists) {
      // Insertar usuario si no existe
      await pool.query('CALL SP_Ins_Usuario(?, ?, ?)', [
        userData.p_uid,
        userData.p_nombre,
        userData.p_email,
      ]);
    }
    else{
      console.log("Usuario ya existe",userExists);
      return res.status(200).json({ message: 'Autenticado correctamente', user: userExists });
    }
    
    return res.status(200).json({ message: 'Registrado correctamente', user: userData });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = { login };

