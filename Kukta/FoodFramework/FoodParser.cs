using Kukta.FoodFramework.FileTask;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Storage;

namespace Kukta.FoodFramework
{
    class FoodParser
    {
        private static List<IFileTask> fileTasks = new List<IFileTask>();
        public static void AddTask(IFileTask task)
        {
            fileTasks.Add(task);
            if (fileTasks.Count == 1)
            {
                DoNextTask();
            }
        }
        private static async void DoNextTask()
        {
            if (fileTasks.Count > 0)
            {
                await fileTasks[0].OperateAsync();
                fileTasks.RemoveAt(0);
                DoNextTask();
                return;
            }
        }

        internal static Food ParseBaseFood(string path)
        {
            FoodData data = JsonConvert.DeserializeObject<FoodData>(File.ReadAllText(path));
            return Food.FromFoodData(data);
        }
    }
}
