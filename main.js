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
  "https://admin.otoplus.com/en-tr/car/edit/e00f7366-861c-4ba9-938d-f690b0f44337/";
var obj = new Object();
obj.orderId = "";
obj.taskCode = "";
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
    code: obj,
    task: taskValue,
    url: `${url}?orderId=${obj.orderId}&task=${encodeURIComponent(taskValue)}`,
  };
});

fs.writeFile("data.json", JSON.stringify(data, null, 4), "utf8", () => {});
