import { NumberField } from '../../decorators/field.decorators.ts';
import { DYNAMIC_TRANSLATION_DECORATOR_KEY } from '../../decorators/translate.decorator.ts';
import { ContextProvider } from '../../providers/context.provider.ts';
import type { AbstractEntity } from '../abstract.entity.ts';

export class AbstractDto {
  @NumberField()
  id!: number;

  @NumberField()
  createdAt!: Number;

  @NumberField()
  updatedAt!: Number;

  translations?: AbstractTranslationDto[];

  constructor(entity: AbstractEntity, options?: { excludeFields?: boolean }) {
    if (!options?.excludeFields) {
      this.id = entity.id;
      this.createdAt = entity.createdAt;
      this.updatedAt = entity.updatedAt;
    }

    const languageCode = ContextProvider.getLanguage();

    if (languageCode && entity.translations) {
      const translationEntity = entity.translations.find(
        (titleTranslation) => titleTranslation.languageCode === languageCode,
      )!;

      const fields: Record<string, string> = {};

      for (const key of Object.keys(translationEntity)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const metadata = Reflect.getMetadata(
          DYNAMIC_TRANSLATION_DECORATOR_KEY,
          this,
          key,
        );

        if (metadata) {
          fields[key] = (translationEntity as never)[key];
        }
      }

      Object.assign(this, fields);
    } else {
      this.translations = entity.translations?.toDtos();
    }
  }
}

export class AbstractTranslationDto extends AbstractDto {
  constructor(entity: AbstractEntity) {
    super(entity, { excludeFields: true });
  }
}
