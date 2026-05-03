async function afficherDerniereAnalyse() {
  const result = await browser.storage.local.get("derniereAnalyse");
  const analyse = result.derniereAnalyse;

  if (!analyse) {
    return;
  }

  document.getElementById("last-file").textContent = analyse.nomFichier;
  document.getElementById("hash").textContent = analyse.hash;

  const verdictElement = document.getElementById("verdict");

  if (analyse.isMalware === true) {
    verdictElement.textContent = "Fichier suspect détecté";
    verdictElement.className = "value danger";
  } else {
    verdictElement.textContent = "Non reconnu comme malveillant";
    verdictElement.className = "value clean";
  }
}

afficherDerniereAnalyse();