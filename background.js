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
         if (fichier.fileSize > 50 * 1024 * 1024) {
        console.warn("Fichier trop gros, hash ignoré pour éviter surcharge mémoire.");
        return;
        }
        console.log("Fichier récupéré !");
        console.log("Nom :", fichier.filename);
        console.log("Chemin local :", fichier.filename); 


        let nomFichier = fichier.filename;
        let hash;
        let isMalware = null;
        try {
          const reponse = await fetch(fichier.url);
          const blob = await reponse.blob();


          console.log("Contenu récupéré (taille) :", blob.size);

          hash = await calculerHash(blob);
          console.log("Hash SHA-256 calculé :", hash);
          const reponseApiHash = await fetch("https://sentinel.sadek-it.fr/hash", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            hash: hash,
            algo: "sha256"
          })
        });
        const data = await reponseApiHash.json();
        isMalware = data.found;
        console.log(isMalware)




        }catch (error){
          console.error("Erreur lors de la récupération du contenu :", error);
            // Parfois, si l'URL est à usage unique ou protégée, le fetch échoue.
        }
        if (isMalware === true) {
        browser.notifications.create({
          type: "basic",
          iconUrl: browser.runtime.getURL("icons/warning.png"),
          title: "FICHIER SUSPECT DÉTECTÉ",
          message: "Le fichier " + nomFichier + " est reconnu dans une base de réputation malware.\nHash : " + hash
        });
      } else if (isMalware === false) {
        browser.notifications.create({
          type: "basic",
          iconUrl: browser.runtime.getURL("icons/check.png"),
          title: "Fichier analysé",
          message: "Le fichier " + nomFichier + " n'est pas reconnu comme malveillant.\nHash : " + hash
        });
      } else {
        browser.notifications.create({
          type: "basic",
          iconUrl: browser.runtime.getURL("icons/warning.png"),
          title: "Analyse non effectuée",
          message: "Impossible de déterminer la réputation du fichier : " + nomFichier
        });
      }
        await browser.storage.local.set({
        derniereAnalyse: {
          nomFichier: nomFichier,
          hash: hash,
          isMalware: isMalware,
          date: new Date().toLocaleString()
        }
});
      }
    });
  }
});