const { default: Axios } = require("axios");
const fs = require("fs");
const http = require("http");
const axios = require("axios");
const url = require("url");
const URL1 =
  "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";
const URL2 =
  "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";

//Reading index and replacing
let readFile = (info, user, callback) => {
  fs.readFile("index.html", (err, data) => {
    let pageContent = data.toString();
    pageContent = pageContent.replace("{{replace}}", buildTable(info, user));
    callback(pageContent);
  });
};

//Function for building the table
let buildTable = (info, user) => {
  let msg = `<div class="container-fluid"><h1 class="text-center">Listado de ${user}</h1><table class="table table-striped"><thead><tr><th>Id</th><th>Nombre</th><th>Contacto</th></tr></thead><tbody>`;
  let compania = "nombrecompania";
  let contacto = "nombrecontacto";
  let id = "idproveedor";
  if (user === "clientes") {
    compania = "NombreCompania";
    contacto = "NombreContacto";
    id = "idCliente";
  }
  for (let i = 0; i < info.length; i++) {
    msg += "<tr><td>" + info[i][`${id}`] + "</td><td>";
    msg += info[i][`${compania}`] + "</td><td>";
    msg += info[i][`${contacto}`] + "</td>";
    msg += "</tr>";
  }
  msg += "</tbody></table></div>";
  return msg;
};

//Creating server
http
  .createServer(function (req, res) {
    // Parsing url
    const queryString = url.parse(req.url, true);

    // Accessing href property of an URL
    let dataLink = "";
    let type = "";
    if (queryString.href === "/api/proveedores") {
      dataLink = URL1;
      type = "proveedores";
    } else {
      dataLink = URL2;
      type = "clientes";
    }
    //Getting data
    axios.get(dataLink).then((response) => readData(response.data, type, res));
  })
  .listen(8081);

function readData(info, type, res) {
  //Sending the data for update and rendering
  readFile(info, type, (data) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
}
