using Kukta.FoodFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.Menu
{
    class Meal
    {
        internal EMealType Type;
        internal List<FoodCategory> Categories = new List<FoodCategory>();
        public Meal(EMealType type)
        {
            Type = type;
        }
    }
}
