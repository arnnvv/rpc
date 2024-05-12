import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./generated/a";
import { AddressBookServiceHandlers } from "./generated/AddressBookService";
import { Status } from "@grpc/grpc-js/build/src/constants";

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "./a.proto"),
);

const personProto = grpc.loadPackageDefinition(
  packageDefinition,
) as unknown as ProtoGrpcType;

const PEOPLE = [
  {
    name: "Arnav",
    age: 20,
  },
  {
    name: "Haana",
    age: 20,
  },
];

const server = new grpc.Server();

const handlers: AddressBookServiceHandlers = {
  AddPerson: (call, callback) => {
    console.log(call);
    let person = {
      name: call.request.name,
      age: call.request.age,
    };
    PEOPLE.push(person);
    callback(null, person);
  },
  GetPersonByName: (call, callback) => {
    let person = PEOPLE.find((p) => p.name === call.request.name);
    if (person) callback(null, person);
    else
      callback(
        {
          code: Status.NOT_FOUND,
          details: "Person not found",
        },
        null,
      );
  },
};

server.addService(personProto.AddressBookService.service, handlers);
server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
  },
);
