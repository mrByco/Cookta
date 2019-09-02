using System.Collections.Generic;
using System.Threading.Tasks;

namespace IngredientUpdater.Command
{
    public interface ICommand
    {
        string Name { get; }
        bool Ready();
        Task Run();
    }
}