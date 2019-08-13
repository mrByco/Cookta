using Cooktapi.Extensions;
using Cooktapi.Food;
using Cooktapi.Measuring;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Stocker
{
    public class StockItem
    {
        public string _id;
        public DateTime LastUpdated { get; set; }
        public DateTime LastSetted { get; set; }
        public IngredientType IngredientType { get; set; }
        public Unit Unit { get; set; }
        public double Value { get; set; }

        public StockItem(double value, Unit unit, IngredientType ingredientType, DateTime lastSetted, DateTime lastUpdated, string _id) 
        {
            this.Value = value;
            this.Unit = unit;
            this.IngredientType = ingredientType;
            this.LastSetted = lastSetted;
            this.LastUpdated = lastUpdated;
            this._id = _id;
        }

        public static StockItem ParseFromServerJson(string json)
        {
            JObject jStockItem;
            try
            {
                jStockItem = JObject.Parse(json);
            }
            catch (JsonReaderException)
            {
                return null;
            }

            double value = jStockItem.Value<double>("value");
            IngredientType ingType = IngredientType.GetByID(jStockItem.Value<string>("typeid"));
            Unit unit = Unit.GetUnit(jStockItem.Value<string>("unitId"), ingType);
            string _id = jStockItem.Value<string>("_id");

            DateTime lastUpdated = DateTimeExtensions.FromTotalMilis(jStockItem.Value<long>("lastupdate"));
            DateTime lastSetted = DateTimeExtensions.FromTotalMilis(jStockItem.Value<long>("validitydate"));


            var item = new StockItem(value, unit, ingType, lastSetted, lastUpdated, _id);
            return item;
        }
        public static string CreateServerJson(StockItem item)
        {
            JObject jStockItem = new JObject();
            jStockItem.Add("value", JToken.FromObject(item.Value));
            jStockItem.Add("typeid", JToken.FromObject(item.IngredientType.ID));
            jStockItem.Add("unitId", JToken.FromObject(item.Unit.id));
            jStockItem.Add("type", JToken.FromObject("ing"));
            return jStockItem.ToString(Formatting.None);
        }
        public async Task<double> SetValue(double value)
        {
            //"typeid": "ingredientId, or productId4",
            //"delta": -1

            this.Value = value;
            string body = CreateServerJson(this);
            var res = await Networking.Networking.PostRequestWithForceAuth("stock", body);
            return value;
        }
        public async Task AddToStock()
        {
            string body = CreateServerJson(this);
            var res = await Networking.Networking.PostRequestWithForceAuth("stock", body);
            return;
        }
        public async Task<double> AddValue(double value)
        {
            JObject body = new JObject();
            body.Add("typeid", IngredientType.ID);
            body.Add("delta", value);
            this.Value += value;
            await Networking.Networking.PutRequestWithForceAuth("stock", body.ToString(Formatting.None));
            return this.Value;
        }
        public async Task Delete()
        {
            JObject body = new JObject();
            body.Add("typeid", IngredientType.ID);
            body.Add("delta", -this.Value);
            await Networking.Networking.PutRequestWithForceAuth("stock", body.ToString(Formatting.None));
            return;
        }
    }
}
