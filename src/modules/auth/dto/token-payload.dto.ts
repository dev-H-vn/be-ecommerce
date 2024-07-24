import { NumberField, StringField } from '../../../decorators';

export class TokenPayloadDto {
  @NumberField()
  expiresIn: string;

  @StringField()
  accessToken: string;

  @StringField()
  refetchToken: string;

  constructor(data: {
    expiresIn: string;
    accessToken: string;
    refetchToken: string;
  }) {
    this.expiresIn = data.expiresIn;
    this.accessToken = data.accessToken;
    this.refetchToken = data.refetchToken;
  }
}

export class RefreshTokenDTO {
  @StringField({ required: true })
  refetchToken!: string;
}
