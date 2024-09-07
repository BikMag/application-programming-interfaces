const express = require("express");
const port = 1234; // номер порта
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema_example");

const app = express(); // инициализация объекта приложения

//выполнение серий функций req,res при совпадении корневого пути
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(port); // прослушиваем порт 1234
