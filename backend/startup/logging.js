import winston from 'winston';
export default function () {
  winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    defaultMeta: { service: 'user-service' },
    exitOnError: false,
    transports: [
      new winston.transports.File({
        name: 'error-file',
        filename: 'error.log',
        level: 'error',
      }),
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    winston.add(
      new winston.transports.Console({
        format: winston.format.simple(),
        json: true,
      })
    );
  } else {
    winston.add(new winston.transports.Console());
  }
}
