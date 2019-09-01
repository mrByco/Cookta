using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cooktapi.Food;
using Newtonsoft.Json.Linq;

namespace Cooktapi.Calendar
{
    public class Flag : AMealingItem
    {
        private readonly string m_IdOfTag;
        private Food.Food m_CurrentFood;
        public int Seed { get; private set; }

        public Flag(string idOfTag)
        {
            m_IdOfTag = idOfTag;
            m_CurrentFood = null;
            Seed = new Random().Next(9999999);
        }
        public Flag(Food.Food currentFood, string idOfTag, int seed)
        {
            m_IdOfTag = idOfTag;
            m_CurrentFood = currentFood;
            Seed = seed;
        }
        public async Task Init()
        {
            var query = new Dictionary<string, object> {{"seed", Seed}, {"tag", m_IdOfTag}};
            var response = await Networking.Networking.GetRequestWithForceAuth("getfoodoftag", query);
            m_CurrentFood = Food.Food.ParseFoodFromServerJson(response.Content);
            return;
        }
        public static List<IMealingItem> GetAvailableFlags()
        {
            List<IMealingItem> flags = new List<IMealingItem>();
            Tag.Tags.ForEach((tag) =>
            {
                flags.Add(new Flag(tag.ID) );
            });
            return flags;
        }

        public override string GetId()
        {
            return m_IdOfTag;
        }

        public override Food.Food GetMealFood()
        {
            return m_CurrentFood;
        }

        public override string GetName()
        {
            return $"tag: {Tag.GetTagById(m_IdOfTag).Name}";
        }
        public override string ToString()
        {
            return "Tag: " + (m_CurrentFood?.Name ?? Tag.GetTagById(m_IdOfTag).Name);
        }

        public List<Ingredient> GetIngsForMealingDose()
        {
            return GetMealFood().GetIngredientsForDose(Dose());
        }

        public override void NewSeed()
        {
            Seed = new Random().Next(9999999);
        }
    }
}
