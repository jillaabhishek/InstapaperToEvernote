import winston, {format} from 'winston'
const { combine, timestamp, label, prettyPrint } = format;

const logConfiguration = {
    format: combine(
        timestamp(),
        prettyPrint()
      ),
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: 'logs/primary.log'
        })
    ]
};

const logger = winston.createLogger(logConfiguration);

export default logger;