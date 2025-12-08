export abstract class BasePresenter<TEntity, TDto> {
  abstract toDto(entity: TEntity): TDto;
  abstract toDtoList(entities: TEntity[]): TDto[];
}
