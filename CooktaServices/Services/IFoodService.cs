using System;
using System.Collections.Generic;
using CooktaServices.Domain;

namespace CooktaServices.Services
{
    public interface IFoodService
    {
        List<Food> GetFoods();
        Food GetFoodById(Guid foodId);

        bool UpdateFood(Food foodToUpdate);
    }
}