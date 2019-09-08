using System;
using System.Threading.Tasks;
using CooktaServices.Contracts.V1;
using CooktaServices.Contracts.V1.Requests;
using CooktaServices.Contracts.V1.Responses;
using CooktaServices.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CooktaServices.Controllers.V1
{
    public class UserController : ControllerBase
    {

        private IUserService m_UserService;

        public UserController(IUserService userService)
        {
            m_UserService = userService;
        }

        [HttpGet(ApiRoutes.Users.Get)]
        public async Task<IActionResult> Get([FromRoute] Guid userId)
        {
            var user = await m_UserService.GetAsync(userId);
            if (user == null) return NotFound();
            return Ok(new PublicUserResponse(user));
        }

        [HttpGet(ApiRoutes.Users.GetMe)]
        public async Task<IActionResult> GetMe()
        {
            var user = await m_UserService.GetAsync(HttpContext);
            if (user == null) return NotFound();
            return Ok(new OwnUserResponse(user));
        }

        [HttpPost(ApiRoutes.Users.CreateUser)]
        public async Task<IAsyncResult> UpdateUser([FromBody] CreateMeRequest request)
        {
            throw  new  NotImplementedException();
        }
        
        
    }
}