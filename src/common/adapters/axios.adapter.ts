import axios, { AxiosInstance } from "axios";
import { HttpAdapter } from "../interfaces/http-adapter.inteface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AxiosAdapters implements HttpAdapter{
    
    private readonly axios: AxiosInstance = axios;
        
    async get<T>(url: string): Promise<T> {
        try{
            const { data } = await this.axios.get<T>(url);
            return data;
        
        }catch(error){
            console.log(error);
            throw new Error('This is an error - Check logs');
        }
    }

}