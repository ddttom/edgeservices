const form = document.createElement('form');
form.method = 'POST';
form.action = 'https://reply57035.activehosted.com/proc.php';
form.id = '_form_11_';
form.classList.add('_form', '_form_11', '_inline-form', '_dark');
form.setAttribute('novalidate', '');
form.dataset.stylesVersion = '5';

const hiddenInputs = [
  { name: 'u', value: '11', 'data-name': 'u' },
  { name: 'f', value: '11', 'data-name': 'f' },
  { name: 's', 'data-name': 's' },
  { name: 'c', value: '0', 'data-name': 'c' },
  { name: 'm', value: '0', 'data-name': 'm' },
  { name: 'act', value: 'sub', 'data-name': 'act' },
  { name: 'v', value: '2', 'data-name': 'v' },
  { name: 'or', value: '60fd3bb597370402b0e762a34d9cc852', 'data-name': 'or' },
];

hiddenInputs.forEach((input) => {
  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'hidden';
  hiddenInput.name = input.name;
  hiddenInput.value = input.value;
  hiddenInput.dataset.name = input['data-name'];
  form.appendChild(hiddenInput);
});

const formContent = document.createElement('div');
formContent.classList.add('_form-content');

const titleElement = document.createElement('div');
titleElement.classList.add('_form_element', '_x02532642', '_full_width', '_clear');
const formTitle = document.createElement('div');
formTitle.classList.add('_form-title');
formTitle.textContent = "Let's talk about how we can help";
titleElement.appendChild(formTitle);
formContent.appendChild(titleElement);

const topicElement = document.createElement('div');
topicElement.classList.add('_form_element', '_x57245618', '_full_width');
const topicLabel = document.createElement('label');
topicLabel.htmlFor = 'field[7]';
topicLabel.classList.add('_form-label');
topicLabel.textContent = 'Contact Topic*';
const topicFieldWrapper = document.createElement('div');
topicFieldWrapper.classList.add('_field-wrapper');
const topicSelect = document.createElement('select');
topicSelect.name = 'field[7]';
topicSelect.id = 'field[7]';
topicSelect.required = true;
topicSelect.dataset.name = 'contact_topic';
const topicOptions = [
  { value: '', text: '' },
  { value: 'Content Management', text: 'Content Management' },
  { value: 'Customer Data Platforms', text: 'Customer Data Platforms' },
  { value: 'Digital Analytics', text: 'Digital Analytics' },
  { value: 'Digital Asset Management', text: 'Digital Asset Management' },
  { value: 'Digital Experience Optimisation', text: 'Digital Experience Optimisation' },
  { value: 'Other / General Enquiries', text: 'Other / General Enquiries' },
];
topicOptions.forEach((option) => {
  const optionElement = document.createElement('option');
  optionElement.value = option.value;
  optionElement.textContent = option.text;
  if (option.value === '') {
    optionElement.selected = true;
  }
  topicSelect.appendChild(optionElement);
});
topicFieldWrapper.appendChild(topicSelect);
topicElement.appendChild(topicLabel);
topicElement.appendChild(topicFieldWrapper);
formContent.appendChild(topicElement);

const firstNameElement = document.createElement('div');
firstNameElement.classList.add('_form_element', '_x51121472', '_full_width');
const firstNameLabel = document.createElement('label');
firstNameLabel.htmlFor = 'firstname';
firstNameLabel.classList.add('_form-label');
const firstNameFieldWrapper = document.createElement('div');
firstNameFieldWrapper.classList.add('_field-wrapper');
const firstNameInput = document.createElement('input');
firstNameInput.type = 'text';
firstNameInput.id = 'firstname';
firstNameInput.name = 'firstname';
firstNameInput.placeholder = 'First Name';
firstNameInput.dataset.name = 'firstname';
firstNameFieldWrapper.appendChild(firstNameInput);
firstNameElement.appendChild(firstNameLabel);
firstNameElement.appendChild(firstNameFieldWrapper);
formContent.appendChild(firstNameElement);

const lastNameElement = document.createElement('div');
lastNameElement.classList.add('_form_element', '_x74695995', '_full_width');
const lastNameLabel = document.createElement('label');
lastNameLabel.htmlFor = 'lastname';
lastNameLabel.classList.add('_form-label');
const lastNameFieldWrapper = document.createElement('div');
lastNameFieldWrapper.classList.add('_field-wrapper');
const lastNameInput = document.createElement('input');
lastNameInput.type = 'text';
lastNameInput.id = 'lastname';
lastNameInput.name = 'lastname';
lastNameInput.placeholder = 'Last Name';
lastNameInput.dataset.name = 'lastname';
lastNameFieldWrapper.appendChild(lastNameInput);
lastNameElement.appendChild(lastNameLabel);
lastNameElement.appendChild(lastNameFieldWrapper);
formContent.appendChild(lastNameElement);

const companyNameElement = document.createElement('div');
companyNameElement.classList.add('_form_element', '_x74888633', '_full_width');
const companyNameLabel = document.createElement('label');
companyNameLabel.htmlFor = 'field[1]';
companyNameLabel.classList.add('_form-label');
const companyNameFieldWrapper = document.createElement('div');
companyNameFieldWrapper.classList.add('_field-wrapper');
const companyNameInput = document.createElement('input');
companyNameInput.type = 'text';
companyNameInput.id = 'field[1]';
companyNameInput.name = 'field[1]';
companyNameInput.placeholder = 'Company Name';
companyNameInput.dataset.name = 'company_name';
companyNameFieldWrapper.appendChild(companyNameInput);
companyNameElement.appendChild(companyNameLabel);
companyNameElement.appendChild(companyNameFieldWrapper);
formContent.appendChild(companyNameElement);

const emailElement = document.createElement('div');
emailElement.classList.add('_form_element', '_x69622927', '_full_width');
const emailLabel = document.createElement('label');
emailLabel.htmlFor = 'email';
emailLabel.classList.add('_form-label');
const emailFieldWrapper = document.createElement('div');
emailFieldWrapper.classList.add('_field-wrapper');
const emailInput = document.createElement('input');
emailInput.type = 'text';
emailInput.id = 'email';
emailInput.name = 'email';
emailInput.placeholder = 'Email Address*';
emailInput.required = true;
emailInput.dataset.name = 'email';
emailFieldWrapper.appendChild(emailInput);
emailElement.appendChild(emailLabel);
emailElement.appendChild(emailFieldWrapper);
formContent.appendChild(emailElement);

const messageElement = document.createElement('div');
messageElement.classList.add('_form_element', '_x85627558', '_full_width');
const messageLabel = document.createElement('label');
messageLabel.htmlFor = 'field[5]';
messageLabel.classList.add('_form-label');
const messageFieldWrapper = document.createElement('div');
messageFieldWrapper.classList.add('_field-wrapper');
const messageTextarea = document.createElement('textarea');
messageTextarea.id = 'field[5]';
messageTextarea.name = 'field[5]';
messageTextarea.placeholder = ' How can we help?*';
messageTextarea.style.height = '127px';
messageTextarea.required = true;
messageTextarea.dataset.name = 'message';
messageFieldWrapper.appendChild(messageTextarea);
messageElement.appendChild(messageLabel);
messageElement.appendChild(messageFieldWrapper);
formContent.appendChild(messageElement);

const marketingConsentElement = document.createElement('div');
marketingConsentElement.classList.add('_form_element', '_x34508191', '_full_width');
const marketingConsentFieldset = document.createElement('fieldset');
marketingConsentFieldset.classList.add('_form-fieldset');
const marketingConsentLegendRow = document.createElement('div');
marketingConsentLegendRow.classList.add('_row');
const marketingConsentLegend = document.createElement('legend');
marketingConsentLegend.htmlFor = 'field[6][]';
marketingConsentLegend.classList.add('_form-label');
marketingConsentLegendRow.appendChild(marketingConsentLegend);
marketingConsentFieldset.appendChild(marketingConsentLegendRow);
const marketingConsentHiddenInput = document.createElement('input');
marketingConsentHiddenInput.dataset.autofill = 'false';
marketingConsentHiddenInput.type = 'hidden';
marketingConsentHiddenInput.id = 'field[6][]';
marketingConsentHiddenInput.name = 'field[6][]';
marketingConsentHiddenInput.value = '~|';
marketingConsentHiddenInput.dataset.name = 'marketing_consent';
marketingConsentFieldset.appendChild(marketingConsentHiddenInput);
const marketingConsentCheckboxRow = document.createElement('div');
marketingConsentCheckboxRow.classList.add('_row', '_checkbox-radio');
const marketingConsentCheckbox = document.createElement('input');
marketingConsentCheckbox.id = "field_6I'd like to receive other communications from Comwrap Reply";
marketingConsentCheckbox.type = 'checkbox';
marketingConsentCheckbox.name = 'field[6][]';
marketingConsentCheckbox.value = "I'd like to receive other communications from Comwrap Reply";
marketingConsentCheckbox.dataset.name = 'marketing_consent';
const marketingConsentCheckboxLabel = document.createElement('label');
marketingConsentCheckboxLabel.htmlFor = "field_6I'd like to receive other communications from Comwrap Reply";
marketingConsentCheckboxLabel.textContent = "I'd like to receive other communications from Comwrap Reply";
const marketingConsentCheckboxSpan = document.createElement('span');
marketingConsentCheckboxSpan.appendChild(marketingConsentCheckboxLabel);
marketingConsentCheckboxRow.appendChild(marketingConsentCheckbox);
marketingConsentCheckboxRow.appendChild(marketingConsentCheckboxSpan);
marketingConsentFieldset.appendChild(marketingConsentCheckboxRow);
marketingConsentElement.appendChild(marketingConsentFieldset);
formContent.appendChild(marketingConsentElement);

const recaptchaElement = document.createElement('div');
recaptchaElement.classList.add('_form_element', '_x48828861', '_full_width');
const recaptchaLabel = document.createElement('label');
recaptchaLabel.htmlFor = 'ls';
recaptchaLabel.classList.add('_form-label');
recaptchaLabel.textContent = 'Please verify your request.*';
const recaptchaDiv = document.createElement('div');
recaptchaDiv.classList.add('g-recaptcha');
recaptchaDiv.dataset.sitekey = '6LcwIw8TAAAAACP1ysM08EhCgzd6q5JAOUR1a0Go';
recaptchaDiv.id = 'recaptcha_0';
const recaptchaInnerDiv = document.createElement('div');
recaptchaInnerDiv.style.width = '304px';
recaptchaInnerDiv.style.height = '78px';
const recaptchaIframe = document.createElement('iframe');
recaptchaIframe.title = 'reCAPTCHA';
recaptchaIframe.width = '304';
recaptchaIframe.height = '78';
recaptchaIframe.role = 'presentation';
recaptchaIframe.name = 'a-w9l2avmu3vl2';
recaptchaIframe.frameBorder = '0';
recaptchaIframe.scrolling = 'no';
recaptchaIframe.sandbox = 'allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation allow-modals allow-popups-to-escape-sandbox';
recaptchaIframe.src = 'https://www.google.com/recaptcha/api2/anchor?ar=1&k=6LcwIw8TAAAAACP1ysM08EhCgzd6q5JAOUR1a0Go&co=aHR0cHM6Ly9yZXBseTU3MDM1LmFjdGl2ZWhvc3RlZC5jb206NDQz&hl=en&v=vjbW55W42X033PfTdVf6Ft4q&size=normal&cb=5fvgjrllgx9t';
recaptchaInnerDiv.appendChild(recaptchaIframe);
const recaptchaTextarea = document.createElement('textarea');
recaptchaTextarea.id = 'g-recaptcha-response';
recaptchaTextarea.name = 'g-recaptcha-response';
recaptchaTextarea.classList.add('g-recaptcha-response');
recaptchaTextarea.style.width = '250px';
recaptchaTextarea.style.height = '40px';
recaptchaTextarea.style.border = '1px solid rgb(193, 193, 193)';
recaptchaTextarea.style.margin = '10px 25px';
recaptchaTextarea.style.padding = '0px';
recaptchaTextarea.style.resize = 'none';
recaptchaTextarea.style.display = 'none';
recaptchaDiv.appendChild(recaptchaInnerDiv);
recaptchaDiv.appendChild(recaptchaTextarea);
const recaptchaIframe2 = document.createElement('iframe');
recaptchaIframe2.style.display = 'none';
recaptchaDiv.appendChild(recaptchaIframe2);
recaptchaElement.appendChild(recaptchaLabel);
recaptchaElement.appendChild(recaptchaDiv);
formContent.appendChild(recaptchaElement);

const buttonWrapper = document.createElement('div');
buttonWrapper.classList.add('_button-wrapper', '_full_width');
const submitButton = document.createElement('button');
submitButton.id = '_form_11_submit';
submitButton.classList.add('_submit');
submitButton.type = 'submit';
submitButton.textContent = 'Submit';
buttonWrapper.appendChild(submitButton);
formContent.appendChild(buttonWrapper);

const clearElement = document.createElement('div');
clearElement.classList.add('_clear-element');
formContent.appendChild(clearElement);

form.appendChild(formContent);

const thankYouMessage = document.createElement('div');
thankYouMessage.classList.add('_form-thank-you');
thankYouMessage.style.display = 'none';
form.appendChild(thankYouMessage);

// Append the form to the document body or a specific container element
document.querySelector('.aform-container').appendChild(form);

// Add event listeners and form submission handling logic
// ...

// Include additional JavaScript code for form validation, error handling, etc.
// ...
