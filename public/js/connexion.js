const formAuth = document.getElementById('form-auth');
const inputIdentifiant = document.getElementById('input-identifiant');
const inputMotPasse = document.getElementById('input-mot-passe');
const formErreur = document.getElementById('form-erreur');

async function connexion(event) {
    event.preventDefault();

    let data = {
        courriel: inputIdentifiant.value,
        motDePasse: inputMotPasse.value
    };

    let response = await fetch('/api/connexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if(response.ok) {
        location.replace('/');
    }
    else if(response.status === 401) {
        let info = await response.json();
        
        if(info.erreur === 'mauvais_mot_de_passe') {
            formErreur.innerText = 'Mot de passe incorrect';
        }
        else if(info.erreur === 'mauvais_identifiant') {
            formErreur.innerText = 'L\'utilisateur n\'existe pas';
        }  
    }
}

formAuth.addEventListener('submit', connexion);