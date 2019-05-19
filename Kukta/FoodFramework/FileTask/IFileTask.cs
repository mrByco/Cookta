using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.FoodFramework.FileTask
{
    interface IFileTask
    {
        string Name();
        Task OperateAsync();

    }
}
