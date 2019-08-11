using Cooktapi.Calendar;
using Cooktapi.Extensions;
using Cooktapi.Food;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Shopping
{
    public class ShoppingList
    {
        private static async Task<List<Ingredient>> GetReqList(int forDays)
        {
            DateTime nowDay = DateTime.Now.CutToDay();
            var reqList = new List<Ingredient>();

            for (int i = 0; i < forDays; i++)
            {
                DateTime current = nowDay.AddDays(i);
                var day = await CalendarDay.GetDay(current);
                foreach (Mealing mealing in day.Mealings)
                {
                    foreach (IMealingItem item in mealing.items)
                    {
                        reqList.AddRange(item.GetMealFood().ingredients);
                    }
                }
            }
            //Add the base list
            reqList = Ingredient.MergeList(reqList);
            return reqList;
        }

        public static async Task<List<Ingredient>> GetFinalShoppingList(int forDays)
        {
            var reqList = await GetReqList(forDays);
            //from current stock
            //var needList = SubtractList(needList, new List<Ingredient>());
            var needList = reqList;
            return needList;
        }


        private static List<Ingredient> SubtractList(List<Ingredient> list)
        {
            throw new NotImplementedException();
        }

    }
}
