// import { shortid } from 'shortid-fix';
import { nanoid } from "nanoid";
// const nanoid = require("nanoid");

export class UtilSlug {
  static getUniqueId(name: string = "") {
    const slug = `${name
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .toLowerCase()
      .split(" ")
      .join("_")
      .concat("_")}${nanoid()}`;
    return slug;
  }
}
