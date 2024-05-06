import React, { useState } from 'react';
import { fetchTownName } from '../service layer/fetchTownAPI';
import { sendAPIData } from '../service layer/leadAPI';
import '../styles/DynamicForm.scss';

function DynamicForm() {
  const [step, setStep] = useState(1);
  const [modelType, setModelType] = useState('');
  const [interestType, setInterestType] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [leasingDuration, setLeasingDuration] = useState('');
  const [finishingForm, setFinishingForm] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [townResult, setTownResult] = useState('');
  const [modalOpen, setModalOpen] = useState(null);

  const handleModelTypeClick = (value) => {
    setModelType(value);
    setStep(step + 1);
  };

  const handleInterestTypeClick = (value) => {
    setInterestType(value);
    setStep(step + 1);
  };

  const handleVehicleTypeClick = (value) => {
    setVehicleType(value);
    setStep(step + 1);
  };

  const handleLeasingDurationClick = (value) => {
    setLeasingDuration(value);
    setStep(step + 1);
  };

  const handleFirstNameChange = (event) => {
    const { value } = event.target;
    setFirstName(value);
  };

  const handleLastNameChange = (event) => {
    const { value } = event.target;
    setLastName(value);
  };

  const handlePostalCodeChange = (event) => {
    const { value } = event.target;
    setPostalCode(value);
  };

  const handlePhoneNumberChange = (event) => {
    const { value } = event.target;
    setPhoneNumber(value);
  };

  const toggleModal = (event) => {
    event.preventDefault();
    setModalOpen(!modalOpen);
  }

  const handleFinishingForm = () => {
    if (validateTownName()) {
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      const formattedLeasingDuration = formatLeasingDuration(leasingDuration);
      
      const dataToSend = {
        type_modele: modelType,
        achat_ou_leasing: interestType,
        vehicule_neuf_ou_location: vehicleType,
        duree_leasing: formattedLeasingDuration,
        nom: lastName,
        prenom: firstName,
        ville: townResult.split(' ')[0],
        telephone: formattedPhoneNumber
      };
      console.log(dataToSend);
      sendAPIData(dataToSend);

      setModalOpen(!modalOpen);
      setFinishingForm(true);
      setStep(step + 1);
    }
  };

  const formatPhoneNumber = (number) => {
    return '+33' + number.substring(1);
  };

  const formatLeasingDuration = (duration) => {
    return duration.split(' ')[0] + 'M';
  };

  const validateTownName = () => {
    if (townResult === 'Ville inconnue !') {
      alert('Le nom de la ville n\'est pas correct !');
      return false;
    }
    return true;
  };

  const handleGetTownName = async () => {
    try {
      const townName = await fetchTownName(postalCode);
      let townNameWithCode;
      if (townName === 'Ville inconnue !') {
        townNameWithCode = townName;
      } else {
        const lastTwoDigits = postalCode.slice(-2);
        townNameWithCode = `${townName} ${lastTwoDigits}`;
      }
  
      setTownResult(townNameWithCode);
    } catch (error) {
      console.error('Error fetching town name:', error);
    }
  };
  

  const validateForm = () => {
    const nameValid = firstName.length >= 2 && firstName.length <= 15;
    const lastNameValid = lastName.length >= 2 && lastName.length <= 15;
    const postalCodeValid = /^\d{5}$/.test(postalCode);
    const phoneNumberValid = /^\d{10}$/.test(phoneNumber);

    if (!nameValid || !lastNameValid || !postalCodeValid || !phoneNumberValid) {
      alert('Le formulaire doit être rempli correctement !');
      return false;
    }
    return true;
  };

  const handleContinueClick = (event) => {
    event.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      toggleModal(event);
      handleGetTownName();
    }
  };
  
  return (
    <form>
      {step === 1 && (
        <div className='questions'>
          <h2>Quel est le type de modèle que vous <br/> souhaitez tester ?</h2>
          <button onClick={() => handleModelTypeClick('COMPACTE')}>COMPACTE</button>
          <button onClick={() => handleModelTypeClick('SUV')}>SUV</button>
          <button onClick={() => handleModelTypeClick('ELECTIQUE & HYBRIDE')}>ELECTIQUE & HYBRIDE</button>
          <button onClick={() => handleModelTypeClick('SPORTIVE')}>SPORTIVE</button>
        </div>
      )}

      {step === 2 && modelType && (
        <div className='questions'>
          <h2>Vous êtes intéressé par ?</h2>
          <button onClick={() => handleInterestTypeClick('UN ACHAT')}>UN ACHAT</button>
          <button onClick={() => handleInterestTypeClick('UN LEASING')}>UN LEASING</button>
        </div>
      )}

      {step === 3 && interestType === 'UN ACHAT' && (
        <div className='questions'>
          <h2>Pour quel type de véhicule ?</h2>
          <button onClick={() => handleVehicleTypeClick('NEUF')}>NEUF</button>
          <button onClick={() => handleVehicleTypeClick('OCCASION')}>OCCASION</button>
        </div>
      )}

      {step === 3 && interestType === 'UN LEASING' && (
        <div className='questions'>
          <h2>Pour quelle durée ?</h2>
          <button onClick={() => handleLeasingDurationClick('6 MOIS')}>6 MOIS</button>
          <button onClick={() => handleLeasingDurationClick('12 MOIS')}>12 MOIS</button>
          <button onClick={() => handleLeasingDurationClick('18 MOIS')}>18 MOIS</button>
          <button onClick={() => handleLeasingDurationClick('24 MOIS')}>24 MOIS</button>
        </div>
      )}

      {step === 4 && (
        <div className='coordonnees'>
          <h2>Vos coordonnées :</h2>
          <div className='ligne1'>
            <div className='prenom'>
                <p className='personalInfo'>PRÉNOM</p>
                <input type="text" placeholder='Écrire' value={firstName} onChange={handleFirstNameChange} />
            </div>
            <div className='nom'>
                <p className='personalInfo'>NOM</p>
                <input type="text" placeholder='Écrire' value={lastName} onChange={handleLastNameChange} />
            </div>
          </div>
          <div className='ligne2'>
            <div className='codePostal'>
                <p className='personalInfo'>CODE POSTAL</p>
                <input type="text" placeholder='XXXXX' value={postalCode} onChange={handlePostalCodeChange} />
            </div>
            <div className='telephone'>
                <p className='personalInfo'>TELEPHONE</p>
                <input type="text" placeholder='06 XX XX XX XX' value={phoneNumber} onChange={handlePhoneNumberChange} />
            </div>
          </div>
          <div className='buttonContinuez'>
            <button className='continuez' onClick={handleContinueClick}>CONTINUER</button>
          </div>
        </div>
      )}
      {finishingForm && (
        <div className='finishingText'>
          <p className='text1'>Votre réservation a bien été prise en compte. <br/> Vous serez contacté dans <span className='stressed'>un délai de 48H.</span></p>
          <div className='text2'><p>L’équipe Alfa Romeo, vous remercie.</p></div>
        </div>
      )}
      {modalOpen && (
        <div>
          <div className="modalBackground"></div>
          <div className='modal'>
            <div className='modalSelect'>
                <p>Confirmation de votre ville, pour la récupération de votre véhicule  :</p>
                <p className='townResult'>{townResult}</p>
            </div>
            <div className='modalButtons'>
                <button className='modifyButton' onClick={(event) => toggleModal(event)}>MODIFIER</button>
                <button type="button" className='continueButton' onClick={handleFinishingForm}>CONTINUER</button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

export default DynamicForm;
