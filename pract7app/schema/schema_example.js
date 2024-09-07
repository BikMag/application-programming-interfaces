const grapiql = require("graphql");
const _ = require("lodash");

const {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} = grapiql;

// Тестовый набор данных
const blogs = [
  {
    id: "1",
    bid: "73898966-e68f-46bc-be55-a4f28bc646ef",
    annotation: "Первая запись в микроблоге",
    authorId: "1",
  },
  {
    id: "2",
    bid: "7c97f5ee-4dc8-4538-bf69-63ee30bf0e74",
    annotation: "Сегодня очень тёплая погода",
    authorId: "2",
  },
  {
    id: "3",
    bid: "064b71d2-5807-4e59-a961-09b1366427e9",
    annotation: "Привет!",
    authorId: "b0124e22-6811-409a-90fb-6491f0a200db",
  },
];
const authors = [
  {
    id: "1",
    username: "Ivan1",
    name: "Иван",
    surname: "Сергеев",
  },
  {
    id: "2",
    username: "Jax",
    name: "Андрей",
    surname: "Иванов",
  },
  {
    id: "b0124e22-6811-409a-90fb-6491f0a200db",
    username: "Qwerty",
    name: "Виктор",
    surname: "Андреев",
  },
];

// Объявление GraphQL Object Types «BlogType» и «BlogAuthorType»
const BlogType = new GraphQLObjectType({
  name: "Blog",
  fields: () => ({
    id: { type: GraphQLID },
    bid: { type: GraphQLID },
    annotation: { type: GraphQLString },
    blogauthor: {
      type: BlogAuthorType,
      resolve(parent, args) {
        return _.find(authors, { id: parent.authorId });
      },
    },
  }),
});
const BlogAuthorType = new GraphQLObjectType({
  name: "BlogAuthor",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    name: { type: GraphQLString },
    surname: { type: GraphQLString },
    blog: {
      type: BlogType,
      resolve(parent, args) {
        return _.find(authors, { authorId: parent.id });
      },
    },
  }),
});

// орпеделение корневого запроса
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    info: {
      type: GraphQLString,
      resolve(parent, args) {
        return "Server is running";
      },
    },

    blog: {
      type: BlogType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(blogs, { id: args.id });
      },
    },

    blogs: {
      type: new GraphQLList(BlogType),
      resolve(parent, args) {
        return blogs;
      },
    },

    author: {
      type: BlogAuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authors, { id: args.id });
      },
    },

    authors: {
      type: new GraphQLList(BlogAuthorType),
      resolve(parent, args) {
        return authors;
      },
    },
  },
});

// Мутации
const Mutations = new GraphQLObjectType({
  name: "Mutations",
  fields: {
    addauthor: {
      type: BlogAuthorType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        surname: { type: GraphQLString },
      },
      resolve(parent, args) {
        const arrLength = authors.push(args);
        return authors[arrLength - 1];
      },
    },
  },
});

// экспорт схемы GraphQL
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations,
});
