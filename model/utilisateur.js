import bcrypt from 'bcrypt'

import connectionPromise from "../connexion.js";

export async function addUtilisateur(courriel, motDePasse,nom,prenom) {
    let connection = await connectionPromise;

    let motDePasseEncrypte = await bcrypt.hash(motDePasse, 10);

    await connection.run(
        `INSERT INTO utilisateur(courriel, mot_de_passe, id_type_utilisateur,nom,prenom)
        VALUES (?, ?, 1,?,?)`,
        [courriel, motDePasseEncrypte,nom,prenom]
    )
}

export async function getUtilisateurById(id){
    const connection = await connectionPromise;

   let utilisateur = await connection.get(
        `SELECT *
        FROM utilisateur
        WHERE id_utilisateur = ?`,
        [id]
    );
    return utilisateur;
}

export async function getUtilisateurByIdentifiant(courriel){
    const connection = await connectionPromise;

    let utilisateur = await connection.get(
         `SELECT *
         FROM utilisateur
         WHERE courriel = ?`,
         [courriel]
     );
     return utilisateur;
}