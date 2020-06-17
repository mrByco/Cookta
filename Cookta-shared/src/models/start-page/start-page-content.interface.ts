import {ISquareContent} from "./square-conent.interface";
import {IRowStartContent} from "./row-start-content.interface";

export interface IStartPageContent {
    Square: ISquareContent,
    Side1: IRowStartContent,
    Side2: IRowStartContent,
    Rows: IRowStartContent[],
}