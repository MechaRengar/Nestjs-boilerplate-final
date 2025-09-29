/* eslint-disable max-classes-per-file */
import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
  DATABASE_CREATED_AT_FIELD_NAME,
  DATABASE_CREATED_BY_FIELD_NAME,
  DATABASE_DELETED_AT_FIELD_NAME,
  DATABASE_UPDATED_AT_FIELD_NAME,
  DATABASE_UPDATED_BY_FIELD_NAME,
} from '../constants/database';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);

export abstract class DatabaseSchemaAbstract {
  @Prop({
    type: Types.ObjectId,
    default: () => new Types.ObjectId(),
  })
  _id!: Types.ObjectId;

  @Prop({
    required: false,
    index: true,
    type: new Object({
      id: Number,
      email: String,
      phone: String,
      fullName: String,
    }),
  })
  [DATABASE_CREATED_BY_FIELD_NAME]?: Record<string, unknown>;

  @Prop({
    required: false,
    index: 'desc',
    type: new Object({
      id: Number,
      email: String,
      phone: String,
      fullName: String,
    }),
  })
  [DATABASE_UPDATED_BY_FIELD_NAME]?: Record<string, unknown>;

  @Prop({
    required: false,
    index: 'desc',
    type: Number,
  })
  [DATABASE_UPDATED_AT_FIELD_NAME]?: Number;

  @Prop({
    required: false,
    index: true,
    type: Number,
  })
  [DATABASE_DELETED_AT_FIELD_NAME]?: Number;

  @Prop({
    required: true,
    default: dayjs().utc().unix(),
    index: 'asc',
    type: Number,
  })
  [DATABASE_CREATED_AT_FIELD_NAME]?: Number;
}
