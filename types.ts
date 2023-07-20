export interface CityData {
  cityName: string;
  postCode: string;
  subdivisionCode: string;
}

export interface ZipCodeResponse {
  cityName: string;
  postCode: string;
  subdivisionCode: string;
}

export interface CountryState {
  id: string;
  shortCode: string;
  name: string;
}

export interface CountryData {
  countryId: string;
  countryCode: string;
  language: string;
  countryName: string;
}

export interface NameCheck {
  salutation: string;
  firstName: string;
  lastName: string;
}

export type NameCheckResponse = {
  predictions: NameCheck[];
  score: string;
  status: string[];
};

export interface StreetData {
  additionalInfo: string;
  buildingNumber: string;
  street: string;
  streetName: string;
}

export interface WrongAddressData {
  originalAddress: {
    street: string;
    cityName: string;
    houseNumber: string;
    postCode: string;
  };
  predictions?: PredictionForAddress;
  status?: string[];
}

export interface PredictionForAddress {
  street: string;
  cityName: string;
  houseNumber: string;
  postCode: string;
}
