import * as pg from "pg";
import { Pool } from "pg";

export default class DataBasePostgreSQL {
  constructor(postgresql_setting: pg.ClientConfig) {
    this.config = postgresql_setting;
  }


  }
}
