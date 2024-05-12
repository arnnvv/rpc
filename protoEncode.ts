import protobuf from "protobufjs";
import fs from "fs/promises";

(async () => {
  try {
    const root = protobuf.loadSync("a.proto");
    const Person = root.lookupType("Person");

    const person = { name: "Arnav", age: 20 };

    const buffer = Person.encode(person).finish();
    await fs.writeFile("person.bin", buffer);
    console.log(`Person serialized and saved to person.bin`);

    const data = await fs.readFile("person.bin");
    const deserializedPerson = Person.decode(data);
    console.log(`Person deserialized from person.bin: ${deserializedPerson}`);
  } catch (e) {
    console.error(e);
  }
})();
