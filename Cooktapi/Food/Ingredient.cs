using Cooktapi.Measuring;
using Cooktapi.Networking;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Food
{
    public class Ingredient
    {
        public Unit unit;
        public double Value;
        public readonly IngredientType Type;

        public Ingredient(IngredientType type, double value, Unit unit)
        {
            this.Type = type;
            this.Value = value;
            this.unit = unit;
        }
    }

}
