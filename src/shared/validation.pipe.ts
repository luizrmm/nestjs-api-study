import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {

  async transform (value: any, metadata: ArgumentMetadata) {
    if (value instanceof Object && this.isEmpty(value)) {
      throw new HttpException('Validation failed: no body submitted', HttpStatus.BAD_REQUEST)
    }

    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new HttpException(`Validation Failed: ${this.FormatErrors(errors)}`, HttpStatus.BAD_REQUEST);
    }
    return value;
  }

  private toValidate (metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private FormatErrors (errors: any[]) {
    return errors.map(error => {
      for (const property in error.constraints) {
        return error.constraints[property];
      }
    }).join(', ');
  }

  private isEmpty (value: any) {
    if (Object.keys(value).length > 0) {
      return false;
    }
    return true
  }
}