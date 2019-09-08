using CooktaServices.Data;

namespace CooktaServices.Services
{
    public abstract class AServiceBase
    {
        protected readonly DataContext DataContext;

        protected AServiceBase(DataContext dataContext)
        {
            DataContext = dataContext;
        }
    }
}