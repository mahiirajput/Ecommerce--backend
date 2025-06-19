import { Observable } from 'rxjs';

export class LoginResponses {
	 admin :{

   email : string ;
   deviceId?: string;
   role :string ;
   entityId :string ;
  

	 };
	tokens :{
		accessToken: string;
		refreshToken: string;
	
	};
}
export interface LoginRequest {
	email: string;
	deviceId: string;
	role: string;
	entityId: string;
  }


  
   export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
  }
  
   export interface AccessTokenRequest {

	refreshToken: string;
  }
  
  export interface AccessTokenResponse {
	accessToken: string;
  }
  
   export interface LogoutRequest {
	accessToken: string;
  }
  
  export interface LogoutResponse {
	success: boolean;
  }
  
  export interface ValidateTokenRequest {
	accessToken: string;
  }
  
  export interface ValidateTokenResponse {
	isValid: boolean;
	entityId: string;
  }
 export  interface AuthService {
	getToken(request: LoginRequest): Observable<LoginResponse>;
	accessToken(request: AccessTokenRequest): Observable<AccessTokenResponse>;
	logout(request: LogoutRequest): Observable<LogoutResponse>;
	validateToken(request: ValidateTokenRequest): Observable<ValidateTokenResponse>;
  }