import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { SeedService } from './seed.service';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

@Controller('seed')
export class SeedController {
  
  constructor(private readonly seedService: SeedService) {}

  @Get()
  populateDb() {
    return this.seedService.populateDb();
  }

}
