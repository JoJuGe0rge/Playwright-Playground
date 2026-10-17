import { faker } from '@faker-js/faker';

export type UserInfo = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export function createRandomUser(): UserInfo {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode(),
  };
}