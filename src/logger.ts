import winston, { format } from "winston";

const fileFormat = format.combine(
  format.timestamp({ format: "YYYY/MM/DD HH:mm:ss.SSS" }),
  format.printf((info) => {
    return `${info.timestamp} [${info.level}]: ${info.message}`;
  }),
);

export const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: fileFormat,
  transports: [
    new winston.transports.File({
      level: "info",
      filename: "zambot.log",
    }),
    new winston.transports.File({
      level: "debug",
      filename: "debug.log",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      level: "silly",
      format: format.combine(format.colorize(), fileFormat),
    }),
  );
}
