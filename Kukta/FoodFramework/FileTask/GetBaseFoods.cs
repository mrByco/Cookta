using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Storage;

namespace Kukta.FoodFramework.FileTask
{
    class GetBaseFoods : IFileTask
    {
        private Action<List<Food>> OnDone;
        public GetBaseFoods(Action<List<Food>> onDone)
        {
            OnDone = onDone;
        }

        public string Name()
        {
            return "Loading base foods";
        }

        public async Task OperateAsync()
        {
            List<Food> foods = new List<Food>();
            string[] foodFiles;
            try
            {
                foodFiles = Directory.GetFiles("Assets/Foods");
            }
            catch (DirectoryNotFoundException)
            {
                return;
            }
            foreach (string path in foodFiles)
            {
                foods.Add(FoodParser.ParseBaseFood(path));
            }
            OnDone(foods);
            return;
        }
    }
}
