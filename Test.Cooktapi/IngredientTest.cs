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
            Ingredient ing1 = new Ingredient(type, 1, type.CustomUnits[0], new List<Food>());

            ing1.ChangeUnitToBase();
            Assert.IsTrue(ing1.Value == 0.5);
        }
        [TestMethod]
        public void IngredientAddTest_GenericAndCustomToBaseUnits()
        {
            Unit liter = new Unit(UnitType.Volume, 1, "liter", "l", "l");
            IngredientType type = new IngredientType(false, true, false, "tej", "54321", "category", new List<Unit> { new Unit(UnitType.Volume, 0.5, "zacskó", null, "z545") });
            Ingredient ing1 = new Ingredient(type, 1, liter, new List<Food>());
            Ingredient ing2 = new Ingredient(type, 3, type.CustomUnits[0], new List<Food>());

            Ingredient result = ing1 + ing2;
            Assert.IsTrue(result.Value == 2.5);
        }
        [TestMethod]
        public void IngredientAddTest_TwoDifferentGeneric()
        {
            Unit liter = new Unit(UnitType.Volume, 1, "liter", "l", "l");
            Unit deciliter = new Unit(UnitType.Volume, 0.1, "deciliter", "dl", "dl");
            IngredientType type = new IngredientType(false, true, false, "tej", "54321", "category", new List<Unit> { new Unit(UnitType.Volume, 0.5, "zacskó", null, "z545") });
            Ingredient ing1 = new Ingredient(type, 2, liter, new List<Food>());
            Ingredient ing2 = new Ingredient(type, 3, deciliter, new List<Food>());

            Ingredient result = ing1 + ing2;
            Assert.IsTrue(result.Value == 2.3);
        }
        [TestMethod]
        public void IngredientMergeTest_OneTobaseableOneNotTobaseable()
        {
            Unit liter = new Unit(UnitType.Volume, 1, "liter", "l", "l");
            Unit korty = new Unit(UnitType.Volume, 0, "korty", "k", "k");
            List<Ingredient> ings = new List<Ingredient>();
            IngredientType type = new IngredientType(false, true, false, "tej", "54321", "category", new List<Unit> { new Unit(UnitType.Volume, 0.5, "zacskó", null, "z545") });
            Ingredient ing1 = new Ingredient(type, 2, liter, new List<Food>());
            Ingredient ing2 = new Ingredient(type, 3, korty, new List<Food>());

            ings.Add(ing1);
            ings.Add(ing2);
            ings = Ingredient.MergeList(ings);

            Assert.IsTrue(ings.Count == 2);
            Assert.IsTrue(ings[0].Unit.id == liter.id);
            Assert.IsTrue(ings[0].Value == 2);
            Assert.IsTrue(ings[1].Unit == korty);
            Assert.IsTrue(ings[1].Value == 3);
        }
        [TestMethod]
        public void IngredientMergeTest_GenericToBaseMerge()
        {
            Unit deciliter = new Unit(UnitType.Volume, 0.1, "deciliter", "dl", "dl");
            List<Ingredient> ings = new List<Ingredient>();
            IngredientType type = new IngredientType(false, true, false, "tej", "54321", "category", new List<Unit> { new Unit(UnitType.Volume, 0.5, "zacskó", null, "z545") });
            Ingredient ing1 = new Ingredient(type, 13, deciliter, new List<Food>());
            ings.Add(ing1);

            ings = Ingredient.MergeList(ings);

            Assert.IsTrue(ings[0].Unit.ToBase == 1);
            Assert.IsTrue(ings[0].Value == 1.3);
        }

    }
}
