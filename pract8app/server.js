const PROTO_PATH = "./phonebook.proto";

var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

var shopProto = grpc.loadPackageDefinition(packageDefinition);

const { v4: uuidv4 } = require("uuid");
const server = new grpc.Server();

const products = [
  {
    id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
    name: "БигХит Комбо",
    quantity: 3,
    acquired: true,
  },
  {
    id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
    name: "Двойной чизбургер",
    quantity: 20,
    acquired: false,
  },
];

server.addService(shopProto.ProductService.service, {
  getAll: (_, callback) => {
    callback(null, { products: products });
  },
  get: (call, callback) => {
    let product = products.find((n) => n.id == call.request.id);

    if (product) {
      callback(null, product);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Не найдено",
      });
    }
  },

  insert: (call, callback) => {
    let product = call.request;
    product.id = uuidv4();
    products.push(product);
    callback(null, product);
  },
  update: (call, callback) => {
    let existingProducts = products.find((n) => n.id == call.request.id);
    if (existingProducts) {
      existingProducts.name = call.request.name;
      existingProducts.quantity = call.request.quantity;
      existingProducts.acquired = call.request.acquired;
      callback(null, existingProducts);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Не найдено",
      });
    }
  },
  remove: (call, callback) => {
    let existingProductIndex = products.findIndex(
      (n) => n.id == call.request.id
    );
    if (existingProductIndex != -1) {
      products.splice(existingProductIndex, 1);
      callback(null, {});
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Не найдено",
      });
    }
  },
});

server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Сервер запущен на http://127.0.0.1:50051");
  }
);
