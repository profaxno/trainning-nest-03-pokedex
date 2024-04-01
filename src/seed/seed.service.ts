import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from '../pokemon/pokemon.service';
import { AxiosAdapters } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly http: AxiosAdapters
  ){}
  
  async populateDb() {

    try{
      await this.pokemonService.removeAll();

      const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
      
      const arrPokemonsToInsert = [];

      data.results.forEach(async ({ name, url }) => {
        const segments = url.split('/');
        const no = +segments[segments.length - 2];
  
        arrPokemonsToInsert.push({ name, no });
      })

      await this.pokemonService.createMany(arrPokemonsToInsert);

      return 'seed executed OK'
    }catch(err){
      throw new InternalServerErrorException(``)
    }
  }

  async populateDb2() {//Arreglo de promesas

    try{
      await this.pokemonService.removeAll();

      const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=5');
      
      const arrayPromises = [];

      data.results.forEach(({ name, url }) => {
        const segments = url.split('/');
        const no = +segments[segments.length - 2];
  
        arrayPromises.push(this.pokemonService.create({ name, no }));//Agrego promesa al arreglo de promesas
      })

      await Promise.all(arrayPromises);//Espero a que todas las promesas se resuelvan

      return 'seed executed OK'
    }catch(err){
      throw new InternalServerErrorException(``)
    }
  }

  async populateDbProfaxno() {

    try{
      const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=5');
      
      data.results.forEach(async ({ name, url }) => {
        const segments = url.split('/');
        const no = +segments[segments.length - 2];
  
        try{
          await this.pokemonService.create({ name, no });
          console.log({ name, no });

        }catch(err){  
          console.log(err);
        }
      })

      return 'seed executed OK'
    }catch(err){
      throw new InternalServerErrorException(``)
    }
  }

}
