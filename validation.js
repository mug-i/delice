import { getPanier } from "./model/panier.js";

/**
 * Valide un identifiant (ID) reçu par le serveur.
 * @param {*} id L'identifiant à valider.
 * @returns Une valeur booléenne indiquant si l'identifiant est valide ou non.
 */
export const validateId = (id) => {
    return !!id &&
        typeof id === 'number' &&
        Number.isInteger(id) &&
        id > 0;
}

/**
 * Valide le panier dans la base de données du serveur.
 * @returns Une valeur booléenne indiquant si le panier est valide ou non.
 */
export const validatePanier = async () => {
    let panier = await getPanier();
    return panier.length > 0;
}

export const IsIdentifiantValid = (identifiant) =>
typeof identifiant === 'string' && 
identifiant.length >= 8;

export const IsMOtdepasseValid = (motDePasse) =>
typeof motDePasse === 'string' &&
motDePasse.length >= 8;

export const IsnomValid = (nom) =>
typeof nom ==='string';

export const IsprenomValid = (prenom) =>
typeof prenom ==='string';
