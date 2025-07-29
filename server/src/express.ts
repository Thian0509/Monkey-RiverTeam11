class Express {
  constructor() {
    if (Express.instance) {
      return Express.instance;
    }

    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    return this;
}