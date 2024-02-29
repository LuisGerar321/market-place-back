import { ERolesTypes } from "../enums/Roles";
import { IUser } from "../interfaces/Users";
import Roles from "../models/Roles";
import { Users } from "../models/Users";
import { createUser } from "../services/Users";

import sinon, { SinonStub } from "sinon";

describe("Users Services Test", () => {
  let stubFindOne: SinonStub;
  let stubCreate: SinonStub;

  const correctUserPayload: IUser = {
    name: "Luis Gerardo Camara",
    password: "123",
    roleId: 2,
    email: "dojas64@gmail.com",
  };

  const incorrectRoleIdPayload: IUser = {
    ...correctUserPayload,
    roleId: 99, // Asumimos que este ID no existe
  };

  const roleFound: Partial<Roles> = {
    id: 2,
    name: "Seller",
    type: ERolesTypes.SELLER,
  };

  beforeEach(() => {
    stubFindOne = sinon.stub(Roles, "findOne");
    stubCreate = sinon.stub(Users, "create");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should create a user successfully when provided with a valid payload", async () => {
    stubFindOne.resolves(roleFound as Roles);
    stubCreate.resolves(correctUserPayload as Users);

    const result = await createUser(correctUserPayload);

    expect(stubFindOne.calledOnceWith({ where: { id: correctUserPayload.roleId } })).toBe(true);
    expect(stubCreate.calledOnceWith(correctUserPayload)).toBe(true);
    expect(result).toEqual(correctUserPayload);
  });

  it("should throw an error when provided with an invalid roleId", async () => {
    stubFindOne.resolves(null);

    await expect(createUser(incorrectRoleIdPayload)).rejects.toThrowError();

    expect(stubFindOne.calledOnceWith({ where: { id: incorrectRoleIdPayload.roleId } })).toBe(true);
    expect(stubCreate.called).toBe(false);
  });

  it("should handle errors gracefully when user creation fails", async () => {
    const errorMessage = "Error at user creation";
    stubFindOne.resolves(roleFound as Roles);
    stubCreate.rejects(new Error(errorMessage));

    await expect(createUser(correctUserPayload)).rejects.toThrowError(errorMessage);

    expect(stubFindOne.calledOnceWith({ where: { id: correctUserPayload.roleId } })).toBe(true);
    expect(stubCreate.calledOnceWith(correctUserPayload)).toBe(true);
  });
});
