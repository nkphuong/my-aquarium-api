export class MemberProfileDTO {
  id: number;
  email: string;
  fullname?: string;
}

export class MemberCredentialsDTO {
  id: number;
  hashedPassword: string;
  email: string;
  fullname?: string;
  verifiedAt?: Date;
  needsEmailVerification: boolean = false;
}
