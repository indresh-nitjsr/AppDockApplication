using AppDock.Services.PortfolioAPI.ExternalServices.IExternalServices;
using AppDock.Services.PortfolioAPI.Models.DTO;
using AppDock.Services.PortfolioAPI.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AppDock.Services.PortfolioAPI.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/portfolio")]
    public class PortfolioAPIController : ControllerBase
    {
        private readonly IPortfolioService _portfolioService;
        protected ResponseDto _responseDto;
        private readonly IAuthService _authService;
        public PortfolioAPIController(IPortfolioService portfolioService, IAuthService authService)
        {
            _portfolioService = portfolioService;
            _responseDto = new ResponseDto();
            _authService = authService;
        }

        //Portfolio CRUD start

        
        // Get all portfolio
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var portfolios = await _portfolioService.GetAllPortfolioAsync();
            if (!portfolios.Any())
            {
                return NotFound("No portfolios found.");
            }
            return Ok(portfolios);
        }

        //create portfolio
        [HttpPost]
        public async Task<IActionResult> CreatePortfolio([FromBody] PortfolioDto portfolio)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = _authService.GetUserByIdAsync(email);
            var message = await _portfolioService.CreatePortfolioAsync(portfolio);

            if (string.IsNullOrEmpty(message) || message.StartsWith("Failed"))
            {
                _responseDto.isSuccess = false;
                _responseDto.Message = message;
                return BadRequest(_responseDto);
            }

            _responseDto.Message = message;
            return Ok(_responseDto);
        }

        [HttpPut]
        public async Task<IActionResult> UpdatePortfolio([FromBody] PortfolioDto user)
        {
            var message = await _portfolioService.UpdatePortfolioAsync(user);

            if (string.IsNullOrEmpty(message) || message.StartsWith("Failed"))
            {
                _responseDto.isSuccess = false;
                _responseDto.Message = message;
                return BadRequest(_responseDto);
            }

            _responseDto.Message = message;
            return Ok(_responseDto);
        }

    }
}
