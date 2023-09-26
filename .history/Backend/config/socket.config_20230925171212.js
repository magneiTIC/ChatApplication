
module.exports = io => {
    io.on("connection", socket => {
      console.log("Utilisateur connecté");
  
      socket.on("disconnect", () => {
        console.log("Utilisateur déconnecté");
        socket.emit("Utilisateur déconnecté");
        socket.disconnect();
      });
    });

    // Listen for incoming chat messages
  socket.on('chat message', (data) => {
    console.log('Received message:', data);
  });
}