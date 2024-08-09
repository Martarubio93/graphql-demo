const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} = require("graphql");

const cardType = new GraphQLObjectType({
  name: "Cart",
  fields: {
    id: { type: GraphQLInt },
    quantity: { type: GraphQLInt },
    total: { type: GraphQLInt },
  },
});

const dataType = new GraphQLObjectType({
  name: "DataContent",
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    copy: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});

const productType = new GraphQLObjectType({
    name: "Product",
    fields:{
        id: {type: GraphQLInt},
        type: {type: GraphQLString},
        price: {type : GraphQLString},
        colour: {type: GraphQLString},
        size: {type: GraphQLString},
    }
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    cart: {
      type: cardType,
      resolve() {
        const cartData = {
          id: 1,
          quantity: 2,
          total: 100,
        };
        return cartData;
      },
    },
    dataContent: {
      type: new GraphQLList(dataType),
      resolve() {
        const dataList = [
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
        return dataList;
      },
    },

    products: {
      type: productType,
      args: {id: {type : GraphQLInt}},
      resolve(parent, args) {
        const products = [
          { id: 1, type: "t-shirt", price: "9,50", colour: "red", size: "M" },
          { id: 2, type: "hoodie", price: "45", colour: "gray", size: "L" },
          { id: 3, type: "cap", price: "5,50", colour: "blue", size: null },
          { id: 4, type: "t-shirt", price: "18", colour: "yelow", size: "S" },
        ];
        return products.find((product) => product.id === args.id);
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(4001, () => console.log("Server running on port 4001"));
