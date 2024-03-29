const SerialPort = require("serialport");
const Delimiter = require("@serialport/parser-delimiter");

let config = require("../config/serial");
let port = new SerialPort(
    config.PORT || "/dev/tty.SLAB_USBtoUART", {
      baudRate: parseInt(config.BAUDRATE) || 115200,
    });

console.log(`Config=`, config);

const parser = port.pipe(new Delimiter({delimiter: "\r\n"}));

let sum = 0x04 + "M".charCodeAt(0) + 50 + 40;
const msg = Buffer.from(
    [
      0x02, 0x02, 0x02,
      "C".charCodeAt(0), 0x04,
      "M".charCodeAt(0),
      50, 40, sum, 0x03]);

port.on("open", () => {
  console.log("port opened.");
  setTimeout(() => {
    console.log("starting port.write.");
    setInterval(() => {
      port.write(msg, err => {
        if (err)
          console.log(`serial.write error`, err);
      });
    }, parseInt(config.DELAY_MS) || 1);
  }, 1000);
});

port.on("close", () => {
  console.log("on close.");
  setTimeout(() => {
    process.exit(-1);
  }, 2000);
});

port.on("error", e => {
  console.log("on error", e);
  setTimeout(() => {
    process.exit(-1);
  }, 2000);
});

parser.on("data", data => {
  console.log(`Recv: `, data);
});
