import connectionPromise from "../connexion.js";
// Fonction pour insérer un nouveau message dans la table messages
export async function insererMessage(name, email, message) {
  let connection = await connectionPromise;
  await connection.run(
    `INSERT INTO messages (name, email, message) VALUES (?, ?, ?)`,
    [name, email, message]
  );
}

export async function getMessage() {
  let connection = await connectionPromise;
  let result = await connection.all(`SELECT * FROM messages`);
  return result;
}

//pour supprimer les messages traite cote admin

export async function supprimerMessageTraite(id_message) {
  let connection = await connectionPromise;
  await connection.run(` DELETE FROM messages WHERE id_message = ?;`, [
    id_message,
  ]);
}
