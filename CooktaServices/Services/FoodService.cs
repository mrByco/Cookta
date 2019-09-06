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
    public class FoodService : IFoodService
    {
        private readonly DataContext m_DataContext;

        public FoodService(DataContext dataContext)
        {
            m_DataContext = dataContext;
        }

        public async Task<List<Food>> GetFoods()
        {
            return await m_DataContext.Foods.ToListAsync();
        }

        public async Task<Food> GetFoodByIdAsync(Guid foodId)
        {
            return await m_DataContext.Foods.SingleOrDefaultAsync(x => x.Id == foodId);
        }

        public async Task<bool> CreateFoodAsync(Food food)
        {
            food.Id = Guid.NewGuid();
            await m_DataContext.Foods.AddAsync(food);
            var created = await m_DataContext.SaveChangesAsync();

            return created > 0;
        }

        public async Task<bool> UpdateFoodAsync(Food foodToUpdate)
        {
            m_DataContext.Foods.Update(foodToUpdate);
            var updated = await m_DataContext.SaveChangesAsync();

            return updated > 0;
        }

        public async Task<bool> DeleteFoodAsync(Guid foodId)
        {
            var food = await GetFoodByIdAsync(foodId);

            m_DataContext.Foods.Remove(food);
            var deleted = await m_DataContext.SaveChangesAsync();
            return deleted > 0;
        }
    }
}