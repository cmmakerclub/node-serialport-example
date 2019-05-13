const SerialPort = require("serialport");
const Delimiter = require("@serialport/parser-delimiter");

const port = new SerialPort(
    process.env.PORT || "/dev/tty.SLAB_USBtoUART", {
      baudRate: parseInt(process.env.TARGET_BAUDRATE) || 115200,
    });
const parser = port.pipe(new Delimiter({delimiter: "\r\n"}));

let sum = 0x04 + "M" + 50 + 40;
const msg = Buffer.from(
    [0x02, 0x02, 0x02, "C", 0x04, "M", 50, 40, sum, 0x03]);

setInterval(() => {
  port.write(msg, err => {
    if (err)
      console.log(`serial.write error`, err);
  });
}, parseInt(process.env.DELAY) || 1);

port.on("open", () => {
  console.log("port opened.");
});

parser.on("data", (data) => {
  console.log(`Recv: `, data);
});
