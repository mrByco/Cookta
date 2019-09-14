using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CooktaServices.Contracts.V1.Requests;
using CooktaServices.Data;
using CooktaServices.Domain;
using CooktaServices.Domain.Receipts;
using Microsoft.EntityFrameworkCore;

namespace CooktaServices.Services
{
    public class FoodService : AServiceBase, IFoodService
    {
        public FoodService(DataContext dataContext) : base(dataContext)
        {
        }

        public async Task<List<Food>> GetFoods()
        {
            return await DataContext.Foods.ToListAsync();
        }

        public async Task<Food> GetFoodByIdAsync(Guid foodId)
        {
            return await DataContext.Foods.SingleOrDefaultAsync(x => x.Id == foodId);
        }

        public async Task<bool> CreateFoodAsync(Food food)
        {
            food.Id = Guid.NewGuid();
            await DataContext.Foods.AddAsync(food);
            var created = await DataContext.SaveChangesAsync();

            return created > 0;
        }

        public async Task<bool> UpdateFoodAsync(Food foodToUpdate)
        {
            DataContext.Foods.Update(foodToUpdate);
            var updated = await DataContext.SaveChangesAsync();

            return updated > 0;
        }

        public async Task<bool> DeleteFoodAsync(Guid foodId)
        {
            var food = await GetFoodByIdAsync(foodId);

            DataContext.Foods.Remove(food);
            var deleted = await DataContext.SaveChangesAsync();
            return deleted > 0;
        }
    }
}