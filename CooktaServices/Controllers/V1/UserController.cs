using System;
using System.Threading.Tasks;
using CooktaServices.Contracts.V1;
using CooktaServices.Contracts.V1.Requests;
using CooktaServices.Contracts.V1.Responses;
using CooktaServices.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Diagnostics;

namespace CooktaServices.Controllers.V1
{
    [Authorize]
    public class UserController : ControllerBase
    {

        private IUserService m_UserService;

        public UserController(IUserService userService)
        {
            m_UserService = userService;
        }

        [AllowAnonymous]
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

        [HttpPost(ApiRoutes.Users.CreateMe)]
        public async Task<IActionResult> UpdateUser([FromBody] CreateMeRequest request)
        {
            var user = await m_UserService.CreateAsync(HttpContext, request.DisplayName);
            if (user == null) return NoContent();
            
            var baseUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host.ToUriComponent()}";
            var locationUri = baseUrl + "/" + ApiRoutes.Users.GetMe;
            
            return Created(locationUri, new OwnUserResponse(user));
        }
        
        
    }
}