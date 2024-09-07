const grapiql = require("graphql");
const _ = require("lodash");

const {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} = grapiql;

// Тестовый набор данных
const products = [
  {
    id: "1",
    text: "Молоко пастеризованное",
    qty: 3,
    completed: true,
    userId: "123",
  },
  {
    id: "93",
    text: "Доширак куриный",
    qty: 9999,
    completed: true,
    userId: "111",
  },
  {
    id: "33",
    text: "Яблоки 1кг Южные",
    qty: 10,
    completed: false,
    userId: "182",
  },
];

const users = [
  {
    id: "111",
    username: "Ivan1",
    name: "Иван",
    surname: "Сергеев",
  },
  {
    id: "123",
    username: "Jax",
    name: "Андрей",
    surname: "Иванов",
  },
  {
    id: "182",
    username: "Qwerty",
    name: "Виктор",
    surname: "Андреев",
  },
];

// Объявление GraphQL Object Types "ProductType" и "UserType"
const ProductType = new GraphQLObjectType({
  name: "Product",
  fields: () => ({
    id: { type: GraphQLID },
    text: { type: GraphQLString },
    qty: { type: GraphQLInt },
    completed: { type: GraphQLBoolean },
    user: {
      type: UserType,
      resolve(parent, args) {
        return _.find(users, { id: parent.userId });
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    name: { type: GraphQLString },
    surname: { type: GraphQLString },
    product: {
      type: ProductType,
      resolve(parent, args) {
        return _.find(users, { userId: parent.id });
      },
    },
  }),
});

// Орпеделение корневого запроса
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    info: {
      type: GraphQLString,
      resolve(parent, args) {
        return "Server is running";
      },
    },

    product: {
      type: ProductType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(products, { id: args.id });
      },
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        return products;
      },
    },

    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(users, { id: args.id });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return users;
      },
    },
  },
});

// Мутации
const Mutations = new GraphQLObjectType({
  name: "Mutations",
  fields: {
    adduser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        surname: { type: GraphQLString },
      },
      resolve(parent, args) {
        const arrLength = users.push(args);
        return users[arrLength - 1];
      },
    },
  },
});

// экспорт схемы GraphQL
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations,
});
