const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const fs = require("fs");
const path = require("path");

// load the SDL schema from the file
const schemaSDL = fs.readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf8"
);

// build the schema
const schema = buildSchema(schemaSDL);

const root = {
  me: () => {
    return {
      id: 1,
      name: "Marta",
      email: "marta@gmail.com",
    };
  },

  cart: () => {
    return {
      id: 1,
      quantity: 2,
      total: 100,
    };
  },
  dataContent: () => {
    return [
      {
        id: 1,
        name: "John",
        copy: "Hello World",
        description: "This is a description",
      },
      {
        id: 2,
        name: "Doe",
        copy: "Goodbye World",
        description: "This is a description",
      },
    ];
  },
  products: (args) => {
    const products = [
      { id: 1, type: "t-shirt", price: "9,50", colour: "red", size: "M" },
      { id: 2, type: "hoodie", price: "45", colour: "gray", size: "L" },
      { id: 3, type: "cap", price: "5,50", colour: "blue", size: null },
      { id: 4, type: "t-shirt", price: "18", colour: "yellow", size: "S" },
    ];
    // if no arguments are passed, return all products
    if (!args.id && !args.type) {
      return products;
    }
    // if arguments are passed, return the product with the id and type that we passed as arguments
    return products.find(
      (product) => product.id === args.id && product.type === args.type
    );
  },
};

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4001, () => console.log("Server running on port 4001"));
