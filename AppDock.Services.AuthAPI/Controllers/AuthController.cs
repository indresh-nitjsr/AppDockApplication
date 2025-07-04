using AppDock.Services.AuthAPI.Models.Dto;
using AppDock.Services.AuthAPI.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AppDock.Services.AuthAPI.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly IAuthService _authService;
        protected ResponseDto _responseDto;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
            _responseDto = new ResponseDto();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationRequestDto model)
        {
            var message = await _authService.Register(model);
            if (message != "Registration successful.")
            {
                _responseDto.isSuccess = false;
                _responseDto.Message = message;
                return BadRequest(_responseDto);
            }
            _responseDto.Message = message;
            return Ok(_responseDto);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto model)
        {
            var loginResponse = await _authService.Login(model);
            if (loginResponse.User == null)
            {

                _responseDto.isSuccess = false;
                _responseDto.Message = "Username or Password is incorrect";
                return BadRequest(_responseDto);    
            }
            _responseDto.Results = loginResponse;
            _responseDto.Message = "Login Successful";
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
    }
}
