import { defineStore } from 'pinia'
import type { Withdrawals } from '@/models/withdrawals'
import axios from 'axios'
import type { Page } from '@/models/page'

export const useWithdrawalsStore = defineStore('withdrawals',{
  state() {
      return {
        withdrawals: null as Page<Withdrawals>|null,
        loading: false,
        errorMessage : null as string| null
      }
  },

  actions:{
    async getWithdrawalsRequests (page?:number){
      this.loading = true;
      const url = page?`users/get-withdraw-request/page=${page}`:'users/get-withdraw-request'
      const apiResponse = await axios.get(url);
      this.loading = false;
      if (apiResponse.status <400 ){
        if(page){
          if (!this.withdrawals){
            this.withdrawals = apiResponse.data.result;
          }else{
            const formatedResponse : Page<Withdrawals> = apiResponse.data.result;
            this.withdrawals.total = formatedResponse.total;
            this.withdrawals.per_page = formatedResponse.per_page;
            this.withdrawals.data = [
              ...this.withdrawals.data,
              ...formatedResponse.data,
            ]
          }
        }else{
          this.withdrawals=apiResponse.data.result
        }
      }
    },


    async validateWithdrawalRequest(withdrawal_id:number):Promise<boolean>{
      this.loading = true;
      const  apiResponse = await  axios.put(`users/validate-withdraw/${withdrawal_id}`);
      this.loading = false;
      return apiResponse.status < 400;
    }

  }
})
