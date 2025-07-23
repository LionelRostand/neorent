const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI; // Injecté depuis Kubernetes
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connexion à MongoDB réussie'))
.catch((err) => console.error('❌ Connexion à MongoDB échouée', err));