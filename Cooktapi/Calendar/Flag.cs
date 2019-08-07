using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cooktapi.Food;
using Newtonsoft.Json.Linq;

namespace Cooktapi.Calendar
{
    public class Flag : AMealingItem, IMealingItem
    {
        private string IdOfTag;
        private Food.Food CurrentFood;
        public int Seed { get; private set; }

        public Flag(string idOfTag)
        {
            IdOfTag = idOfTag;
            CurrentFood = null;
            Seed = new Random().Next(9999999);
        }
        public Flag(Food.Food currentFood, string idOfTag, int seed)
        {
            IdOfTag = idOfTag;
            CurrentFood = currentFood;
            Seed = seed;
        }
        public async Task Init()
        {
            var query = new Dictionary<string, object>();
            query.Add("seed", Seed);
            query.Add("tag", IdOfTag);
            var response = await Networking.Networking.GetRequestWithForceAuth("getfoodoftag", query);
            CurrentFood = Food.Food.ParseFoodFromServerJson(response.Content);
            return;
        }
        public static List<IMealingItem> GetAvailableFlags()
        {
            List<IMealingItem> flags = new List<IMealingItem>();
            Tag.Tags.ForEach((tag) =>
            {
                flags.Add(new Flag(tag.id) );
            });
            return flags;
        }

        public string GetId()
        {
            return IdOfTag;
        }

        public Food.Food GetMealFood()
        {
            return CurrentFood;
        }

        public string GetName()
        {
            return string.Format("tag: {0}", Tag.GetTagById(IdOfTag).hu_hu);
        }
        public override string ToString()
        {
            return "Tag: " + (CurrentFood?.name ?? Tag.GetTagById(IdOfTag).hu_hu);
        }

        public void NewSeed()
        {
            Seed = new Random().Next(9999999);
        }

    }
}
