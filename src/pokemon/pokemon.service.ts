import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel : Model<Pokemon>
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try{
      createPokemonDto.name = createPokemonDto.name.toLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      
      return pokemon;

    }catch(err){
      if(err.code === 11000){
        throw new BadRequestException(`Pokemon already exists in db with ${JSON.stringify(err.keyValue)}`);
      }

      console.log(err);
      throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
    }
    
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(value: String) {
    
    let pokemon : Pokemon;
    
    if(!isNaN(+value)){//is number
      pokemon = await this.pokemonModel.findOne({no: +value});
    }

    if(!pokemon && isValidObjectId(value)){
      pokemon = await this.pokemonModel.findById(value);
    }

    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: value.toLowerCase().trim()});
    }

    if(!pokemon){
      throw new NotFoundException(`Pokemon with id, name or no "${value}" not found`);
    }

    return pokemon;    
  }

  async update(value: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemonDb = await this.findOne(value);

    updatePokemonDto.name = updatePokemonDto.name ? updatePokemonDto.name.toLowerCase() : pokemonDb.name;

    try{
      await pokemonDb.updateOne(updatePokemonDto);

      return {...pokemonDb.toJSON(), ...updatePokemonDto};

    }catch(err){
      if(err.code === 11000){
        throw new BadRequestException(`Another pokemon already exists in db with ${JSON.stringify(err.keyValue)}`);
      }

      console.log(err);
      throw new InternalServerErrorException(`Can't update Pokemon - Check server logs`);
    }
  }

  async remove(id: string) {

    //const result = await this.pokemonModel.findByIdAndDelete(id);//no devuelve si borro o no, ya que puede ser que no exista el id que se quiere eliminar.

    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});//devuelve si borro o no
    if(deletedCount === 0){
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
    }

    return "delete OK";
  }

  // async remove(id: string) {
  //   const pokemonDb = await this.findOne(id);
  //   await pokemonDb.deleteOne();
  //   return `This action removes a #${id} pokemon`;
  // }

  private handleExceptions(error: any){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon already exists in db with ${JSON.stringify(error.keyValue)}`);
    }

    console.log(error);
    throw new InternalServerErrorException(`Can't create/update Pokemon - Check server logs`);
  }

}
