using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.FoodFramework
{
    interface IMealingItem
    {
        Food GetMealFood(int seed);
        Guid GetGuid();
        string GetName();
    }
}
