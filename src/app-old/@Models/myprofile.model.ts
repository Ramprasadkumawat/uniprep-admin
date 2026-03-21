export interface ProfileParams {
    name: string;

}

export interface ChangePasswordParams {
    password: string;
    new_password: string;
    passwordConfirmation: string; 
}

export interface ProfileResponse {
    status: string;
    message: string;
  }