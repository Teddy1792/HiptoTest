export async function fetchTownName(postalCode) {
    try {
      const apiUrl = `https://geo.api.gouv.fr/communes?codePostal=${postalCode}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.length > 0) {
        return data[0].nom;
      } else {
        return 'Ville inconnue !';
      }
    } catch (error) {
      console.error('Error fetching town name:', error);
      return 'Error fetching town name';
    }
  }