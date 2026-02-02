import { CredentialsSignin } from 'next-auth';

export class ThrowCredentialsError extends CredentialsSignin {
  constructor(message = 'INTERNAL_ERROR') {
    super(message);
  }
}
