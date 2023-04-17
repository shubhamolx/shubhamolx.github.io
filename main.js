// Code here will run only once, no matter how many input items there are.
// More info and help: https://docs.n8n.io/nodes/n8n-nodes-base.function
// Tip: You can use luxon for dates and $jmespath for querying JSON structures
// Loop over inputs and add a new field called 'myNewField' to the JSON of each one
const crypto = require("crypto");
var fs = require("fs");

const publicKey = `
-----BEGIN PUBLIC KEY-----

-----END PUBLIC KEY-----`;
var url =
  "https://admin.otoplus.com/en-tr/car/edit/36c79259-3daf-4b7e-a12c-591d285d8972/";
var obj = new Object();
obj.orderId = "3b450221-143e-4d84-846c-2d04746fac40";
obj.createdAt = "2022-03-04";

const tasks = [
  "addPoDetails",
  "paymentMethodApproval",
  "addAdditionalDocs",
  "poReview",
  "poPayment",
  "addDocuments",
  "updateOrderInvoices",
  "updateCarStatuses",
];
const data = {};
tasks.forEach((task) => {
  obj.taskCode = task;
  var jsonString = JSON.stringify(obj);
  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    // We convert the data string to a buffer using `Buffer.from`
    Buffer.from(jsonString)
  );

  const taskValue = encryptedData.toString("base64");
  data[task] = {
    code: jsonString,
    encryptedTask: taskValue,
    encodedTask: encodeURIComponent(taskValue),
    url: `${url}?orderId=${obj.orderId}&task=${encodeURIComponent(taskValue)}`,
  };
});

fs.writeFile("data.json", JSON.stringify(data, null, 4), "utf8", () => {});

fs.readFile("index.html", "utf-8", (err, fileData) => {
  if (!err) {
    let innerData = "";
    [
      "addPoDetails",
      "paymentMethodApproval",
      "addAdditionalDocs",
      "poReview",
      "poPayment",
      "addDocuments",
      "updateOrderInvoices",
      "updateCarStatuses",
    ].forEach((task) => {
      innerData += `<div class="row">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3>${task}</h3>
          </div>
          <div class="panel-body">
            <div class="col-lg-12">
                <textarea
                    id="encodeText"
                    name="encodeText"
                    style="width: 100%"
                    rows="1"
                >${data[task].code}</textarea>
            </div>
            <div class="col-lg-12">
              <textarea
                id="encodeText"
                name="encodeText"
                style="width: 100%"
                rows="3"
              >${data[task].encodedTask}</textarea>
            </div>
            <div class="col-lg-12">
              <textarea
                id="encodeText"
                name="encodeText"
                style="width: 100%"
                rows="3"
              >${data[task].url}</textarea>
            </div>
            <div>
              <a href="${data[task].url}" id="link" target="_blank">${task}</a>
            </div>
          </div>
        </div>
      </div>`;
    });

    const finalData = fileData.replace("{innerText}", innerData);
    fs.writeFile("final.html", finalData, "utf8", () => {});
  }
});
