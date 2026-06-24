## Description
Un annuaire centralisé sécurisé facilitant le contrôle des accès, la gestion des profils et l'administration des identités au sein de l'organisation.

## Fonctionnalités
Annuaire complet avec création, modification et suspension de comptes

Gestion fine du contrôle d'accès basé sur les rôles (RBAC : Admin, Modérateur, Utilisateur)

Sécurisation des sessions utilisateurs et gestion des jetons d'accès

Tableau d'historique des connexions et des modifications de profils

## Technologies
React (TypeScript)

Node.js & Express

PostgreSQL (Schéma d'identité dédié)

Nginx & Docker

Bash
## Installation & Docker
cd user-management-app-Gemini
sudo docker compose up --build

## Spécificités et Configuration Réseau
🌐 Accès Web Principal   : http://localhost:3003
⚙️ Port Frontend (Nginx) : 3003 -> Panel d'administration IAM dédié
⚡ Port Backend (API)     : Validation des jetons et gestion de l'annuaire en interne
🐘 Base de données       : PostgreSQL configuré sur le port réseau externe 5435
