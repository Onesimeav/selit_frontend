import { defineStore } from 'pinia'
import axios from 'axios'
import type { User } from '@/models/user'

export const useUserStore = defineStore('user',{
  state() {
      return{
        currentUser:null as User| null,
        loading:false,
        errorMessage:null as string | null,
      }
  },

  actions:{
    async getCurrentUser(): Promise<boolean> {
      this.loading = true;
      try {
        const apiResponse = await axios.get('user');
        this.currentUser = apiResponse.data.user;
        return true;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status >= 400) {
            this.errorMessage = "Erreur de connection de l'utilisateur";
          }
        }
        return false;
      } finally {
        this.loading = false;
      }
    },

    async login(email: string, password: string): Promise<boolean> {
      this.loading = true;

      try {
        const query = { email: email, password: password };
        const apiResponse = await axios.post('login', query);

        if (apiResponse.status >= 200 && apiResponse.status < 300) {
          localStorage.setItem('token', apiResponse.data.access_token);
          return await this.getCurrentUser();
        }
      } catch (error) {
        console.error('Login failed:', error);
      } finally {
        this.loading = false;
      }

      return false;
    },

    async loginAdmin (email: string, password: string): Promise<boolean>{
      this.loading = true;

      try {
        const query = { email: email, password: password };
        const apiResponse = await axios.get('admin-login', {params:query});

        if (apiResponse.status >= 200 && apiResponse.status < 300) {
          localStorage.setItem('token', apiResponse.data.access_token);
          return await this.getCurrentUser();
        }
      } catch (error) {
        this.errorMessage = "Login failed : " + error;
      } finally {
        this.loading = false;
      }

      return false;
    },

    async googleLogin():Promise<void>{
      this.loading = true;
      const apiResponse = await axios.get('google-auth')
      this.loading=false;
      if(apiResponse.status<400 ){
        window.location.href =  apiResponse.data.url;
      }else{
        this.errorMessage = "Erreur de connection de l'utilisateur";
      }
    },

    async handleGoogleCallback(code:string):Promise<boolean>{
      this.loading=true;
      const apiResponse = await axios.post('google-auth-callback',{code});
      this.loading = false
      if(apiResponse.status<400 ){
        localStorage.setItem('token', apiResponse.data.access_token);
        this.currentUser = apiResponse.data.user;
        return  true;
      }
      this.errorMessage = "Erreur de connection de l'utilisateur";
      return false;
    },

    async forgotPassword(userEmail:string):Promise<boolean>{
      this.loading=true;
      const apiResponse = await axios.post('forgot-password',{email:userEmail});
      this.loading = false
      if (apiResponse.status<400 ){
        return true;
      }else{
        this.errorMessage = "Erreur lors de l'envoie du mail";
        return false;
      }
    },

    async resetPassword(userResetCode:number,userPassword:string):Promise<boolean>{
      this.loading=true;
      const query = {
        code : userResetCode,
        password : userPassword,
      }
      const  apiResponse = await axios.post('reset-password',query);
      this.loading = false
      if (apiResponse.status<400){
        return true;
      }else {
        this.errorMessage = "Erreur lors du changement de mot de passe";
        return false;
      }
    },

    async createUserAccount(name:string,email:string,password:string):Promise<boolean>{
      this.loading=true;
      const query = {
        name:name,
        email : email,
        password :password,
      };

      const apiResponse = await  axios.post('register',query);

      if (apiResponse.status<400){
        localStorage.setItem('token', apiResponse.data.access_token);
        return await this.getCurrentUser();
      }else{
        if (apiResponse.data.message=="The email has already been taken."){
          this.errorMessage='Le mail est déjà utilisée pour un autre compte '
        }
        this.loading=false;
        return false;
      }
    },

    async resendVerificationCode():Promise<boolean>{
      this.loading=true;
      const apiResponse = await axios.get('resend-verification-code')
      this.loading=false
      if (apiResponse.status<400){
       return true
      }
      this.errorMessage="Une erreur s'est produite lors de l'envoie du mail"
      return  false;
    },

    async verifyUserAccount(code:string):Promise<boolean>{
      this.loading=true

      const apiResponse = await axios.get(`verify-code/${code}`);

      this.loading=false
      if (apiResponse.status<400){
        return true;
      }
      this.errorMessage="Code incorrect";
      return false;
    },

    async logoutUser():Promise<boolean>{
      this.loading=true;
      const apiResponse = await axios.get('logout');
      this.loading=false;
      if (apiResponse.status<400){
        localStorage.removeItem('token');
        this.currentUser=null;
        return true;
      }else{
        this.errorMessage="Une erreur s'estt produite lors de la déconnexion";
        return  false;
      }
    }
  }
})
