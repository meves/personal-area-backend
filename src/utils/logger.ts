import { Model } from "sequelize";

type LoggedModel = Model<any, any> | Model<any, any>[] | null;

export const logger = (model: LoggedModel) => {
    // should be looged in file
    console.log(JSON.stringify(model));        
}