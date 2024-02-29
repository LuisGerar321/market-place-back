import { BeforeCreate, BelongsTo, Column, CreatedAt, ForeignKey, HasMany, Model, PrimaryKey, Table, Unique, UpdatedAt } from "sequelize-typescript";
import Roles from "./Roles";
import Products from "./Product";
import { uuid } from "uuidv4";
import bcrypt from "bcrypt";

@Table
export class Users extends Model {
  @PrimaryKey
  @Unique
  @Column
  uid!: string;

  @Column
  email!: string;

  @Column
  name: string;

  @Column
  password!: string;

  @ForeignKey(() => Roles)
  roleId: number;

  @BelongsTo(() => Roles)
  role: Roles;

  @HasMany(() => Products)
  products: Products[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BeforeCreate
  static async generateUid(instance: Users): Promise<void> {
    instance.uid = uuid();
  }
  @BeforeCreate
  static async hashPass(instance: Users): Promise<void> {
    const saltRounds = 2;
    const hashedPass = await bcrypt.hash(instance.password, saltRounds);
    instance.password = hashedPass;
  }
}
