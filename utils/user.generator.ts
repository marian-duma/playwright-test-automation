import { faker } from "@faker-js/faker";

export interface UserData {
  title: "Mr" | "Mrs";
  name: string;
  email: string;
  password: string;
  days: string;
  months: string;
  years: string;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
  newsletter?: boolean;
  optin?: boolean;
}

export interface PaymentData {
  cardName: string;
  cardNumber: string;
  cvv: string;
  expiryMonth: string;
  expiryYear: string;
}

export const generateUserData = (): UserData => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    title: faker.helpers.arrayElement(["Mr", "Mrs"]),
    firstName: firstName,
    lastName: lastName,
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    password: `Test${faker.string.alphanumeric(8)}!`,
    days: faker.number.int({ min: 1, max: 28 }).toString(),
    months: faker.date.month(),
    years: faker.number.int({ min: 1970, max: 2002 }).toString(),
    address: faker.location.streetAddress(),
    country: "United States",
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode("#####"),
    mobileNumber: faker.phone.number({ style: "national" }).replace(/\D/g, "").substring(0, 10),
    newsletter: true,
    optin: true,
  };
};

export const generatePaymentData = (): PaymentData => {
  return {
    cardName: faker.person.fullName(),
    cardNumber: faker.finance.creditCardNumber().replaceAll("-", ""),
    cvv: faker.finance.creditCardCVV(),
    expiryMonth: faker.date.month({ context: true }).slice(0, 2),
    expiryYear: faker.date.future({ years: 5 }).getFullYear().toString(),
  };
};
