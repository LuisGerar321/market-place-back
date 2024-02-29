import { BeforeCreate, BelongsTo, Column, CreatedAt, ForeignKey, Model, PrimaryKey, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { Users } from "./Users";
import { uuid } from "uuidv4";

@Table
export default class Products extends Model {
  @PrimaryKey
  @Unique
  @Column
  sku: string;

  @Column
  name: string;

  @ForeignKey(() => Users)
  sellerUid: string;

  @BelongsTo(() => Users)
  seller: Users;

  @Column
  quantity: number;

  @Column
  priceUsd: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BeforeCreate
  @BeforeCreate
  static async generateUid(instance: Products): Promise<void> {
    instance.sku = uuid();
  }
}
