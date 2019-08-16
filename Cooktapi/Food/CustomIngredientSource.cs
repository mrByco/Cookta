using System;
using System.Collections.Generic;
using System.Text;

namespace Cooktapi.Food
{
    public class CustomIngredientSource : IIngredientSource
    {
        private string Name;
        public CustomIngredientSource(string name)
        {
            Name = name;
        }
        public string GetName()
        {
            return Name;
        }
    }
}
