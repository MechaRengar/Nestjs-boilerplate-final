import { HttpStatus, Injectable } from '@nestjs/common';
import { ApiConfigService } from '../../../shared/services/api-config.service';
// Update the import path below to the correct location of ApiException, for example:
import { OAuth2Client } from 'google-auth-library';
import { ApiException } from '../../../exceptions/api.exception';

@Injectable()
export class GoogleAuthClient {
  public oAuth2Client: OAuth2Client;
  constructor(
    private readonly apiConfigService: ApiConfigService,
  ) {
    this.oAuth2Client = new OAuth2Client(this.apiConfigService.googleAuthData.client_id, this.apiConfigService.googleAuthData.client_secret);
  }

  verifyGoogleIdToken({token}: {token: string}){
    return this.oAuth2Client.verifyIdToken({
      idToken: token,
      audience: this.apiConfigService.googleAuthData.client_id,
    })
  }

  async getUserDataFromGoogleIdToken({token}: {token: string}): Promise<{email: string, google_id: string}>{
    try {
      const ticket = await this.verifyGoogleIdToken({ token });
      const payload  = ticket.getPayload();
      if (payload && payload.email && payload.sub){
        return {
          email: payload.email,
          google_id: payload.sub,
        };
      }
      throw new Error();
    }catch (e){
      console.log(e);

      throw new ApiException(HttpStatus.BAD_REQUEST, 'Incorrect Token', {
        translate: false,
      })
    }
  }
}
