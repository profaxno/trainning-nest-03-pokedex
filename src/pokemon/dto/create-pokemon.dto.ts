import { IsInt, IsOptional, IsPositive, IsString, Min, MinLength } from "class-validator";


export class CreatePokemonDto {
    
    @IsInt()
    @IsPositive()
    no: number;

    @IsString()
    @MinLength(3)
    name: string;
}
