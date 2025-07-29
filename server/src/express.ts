import express from "express";
import cors from "cors";

class Express {
  private static instance: Express;
  public app!: express.Express;

  constructor() {
    if (Express.instance) {
      return Express.instance;
    }

    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    return this;
  }
}

export default Express;
