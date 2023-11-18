// import {
//   DeepPartial,
//   DeleteResult,
//   FindManyOptions,
//   FindOneOptions,
//   FindOptionsWhere,
//   Repository,
//   UpdateResult,
// } from 'typeorm';
// import { IBaseRepository } from './base-repository.interface';

// interface WithId {
//   id: string | number;
// }

// export abstract class BaseAbstractRepository<T extends WithId>
//   implements IBaseRepository<T>
// {
//   private entity: Repository<T>;

//   constructor(entity: Repository<T>) {
//     this.entity = entity;
//   }
//   create(data: DeepPartial<T>): T {
//     return this.entity.create(data);
//   }

//   createMany(data: DeepPartial<T>[]): T[] {
//     return this.entity.create(data);
//   }

//   async save(data: T): Promise<T> {
//     return await this.entity.save(data);
//   }

//   async saveMany(data: T[]): Promise<T[]> {
//     return await this.entity.save(data);
//   }

//   async findOneBy(data: FindOneOptions<T>): Promise<T> {
//     return await this.entity.findOne(data);
//   }

//   async findOneById(id: any): Promise<T> {
//     const options: FindOptionsWhere<T> = {
//       id,
//     };
//     return await this.entity.findOneBy(options);
//   }

//   async findManyWithCondition(data: FindManyOptions<T>): Promise<T[]> {
//     return await this.entity.find(data);
//   }

//   async findManyWithConditionAndPagination(data: FindManyOptions<T>) {
//     return await this.entity.find(data);
//   }

//   // async updateOne(
//   //   options: FindOptionsWhere<T>,
//   //   data: DeepPartial<T>,
//   // ): Promise<UpdateResult> {
//   //   return await this.entity.update(options, data);
//   // }

//   // preload(data: DeepPartial<T>): Promise<T> {}

//   // removeOne(data: DeepPartial<T>): Promise<DeleteResult> {}

//   // removeMany(data: DeepPartial<T>[]): Promise<DeleteResult[]> {}

//   // countRaws() {}
// }
