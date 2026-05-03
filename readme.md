🛡️ HashDetectMalware / Sadek Sentinel Analyzer

🎯 Présentation

HashDetectMalware est une extension Firefox de sécurité développée dans le cadre du projet Sadek Sentinel Analyzer.

L’objectif est de surveiller les fichiers téléchargés, de calculer automatiquement leur empreinte SHA-256, puis de vérifier leur réputation via une API distante de détection malware par hash.

Le projet reproduit une brique légère de cybersécurité : la détection par réputation de hash, sans envoyer le fichier complet vers un serveur antivirus.

🎯 Objectif du projet

Le but est de proposer une solution simple permettant de répondre au besoin suivant :

Vérifier rapidement si un fichier téléchargé est connu comme malveillant, sans transmettre le fichier complet à un serveur externe.

Au lieu d’envoyer un fichier potentiellement volumineux, l’extension calcule localement son hash SHA-256, puis transmet uniquement cette empreinte à une API de réputation.

⚙️ Fonctionnement général

Le flux de fonctionnement est le suivant :

1. Firefox termine un téléchargement.
2. L’extension détecte automatiquement l’événement.
3. Le fichier est récupéré par l’extension.
4. Son hash SHA-256 est calculé localement.
5. Le hash est envoyé à l’API POST /hash.
6. L’API interroge une source de réputation malware.
7. L’extension reçoit un verdict.
8. Une notification informe l’utilisateur.

🏗️ Architecture

```text
Téléchargement Firefox
        |
        v
Extension WebExtension
        |
        | Calcul local du SHA-256
        v
Hash du fichier
        |
        | POST /hash
        v
API HashDetectMalware
        |
        | Lookup réputation
        v
Team Cymru Malware Hash Registry
        |
        v
Verdict : found / clean / malware
```

🧩 Composants techniques

Extension Firefox

L’extension est basée sur :

* JavaScript
* Manifest V2
* WebExtension API
* browser.downloads
* browser.notifications
* browser.storage
* WebCrypto API pour le calcul SHA-256

API de réputation

Le backend est un micro-service HTTP développé avec :

* Python
* FastAPI
* Docker
* Docker Compose
* Team Cymru Malware Hash Registry

L’API reçoit un hash et son algorithme, valide les données, puis interroge la source de réputation.

🌐 Endpoint utilisé

```text
POST https://sentinel.sadek-it.fr/hash
```

Exemple de requête :

```bash
curl -X POST https://sentinel.sadek-it.fr/hash \
  -H "Content-Type: application/json" \
  -d '{"hash":"d378bffb70923139d6a4f546864aa61c","algo":"md5"}'
```

Exemple de réponse :

```json
{
  "found": false,
  "hash": "d378bffb70923139d6a4f546864aa61c",
  "algo": "md5",
  "verdict": "clean",
  "source": "team-cymru-mhr"
}
```

✅ État actuel du développement

Le socle principal est fonctionnel :

* détection automatique des téléchargements terminés
* récupération du fichier téléchargé
* calcul local du hash SHA-256
* envoi du hash à l’API distante
* récupération du verdict de réputation
* affichage de notifications Firefox
* ajout d’une limite de taille pour éviter une surcharge mémoire
* ajout d’une popup d’extension
* configuration d’un backend Dockerisé accessible en HTTPS

🔐 Confidentialité

HashDetectMalware applique une logique de minimisation des données.

L’extension n’envoie pas le contenu complet du fichier à l’API. Elle calcule localement l’empreinte du fichier, puis transmet uniquement le hash et l’algorithme utilisé.

Données envoyées :

* hash du fichier
* algorithme utilisé
* requête technique vers l’API

Données non envoyées :

* contenu complet du fichier
* mots de passe
* historique complet de navigation
* données personnelles volontairement collectées

⚠️ Limites actuelles

Ce projet ne remplace pas un antivirus complet.

Il s’agit d’une brique expérimentale de détection par réputation de hash. Si un hash n’est pas trouvé dans la source consultée, cela ne garantit pas que le fichier est totalement sûr. Cela signifie uniquement qu’il n’est pas connu comme malveillant dans cette source au moment de la requête.

Limites connues :

* les fichiers volumineux peuvent être ignorés pour éviter une surcharge mémoire
* le fichier peut être relu via son URL pour calculer le hash
* la détection dépend de la source de réputation interrogée
* aucune analyse dynamique du comportement du fichier n’est effectuée

🚀 Évolutions possibles

Améliorations envisagées :

* hash en streaming pour éviter le chargement complet en mémoire
* agent local via Native Messaging
* quarantaine locale des fichiers suspects
* ajout de plusieurs sources de threat intelligence
* historique local des analyses
* tableau de bord dans la popup
* mode professionnel avec politique de blocage configurable

📄 Licence

Ce projet est distribué sous licence MIT.

👨‍💻 Auteur

Projet réalisé par Sadek Adel.

GitHub : arthas95/sadek-sentinel-analyzer
