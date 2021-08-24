import React from "react";
import axios from "axios";
import fetchedPatients from "../fetchedPatients";

import { Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { useParams } from "react-router-dom";
import { useStateValue, updatePatient } from "../state";
import { Icon } from "semantic-ui-react";
import { SemanticICONS } from "semantic-ui-react/dist/commonjs/generic";

const PatientInfoPage = () => {

  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  
  const patientToShow = Object.values(patients).find((patient: Patient) => patient.id === id);
  const gender = patientToShow?.gender;

  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(updatePatient(patient));
      } catch (e) {
        console.error(e);
      }
    };
    //checking if the patient page has been opened already
    //if not, the patient data is fetched
    if (patientToShow !== undefined && !(fetchedPatients.includes(patientToShow.id))) {
      void fetchPatient();
      fetchedPatients.push(patientToShow.id);
    }
  }, [dispatch]);


  let icon: SemanticICONS;
  if (gender === 'female') {
    icon = 'venus';
  } else if (gender === 'male') {
    icon = 'mars';
  } else {
    icon = 'genderless';
  }

  if (patientToShow) {
    return (
      <div className="App">
        <h2>{patientToShow.name}<Icon name={icon}/></h2>
        <p>ssn: {patientToShow.ssn}</p>
        <p>occupation: {patientToShow.occupation}</p>
      </div>
    );
  }
  else {
    return (
      <h2>cannot find patient</h2>
    );
  }
};

export default PatientInfoPage;