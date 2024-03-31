import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    //if (!value.match(/^[0-9a-fA-F]{24}$/)) {

    if(!isValidObjectId(value)){
      throw new BadRequestException(`${value} invalid mongoID`);
    }

    return value;
  }
}
