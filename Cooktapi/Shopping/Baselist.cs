using Cooktapi.Food;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Shopping
{
    public class Baselist
    {
        public async static Task<List<Ingredient>> GetBaseList()
        {
            var Ingredients = new List<Ingredient>();
            var res = await Networking.Networking.GetRequestWithForceAuth("baselist", new Dictionary<string, object>());
            return Ingredient.ParseIngredientList(res.Content);
        }
        /// <summary>
        /// Adds a new Ing to baselist or set an exist.
        /// </summary>
        /// <param name="ingredient">The new or the override ingredient.</param>
        /// <returns>Returns the complete new baselist contains the inserted</returns>
        public static async Task<List<Ingredient>> AddItemToBaseList(Ingredient ingredient)
        {
            JObject body = Ingredient.CreateIngredientToServer(ingredient);
            var resposne = await Networking.Networking.PostRequestWithForceAuth("baselist", body.ToString(Formatting.None));
            return Ingredient.ParseIngredientList(resposne.Content);
        }
        /// <summary>
        /// Deletes the Ingredient of the type, for the current user.
        /// </summary>
        public static async Task DeleteItemFromBaseList(IngredientType type)
        {
            var query = new Dictionary<string, object>();
            query.Add("itemId", type.ID);
            var response = await Networking.Networking.DeleteRequestWithForceAuth("baselist", query);
            return;
        }
    }
}
