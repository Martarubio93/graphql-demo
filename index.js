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
  createProduct: ({ type, price, colour, size }) => {
    const newProduct = { id: nextId++, type, price, colour, size };
    products.push(newProduct);
    return newProduct;
  },
  updateProductPrice: ({id, price}) => {
    const product = products.find((product) => product.id === id);
    if (!product){
      throw new Error('Product not found');
    }
    product.price = price;
    return product;
  },
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
    // if no arguments are passed, return all products
    if (!args.id && !args.type) {
      return products;
    }
    // if arguments are passed, return the product with the id and type that we passed as arguments
    return products.filter(
      (product) =>
        (!args.id || product.id === args.id) &&
        (!args.type || product.type === args.type)
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
