using Cooktapi.Food;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Shopping
{
    public class ShoppingList
    {
        private List<Ingredient> m_List;

        public static async  Task<List<Ingredient>> GetFinalShoppingList()
        {

        }

        public static List<Ingredient> FromList(List<Ingredient> list)
        {
            var i = new ShoppingList();
            i.m_List = list;
        }

        public static List<Ingredient> MergeList(List<Ingredient> list1, List<Ingredient> list2)
        {

        }
        public  List<Ingredient> MergeList(List<Ingredient> list)
        {
            var newList = new List<Ingredient>();
            foreach (Ingredient ing in list)
            {
                var alreadyIng = newList.Find((i) => { return i.Type.ID == ing.Type.ID; });
                if (alreadyIng != null)
                {
                    alreadyIng += ing;
                }
                else
                {
                    newList.Add(ing);
                }
            }
            return newList;
        }
        public static List<Ingredient> SubtractList(List<Ingredient> from, List<Ingredient> what)
        {
            
        }
    }
}
