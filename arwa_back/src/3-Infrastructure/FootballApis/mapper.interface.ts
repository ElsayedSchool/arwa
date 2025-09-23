import { response } from 'express';

export interface ICountry {
  name: string;
  code: string;
  flag: string;
}

export interface ICountryResponse {
  response: ICountry[];
}
