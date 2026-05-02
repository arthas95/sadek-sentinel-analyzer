async function calculerHash(blob){
  const buffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256',buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convertit le résultat
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Formate en hexadécimal

}

// On écoute les changements dans les téléchargements
browser.downloads.onChanged.addListener(async (delta) => {
  
  // On vérifie si le téléchargement vient de se terminer (state: "complete")
  if (delta.state && delta.state.current === "complete") {
    
    // On demande les détails complets de ce téléchargement précis via son ID
    browser.downloads.search({ id: delta.id }).then(async (items) => {
      if (items.length > 0) {
        const fichier = items[0];
        
        console.log("Fichier récupéré !");
        console.log("Nom :", fichier.filename);
        console.log("Chemin local :", fichier.filename); 
        let nomFichier = fichier.filename;
        let hash;
        try {
          const reponse = await fetch(fichier.url);
          const blob = await reponse.blob();
          console.log("Contenu récupéré (taille) :", blob.size);
          hash = await calculerHash(blob);
          console.log("Hash SHA-256 calculé :", hash);

        }catch (error){
          console.error("Erreur lors de la récupération du contenu :", error);
            // Parfois, si l'URL est à usage unique ou protégée, le fetch échoue.
        }
        if (nomFichier != null){
          browser.notifications.create({
            "type": "basic",
            "iconUrl": browser.runtime.getURL("icons/warning.png"),
            "title": "ALERTE SECURITE ! ",
            "message": "Nouveau fichier telecharger " + nomFichier + "HASH : " + hash
          });
        }
        // C'est ICI que vous lanceriez votre fonction pour :
        // 1. Lire le fichier
        // 2. Calculer le Hash
        // 3. Envoyer à votre API Docker
      }
    });
  }
});