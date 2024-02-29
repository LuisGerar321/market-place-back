import { AutoIncrement, Column, CreatedAt, HasMany, Model, PrimaryKey, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { Users } from "./Users";
import { ERolesTypes } from "../enums/Roles";

@Table
export default class Roles extends Model {
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column
  id!: number;

  @Column
  name!: string;

  @Column({
    defaultValue: ERolesTypes.SELLER,
  })
  type!: ERolesTypes;

  @HasMany(() => Users)
  users: Users[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
