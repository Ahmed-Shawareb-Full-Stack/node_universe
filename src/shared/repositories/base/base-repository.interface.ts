// import {
//   DeepPartial,
//   DeleteResult,
//   FindManyOptions,
//   FindOneAndUpdateOptions,
//   FindOneOptions,
//   FindOptionsWhere,
//   UpdateResult,
// } from 'typeorm';
// export interface IBaseRepository<T> {
//   create(data: DeepPartial<T>): T;
//   createMany(data: DeepPartial<T>[]): T[];
//   save(data: DeepPartial<T>): Promise<T>;
//   saveMany(data: DeepPartial<T>[]): Promise<T[]>;
//   findOneBy(data: FindOneOptions<T>): Promise<T>;
//   findOneById(id: string | number): Promise<T>;
//   findManyWithCondition(data: FindManyOptions<T>): Promise<T[]>;
//   findManyWithConditionAndPagination(data: FindManyOptions<T>);
//   updateOne(
//     options: FindOptionsWhere<T>,
//     data: DeepPartial<T>,
//   ): Promise<UpdateResult>;
//   preload(data: DeepPartial<T>): Promise<T>;
//   removeOne(data: DeepPartial<T>): Promise<DeleteResult>;
//   removeMany(data: DeepPartial<T>[]): Promise<DeleteResult[]>;
//   countRaws();
// }
