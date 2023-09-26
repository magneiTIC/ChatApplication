
module.exports = io => {
    io.on("connection", socket => {
      console.log("Utilisateur connecté");
  
      socket.on("disconnect", () => {
        console.log("Utilisateur déconnecté");
        socket.emit("Utilisateur déconnecté");
        socket.disconnect();
      });
    });

    // messages entrants
  socket.on('chat message', (data) => {
    console.log('Message reçu : ', data);
  });

  // Save the message to MongoDB
  const message = new Message({ user: data.user, text: data.message });
  message.save((err) => {
    if (err) {
      console.error('Error saving message to database:', err);
    } else {
      console.log('Message saved to the database');
    }
  });
}