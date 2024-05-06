export async function sendAPIData(userData) {
    const apiUrl = 'https://hooks.zapier.com/hooks/catch/6844401/3sjq5ou/';
    const email = "theodore.abitbol@gmail.com";
    const fullUrl = `${apiUrl}?em=${encodeURIComponent(email)}`;

    const bodyData = {
        "data": {
            "type_modele": userData.type_modele,
            "achat_ou_leasing": userData.achat_ou_leasing,
            "vehicule_neuf_ou_location": userData.vehicule_neuf_ou_location,
            "duree_leasing": userData.duree_leasing,
            "nom": userData.nom,
            "prenom": userData.prenom,
            "ville": userData.ville,
            "telephone": userData.telephone
        }
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
    };

    try {
        const response = await fetch(fullUrl, requestOptions);
        const data = await response.json();
        console.log('Success:', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
