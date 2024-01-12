// app.post("/logout", (req, res) => {
//     const sessionId = req.session.id;

//     req.session.destroy(() => {
//       // disconnect all Socket.IO connections linked to this session ID
//       io.in(sessionId).disconnectSockets();
//       res.status(204).end();
//     });
//   });
