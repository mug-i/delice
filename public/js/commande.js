// Liste de tous les <select> pour les commandes
let selects = document.querySelectorAll('.commande select');

/**
 * Modifie l'état d'une commande sur le serveur.
 * @param {InputEvent} event Objet d'information sur l'événement.
 */
const modifyEtatCommande = async (event) => {

    let data = {
        idCommande: parseInt(event.target.parentNode.parentNode.dataset.idCommande),
        idEtatCommande: parseInt(event.target.value)
    };

    await fetch('/commande', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

// Ajoute l'exécution de la fonction "modifyEtatCommande" pour chaque <select> 
// lorsque son état change.
for (let select of selects) {
    select.addEventListener('change', modifyEtatCommande)
}

//ouverture du canal sse
let source = new EventSource('/api/stream');

source.addEventListener('nouvelle-commande-ajouter',(event)=>{
    let data = JSON.parse(event.data)
   
    let idcom = (data.id - 1);
    console.log(data.commande[idcom].id_commande);
    
    const id = document.createElement("div") ;
    id.className = 'id';
    id.innerText = data.commande[idcom].id_commande;
    const date = document.createElement("div");
    date.className = 'date';
    date.innerText =data.commande[idcom].date;
    console.log('etatcommande-'+data.commande[idcom].id_commande)
    const etat = document.createElement("select");
    const option = document.createElement("option");
    etat.appendChild(option)
    option.value = data.commande[idcom].id_ete_commande ;
    
    etat.id = 'etatcommande-'+data.commande[idcom].id_commande;
    const img = document.createElement("img")
    img.className = 'img-'+data.commande[idcom].id_commande;
    img.src = data.commande[idcom].produit[0].chemin_image;
    const nom = document.createElement("td")
    nom.className = 'nom-'+data.commande[idcom].id_commande;
    nom.innerText  = data.commande[idcom].produit[0].nom;
    const qte = document.createElement("td")
    nom.className = 'quantite-'+data.commande[idcom].id_commande;
    qte.innerText  = data.commande[idcom].produit[0].quantite;
    const info = document.createElement("div");
    info.className = 'info';
    info.appendChild(id);
    info.appendChild(date);
    info.appendChild(etat);
    info.appendChild(img);
    info.appendChild(nom);
    info.appendChild(qte);

    const table = document.createElement("table")
    const thead = document.createElement("thead")
    const trow = document.createElement("tr");
    const th = document.createElement("th");
    const th1 = document.createElement("th");
    th1.className = 'nom'
    th1.innerText = 'Produit'
    const th2 = document.createElement("th");
    th2.className = 'quantite'
    th2.innerText = 'Quantité'
    trow.appendChild(th)
    trow.appendChild(th1)
    trow.appendChild(th2)
    thead.appendChild(trow)

    const tbody = document.createElement("tbody");
    const trow1 = document.createElement("tr");
    const tdimg = document.createElement("td");
    trow1.id = data.commande[idcom].id_commande
    tdimg.appendChild(img);
    trow1.appendChild(tdimg);
    trow1.appendChild(nom);
    trow1.appendChild(qte);
    tbody.appendChild(trow1)

    table.appendChild(thead);
    table.appendChild(tbody);


    const ul = document.createElement("ul")
    const li = document.createElement("li")
    li.id =data.commande[idcom].id_commande
    li.appendChild(info);
    li.appendChild(table)
    ul.className = 'commande'; 
    ul.appendChild(li);
    
    const section = document.getElementById('section')
    section.appendChild(ul) 

console.log("add");
});

source.addEventListener  ('etat-commande-changer',(event)=>{
    let data = JSON.parse(event.data)
    const etat = document.getElementById('etatcommande-' + data.id)
    etat.value = data.idEtat;
    console.log("changed");                   
});