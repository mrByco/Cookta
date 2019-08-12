using Cooktapi.Food;
using Cooktapi.Measuring;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Stocker
{
    public class Stock
    {
        public async static Task<List<StockItem>> GetCurrentStock()
        {
            List<StockItem> stockItems = new List<StockItem>();
            var res = await Networking.Networking.GetRequestWithForceAuth("stock", new Dictionary<string, object>());
            var Jarray = JArray.Parse(res.Content);
            for (int i = 0; i < Jarray.Count; i++)
            {
                string str = Jarray[i].ToString(Newtonsoft.Json.Formatting.None);
                stockItems.Add(StockItem.ParseFromServerJson(str));
            }
            return stockItems;
        }
        public async static Task AddItemToStock(IngredientType type, Unit unit, double value)
        {
            var item = new StockItem(value, unit, type, DateTime.Now, DateTime.Now, null);
            await item.AddToStock();
        } 
        
    }
}
