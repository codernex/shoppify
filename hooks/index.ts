import axios from 'axios';


function generateRequestParameter(method:string, params:string) {
  return {
    jsonrpc: '2.0',
    id: 1,
    method: method,
    params: params
  };
}
export const UseAddressCheck = async requestData => {
  const response = await axios.post(
    'http://localhost:3001/endereco',
    generateRequestParameter('addressCheck', requestData)
  );

  return response.data.result;
};

export const getZipCodeAutoComplete = async (requestData: {
  zipCode:string
}) => {
  const response = await axios.post(
    'http://localhost:3001/endereco',
      {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "nameCheck",
        "params": {
         "zipCode":
        }
      }

  );
  generateRequestParameter('postCodeAutocomplete', requestData)
  return response.data.result;
};

export const UseCityNameAutocomplete = async requestData => {
  const response = await axios.post(
    'http://localhost:3001/endereco',
    generateRequestParameter('cityNameAutocomplete', requestData)
  );

  return response.data.result;
};

export const UseStreetAutocomplete = async requestData => {
  const response = await axios.post(
    'http://localhost:3001/endereco',
    generateRequestParameter('streetAutocomplete', requestData)
  );

  return response.data.result;
};

// export const UseEmailCheck = async requestData => {
//   const response = await axios.post(
//     'http://localhost:3001/endereco',
//     generateRequestParameter('emailCheck', requestData)
//   );

//   return response.data.result;
// };

export const getNameCheck = async ({lastName,firstName,salutation}: {firstName:string,lastName:string,salutation:string}) => {
  const response = await axios.post(
    'http://localhost:3001/endereco',
      {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "nameCheck",
        "params": {
          "salutation":salutation ,
          "firstName": firstName,
          "lastName": lastName
        }
      }
  );
  return response.data.result;
};

export const UsePhoneCheck = async requestData => {
  const response = await axios.post(
    'http://localhost:3001/endereco',
    generateRequestParameter('phoneCheck', requestData)
  );

  return response.data.result;
};

export const UseIbanCheck = async requestData => {
  const response = await axios.post(
    'http://localhost:3001/endereco',
    generateRequestParameter('ibanCheck', requestData)
  );

  return response.data.result;
};

export const UseVatIdCheck = async requestData => {
  const response = await axios.post(
    'http://localhost:3001/endereco',
    generateRequestParameter('vatIdCheck', requestData)
  );

  return response.data.result;
};



export const loadCountryStates = async (countryId:string) => {
  const response = await axios.post('http://localhost:3001/countryData', {
    countryId
  });
  return response.data.states as CountryState[];
};
