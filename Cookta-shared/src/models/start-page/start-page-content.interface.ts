import {ISquareContent} from "./square-conent.interface";
import {IRowStartContent} from "./row-start-content.interface";

export interface IStartPageContent {
    Square: ISquareContent,
    SpecRow1: IRowStartContent,
    SpecRow2: IRowStartContent,
    Rows: IRowStartContent[],
}