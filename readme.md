# Sadek Sentinel: Browser Malware Hash Analyzer

## 🎯 Objectif du Projet
Développer une extension Firefox orientée sécurité permettant d'analyser en temps réel l'intégrité des fichiers téléchargés. L'outil calcule l'empreinte numérique (Hash SHA-256) de chaque nouveau téléchargement et l'envoie à une instance privée (Docker) pour vérification.

## 🛠️ État Actuel du Développement
Le socle technique de l'extension est fonctionnel :
- [x] **Détection automatique** : L'extension écoute les événements de téléchargement de Firefox.
- [x] **Lecture Binaire** : Contournement des restrictions CORS via les permissions `<all_urls>` pour accéder au flux de données.
- [x] **Calcul de Hash** : Intégration de l'API WebCrypto pour générer des empreintes SHA-256 natives.
- [x] **Notifications** : Système d'alerte utilisateur via les notifications natives du navigateur.

## 🏗️ Architecture
- **Frontend** : Extension WebExtension (JavaScript/Manifest V2).
- **Backend (À venir)** : Serveur API conteneurisé (Docker) hébergeant une base de signatures ou un moteur de scan type ClamAV.

## 🛡️ Confidentialité
L'extension est conçue pour respecter la vie privée : elle n'envoie que le **hash** du fichier à l'API, et non le fichier complet, garantissant que les données personnelles ne quittent jamais la machine de l'utilisateur.