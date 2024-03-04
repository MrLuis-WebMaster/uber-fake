import * as dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const configDefault = {
  baseURL: 'https://sandbox.wompi.co/v1',
};

const fetchingPublic = axios.create({
  ...configDefault,
});

const fetchingPrivate = axios.create({
  ...configDefault,
  headers: {
    Authorization: `Bearer ${process.env.PRIVATE_KEY_WOMPI}`,
  },
});

export { fetchingPublic, fetchingPrivate };
