const DEFAULT_BUSINESS_MODEL = 'merchant';
const DUPLICATE_EMAIL_RESPONSE_CODE = 'client_with_same_email_already_exists';
const EMAIL_IN_USE_ERROR_CODE = 'email_address_is_already_registered_as_admin_on_another_client';

const formSubmissionStatus = {
  emailExistsError: 1,
  submitted: 2,
  unknownError: 3,
};

// Current form submission status
let formStatus = null;

/**
 * Returns data corresponding to all fields specified in the array.
 * @param gate GC instance to interact with.
 * @param keys Keys of the fields to pull data from.
 * @returns
 */
const getGCFormValues = (gate, keys) => {
  return keys.map((k) => gate.form.getFieldById(k)?.getValue());
};

const isAPIErrorException = (error) => {
  return error.response.data.request_id !== undefined;
};

const preFormSubmission = async (event) => {
  const gateInstance = event.detail;

  const [first_name, last_name, work_email, trading_name] = getGCFormValues(gateInstance, [
    'first_name',
    'last_name',
    'email',
    'company',
  ]);

  const nasApiData = {
    first_name,
    last_name,
    work_email,
    trading_name,
    business_model: DEFAULT_BUSINESS_MODEL,
  };

  if (work_email.endsWith('@checkout.com')) {
    formStatus = formSubmissionStatus.emailExistsError;
    return;
  }

  try {
    //This maps to our API route within the NextJS app, will need changing.
    await axios.post('api/nas-sandbox-account', nasApiData);
    formStatus = formSubmissionStatus.submitted;
    setFormData({ name: first_name, email: work_email });
  } catch (error) {
    if (
      isAPIErrorException(error) &&
      (error.response.data.error_codes.includes(DUPLICATE_EMAIL_RESPONSE_CODE) ||
        error.response.data.error_codes.includes(EMAIL_IN_USE_ERROR_CODE))
    ) {
      formStatus = formSubmissionStatus.emailExistsError;
    } else {
      formStatus = formSubmissionStatus.unknownError;
    }
  }
};

window.addEventListener('gcdcGateSubmit', preFormSubmission);
