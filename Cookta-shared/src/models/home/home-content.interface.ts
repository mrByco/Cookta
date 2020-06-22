import {ISquareContent} from "./square-conent.interface";
import {IHomeRowContentMarkup} from "./home-row-content-markup.interface";

export interface IHomeContent {
    Square: ISquareContent,
    SpecRow1: IHomeRowContentMarkup,
    SpecRow2: IHomeRowContentMarkup,
    Rows: IHomeRowContentMarkup[],
}