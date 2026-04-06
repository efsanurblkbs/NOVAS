import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let token = req.headers.token;
  if (!token && req.headers.authorization) {
     token = req.headers.authorization.split(" ")[1];
  }
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "Geçersiz token!" });
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ error: "Kimlik doğrulama başarısız! (Token yok)" });
  }
};
