using Cooktapi.Food;
using Cooktapi.Measuring;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;

namespace Test.Cooktapi
{
    [TestClass]
    public class IngredientTest
    {
        [TestMethod]
        public void ToBaseTest()
        {
            IngredientType type = new IngredientType(false, true, false, "tej", "54321", "category", new List<Unit> { new Unit(UnitType.Volume, 0.5, "zacskó", null, "z545") });
            Ingredient ing1 = new Ingredient(type, 1, type.CustomUnits[0]);

            ing1.ChangeUnitToBase();
            Assert.IsTrue(ing1.Value == 0.5);
        }
        [TestMethod]
        public void IngredientAddTest()
        {
            Unit liter = new Unit(UnitType.Volume, 1, "liter", "l", "l");
            IngredientType type = new IngredientType(false, true, false, "tej", "54321", "category", new List<Unit> { new Unit(UnitType.Volume, 0.5, "zacskó", null, "z545") });
            Ingredient ing1 = new Ingredient(type, 1, liter);
            Ingredient ing2 = new Ingredient(type, 3, type.CustomUnits[0]);

            Ingredient result = ing1 + ing2;
            Assert.IsTrue(result.Value == 2.5);
        }

    }
}
