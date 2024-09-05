const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema, GraphQLScalarType, Kind } = require("graphql");
const fs = require("fs");
const path = require("path");

// load the SDL schema from the file
const schemaSDL = fs.readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf8"
);

// build the schema
const schema = buildSchema(schemaSDL);

const DateType = new GraphQLScalarType({
  name: 'Date',
  description: 'A custom scalar type for dates',
  serialize(value) {
    return value instanceof Date ? value.toISOString() : null;
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
  },
});

const dataContent = [
  { id: 1, name: "Content 1", copy: "Copy 1", description: "Description 1" },
  { id: 2, name: "Content 2", copy: "Copy 2", description: "Description 2" },
];

const products = [
  { id: 1, type: "t-shirt", price: "9,50", colour: "red", size: "M" },
  { id: 2, type: "hoodie", price: "45", colour: "gray", size: "L" },
  { id: 3, type: "cap", price: "5,50", colour: "blue", size: null },
  { id: 4, type: "t-shirt", price: "18", colour: "yellow", size: "S" },
];

let nextId = 5;

const root = {
  Date: DateType,
  createProduct: ({ type, price, colour, size }) => {
    const newProduct = { id: nextId++, type, price, colour, size };
    products.push(newProduct);
    return newProduct;
  },
  updateProductPrice: ({ id, price }) => {
    const product = products.find((product) => product.id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    product.price = price;
    return product;
  },
  me: () => {
    const createdAt = new Date();
    console.log("createdAt:", createdAt); 
    return {
      id: "1",
      name: "Marta",
      email: "marta@gmail.com",
      createdAt: createdAt, 
    };
  },
  cart: () => {
    return {
      id: 1,
      quantity: 2,
      total: 100,
    };
  },
  dataContent: (args) => {
    if (!args.id && !args.name) {
      return dataContent;
    }
    return dataContent.filter(
      (content) =>
        (!args.id || content.id === args.id) &&
        (!args.name || content.name === args.name)
    );
  },
  products: (args) => {

    if (!args.id && !args.type) {
      return products;
    }
    return products.filter(
      (product) =>
        (!args.id || product.id === args.id) &&
        (!args.type || product.type === args.type)
    );
  },
  items: () => {
    return dataContent; 
  },
  Item: {
    __resolveType: (item) => {
      if (item.copy) {
        return "DataContent";
      }
      return null;
    },
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