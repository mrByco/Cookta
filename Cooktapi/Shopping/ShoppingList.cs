using Cooktapi.Calendar;
using Cooktapi.Extensions;
using Cooktapi.Food;
using System;
using System.Collections.Generic;
using System.Linq;
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
                    foreach (var item in mealing.items.Where(item => item.IsFixed()))
                    {
                        reqList.AddRange(item.GetIngsForMealingDose());
                    }
                }
            }
            reqList = Ingredient.MergeList(reqList);
            for (int i = 0; i < 0; i++)
            {
                if (0 != reqList[i].Unit.ToBase && reqList[i].Unit.ToBase != 1)
                {
                    reqList[i].ChangeUnitToBase();
                }
            }
            var baseList = await Baselist.GetBaseList();
            reqList = Ingredient.SubstractList(reqList, baseList);
            reqList = reqList.FindAll((i) => i.Value > 0);
            reqList.AddRange(baseList);
            reqList = Ingredient.MergeList(reqList);
            return reqList;
        }

        public static async Task<List<Ingredient>> GetFinalShoppingList(int forDays)
        {
            var reqList = await GetReqList(forDays);

            var currentStock = await Stocker.Stock.GetCurrentStock();
            var needList = Ingredient.SubstractList(reqList, Stocker.Stock.ToIngredientList(currentStock));
            var final = needList.FindAll((i) => i.Value > 0);
            return final;
        }


    }
}
