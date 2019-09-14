using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CooktaServices.Domain;
using CooktaServices.Domain.Receipts;

namespace CooktaServices.Services
{
    public interface IFoodService
    {
        Task<List<Food>> GetFoods();
        Task<Food> GetFoodByIdAsync(Guid foodId);
        Task<bool> CreateFoodAsync(Food food);
        Task<bool> UpdateFoodAsync(Food foodToUpdate);
        Task<bool> DeleteFoodAsync(Guid foodToDelete);
    }
}