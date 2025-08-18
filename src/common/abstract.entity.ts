import {
  Column,
  PrimaryGeneratedColumn,
  type ValueTransformer,
} from 'typeorm';

import { LanguageCode } from '../constants/language-code.ts';
import type {
  AbstractDto,
  AbstractTranslationDto,
} from './dto/abstract.dto.ts';

/**
 * Abstract Entity
 * @author Narek Hakobyan <narek.hakobyan.07@gmail.com>
 *
 * @description This class is an abstract class for all entities.
 * It's experimental and recommended using it only in microservice architecture,
 * otherwise just delete and use your own entity.
 */

// Transformer: convert Date <-> number (unix time in seconds)
const unixTimestampTransformer: ValueTransformer = {
  to: (value?: number) => {
    if (!value) return Math.floor(Date.now() / 1000);
    return value;
  },
  from: (value: Date | number) => {
    if (value instanceof Date) {
      return Math.floor(value.getTime() / 1000);
    }
    return Number(value);
  },
};

export abstract class AbstractEntity<
  DTO extends AbstractDto = AbstractDto,
  O = never,
> {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({
    type: 'bigint',
    transformer: unixTimestampTransformer,
  })
  createdAt!: number;

  @Column({
    type: 'bigint',
    transformer: unixTimestampTransformer,
  })
  updatedAt!: number;

  translations?: AbstractTranslationEntity[];

  toDto(options?: O): DTO {
    const dtoClass = Object.getPrototypeOf(this).dtoClass;

    if (!dtoClass) {
      throw new Error(
        `You need to use @UseDto on class (${this.constructor.name}) to be able to call toDto function`,
      );
    }

    return new dtoClass(this, options);
  }
}

export class AbstractTranslationEntity<
  DTO extends AbstractTranslationDto = AbstractTranslationDto,
  O = never,
> extends AbstractEntity<DTO, O> {
  @Column({ type: 'enum', enum: LanguageCode })
  languageCode!: LanguageCode;
}
