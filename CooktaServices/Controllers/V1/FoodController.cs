using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CooktaServices.Contracts.V1;
using CooktaServices.Contracts.V1.Requests;
using CooktaServices.Contracts.V1.Responses;
using CooktaServices.Domain;
using CooktaServices.Domain.Receipts;
using CooktaServices.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CooktaServices.Controllers.V1
{
    [ApiController]
    public class FoodController : ControllerBase
    {

        private readonly IFoodService m_FoodService;

        public FoodController(IFoodService foodService)
        {
            m_FoodService = foodService;
        }
//        [HttpGet(ApiRoutes.Foods.Get)]
//        public IActionResult Get([FromRoute]Guid foodId) 
//        {
//            var food = m_FoodService.GetFoodByIdAsync(foodId);
//            if (food == null)
//                return NotFound();
//
//            return Ok(food);
//        }


        [HttpGet(ApiRoutes.Foods.Get)]
        [Authorize]
        public IActionResult Get()
        {
            return Ok();
        }


        [HttpPut(ApiRoutes.Foods.Update)]
        public async Task<IActionResult> UpdateFood([FromRoute]Guid foodId, [FromBody] UpdateFoodRequest request)
        {
            var food = new Food()
            {
                Id = foodId,
                Name = request.Name
            };

            var updated = await m_FoodService.UpdateFoodAsync(food);

            if (updated)
                return Ok(food);

            return NotFound();
        }
        
        [HttpDelete(ApiRoutes.Foods.Delete)]
        public async Task<IActionResult> UpdateFood([FromRoute]Guid foodId)
        {
            var deleted = await m_FoodService.DeleteFoodAsync(foodId);

            if (deleted)
                return NoContent();

            return NotFound();
        }

        [HttpGet(ApiRoutes.Foods.GetAll)]
        public async Task<IActionResult> GetAll()
        {
            var foods = await m_FoodService.GetFoods();
            return Ok(foods);
        }

        [HttpPost(ApiRoutes.Foods.Create)]
        public async Task<IActionResult> Create([FromBody] CreateFoodRequest foodRequest)
        {
            var food = new Food() {Name = foodRequest.Name};

            await m_FoodService.CreateFoodAsync(food);

            var baseUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host.ToUriComponent()}";
            var locationUri = baseUrl + "/" + ApiRoutes.Foods.Get.Replace("{foodId}", food.Id.ToString());

            var response = new FoodResponse() {Id = food.Id};
            return Created(locationUri, response);
        }

    }
}