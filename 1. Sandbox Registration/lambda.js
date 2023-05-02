import axios from 'axios';

const EMAIL_PATTERN =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const isValidRequestBody = ({ first_name, last_name, work_email, trading_name, business_model }) => {
  const noSpecialCharacters = /[!@#$%^*()_+=\[\]{};:"\\|,<>\/?]+/; // Regex to check if the regex contains special characters
  const isValidFirstName = !noSpecialCharacters.test(first_name);
  const isValidLastName = !noSpecialCharacters.test(last_name);
  const isValidBusinessName = !noSpecialCharacters.test(trading_name);
  const isValidEmail = EMAIL_PATTERN.test(work_email);
  const isValidBusinessModel = business_model === 'merchant';

  return isValidFirstName && isValidLastName && isValidEmail && isValidBusinessName && isValidBusinessModel;
};

export default async function handler(req, res) {
  if (req.method === 'POST' && isValidRequestBody(req.body)) {
    const { first_name, last_name, work_email, trading_name, business_model } = req.body;

    try {
      const nasAccount = await axios.post(
        process.env.NAS_API_URL || '',
        { first_name, last_name, work_email, trading_name, business_model },
        { headers: { 'X-API-KEY': process.env.NAS_API_AUTH_KEY ?? '' } },
      );

      for (const key in nasAccount.headers) {
        res.setHeader(key, nasAccount.headers[key]);
      }

      res.status(nasAccount.status);
      res.end();
    } catch (error) {
      const statusCode = error?.response?.status || 500;

      res.status(statusCode).json({ ...error?.response?.data });
      res.end();
    }
  } else {
    res.status(400);
    res.end();
  }
}
