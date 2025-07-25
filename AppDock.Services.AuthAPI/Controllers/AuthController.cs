using AppDock.Services.AuthAPI.Models;
using AppDock.Services.AuthAPI.Models.Dto;
using AppDock.Services.AuthAPI.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace AppDock.Services.AuthAPI.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly IAuthService _authService;
        private readonly IEMailService _emailService;
        private readonly IUserService _userService;
        private readonly UserManager<AppDockUser> _userManager;
        protected ResponseDto _responseDto;

        public AuthController(
            IAuthService authService, 
            IEMailService emailService, 
            IUserService userService, 
            UserManager<AppDockUser> userManager)
        {
            _authService = authService;
            _responseDto = new ResponseDto();
            _emailService = emailService;
            _userService = userService;
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationRequestDto model)
        {
            var message = await _authService.Register(model);
            _responseDto.Message = message;
            _responseDto.isSuccess = message.StartsWith("Registration successful");
            return _responseDto.isSuccess ? Ok(_responseDto) : BadRequest(_responseDto);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto model)
        {
            var loginResponse = await _authService.Login(model);
            if (loginResponse.User == null)
            {

                _responseDto.isSuccess = false;
                _responseDto.Message = loginResponse.Message;
                return BadRequest(_responseDto);    
            }
            _responseDto.Results = loginResponse;
            _responseDto.Message = loginResponse.Message;
            return Ok(_responseDto);
        }

        [HttpPost("assignRole")]
        public async Task<IActionResult> AssignRole([FromBody] RegistrationRequestDto model)
        {
            var assignRoleSuccessful = await _authService.AssignRole(model.Email, model.Role.ToUpper());
            if (!assignRoleSuccessful)
            {

                _responseDto.isSuccess = false;
                _responseDto.Message = "failed to assign Role...";
                return BadRequest(_responseDto);
            }
            _responseDto.Results = assignRoleSuccessful;
            _responseDto.Message = "Assigned Role Successful";
            return Ok(_responseDto);
        }

        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail(string userId, string token)
        {
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token))
                return BadRequest("Invalid request.");

            var decodedToken = WebUtility.UrlDecode(token).Replace(" ", "+"); // ✅ Use proper URL decoding

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return BadRequest("User not found");

            // ✅ Check if already verified
            if (user.EmailConfirmed)
                return Ok("Email is already verified.");

            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

            if (!result.Succeeded)
                return BadRequest("Invalid or expired token");

            // Optional: update custom flag
            user.IsEmailVerified = true;
            await _userManager.UpdateAsync(user);

            return Ok("Email verified successfully!");
        }

    }
}
